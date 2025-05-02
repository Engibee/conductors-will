// src/composables/useSaveGame.js

const GAME_KEY = "@game:state";

export function saveGame(state) {
  try {
    // Consider compression for large states
    localStorage.setItem(GAME_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save game state:", e);
    // Handle localStorage quota exceeded
  }
}

export function loadGame() {
  const item = localStorage.getItem(GAME_KEY);
  return item ? JSON.parse(item) : null;
}

export function clearGame() {
  localStorage.removeItem(GAME_KEY);
}
