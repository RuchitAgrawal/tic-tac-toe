# 🎮 Dynamic Tic Tac Toe

A classic Tic Tac Toe game implemented with dynamic board sizing (3x3, 4x4, 5x5) and a modern, theme-switchable interface.

## ✨ Features

- **Dynamic Board Size**: Play on a 3x3, 4x4, or 5x5 grid.
- **Win Detection**: Automatically checks for wins across rows, columns, and both diagonals.
- **Draw Detection**: Declares a draw if all cells are filled without a winner.
- **Visual Feedback**: Highlights the winning line with a distinct color.
- **Theme Toggle**: Supports both light mode (default) and dark mode for a modern user experience.
- **Responsive Design**: Optimized for various screen sizes.

## 💻 Technologies Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure and Semantic Markup |
| CSS3 | Styling, Layout, Variables (`:root`), and Theme Switching |
| JavaScript (ES6) | Core Game Logic, State Management, and DOM Manipulation |

## 🚀 Getting Started

To run this project locally, simply follow these steps.

### Prerequisites

You only need a modern web browser (like Chrome, Firefox, or Edge).

### Installation and Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/dynamic-tic-tac-toe.git
   cd dynamic-tic-tac-toe
   ```

2. **Open in Browser**:
   - Open the `index.html` file directly in your web browser.
   - Alternatively, you can serve it using a simple local server extension (like Live Server for VS Code) for best performance.

## 🕹️ How to Play

1. **Start Game**: The game defaults to a 3x3 board.
2. **Select Size**: Use the dropdown menu to select a different board size (4x4 or 5x5). Changing the size automatically starts a new game.
3. **Take Turns**: Player X goes first. Click on any empty cell to place your mark.
4. **Winning**: The goal is to get three (or four/five, depending on the board size) of your marks in a horizontal, vertical, or diagonal row.
5. **Reset**: Click the "New Game" button to clear the board and restart the game at the current size.
6. **Toggle Theme**: Use the "🌓 Toggle Theme" button in the top right corner to switch between the light and dark color schemes.

## ⚙️ Game Logic Highlights

The core logic is handled in `script.js`:

- **`createBoard()`**: Initializes the grid structure based on the size selected in the dropdown.
- **`handleClick(index)`**: Handles a player move, updates the cell, and then calls `checkWin()`.
- **`checkWin()`**: Iterates dynamically through all possible rows, columns, and two main diagonals based on the current board size (`size`) to determine if the `currentPlayer` has won.
- **`highlightWinningRow()`**: Uses a loop over the determined winning array (`winningRow`) to apply the CSS class for visual win feedback.

## 🎨 Styling Details

The styles are managed in `styles.css` using CSS Variables:

- The `:root` selector defines the default light theme variables.
- The `[data-theme="dark"]` attribute is used to override these variables, enabling the dark mode switch in JavaScript.
- A subtle CSS gradient is applied to the body for a modern background effect.
