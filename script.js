let currentPlayer = 'X';
let cells = [];
let size = 3;
let winningRow = null;

function createBoard() {
    size = parseInt(document.getElementById('sizeSelect').value);
    const board = document.getElementById('board');
    board.style.gridTemplateColumns = `repeat(${size}, var(--cell-size))`;
    
    cells = Array.from({ length: size * size }, (_, i) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', () => handleClick(i));
        return cell;
    });

    board.replaceChildren(...cells);
    currentPlayer = 'X';
    document.getElementById('status').textContent = `Player ${currentPlayer}'s turn`;
    winningRow = null;
}

function handleClick(index) {
    const cell = cells[index];
    if (cell.textContent || checkWin()) return;

    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    if (checkWin()) {
        highlightWinningRow();
        document.getElementById('status').textContent = `Player ${currentPlayer} wins!`;
        return;
    }

    if (cells.every(c => c.textContent)) {
        document.getElementById('status').textContent = "It's a draw!";
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('status').textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin() {
    const winningCombinations = [];
    const currentClass = currentPlayer.toLowerCase();

    // Check rows and columns
    for (let i = 0; i < size; i++) {
        // Check rows
        if (cells.slice(i * size, (i + 1) * size).every(c => c.classList.contains(currentClass))) {
            winningRow = cells.slice(i * size, (i + 1) * size);
            return true;
        }
        // Check columns
        if (Array.from({ length: size }, (_, j) => cells[i + j * size]).every(c => c.classList.contains(currentClass))) {
            winningRow = Array.from({ length: size }, (_, j) => cells[i + j * size]);
            return true;
        }
    }

    // Check diagonals
    const diag1 = Array.from({ length: size }, (_, i) => cells[i * size + i]);
    const diag2 = Array.from({ length: size }, (_, i) => cells[i * size + (size - 1 - i)]);
    
    if (diag1.every(c => c.classList.contains(currentClass))) {
        winningRow = diag1;
        return true;
    }
    if (diag2.every(c => c.classList.contains(currentClass))) {
        winningRow = diag2;
        return true;
    }

    return false;
}

function highlightWinningRow() {
    if (winningRow) {
        winningRow.forEach(cell => cell.classList.add('winning'));
    }
}

function resetGame() {
    cells.forEach(c => {
        c.textContent = '';
        c.className = 'cell';
    });
    currentPlayer = 'X';
    document.getElementById('status').textContent = `Player ${currentPlayer}'s turn`;
    winningRow = null;
}

function toggleTheme() {
    document.body.setAttribute('data-theme',
        document.body.getAttribute('data-theme') === 'dark' ? null : 'dark'
    );
}

// Initialize game
createBoard();
