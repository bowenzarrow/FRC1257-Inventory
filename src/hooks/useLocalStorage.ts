import { useEffect, useState } from "react";

const DB_NAME = "drawer_app_db_v1";
const STORE_NAME = "kv";
const IS_DEV = typeof process !== "undefined" ? process.env.NODE_ENV !== "production" : true;

function hasIndexedDB() {
  try {
    return typeof window !== "undefined" && "indexedDB" in window && window.indexedDB != null;
  } catch {
    return false;
  }
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    try {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (err) {
      reject(err);
    }
  });
}

async function idbGet<T>(key: string): Promise<T | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result === undefined ? undefined : req.result);
      req.onerror = () => reject(req.error);
    } catch (err) {
      reject(err);
    }
  });
}

async function idbSet<T>(key: string, value: T): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    } catch (err) {
      reject(err);
    }
  });
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  // Load persisted value once
  useEffect(() => {
    let mounted = true;

    (async () => {
      let persisted: T | undefined;

      if (hasIndexedDB()) {
        try {
          persisted = await idbGet<T>(key);
          if (IS_DEV) console.debug("useLocalStorage: read from IndexedDB", key, persisted);
        } catch {}
      }

      if (persisted === undefined) {
        try {
          const raw = localStorage.getItem(key);
          if (raw) persisted = JSON.parse(raw);
        } catch {}
      }

      if (mounted) {
        if (persisted !== undefined) setState(persisted);
        setHasValue(persisted !== undefined);
        setLoaded(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [key]);

  // Write to storage whenever state changes
  useEffect(() => {
    if (!loaded) return;

    (async () => {
      try {
        if (hasIndexedDB()) await idbSet(key, state);
        localStorage.setItem(key, JSON.stringify(state));
      } catch (err) {
        if (IS_DEV) console.error("useLocalStorage write error", err);
      }
    })();
  }, [state, key, loaded]);

  return [state, setState, loaded, hasValue] as const;
}
