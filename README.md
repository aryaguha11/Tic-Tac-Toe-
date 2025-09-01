# Tic Tac Toe Game

A modern, responsive Tic Tac Toe game built with HTML, CSS, and JavaScript featuring both Player vs Player and Player vs Computer modes with multiple difficulty levels.

## Features

- 🎮 **Multiple Game Modes**: Choose between Player vs Player or Player vs Computer
- 🤖 **Computer AI**: Play against an intelligent computer opponent
- 📊 **Difficulty Levels**: Three difficulty levels for computer mode:
  - **Easy**: Computer makes random moves
  - **Medium**: Computer mixes random and strategic moves
  - **Hard**: Computer plays optimally using advanced strategy
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 🏆 **Score Tracking**: Keeps track of wins for both players
- ✨ **Visual Feedback**: Winning combinations are highlighted with animations
- 🔄 **Game Controls**: Restart game, reset score, and change mode functionality

## How to Play

1. Open `index.html` in your web browser
2. Choose your game mode:
   - **Player vs Player**: Two human players take turns
   - **Player vs Computer**: Play against the computer AI
3. If playing against computer, select difficulty level
4. Players take turns clicking on empty cells to place their X or O
5. The first player to get three in a row (horizontally, vertically, or diagonally) wins
6. If all cells are filled without a winner, the game ends in a draw
7. Use the "Restart Game" button to start a new game
8. Use the "Reset Score" button to reset the win counter
9. Use the "Change Mode" button to switch between game modes

## Game Rules

- Player X always goes first
- Players alternate turns
- A player wins by placing three of their marks in a row
- The game ends when someone wins or all cells are filled (draw)

## Computer AI Strategy

### Easy Mode
- Computer makes completely random moves
- Perfect for beginners or casual play

### Medium Mode
- Computer has a 50% chance of making the best move
- Computer has a 50% chance of making a random move
- Good balance between challenge and accessibility

### Hard Mode
- Computer plays optimally using advanced strategy:
  1. Looks for winning moves
  2. Blocks opponent's winning moves
  3. Takes center position when available
  4. Prefers corner positions over edges
  5. Makes strategic edge moves when necessary
- Very challenging - the computer rarely loses

## Files Structure

```
├── index.html      # Main HTML file
├── styles.css      # CSS styling and animations
├── script.js       # Game logic and AI functionality
└── README.md       # This file
```

## Technologies Used

- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **JavaScript (ES6+)**: Game logic using classes and modern JavaScript features
- **Google Fonts**: Poppins font family for typography

## Browser Compatibility

This game works on all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## Getting Started

Simply open the `index.html` file in any modern web browser to start playing!

Enjoy the game! 🎉
