import { openDB, type IDBPDatabase } from 'idb';

export const DB_NAME = 'mamacare-db';
export const DB_VERSION = 1;

export type StoreName = 'patients' | 'visits' | 'appointments' | 'syncQueue' | 'users';

const STORE_DEFINITIONS: Record<StoreName, string[]> = {
  patients: ['phone', 'chw_id', 'risk_level', 'edd'],
  visits: ['patient_id', 'visit_date', 'chw_id'],
  appointments: ['patient_id', 'appointment_date', 'status', 'chw_id'],
  syncQueue: ['table', 'operation', 'status', 'created_at'],
  users: ['phone', 'role'],
};

export async function openMamaCareDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      Object.entries(STORE_DEFINITIONS).forEach(([storeName, indexes]) => {
        if (!db.objectStoreNames.contains(storeName)) {
          const store = db.createObjectStore(storeName, { keyPath: 'id' });
          indexes.forEach((index) => store.createIndex(index, index, { unique: false }));
        }
      });
    },
  });
}

export async function putRecord<T extends { id: string }>(storeName: StoreName, value: T) {
  const db = await openMamaCareDB();
  const tx = db.transaction(storeName, 'readwrite');
  await tx.objectStore(storeName).put(value);
  await tx.done;
  return value;
}

export async function getRecord<T>(storeName: StoreName, id: string): Promise<T | undefined> {
  const db = await openMamaCareDB();
  return db.get(storeName, id) as Promise<T | undefined>;
}

export async function getAllRecords<T>(storeName: StoreName): Promise<T[]> {
  const db = await openMamaCareDB();
  return db.getAll(storeName) as Promise<T[]>;
}

export async function deleteRecord(storeName: StoreName, id: string) {
  const db = await openMamaCareDB();
  const tx = db.transaction(storeName, 'readwrite');
  await tx.objectStore(storeName).delete(id);
  await tx.done;
}
