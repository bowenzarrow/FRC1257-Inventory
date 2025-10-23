export type ChestId = "chest1" | "chest2";

export type DrawerLabel = 
  | "Top"
  | "2nd left"
  | "3rd left"
  | "4th left"
  | "5th left"
  | "2nd right"
  | "3rd right"
  | "4th right"
  | "5th right";


export type Item = {
  id: string;
  name: string;
  imageUrl: string;
  chest: ChestId;
  drawer: DrawerLabel;
};
