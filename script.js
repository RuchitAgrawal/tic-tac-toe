let currentPlayer = 'X';
let playerToken = 'X';
let aiToken = 'O';
let aiDifficulty = 'easy';
let mode = 'single'; // 'single' or 'two'
let board = Array(9).fill('');
let cells = [];
let gameActive = true;
let winningRow = null;

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
  
  // Update scores
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

// --- Score Management ---
function updateScoreDisplay() {
  document.getElementById('playerScore').textContent = scores.player;
  document.getElementById('aiScore').textContent = scores.ai;
  document.getElementById('drawScore').textContent = scores.draws;
  
  // Save scores to localStorage
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
      
      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }
    
    draw() {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
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
  
  setTimeout(() => {
    container.innerHTML = '';
  }, 5000);
}

// --- Initial Setup ---
window.onload = function() {
  document.getElementById('difficultyLabel').style.display = '';
  createBoard();
  initParticles();
  loadScores();
  
  // Load theme from localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
  }
};
