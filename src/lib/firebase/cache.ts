import { cache } from 'react';
import { collection, getDocs, doc, getDoc, query, QueryConstraint } from 'firebase/firestore';
import { db } from '../firebase';

// Cache duration in milliseconds
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheItem<T> {
  value: T;
  timestamp: number;
}

interface Cache<T> {
  [key: string]: CacheItem<T>;
}

const firebaseCache: Cache<unknown> = {};

function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION;
}

export const getCachedCollection = cache(async <T>(
  collectionName: string,
  queryConstraints: QueryConstraint[] = []
): Promise<T[]> => {
  const cacheKey = `${collectionName}:${queryConstraints.map(c => c.toString()).join(':')}`;
  const cached = firebaseCache[cacheKey];

  if (cached && isCacheValid(cached.timestamp)) {
    return cached.value as T[];
  }

  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, ...queryConstraints);
  const snapshot = await getDocs(q);
  
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as T[];

  firebaseCache[cacheKey] = {
    value: data,
    timestamp: Date.now()
  };

  return data;
});

export const getCachedDocument = cache(async <T>(
  collectionName: string,
  documentId: string
): Promise<T | null> => {
  const cacheKey = `${collectionName}:${documentId}`;
  const cached = firebaseCache[cacheKey];

  if (cached && isCacheValid(cached.timestamp)) {
    return cached.value as T;
  }

  const docRef = doc(db, collectionName, documentId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = {
    id: snapshot.id,
    ...snapshot.data()
  } as T;

  firebaseCache[cacheKey] = {
    value: data,
    timestamp: Date.now()
  };

  return data;
});

export const invalidateCache = (collectionName?: string) => {
  if (collectionName) {
    // Invalidate specific collection
    for (const key in firebaseCache) {
      if (key.startsWith(collectionName)) {
        delete firebaseCache[key];
      }
    }
  } else {
    // Invalidate all cache
    Object.keys(firebaseCache).forEach(key => delete firebaseCache[key]);
  }
};

export function getCachedData<T>(key: string): T | null {
  const item = firebaseCache[key];
  if (!item) return null;

  const now = Date.now();
  if (now - item.timestamp > CACHE_DURATION) {
    delete firebaseCache[key];
    return null;
  }

  return item.value as T;
}

export function setCachedData<T>(key: string, value: T): void {
  firebaseCache[key] = {
    value,
    timestamp: Date.now(),
  };
} 