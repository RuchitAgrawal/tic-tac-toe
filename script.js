let currentPlayer = 'X';
let playerToken = 'X';
let aiToken = 'O';
let aiDifficulty = 'easy';
let mode = 'single'; // 'single' or 'two'
let board = Array(9).fill('');
let cells = [];
let gameActive = true;
let winningRow = null;

// --- Board Setup ---
function createBoard() {
  const boardElem = document.getElementById('board');
  boardElem.innerHTML = '';
  boardElem.style.gridTemplateColumns = `repeat(3, var(--cell-size))`;
  cells = [];
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.setAttribute('data-index', i);
    cell.addEventListener('click', () => handleClick(i));
    boardElem.appendChild(cell);
    cells.push(cell);
  }
  resetGame();
}

// --- Game Logic ---
function handleClick(index) {
  if (!gameActive || board[index]) return;

  if (mode === 'single') {
    if (currentPlayer === playerToken) {
      makeMove(index, playerToken);
      if (checkWin(playerToken)) {
        highlightWinningRow();
        endGame(`Player ${playerToken} wins!`);
        return;
      }
      if (board.every(cell => cell)) {
        endGame("It's a draw!");
        return;
      }
      currentPlayer = aiToken;
      setTimeout(aiMove, 400);
    }
  } else {
    makeMove(index, currentPlayer);
    if (checkWin(currentPlayer)) {
      highlightWinningRow();
      endGame(`Player ${currentPlayer} wins!`);
      return;
    }
    if (board.every(cell => cell)) {
      endGame("It's a draw!");
      return;
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
  }
}

function makeMove(index, token) {
  board[index] = token;
  cells[index].textContent = token;
  cells[index].classList.add(token.toLowerCase());
}

function aiMove() {
  let move;
  if (aiDifficulty === 'easy') {
    move = dumbAI();
  } else {
    move = expertAI();
  }
  makeMove(move, aiToken);
  if (checkWin(aiToken)) {
    highlightWinningRow();
    endGame(`Computer (${aiToken}) wins!`);
    return;
  }
  if (board.every(cell => cell)) {
    endGame("It's a draw!");
    return;
  }
  currentPlayer = playerToken;
  updateStatus();
}

// --- AI Algorithms ---
function dumbAI() {
  let empty = board.map((v, i) => v === '' ? i : null).filter(i => i !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function expertAI() {
  function minimax(newBoard, depth, isMaximizing) {
    let winner = getWinner(newBoard);
    if (winner === aiToken) return { score: 10 - depth };
    if (winner === playerToken) return { score: depth - 10 };
    if (newBoard.every(cell => cell)) return { score: 0 };

    let best;
    if (isMaximizing) {
      best = { score: -Infinity };
      newBoard.forEach((cell, i) => {
        if (!cell) {
          newBoard[i] = aiToken;
          let result = minimax(newBoard, depth + 1, false);
          newBoard[i] = '';
          if (result.score > best.score) {
            best = { score: result.score, index: i };
          }
        }
      });
    } else {
      best = { score: Infinity };
      newBoard.forEach((cell, i) => {
        if (!cell) {
          newBoard[i] = playerToken;
          let result = minimax(newBoard, depth + 1, true);
          newBoard[i] = '';
          if (result.score < best.score) {
            best = { score: result.score, index: i };
          }
        }
      });
    }
    return best;
  }
  return minimax([...board], 0, true).index;
}

// --- Win Logic ---
function checkWin(token) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let pattern of winPatterns) {
    if (pattern.every(i => board[i] === token)) {
      winningRow = pattern;
      return true;
    }
  }
  return false;
}

function getWinner(b) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let pattern of winPatterns) {
    if (b[pattern[0]] && b[pattern[0]] === b[pattern[1]] && b[pattern[1]] === b[pattern[2]]) {
      return b[pattern[0]];
    }
  }
  return null;
}

function highlightWinningRow() {
  if (winningRow) {
    winningRow.forEach(i => cells[i].classList.add('winning'));
  }
}

function endGame(message) {
  gameActive = false;
  document.getElementById('status').textContent = message;
}

function updateStatus() {
  if (!gameActive) return;
  if (mode === 'single') {
    if (currentPlayer === playerToken) {
      document.getElementById('status').textContent = `Your turn (${playerToken})`;
    } else {
      document.getElementById('status').textContent = `Computer's turn (${aiToken})`;
    }
  } else {
    document.getElementById('status').textContent = `Player ${currentPlayer}'s turn`;
  }
}

// --- Reset and UI ---
function resetGame() {
  board = Array(9).fill('');
  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
  });
  gameActive = true;
  winningRow = null;
  currentPlayer = playerToken;
  updateStatus();
  if (mode === 'single' && aiToken === 'X') {
    // If AI is X, let AI start
    currentPlayer = aiToken;
    setTimeout(aiMove, 400);
  }
}

// --- Theme ---
// function toggleTheme() {
//   document.body.setAttribute('data-theme',
//     document.body.getAttribute('data-theme') === 'dark' ? null : 'dark'
//   );
// }
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme preference
window.onload = function() {
    document.getElementById('difficultyLabel').style.display = '';
    createBoard();
    
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }
};
////////

// --- Controls ---
document.getElementById('modeSelect').addEventListener('change', function() {
  mode = this.value;
  document.getElementById('difficultyLabel').style.display = (mode === 'single') ? '' : 'none';
  resetGame();
});

document.getElementById('tokenSelect').addEventListener('change', function() {
  playerToken = this.value;
  aiToken = playerToken === 'X' ? 'O' : 'X';
  resetGame();
});

document.getElementById('difficultySelect').addEventListener('change', function() {
  aiDifficulty = this.value;
  resetGame();
});

// --- Initial Setup ---
window.onload = function() {
  document.getElementById('difficultyLabel').style.display = '';
  createBoard();
};
