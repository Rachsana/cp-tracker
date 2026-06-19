import { atom } from "recoil";

export const profileAtom = atom({
  key: "profileAtom",
  default: null,
});

export const submissionsAtom = atom({
  key: "submissionsAtom",
  default: [],
});

export const syncingAtom = atom({
  key: "syncingAtom",
  default: false,
});
