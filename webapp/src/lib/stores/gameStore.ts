import { writable } from "svelte/store";

export const selectedCategory = writable<string>("");
export const isCreator = writable<boolean>(false);
export const selectedAvatar = writable<string>("");
export const playerName = writable<string>("");
