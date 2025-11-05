import { Item, DrawerLabel, ChestId } from "./types";



export const DRAWERS: DrawerLabel[] = [
  "Top",
  "2nd left",
  "3rd left",
  "4th left",
  "5th left",
  "2nd right",
  "3rd right",
  "4th right",
  "5th right",
];

export const SAMPLE_ITEMS: Item[] = [
  {
    id: "it1",
    name: "Screwdriver",
    imageUrl: "https://dummyimage.com/200x200/ddd/000&text=Screwdriver",
    chest: "Electronics Chest",
    drawer: "Top",
    category: "Tools",
  },
  {
    id: "it2",
    name: "Hammer",
    imageUrl: "https://dummyimage.com/200x200/ddd/000&text=Hammer",
    chest: "Build Chest",
    drawer: "2nd left",
    category: "Tools",
  },
];


export const locked = false;


