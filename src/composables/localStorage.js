// src/composables/useSaveGame.js

const GAME_KEY = "@game:state";

export function saveGame(state) {
  localStorage.setItem(GAME_KEY, JSON.stringify(state));
}

export function loadGame() {
  const item = localStorage.getItem(GAME_KEY);
  return item ? JSON.parse(item) : null;
}

export function clearGame() {
  localStorage.removeItem(GAME_KEY);
}
