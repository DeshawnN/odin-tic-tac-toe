const gameBoard = (function() {
    const board = [];

    function move(player, position) {
        board[position] = player.getSign();
    }

    function getBoard() {
        return board;
    }

    return { move, getBoard };
})();


const { player1, player2 } = (function() {
    function Player(sign) {
        function getSign() {
            return sign;
        }
        
        return { getSign };
    }

    const player1 = Player("X");
    const player2 = Player("O");

    return { player1, player2 };
})();


