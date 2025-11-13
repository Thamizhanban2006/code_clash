// src/utils/getPlayerName.js
export default function getPlayerName() {
  let name = localStorage.getItem('playerName');
  if (!name) {
    name = 'player' + Math.floor(Math.random() * 1000);
    localStorage.setItem('playerName', name);
  }
  return name;
}
