import React, { createContext, useContext, useMemo, useEffect } from "react";
import { Item } from "../types";
import { SAMPLE_ITEMS } from "../data";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ItemsContextValue = {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  loaded: boolean;
};

const ItemsContext = createContext<ItemsContextValue | undefined>(undefined);

export function ItemsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems, loaded, hasValue] = useLocalStorage<Item[]>(
    "drawer_app_items_v1",
    [] as Item[]
  );

  // Seed SAMPLE_ITEMS only once if nothing is persisted
  useEffect(() => {
    if (!loaded) return;
    if (!hasValue && items.length === 0) {
      setItems(SAMPLE_ITEMS);
    }
  }, [loaded, hasValue]);

  const value = useMemo(
    () => ({
      items,
      setItems: setItems as React.Dispatch<React.SetStateAction<Item[]>>,
      loaded,
    }),
    [items, setItems, loaded]
  );

  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
}

export function useItems() {
  const ctx = useContext(ItemsContext);
  if (!ctx) throw new Error("useItems must be used within ItemsProvider");
  return ctx;
}
