import { getFirebaseAdmin } from '@/lib/server/firebase-admin';

export interface AuditLogEntry {
  actorUid: string;
  action: string;
  bookingId: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export class AuditLogger {
  private static instance: AuditLogger;
  private db: FirebaseFirestore.Firestore | null;

  private constructor() {
    this.db = getFirebaseAdmin();
  }

  public static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  async logAction(entry: AuditLogEntry): Promise<void> {
    try {
      if (!this.db) {
        console.error('Firebase Admin not available for audit logging');
        return;
      }

      await this.db.collection('admin_audit_logs').add({
        ...entry,
        timestamp: entry.timestamp || new Date(),
      });

      console.log('Audit log entry created:', entry.action, entry.bookingId);
    } catch (error) {
      console.error('Failed to create audit log entry:', error);
      // Don't throw - audit logging should not break the main flow
    }
  }

  async getAuditLogs(bookingId?: string, limit: number = 100): Promise<AuditLogEntry[]> {
    try {
      if (!this.db) {
        console.error('Firebase Admin not available for audit logging');
        return [];
      }

      let query = this.db.collection('admin_audit_logs')
        .orderBy('timestamp', 'desc')
        .limit(limit);

      if (bookingId) {
        query = query.where('bookingId', '==', bookingId);
      }

      const snapshot = await query.get();
      return snapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      })) as unknown as AuditLogEntry[];
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      return [];
    }
  }
}

export const auditLogger = AuditLogger.getInstance();
