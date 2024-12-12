// Elementos del DOM
const startGameButton = document.getElementById('startGameButton');
const menu = document.getElementById('menu');
const miniBattleButton = document.getElementById('miniBattleButton');
const catanButton = document.getElementById('catanButton');
const exitButton = document.getElementById('exitButton');
const gameContainer = document.getElementById('gameContainer');
const gameBoard = document.getElementById('gameBoard');
const statusMessage = document.getElementById('statusMessage');
const coordinateInput = document.getElementById('coordinate');
const submitCoordinateButton = document.getElementById('submitCoordinate');

let playerArmy = [];
let computerArmy = [];
let boardSize = 4;
let armySize = 3;
let currentTurn = 'player'; // 'player' o 'computer'
let rounds = 1;

startGameButton.addEventListener('click', () => {
  menu.classList.remove('hidden');
  startGameButton.classList.add('hidden');
});

// Mostrar el menú con opciones
miniBattleButton.addEventListener('click', () => {
  menu.classList.add('hidden');
  gameContainer.classList.remove('hidden');
  startMiniNavalBattle();
});

exitButton.addEventListener('click', () => {
  window.location.reload();
});

submitCoordinateButton.addEventListener('click', () => {
  const coordinate = coordinateInput.value.trim().toUpperCase();
  if (coordinate) {
    handlePlayerTurn(coordinate);
  } else {
    alert('Por favor ingresa una coordenada válida.');
  }
});

function startMiniNavalBattle() {
  alert('¡Bienvenido a la batalla naval miniatura! \n Para jugar deberás ingresar las coordenadas de tus barcos.');

  // Crear las flotas de barcos
  playerArmy = createArmy(armySize, boardSize);
  computerArmy = createArmy(armySize, boardSize, true);

  // Mostrar el tablero
  showArmy(playerArmy, boardSize);

  // Actualizar mensaje de estado
  statusMessage.innerText = `Es tu turno, ingresa una coordenada para atacar.`;
}

function createArmy(armySize, boardSize, IAselection = false) {
  const army = [];
  for (let i = 0; i < armySize; i++) {
    const coordinate = IAselection ? { x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) } : asignValidCoordinate(boardSize, army);
    army.push(coordinate);
  }
  return army;
}

function asignValidCoordinate(boardSize, currentValues) {
  const maxLetterRange = convertNumberToLetter(boardSize - 1);

  const validLetters = Array.from({ length: boardSize }, (_, i) => convertNumberToLetter(i));
  const validNumbers = Array.from({ length: boardSize }, (_, i) => i);

  const isValidInput = (input) => input.length === 2 && validLetters.includes(input[0].toUpperCase()) && validNumbers.includes(parseInt(input[1]));
  const isRepeated = (input) => currentValues.some((coordinate) => coordinate.x === convertLetterToNumber(input[0]) && coordinate.y === parseInt(input[1]));

  let input = '';

  do {
    input = prompt(`Ingrese una coordenada válida entre A0 y ${maxLetterRange}${boardSize - 1}`);
    if (!isValidInput(input)) {
      alert('Coordenada inválida. Intente nuevamente');
    }

    if (isRepeated(input)) {
      alert('Coordenada repetida. Intente nuevamente');
    }

  } while (!isValidInput(input) || isRepeated(input));

  return { x: convertLetterToNumber(input[0]), y: parseInt(input[1]) };
}

function convertLetterToNumber(letter) {
  return letter.toLowerCase().charCodeAt(0) - 97;
}

function convertNumberToLetter(number) {
  return String.fromCharCode(number + 97).toUpperCase();
}

function showArmy(army, boardSize) {
  gameBoard.innerHTML = ''; // Limpiar el tablero anterior

  // Mostrar filas
  for (let i = 0; i < boardSize; i++) {
    const row = document.createElement('div');
    row.classList.add('d-flex');
    for (let j = 0; j < boardSize; j++) {
      const cell = document.createElement('div');
      const hasShip = army.some(coordinate => coordinate.x === j && coordinate.y === i);
      cell.textContent = hasShip ? 'X' : '';
      cell.classList.add('cell', 'border', 'p-2');
      row.appendChild(cell);
    }
    gameBoard.appendChild(row);
  }
}

function handlePlayerTurn(coordinate) {
  // Convertir coordenada ingresada por el jugador en un objeto
  const x = convertLetterToNumber(coordinate[0]);
  const y = parseInt(coordinate[1]);

  // Verificar si el jugador ha acertado o fallado
  if (computerArmy.some(coordinate => coordinate.x === x && coordinate.y === y)) {
    alert('¡Hundiste un barco enemigo!');
    computerArmy = computerArmy.filter(coordinate => coordinate.x
