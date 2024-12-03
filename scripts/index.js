
const showMenu = () => {
    let menu = '';

    do {
        menu = prompt('Qué desea hacer: \n 1. Jugar mini batalla naval \n 2. Jugar Catan \n 3. Salir');

        switch (menu) {
            case '1':
                tinyNavalBattle();
                break;
            case '2':
                alert ('No disponible. Intente más tarde!');
                break;
            case '3':
                alert ('Gracias por usar la app. Si quiere volver a usarla presione el botón o refresque la página');
                break;
        }


    } while (menu !== '3');
};

const convertLetterToNumber = (letter) => {
    return letter?.toLowerCase().charCodeAt(0) - 97;
};

const convertNumberToLetter = (number) => {
    return String.fromCharCode(number + 97).toUpperCase();
}


const asignValidCoordinate = (boardSize, currentValues) => {
    const maxLetterRange = convertNumberToLetter(boardSize - 1);

    const validLetters = Array.from({ length: boardSize }, (_, i) => convertNumberToLetter(i));
    const validNumbers = Array.from({ length: boardSize }, (_, i) => i);

    const isValidInput = (input) => input.length === 2 && validLetters.includes(input[0].toUpperCase()) && validNumbers.includes(parseInt(input[1]));
    const isRepeated = (input) => currentValues.some((coordinate) => coordinate.x === convertLetterToNumber(input[0]) && coordinate.y === parseInt(input[1]));

    let input = '';
    
    do {
        input = prompt(`Ingrese una coordenada válida entre A0 y ${maxLetterRange}${boardSize - 1}`);
        if (!isValidInput(input)) {
            alert ('Coordenada inválida. Intente nuevamente');
        }

        if (isRepeated(input)) {
            alert ('Coordenada repetida. Intente nuevamente');
        }

    } while (!isValidInput(input) || isRepeated(input));

    return {x: convertLetterToNumber(input[0]), y: parseInt(input[1])};
}

const createArmy = (armySize, boardSize, IAselection) => {
    const army = [];
    for (let i = 0; i < armySize ; i++) {
       const coordinate = IAselection ? {x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random()*boardSize)} : asignValidCoordinate(boardSize, army);
         
       army.push(coordinate);
    }

    return army;
};

const showArmy = (army, boardSize) => {
    let armyString = '';

    armyString += ' \u00a0 \u00a0 \u00a0 \u00a0' + Array(boardSize).fill().map((_, i) => convertNumberToLetter(i)).join('\u00a0 \u00a0') + '\n';

    Array(boardSize).fill('').forEach((_, posY) => {
        let row = `\u00a0 ${posY} \u00a0`;
      Array(boardSize).fill('').forEach((_, posX) => {
        row += army.some((coordinate) => coordinate.x === posX && coordinate.y === posY) ? '\u00a0 X \u00a0' : '\u00a0 \u00a0 \u00a0';
      });
        armyString += row + '\n';
    });

    alert(armyString);
}

const IANewCoordinate = (boardSize, usedCoordinates) => {
    let coordinate = {x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random()*boardSize)};

    while (usedCoordinates.some((usedCoordinate) => usedCoordinate.x === coordinate.x && usedCoordinate.y === coordinate.y)) {
        coordinate = {x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random()*boardSize)};
    }

    return coordinate;
}

const navalGamePlay = (playerArmy, computerArmy, boardSize) => {
    let playerTurn = true;
    let rounds = 1;
    const IAusedCoordinates = [];

    alert(`¡Es momento de jugar! \n Recuerda que el tablero es de ${boardSize}x${boardSize} y que los barcos tienen un solo casillero de dimensiones. \n ¡Buena suerte!`);
    
    do {
        if (playerTurn) {
            alert('Es tu turno');

            const coordinate = asignValidCoordinate(boardSize, []);
            
            if (computerArmy.some((computerCoordinate) => computerCoordinate.x === coordinate.x && computerCoordinate.y === coordinate.y)) {
                alert('¡Hundiste un barco enemigo!');
                computerArmy = computerArmy.filter((computerCoordinate) => computerCoordinate.x !== coordinate.x || computerCoordinate.y !== coordinate.y);
            } else {
                alert('Agua!! No hay barcos enemigos en esta coordenada');
            }

            
        } else {
            alert('Turno de la IA');

            const coordinate = IANewCoordinate(boardSize, IAusedCoordinates);

            if (playerArmy.some((playerCoordinate) => playerCoordinate.x === coordinate.x && playerCoordinate.y === coordinate.y)) {
                alert('¡La IA hundió uno de tus barcos!');
                playerArmy = playerArmy.filter((playerCoordinate) => playerCoordinate.x !== coordinate.x || playerCoordinate.y !== coordinate.y);
            } else {
                alert(`${convertNumberToLetter(coordinate.x)}${coordinate.y} ! La IA falló!`);
            }

            rounds++;
        }
        playerTurn = !playerTurn;

} while (playerArmy.length > 0 && computerArmy.length > 0);

if (!playerArmy.length) {
    alert(`¡Perdiste! La IA hundió todos tus barcos en ${rounds} rondas`);
} else {
    alert(`¡Ganaste! Hundiste todos los barcos de la IA en ${rounds} rondas`);
}
}

// JUEGO DE BATALLA NAVAL MINIATURA
const tinyNavalBattle = () => {
    const boardSize = 4;
    const armySize = 3;

    alert('¡Bienvenido a la batalla naval miniatura! \n \n Para jugar deberás ingresar las coordenadas de tus barcos. \n \n Recuerda que en esta versión los barcos tienen un solo casillero de dimensiones. \n \n ¡Buena suerte!');

    let playerArmy = createArmy(armySize, boardSize);
    let computerArmy = createArmy(armySize, boardSize, true);
    
    showArmy(playerArmy, boardSize);

    navalGamePlay(playerArmy, computerArmy, boardSize);
}

