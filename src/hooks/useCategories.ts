import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

export function useCategories() {
  const [categories, setCategories, loaded] = useLocalStorage<string[]>(
    "categories",
    ["None"] // start with "None"
  );

  // Add a new category
  function addCategory(name: string) {
    const trimmed = name.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    setCategories([...categories, trimmed]);
  }

  // Remove a category
  function removeCategory(name: string) {
    if (name === "None") return; // never remove "None"
    setCategories(categories.filter((c) => c !== name));
  }

  // Rename a category
  function renameCategory(oldName: string, newName: string) {
    const trimmed = newName.trim();
    if (
      !trimmed ||
      trimmed === oldName ||
      categories.includes(trimmed) ||
      oldName === "None"
    )
      return;

    setCategories(
      categories.map((c) => (c === oldName ? trimmed : c))
    );
  }

  return { categories, addCategory, removeCategory, renameCategory, loaded };
}
