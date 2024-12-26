
const titleContainer = document.getElementById('title-container');
const boardContainer = document.getElementById('board-container');
const captionContainer = document.getElementById('caption-container');

const GRID_SIZE = 40;
const boardSize = 4;

let playerArmy = [];
let computerArmy = [];
const IAAttackedCoordinates = [];
let winner = null;
let rounds = 0;

const POINTER_CURSOR = ';cursor:pointer';
const CAPTION_PLAYER_GAME = `<p class="text-center mt-3">¡Es tu turno! Haz click en algún casillero del oponente para atacar...</p>`;
const CAPTION_IA_GAME = `<p class="text-center mt-3">¡La IA está pensando su movimiento! Suerte con el contraataque...</p>`;

const iconSelector = (army, posX, posY, isOpponent) => {
    const waves = '<span class="material-icons" style="color:#74A9F2">waves</span>';
   
    const findCoordinate = army.find((coordinate) => coordinate.x === posX && coordinate.y === posY);

    if (findCoordinate) {
        if (findCoordinate.status === 'destroyed') {
        return '<span class="material-icons" style="color:#F45933">local_fire_department</span>';
        }
        return isOpponent ? waves : '<span class="material-icons" style="color:#8492A5">directions_boat</span>';
    }
    
    return waves;
}

const BORDER = 'border:1px black solid';

const showBattleBoard = (computerTurn) => {
    boardContainer.innerHTML = `
    <div class="d-flex justify-content-center align-items-center">
        <div class="container">
            <h5 class="text-center">Tu tablero</h5>
            ${showBoard('player', 'disabled')}
        </div>
        <div class="container">
            <h5 class="text-center">Tablero del oponente</h5>
            ${showBoard('oponent', computerTurn ? 'disabled' : undefined)}
        </div>
    </div>
    `;
}

const checkForGameStart = () => {
    if (playerArmy.length === 3) {
        captionContainer.innerHTML = CAPTION_PLAYER_GAME;
        showBattleBoard();
        return;
    }
    boardContainer.innerHTML = showBoard('player');
}

const renderCell = (type, action, posX, posY) => {
    let onClick = '';
    let cursor = POINTER_CURSOR;

    const isOpponent = type === 'oponent';
    const army = isOpponent ? computerArmy : playerArmy;
    
    const icon = iconSelector(army, posX, posY, isOpponent);

    if (action === 'disabled') {
        cursor = ';cursor:default';
    }

    if (type === 'player' && action !== 'disabled') {
        onClick = `onclick="playerArmy.push({x:${posX},y:${posY}});checkForGameStart();"`;

    }

    const isDestroyedCell = army.some((cell) => cell.x === posX && cell.y === posY && cell.status === 'destroyed');

    if (type === 'oponent' && !isDestroyedCell && action !== 'disabled') {
        onClick = `onclick="computerArmy = computerArmy.map((cell) => {if(cell.x === ${posX} && cell.y ===${posY}) {return {...cell, status: 'destroyed'}} return cell});navalGamePlay();"`;
        cursor = ';cursor:crosshair';
    }
    
    return `<div ${onClick} class="col d-flex justify-content-center align-items-center" style="width:${GRID_SIZE}px;max-width:${GRID_SIZE}px;height:${GRID_SIZE}px;border:1px black solid${cursor}">${icon}</div>`};


    function showBoard (type, action) {
        let grid = '';
    
        Array(boardSize).fill('').forEach((_, posY) => {
            let row = '';
            Array(boardSize).fill('').forEach((_, posX) => {
                row += renderCell(type, action, posX, posY);
            });
            grid += `<div class="row justify-content-center">${row}</div>`;
        });
    
        return `<div class="d-flex justify-content-center align-items-center" ><div class="container w-100">${grid}</div></div>`; 
    
    }


const createArmy = (armySize, boardSize, IAselection) => {
    const army = [];
    for (let i = 0; i < armySize ; i++) {
       const coordinate = IAselection ? {x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random()*boardSize)} : asignValidCoordinate(boardSize, army);
         
       army.push(coordinate);
    }

    return army;
};

const IANewCoordinate = (boardSize, usedCoordinates) => {
    let coordinate = {x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random()*boardSize)};

    while (usedCoordinates.some((usedCoordinate) => usedCoordinate.x === coordinate.x && usedCoordinate.y === coordinate.y)) {
        coordinate = {x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random()*boardSize)};
    }

    return coordinate;
}

const checkForWin = () => {
    if (!playerArmy.some((coordinate) => coordinate.status !== 'destroyed')) {
        winner = 'IA';
        return;
    }
    if (!computerArmy.some((coordinate) => coordinate.status !== 'destroyed')) {
        winner = 'player';
        return;
    }
}

const handleWinner = () => {
    if (!winner) {
        return;
    }
    console.log(winner);
    const winnerMessage = winner === 'player' ? '¡Ganaste! Hundiste todos los barcos de la IA' : '¡Perdiste! La IA hundió todos tus barcos';
    document.getElementById('modal-body').innerText = winnerMessage;
    document.getElementById('modal-title').innerText = winner === 'player' ? 'Ganaste!' : 'Perdiste';

    const modal = new bootstrap.Modal(document.getElementById('winner-modal'))
    modal.show();

}

const navalGamePlay = () => {
    rounds++;
    checkForWin();
    handleWinner();
    showBattleBoard();

    if (winner) {
        return;
    }

    // IA turn
    const IATimeout = Math.floor(Math.random() * 3) * 1000;

    captionContainer.innerHTML = CAPTION_IA_GAME;
    showBattleBoard(true);
    setTimeout(() => {
        captionContainer.innerHTML = CAPTION_PLAYER_GAME;
    }, IATimeout);

    const newCoordinate = IANewCoordinate(boardSize, IAAttackedCoordinates);

    IAAttackedCoordinates.push(newCoordinate);
    playerArmy = playerArmy.map((cell) => {
        if (cell.x === newCoordinate.x && cell.y === newCoordinate.y) {
            return {...cell, status: 'destroyed'};
        }
        return cell;
    });

    checkForWin();
    handleWinner();
    showBattleBoard();
}

// JUEGO DE BATALLA NAVAL MINIATURA
const showGame = () => {
    const armySize = 3;

    titleContainer.innerHTML = `
    <h1>¡Bienvenido a la batalla naval miniatura!</h1> \n \n 
    <h2>Para jugar deberás ingresar las coordenadas de tus barcos.</h2> \n \n 
    
    <p>Recuerda que en esta versión los barcos tienen un solo casillero de dimensiones.</p> \n \n 
    
    <h3 class="text-center pb-3">¡Buena suerte!</h3>

    `;

    computerArmy = createArmy(armySize, boardSize, true);

    
    boardContainer.innerHTML = showBoard('player');
    captionContainer.innerHTML = `<p class="text-center mt-3">Para comenzar,seleccione las ${armySize} posiciones de sus naves...</p>`;

}

