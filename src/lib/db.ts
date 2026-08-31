/**
 * IndexedDB access layer.
 *
 * Two object stores:
 *   entries  key = "<patternId>/<slug>"  your notes, code and status
 *   custom   key = "<patternId>/<slug>"  questions you added yourself
 *
 * Every call opens a connection, runs one transaction and closes again. That
 * keeps a long-lived handle from blocking a future schema upgrade in another
 * tab, at the cost of a few microseconds per call.
 */

import { errorMessage } from "./format.ts";
import type { CustomQuestion, CustomQuestionMap, Entry, EntryMap } from "../types.ts";

const DB_NAME = "dsa-logbook";
const DB_VERSION = 1;

export const STORES = {
  entries: "entries",
  custom: "custom",
} as const;

export type StoreName = (typeof STORES)[keyof typeof STORES];

export class StorageUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageUnavailableError";
  }
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new StorageUnavailableError("This browser has no IndexedDB"));
      return;
    }

    let request: IDBOpenDBRequest;
    try {
      request = indexedDB.open(DB_NAME, DB_VERSION);
    } catch (error) {
      reject(new StorageUnavailableError(errorMessage(error)));
      return;
    }

    request.onupgradeneeded = () => {
      const db = request.result;
      Object.values(STORES).forEach((name) => {
        if (!db.objectStoreNames.contains(name)) db.createObjectStore(name);
      });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(
        new StorageUnavailableError(request.error?.message || "Could not open the database")
      );
    request.onblocked = () =>
      reject(new StorageUnavailableError("Another tab is holding an older version open"));
  });
}

/**
 * Open, run one transaction, close. Resolves with whatever `run` returned, but
 * only once the transaction completes — so `run` may hand back an object it
 * goes on to fill from a cursor.
 */
async function withStore<T>(
  storeName: StoreName,
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => T
): Promise<T> {
  const db = await openDatabase();
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      let result: T;
      try {
        result = run(store);
      } catch (error) {
        reject(error);
        return;
      }
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

/**
 * Walk a whole store into a plain object. Values were written by us but come
 * back from disk untyped, so the cast is the trust boundary.
 */
function readAll<T>(storeName: StoreName): Promise<Record<string, T>> {
  return withStore(storeName, "readonly", (store) => {
    const all: Record<string, T> = {};
    const request = store.openCursor();
    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) return;
      all[String(cursor.key)] = cursor.value as T;
      cursor.continue();
    };
    return all;
  });
}

export const readEntries = (): Promise<EntryMap> => readAll<Entry>(STORES.entries);

export const readCustomQuestions = (): Promise<CustomQuestionMap> =>
  readAll<CustomQuestion>(STORES.custom);

export const putEntry = (key: string, value: Entry): Promise<IDBRequest<IDBValidKey>> =>
  withStore(STORES.entries, "readwrite", (store) => store.put(value, key));

export const deleteEntry = (key: string): Promise<IDBRequest<undefined>> =>
  withStore(STORES.entries, "readwrite", (store) => store.delete(key));

export const putCustomQuestion = (
  key: string,
  value: CustomQuestion
): Promise<IDBRequest<IDBValidKey>> =>
  withStore(STORES.custom, "readwrite", (store) => store.put(value, key));

export const deleteCustomQuestion = (key: string): Promise<IDBRequest<undefined>> =>
  withStore(STORES.custom, "readwrite", (store) => store.delete(key));

export async function replaceAll({
  entries = {},
  custom = {},
}: {
  entries?: EntryMap;
  custom?: CustomQuestionMap;
}): Promise<void> {
  await withStore(STORES.entries, "readwrite", (store) => {
    store.clear();
    Object.entries(entries).forEach(([key, value]) => store.put(value, key));
  });
  await withStore(STORES.custom, "readwrite", (store) => {
    store.clear();
    Object.entries(custom).forEach(([key, value]) => store.put(value, key));
  });
}

export async function clearAll(): Promise<void> {
  await withStore(STORES.entries, "readwrite", (store) => store.clear());
  await withStore(STORES.custom, "readwrite", (store) => store.clear());
}
