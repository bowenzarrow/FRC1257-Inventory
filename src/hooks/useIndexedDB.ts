import { useState, useEffect } from "react";

export function useIndexedDB<T>(key: string, initial: T) {
  const [state, setState] = useState<T | undefined>(undefined);

  // Load on mount
  useEffect(() => {
    const openRequest = indexedDB.open("drawer_app_db", 1);
    openRequest.onupgradeneeded = () => {
      const db = openRequest.result;
      if (!db.objectStoreNames.contains("store")) db.createObjectStore("store");
    };
    openRequest.onsuccess = () => {
      const db = openRequest.result;
      const tx = db.transaction("store", "readonly");
      const store = tx.objectStore("store");
      const getReq = store.get(key);
      getReq.onsuccess = () => {
        if (getReq.result !== undefined) {
          setState(getReq.result);
        } else {
          setState(initial);
          // Save initial value to DB
          const tx2 = db.transaction("store", "readwrite");
          tx2.objectStore("store").put(initial, key);
        }
      };
    };
    openRequest.onerror = () => {
      setState(initial); // fallback
    };
  }, [key, initial]);

  // Function to update state + DB
  const save = (newState: T) => {
    setState(newState);
    const openRequest = indexedDB.open("drawer_app_db", 1);
    openRequest.onsuccess = () => {
      const db = openRequest.result;
      const tx = db.transaction("store", "readwrite");
      tx.objectStore("store").put(newState, key);
    };
  };

  return [state ?? initial, save] as const;
}
