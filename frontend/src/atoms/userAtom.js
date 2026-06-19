import { atom } from "recoil";

export const userAtom = atom({
  key: "userAtom",
  default: JSON.parse(localStorage.getItem("cp_user")) || null,
});

export const tokenAtom = atom({
  key: "tokenAtom",
  default: localStorage.getItem("cp_token") || null,
});
