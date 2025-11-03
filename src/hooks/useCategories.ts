import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

export function useCategories() {
  const [categories, setCategories, loaded] = useLocalStorage<string[]>(
    "categories",
    ["None"]
  );

  // persist edit lock state
  const [editingEnabled, setEditingEnabled, editingLoaded] =
    useLocalStorage<boolean>("categoryEditingEnabled", false);

  // Add a new category
  function addCategory(name: string) {
    const trimmed = name.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    setCategories([...categories, trimmed]);
  }

  // Remove a category (only if editing is enabled)
  function removeCategory(name: string) {
    if (!editingEnabled) return;
    if (name === "None") return; // never remove "None"
    setCategories(categories.filter((c) => c !== name));
  }

  // Rename a category (only if editing is enabled)
  function renameCategory(oldName: string, newName: string) {
    if (!editingEnabled) return;
    const trimmed = newName.trim();
    if (
      !trimmed ||
      trimmed === oldName ||
      categories.includes(trimmed) ||
      oldName === "None"
    )
      return;

    setCategories(categories.map((c) => (c === oldName ? trimmed : c)));
  }

  // Toggle editing mode
  function toggleEditing() {
    setEditingEnabled(!editingEnabled);
  }


  useEffect(() => {
    localStorage.setItem(
      "categoryEditingEnabled",
      JSON.stringify(editingEnabled)
    );
  }, [editingEnabled]);

  useEffect(() => {
    const saved = localStorage.getItem("categoryEditingEnabled");
    if (saved !== null) {
      setEditingEnabled(JSON.parse(saved));
    }
  }, [setEditingEnabled]);

  return {
    categories,
    addCategory,
    removeCategory,
    renameCategory,
    editingEnabled,
    setEditingEnabled,
    toggleEditing,
    loaded: loaded && editingLoaded,
  };
}
