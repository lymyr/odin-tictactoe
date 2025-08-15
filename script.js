
const player = (name, mark, isFirst) => {
    let marker = mark;
    let score = 0;
    let turn = isFirst;
    this.name = name;

    const incrScore = () => score++; 
    const getScore = () => score;
    const getMarker = () => marker;
    return {name, marker, incrScore, getScore, getMarker, turn};
};

const gameboard = (() => {
    let board;
    startBoard();

    let hasWinner = false;

    function startBoard() {
        board = [["","",""],
                 ["","",""],
                 ["","",""],];
    }

    function addMark(player, row, col) {
        if (board[row][col] === "" && player.turn) board[row][col] = player.marker;
        else console.log(`[${row}][${col}] spot is taken`);
        checkWinner(player);
    }

    const showBoard = () => board;

    return {startBoard, addMark, showBoard, hasWinner};
})();

function checkWinner(player) {
    const board = gameboard.showBoard();
    const mark = player.marker;

    let firstI;
    let secI;
    for (let i = 0; i < 3; i++) {
        let firstJ;
        let secJ;

        for (let j = 0; j < 3; j++) {
            if (board[i][j] == mark) {

                // column match
                if (i == 0) firstI = board[i][j];
                else if (i == 1) secI = board[i][j];
                else {
                    if (firstI == board[i][j] && secI == board[i][j]) {
                        player.incrScore();
                        clearMemory();
                        gameboard.startBoard();
                        return
                    }
                }

                // row match
                if (j == 0) firstJ = board[i][j];
                else if (j == 1) secJ = board[i][j];
                else {
                    if (firstJ == board[i][j] && secJ == board[i][j]) {
                        player.incrScore();
                        clearMemory();
                        gameboard.startBoard();
                        return
                    }
                }
                
                // diagonal match
                if (i == 1 && j == 1) {
                    if ((board[0][0] == mark && board[2][2] == mark)
                      || (board[2][0] == mark && board[0][2] == mark)) {
                        player.incrScore();
                        clearMemory();
                        gameboard.startBoard();
                        return
                    }
                }
            }
        }
    }

    // in case of false alarms
    function clearMemory() {
        firstI = null;
        secI = null;
        firstJ = null;
        secJ = null;
    }
}

function startGame() {
    const player1 = player("Ken", "X", true);
    const player2 = player("Goku", "O", false);
    const players = [player1, player2];


    while (!gameboard.hasWinner){
        console.log(gameboard.showBoard());
        players.forEach((player) => {
            if (player.turn) {
                let inputRow = prompt(`${player.name}'s turn. Select nth row (0-2):`);
                let inputCol = prompt(`${player.name}'s turn. Select nth column (0-2):`);
                gameboard.addMark(player, inputRow, inputCol);
                console.log(player.turn);
                changeTurns();
                console.log(player.turn);
            }
        });
    }


    function changeTurns() {
        player1.turn = !player1.turn;
        player2.turn = !player2.turn;
    }
} 


const dialog = document.querySelector("dialog");
const form = document.querySelector("dialog form");
const btnForm = document.querySelector("form button");

btnForm.addEventListener("click", (e) => {
    e.preventDefault();
    dialog.close();
})