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
    id: "i1",
    name: "Screwdriver",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/41/Flat-head_screwdriver.png",
    chest: "Electronics Chest",
    drawer: "Top",
  },
  {
    id: "i2",
    name: "Hammer",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Steel_hammer.jpg",
    chest: "Build Chest",
    drawer: "2nd left",
  }
];

