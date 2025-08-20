function checkWinner(player) {
    const board = gameboard.showBoard();
    const mark = player.getMarker();

    let secI;
    let thirdI;
    let allHasInput = true;
    for (let i = 0; i < 3; i++) {
        let firstJ;
        let secJ;

        for (let j = 0; j < 3; j++) {
            if (board[i][j] == "") {allHasInput = false;}
            
            if (board[i][j] == mark) {
                // column match
                if (i == 0) {
                    secI = board[i+1][j];
                    thirdI = board[i+1+1][j];

                    if (secI == board[i][j] && thirdI == board[i][j]) {
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
    if (allHasInput) {
        gameboard.startBoard();
    }


    // in case of false alarms
    function clearMemory() {
        secI = null;
        thirdI = null;
        firstJ = null;
        secJ = null;
    }
}

const player = (name, mark, isFirst) => {
    let marker = mark;
    let score = 0;
    let turn = isFirst;
    this.name = name;

    const incrScore = () => score++; 
    const getScore = () => score;
    const getMarker = () => marker;
    return {name, incrScore, getScore, getMarker, turn};
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
        if (board[row][col] === "") {
            board[row][col] = player.getMarker();
            return true
        }
        else {
            console.log(`[${row}][${col}] spot is invalid`);
            return false
        }

    }

    const showBoard = () => board;

    return {startBoard, addMark, showBoard, hasWinner};
})();

function getTurn(player1, player2) {
    if (player1.turn) {
        return player1
    }
    else if (player2.turn) {
        return player2
    }

}


function startGame(name1, name2) {
    const player1 = player(name1, "X", true);
    const player2 = player(name2, "O", false);

    const nameScore1 = document.querySelector(".scoreboard div p");
    const nameScore2 = document.querySelector(".scoreboard:nth-child(3) div p");
    nameScore1.textContent = `${player1.name}:`;
    nameScore2.textContent = `${player2.name}:`;

    const score1 = document.querySelector(".scoreboard div span");
    const score2 = document.querySelector(".scoreboard:nth-child(3) div span");

    render();

    function render() {
        const arrBoard = gameboard.showBoard();
        const boardUi = document.querySelector(".board");
        boardUi.innerHTML = '';
        score1.textContent = player1.getScore();
        score2.textContent = player2.getScore();

        const winningScore = 6;
        if (player1.getScore() == winningScore || player2.getScore() == winningScore) {
            const p = document.createElement("p");
            p.textContent = (player1.getScore() == winningScore ? `${player1.name} won!` :  `${player2.name} won!`);
            dialog.insertBefore(p, dialog.firstChild);
            dialog.showModal();
        }

        const playerTurn = getTurn(player1, player2);
        if (player1 == playerTurn) {
            nameScore1.parentNode.setAttribute("style", "background-color: rgb(61, 54, 44); color: rgba(214, 204, 187, 1); transition: 200ms; font-size:1.2em");
        }
        else {
            nameScore1.parentNode.setAttribute("style", "transition: 200ms");
        }
        if (player2 == playerTurn) {
            nameScore2.parentNode.setAttribute("style", "background-color: rgb(61, 54, 44); color: rgba(214, 204, 187, 1); transition: 200ms; font-size:1.2em");
        }
        else {
            nameScore2.parentNode.setAttribute("style", "transition: 200ms");
        }

        for (let i = 0; i < arrBoard.length; i++) {
            for (let j = 0; j < arrBoard[i].length; j++) {
                const box = document.createElement("div");
                box.textContent = arrBoard[i][j];
                box.setAttribute("row", i);
                box.setAttribute("col", j);
                box.addEventListener("click", (e) => {
                    
                    if (gameboard.addMark(playerTurn, e.target.getAttribute("row"), e.target.getAttribute("col"))) {
                        e.target.textContent = playerTurn.getMarker();
                        checkWinner(playerTurn);
                        changeTurns();
                    }
                    render();
                })
                boardUi.appendChild(box);
            }
        }
    }

    function changeTurns() {
        player1.turn = !player1.turn;
        player2.turn = !player2.turn;
    }


} 


const dialog = document.querySelector("dialog");
const btnForm = document.querySelector("form button");
const btnStart = document.querySelector("#btn-start");

dialog.showModal();

btnForm.addEventListener("click", (e) => {
    e.preventDefault();
    const name1 = document.querySelector("#player1");
    const name2 = document.querySelector("#player2");

    if (dialog.firstChild.tagName == 'P') {
        dialog.firstChild.remove();
    }

    if (name1.value != "" && name2.value != "" && name1.value !== name2.value) {
        dialog.close();
        startGame(name1.value, name2.value);
    }
    else alert("please input names");
});


btnStart.addEventListener("click", () => {
    dialog.showModal();
});

