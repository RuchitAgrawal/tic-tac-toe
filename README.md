# 🚀 Tic Tac Toe Ultimate: Dynamic, AI-Powered, and Feature-Rich

This project is a sophisticated, full-stack Tic Tac Toe game application, showcasing modern JavaScript, advanced AI implementation, and a robust, feature-rich UI/UX design.

## 💡 Project Evolution: Improved and Extended

| Feature            | Original Concept (Static 3x3)                      | Current Ultimate Version                                                                                                                      |
|--------------------|----------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| **Game Modes**     | Basic single-player (vs AI) or simple two-player. | Dedicated Single Player and Two Player modes are selectable.                                                                                  |
| **AI Difficulty**  | Simple AI (random moves) likely used.              | Expert AI (minimax() function) for 'Hard' mode, and a random AI for 'Easy' mode.                                                             |
| **Board Size**     | Static 3x3 only.                                   | Static 3x3 (for simplicity and Minimax scope) but architecture supports dynamic scaling (Note: Code currently configured for 3x3).            |
| **Score Tracking** | None.                                              | Persistent Scoreboard (Wins, Losses, Draws) saved to localStorage.                                                                           |
| **Theming**        | Basic theme toggle functionality.                  | Persistent Theme preference saved to localStorage across sessions.                                                                            |
| **Visual/UX**      | Basic styling.                                     | Modern Glassmorphism Design, Particle Background (\<canvas\>), and Confetti Effect on player win.                                            |
| **Customization**  | Minimal.                                           | Players can choose to play as 'X' or 'O'; AI takes the opposite token.                                                                       |

## ✨ Current Features

- **Multi-Mode Gameplay**: Select between Single Player (vs. Computer) and Two Player modes using a control dropdown.
- **Expert AI**: Includes a highly challenging 'Hard' mode powered by the Minimax Algorithm (expertAI()), and an 'Easy' mode (random moves).
- **Persistent Scoreboard**: Tracks Wins, Losses (vs. AI), and Draws across sessions, with data saved using localStorage.
- **Modern UI/UX**:
  - **Glassmorphism Design**: Styled with vibrant, modern CSS and subtle shadowing.
  - **Persistent Theme**: Users can toggle between light and dark themes; the preference is saved via localStorage and loads upon entry.
  - **Visual Feedback**: Features a subtle particle background (\<canvas\>) and an engaging confetti animation upon human player wins.
- **Customization**: Players can choose to play as 'X' or 'O', with the AI automatically taking the opposite token.

## 💻 Technologies Used

| Technology | Purpose |
|------------|---------|
| **HTML5** | Application structure, Scoreboard, and Control elements. |
| **CSS3** | Glassmorphism Design, CSS Variables for theming, @keyframes for animations (title, cells, gradient shift), and Responsive Design. |
| **JavaScript (ES6)** | Core Game Logic, Minimax Algorithm, localStorage for score and theme persistence, Canvas API for Particle Background, and Confetti Effect generation. |

## 🚀 Getting Started

To run this project locally, simply follow these steps.

### Prerequisites

You only need a modern web browser (like Chrome, Firefox, or Edge).

### Installation and Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/tic-tac-toe-ultimate.git
   cd tic-tac-toe-ultimate
   ```

2. **Open in Browser**:
   - Open the `index.html` file directly in your web browser to launch the game.

## ⚙️ Key Implementation Details

The project is driven by `script.js`, which handles game state, AI, and UI interactions:

- **Minimax Implementation**: The `expertAI()` function calls the recursive `minimax()` function to calculate the optimal move, ensuring the computer plays a perfect game on 'Hard' mode.
- **Score Persistence**: Scores and the last selected theme are stored and retrieved using `localStorage.setItem()` and `localStorage.getItem()`.
- **Canvas API**: The `initParticles()` function utilizes the HTML `\<canvas\>` element to render and animate the background particles.
- **Theming**: The `toggleTheme()` function switches the `data-theme` attribute on the `\<body\>`, which is styled by CSS Variables in `styles.css`.

## 🕹️ How to Play

1. **Select Mode**: Choose "vs Computer" or "Two Players" using the 🎯 Mode dropdown.
2. **Customize**: If playing vs. Computer, select your token (X or O) and the 🎚️ Difficulty.
3. **Start/Reset**: Click the 🔄 New Game button to begin or reset the board.
4. **Scoring**: Your scores will automatically save and load when you return to the game.
5. **Toggle Theme**: Use the 🌓 Theme button in the top corner to switch themes permanently.
