let currentPlayer = 'X';
let playerToken = 'X';
let aiToken = 'O';
let aiDifficulty = 'easy';
let mode = 'single';       // 'single' or 'two'
let gameType = 'normal';   // 'normal' or 'infinite'
let board = Array(9).fill('');
let cells = [];
let gameActive = true;
let winningRow = null;

// Infinite-mode queues — store board indices in insertion order (oldest first)
const MAX_PIECES = 3;
let playerMoveQueue = [];  // indices owned by playerToken
let aiMoveQueue = [];      // indices owned by aiToken (or player 2 in two-player)

// Score tracking
let scores = {
  player: 0,
  ai: 0,
  draws: 0
};

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

// --- Infinite-mode helpers ---
function getQueue(token) {
  return token === playerToken ? playerMoveQueue : aiMoveQueue;
}

/**
 * Returns the index that will vanish if `token` places a new piece.
 * Returns null if not yet at MAX_PIECES.
 */
function peekVanish(token) {
  const q = getQueue(token);
  return q.length >= MAX_PIECES ? q[0] : null;
}

/**
 * Applies the vanish + place logic to the **live** board & DOM.
 * Returns the index that was removed (or null).
 */
function infinitePlace(index, token) {
  const q = getQueue(token);
  let removed = null;

  if (q.length >= MAX_PIECES) {
    removed = q.shift();
    // Animate the removal
    cells[removed].classList.add('vanishing');
    setTimeout(() => {
      // Clear the DOM piece after animation
      cells[removed].textContent = '';
      cells[removed].className = 'cell';
    }, 380);
    board[removed] = '';
  }

  // Place new piece
  board[index] = token;
  q.push(index);
  cells[index].textContent = token;
  cells[index].classList.add(token.toLowerCase());

  return removed;
}

/**
 * Updates the orange "next to vanish" warning highlights.
 */
function updateVanishWarnings() {
  if (gameType !== 'infinite') return;
  cells.forEach(c => c.classList.remove('next-vanish'));

  const pVanish = peekVanish(playerToken);
  if (pVanish !== null) cells[pVanish].classList.add('next-vanish');

  const aVanish = peekVanish(aiToken);
  if (aVanish !== null && aVanish !== pVanish) cells[aVanish].classList.add('next-vanish');
}

// --- Game Logic ---
function handleClick(index) {
  if (!gameActive || board[index]) return;

  if (mode === 'single') {
    if (currentPlayer !== playerToken) return;

    if (gameType === 'infinite') {
      infinitePlace(index, playerToken);
      updateVanishWarnings();
      if (checkWin(playerToken)) {
        setTimeout(() => { highlightWinningRow(); endGame(`Player ${playerToken} wins!`); }, 10);
        return;
      }
      // No draw in infinite mode
      currentPlayer = aiToken;
      setTimeout(aiMove, 400);
    } else {
      makeMove(index, playerToken);
      if (checkWin(playerToken)) { highlightWinningRow(); endGame(`Player ${playerToken} wins!`); return; }
      if (board.every(cell => cell)) { endGame("It's a draw!"); return; }
      currentPlayer = aiToken;
      setTimeout(aiMove, 400);
    }
  } else {
    // Two-player
    if (gameType === 'infinite') {
      infinitePlace(index, currentPlayer);
      updateVanishWarnings();
      if (checkWin(currentPlayer)) {
        setTimeout(() => { highlightWinningRow(); endGame(`Player ${currentPlayer} wins!`); }, 10);
        return;
      }
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      updateStatus();
    } else {
      makeMove(index, currentPlayer);
      if (checkWin(currentPlayer)) { highlightWinningRow(); endGame(`Player ${currentPlayer} wins!`); return; }
      if (board.every(cell => cell)) { endGame("It's a draw!"); return; }
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      updateStatus();
    }
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
  if (move === undefined || move === null) return;

  if (gameType === 'infinite') {
    infinitePlace(move, aiToken);
    updateVanishWarnings();
    if (checkWin(aiToken)) {
      setTimeout(() => { highlightWinningRow(); endGame(`Computer (${aiToken}) wins!`); }, 10);
      return;
    }
    // No draw in infinite mode
  } else {
    makeMove(move, aiToken);
    if (checkWin(aiToken)) { highlightWinningRow(); endGame(`Computer (${aiToken}) wins!`); return; }
    if (board.every(cell => cell)) { endGame("It's a draw!"); return; }
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
  if (gameType === 'infinite') {
    return expertAIInfinite();
  }

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
          if (result.score > best.score) best = { score: result.score, index: i };
        }
      });
    } else {
      best = { score: Infinity };
      newBoard.forEach((cell, i) => {
        if (!cell) {
          newBoard[i] = playerToken;
          let result = minimax(newBoard, depth + 1, true);
          newBoard[i] = '';
          if (result.score < best.score) best = { score: result.score, index: i };
        }
      });
    }
    return best;
  }
  return minimax([...board], 0, true).index;
}

/**
 * Infinite-mode minimax: simulates vanishing during evaluation.
 * State = { board, pQueue, aQueue }
 */
function expertAIInfinite() {
  const MAX_DEPTH = 6; // cap depth to stay responsive

  function applyMove(state, index, token) {
    const newBoard = [...state.board];
    const newPQ = [...state.pQueue];
    const newAQ = [...state.aQueue];
    const q = token === aiToken ? newAQ : newPQ;

    if (q.length >= MAX_PIECES) {
      const removed = q.shift();
      newBoard[removed] = '';
    }
    newBoard[index] = token;
    q.push(index);

    return { board: newBoard, pQueue: newPQ, aQueue: newAQ };
  }

  function minimaxInf(state, depth, isMaximizing) {
    const winner = getWinner(state.board);
    if (winner === aiToken)     return { score: 10 - depth };
    if (winner === playerToken) return { score: depth - 10 };
    if (depth >= MAX_DEPTH)    return { score: 0 };

    const empty = state.board.map((v, i) => v === '' ? i : null).filter(i => i !== null);
    if (empty.length === 0)    return { score: 0 };

    let best;
    if (isMaximizing) {
      best = { score: -Infinity };
      for (const i of empty) {
        const next = applyMove(state, i, aiToken);
        const result = minimaxInf(next, depth + 1, false);
        if (result.score > best.score) best = { score: result.score, index: i };
      }
    } else {
      best = { score: Infinity };
      for (const i of empty) {
        const next = applyMove(state, i, playerToken);
        const result = minimaxInf(next, depth + 1, true);
        if (result.score < best.score) best = { score: result.score, index: i };
      }
    }
    return best;
  }

  const initialState = { board: [...board], pQueue: [...playerMoveQueue], aQueue: [...aiMoveQueue] };
  return minimaxInf(initialState, 0, true).index;
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

  if (message.includes('Player')) {
    scores.player++;
    updateScoreDisplay();
    createConfetti();
  } else if (message.includes('Computer')) {
    scores.ai++;
    updateScoreDisplay();
  } else if (message.includes('draw')) {
    scores.draws++;
    updateScoreDisplay();
  }
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
  if (gameType === 'infinite') {
    updateVanishWarnings();
  }
}

// --- Reset and UI ---
function resetGame() {
  board = Array(9).fill('');
  playerMoveQueue = [];
  aiMoveQueue = [];
  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
  });
  gameActive = true;
  winningRow = null;
  currentPlayer = playerToken;
  updateStatus();
  if (mode === 'single' && aiToken === 'X') {
    currentPlayer = aiToken;
    setTimeout(aiMove, 400);
  }
}

// --- Theme ---
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

// --- Controls ---
document.getElementById('gameTypeSelect').addEventListener('change', function() {
  gameType = this.value;
  resetGame();
});

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

// --- Score Management ---
function updateScoreDisplay() {
  document.getElementById('playerScore').textContent = scores.player;
  document.getElementById('aiScore').textContent = scores.ai;
  document.getElementById('drawScore').textContent = scores.draws;
  localStorage.setItem('tictactoe-scores', JSON.stringify(scores));
}

function loadScores() {
  const savedScores = localStorage.getItem('tictactoe-scores');
  if (savedScores) {
    scores = JSON.parse(savedScores);
    updateScoreDisplay();
  }
}

// --- Particle Animation ---
function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 50;

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 1 - 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x > canvas.width)  this.x = 0;
      if (this.x < 0)             this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0)             this.y = canvas.height;
    }
    draw() {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// --- Confetti Effect ---
function createConfetti() {
  const container = document.getElementById('confetti-container');
  container.innerHTML = '';
  const colors = ['#ffd93d', '#ff6b6b', '#4ecdc4', '#a8a5e6', '#51cf66', '#ff6348', '#f368e0'];
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(confetti);
  }
  setTimeout(() => { container.innerHTML = ''; }, 5000);
}

// --- Initial Setup ---
window.onload = function() {
  document.getElementById('difficultyLabel').style.display = '';
  createBoard();
  initParticles();
  loadScores();
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') document.body.setAttribute('data-theme', 'dark');
};
