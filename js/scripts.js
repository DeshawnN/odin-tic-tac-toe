const gameBoard = (function() {
    let board = [];
    const players = [];
    let state;
    const DOM_grid = [...document.querySelectorAll(".grid div")];
    const DOM_textAreas = [...document.querySelectorAll(".info p")];
    

    const WINNING_COMBINATIONS = [
        // Across
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // Vertical
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // Diagonals
        [0, 4, 8],
        [2, 4, 6]
    ];
    let currentPlayer;
    
    function renderToDOM() {
        DOM_grid.forEach((node, index) => {
            node.textContent = board[index];
        })

        DOM_textAreas[0].textContent = (!players[0]) ? 'Player 1' : players[0].getName();

        DOM_textAreas[2].textContent = (!players[1]) ? 'Player 2' : players[1].getName();
    }

    function init() {
        renderToDOM();
        setEventListeners();
        state = "Playing";
    }

    function makeMove(position) {
        if (board[position]) return
        board[position] = currentPlayer.getSign();
        renderToDOM();
    }

    function addPlayer(player) {
        if (players.length === 2) return;
        players.push(player);
        console.log(`Player: ${player.getSign()} was added.`);
        
        if (!currentPlayer) currentPlayer = player;
    }

    function setEventListeners() {
        DOM_grid.forEach((node, index) => {
            node.addEventListener('click', () => {
                if (state === "Finished") return;
                makeMove(index);
                if (checkForWinner()) {
                    endGame()
                }
                if (checkForTie()) {
                    endGame(true);
                }
                
                switchPlayer();
            });
        });

        const resetButton = document.querySelector("[data-reset]");
        resetButton.addEventListener('click', reset);

        const player1NameButton = document.querySelector("[data-p1-change]");
        player1NameButton.addEventListener("click", () => {
            const newName = prompt("Enter Player 1's new name:");
            players[0].setName(newName);
            renderToDOM();
        });

        const player2NameButton = document.querySelector("[data-p2-change]");
        player2NameButton.addEventListener("click", () => {
            const newName = prompt("Enter Player 2's new name:");
            players[1].setName(newName);
            renderToDOM();
        });

    }

    function switchPlayer() {
        currentPlayer = (currentPlayer === players[0]) ? players[1] : players[0];
    }

    function checkForWinner() {
        return WINNING_COMBINATIONS.some(combination => {
            return combination.every(index => {
                return board[index] === currentPlayer.getSign();
            });
        })
    }

    function endGame(tie=false) {
        state = "Finished";
        if (tie) {
            declareTie();
            return;
        }
        declareWinner();
    }

    function declareWinner() {
        const player1Text = document.querySelector("[data-player1]");
        const player2Text = document.querySelector("[data-player2]");
        
        const message = `${currentPlayer.getName()} is the winner`;

        if (currentPlayer === player1) {
            player1Text.textContent = message;
            player2Text.textContent = null;
        } else {
            player2Text.textContent = message;
            player1Text.textContent = null;
        }
    }

    function checkForTie() {
        let count = board.filter(element => element != null).length;
        
        return !checkForWinner() && count === 9;
    }

    function declareTie() {
        const tieText = document.querySelector("[data-tie]");
        tieText.textContent = "Tie game";
    }

    function reset() {
        state = "playing";
        board = [];
        currentPlayer = players[0];
        renderToDOM();
    }

    init();

    return { addPlayer }
})();

function Player(sign, name) {
    if (sign.length > 1) {
        sign = truncateSign(sign);
    }

    function truncateSign() {
        return sign.toString()[0];
    }

    function getSign() {
        return sign;
    }

    function setName(newName) {
        name = newName;
    }

    function getName() {
        return name;
    }

    return { getSign, getName, setName };
}

const player1 = Player("X", "Player 1");
const player2 = Player("O", "Player 2");

gameBoard.addPlayer(player1);
gameBoard.addPlayer(player2);