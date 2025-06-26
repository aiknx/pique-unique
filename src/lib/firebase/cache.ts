import { cache } from 'react';
import { collection, getDocs, doc, getDoc, query, QueryConstraint } from 'firebase/firestore';
import { db } from '../firebase';

// Cache duration in milliseconds
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cacheStore = new Map<string, CacheEntry<any>>();

function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION;
}

export const getCachedCollection = cache(async <T>(
  collectionName: string,
  queryConstraints: QueryConstraint[] = []
): Promise<T[]> => {
  const cacheKey = `${collectionName}:${queryConstraints.map(c => c.toString()).join(':')}`;
  const cached = cacheStore.get(cacheKey);

  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }

  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, ...queryConstraints);
  const snapshot = await getDocs(q);
  
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as T[];

  cacheStore.set(cacheKey, {
    data,
    timestamp: Date.now()
  });

  return data;
});

export const getCachedDocument = cache(async <T>(
  collectionName: string,
  documentId: string
): Promise<T | null> => {
  const cacheKey = `${collectionName}:${documentId}`;
  const cached = cacheStore.get(cacheKey);

  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
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

  cacheStore.set(cacheKey, {
    data,
    timestamp: Date.now()
  });

  return data;
});

export const invalidateCache = (collectionName?: string) => {
  if (collectionName) {
    // Invalidate specific collection
    for (const key of cacheStore.keys()) {
      if (key.startsWith(collectionName)) {
        cacheStore.delete(key);
      }
    }
  } else {
    // Invalidate all cache
    cacheStore.clear();
  }
}; 