class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = { X: 0, O: 0 };
        this.gameMode = null; // 'pvp' or 'pvc'
        this.difficulty = null; // 'easy', 'medium', 'hard'
        this.playerSymbol = 'X';
        this.computerSymbol = 'O';
        this.soundEnabled = true;
        
        this.initializeElements();
        this.addEventListeners();
        this.createParticles();
        this.initSoundSystem();
        this.showGameModeSelection();
    }

    initializeElements() {
        this.cells = document.querySelectorAll('[data-cell]');
        this.status = document.getElementById('status');
        this.scoreX = document.getElementById('score-x');
        this.scoreO = document.getElementById('score-o');
        this.restartBtn = document.getElementById('restart-btn');
        this.resetScoreBtn = document.getElementById('reset-score-btn');
        this.changeModeBtn = document.getElementById('change-mode-btn');
        this.winningMessage = document.getElementById('winning-message');
        this.winningText = document.getElementById('winning-text');
        this.winningIcon = document.getElementById('winning-icon');
        this.restartWinBtn = document.getElementById('restart-win-btn');
        this.soundToggleBtn = document.getElementById('sound-toggle');
        
        // Game mode elements
        this.gameModeSelection = document.getElementById('game-mode-selection');
        this.difficultySelection = document.getElementById('difficulty-selection');
        this.gameMain = document.getElementById('game-main');
        this.backToModeBtn = document.getElementById('back-to-mode');
    }

    initSoundSystem() {
        // Initialize Web Audio API
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('Audio system initialized');
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random size between 2-6px
            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Random animation delay
            particle.style.animationDelay = `${Math.random() * 6}s`;
            
            particlesContainer.appendChild(particle);
        }
    }

    addEventListeners() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
            cell.addEventListener('mouseenter', (e) => this.handleCellHover(e));
            cell.addEventListener('mouseleave', (e) => this.handleCellLeave(e));
        });

        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.resetScoreBtn.addEventListener('click', () => this.resetScore());
        this.changeModeBtn.addEventListener('click', () => this.showGameModeSelection());
        this.restartWinBtn.addEventListener('click', () => this.restartGame());
        this.soundToggleBtn.addEventListener('click', () => this.toggleSound());
        
        // Back button event listener with error handling
        if (this.backToModeBtn) {
            this.backToModeBtn.addEventListener('click', () => {
                console.log('Back button clicked');
                this.showGameModeSelection();
            });
        } else {
            console.error('Back button not found');
        }

        // Game mode selection
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectGameMode(e.target.closest('.mode-btn').dataset.mode));
            btn.addEventListener('mouseenter', () => this.playHoverSound());
        });

        // Difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectDifficulty(e.target.closest('.difficulty-btn').dataset.difficulty));
            btn.addEventListener('mouseenter', () => this.playHoverSound());
        });

        // Add hover sounds to all buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => this.playHoverSound());
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Event delegation for back button (fallback)
        document.addEventListener('click', (e) => {
            if (e.target.closest('#back-to-mode')) {
                console.log('Back button clicked via delegation');
                this.showGameModeSelection();
            }
        });
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.soundToggleBtn.classList.toggle('muted', !this.soundEnabled);
        this.soundToggleBtn.innerHTML = this.soundEnabled ? 
            '<i class="fas fa-volume-up"></i>' : 
            '<i class="fas fa-volume-mute"></i>';
        
        // Play a test sound
        if (this.soundEnabled) {
            this.playClickSound();
        }
    }

    handleKeyboard(e) {
        if (e.key === 'r' || e.key === 'R') {
            this.restartGame();
        } else if (e.key === 'm' || e.key === 'M') {
            this.showGameModeSelection();
        } else if (e.key === 's' || e.key === 'S') {
            this.resetScore();
        } else if (e.key === 'b' || e.key === 'B') {
            // Back button shortcut
            if (this.difficultySelection.style.display !== 'none') {
                this.showGameModeSelection();
            }
        }
    }

    handleCellHover(e) {
        if (this.board[Array.from(this.cells).indexOf(e.target)] === '' && this.gameActive) {
            e.target.style.transform = 'translateY(-3px) scale(1.05)';
            e.target.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
            this.playHoverSound();
        }
    }

    handleCellLeave(e) {
        e.target.style.transform = '';
        e.target.style.boxShadow = '';
    }

    showGameModeSelection() {
        this.gameModeSelection.style.display = 'block';
        this.difficultySelection.style.display = 'none';
        this.gameMain.style.display = 'none';
        this.winningMessage.classList.remove('show');
        
        // Reset game state when going back to mode selection
        this.gameMode = null;
        this.difficulty = null;
        this.restartGame();
        
        this.updateStatus('Choose game mode', 'fas fa-users');
        console.log('Game mode selection shown');
    }

    selectGameMode(mode) {
        this.gameMode = mode;
        this.playClickSound();
        
        if (mode === 'pvp') {
            this.startGame();
        } else if (mode === 'pvc') {
            this.showDifficultySelection();
        }
    }

    showDifficultySelection() {
        this.gameModeSelection.style.display = 'none';
        this.difficultySelection.style.display = 'block';
        this.gameMain.style.display = 'none';
        this.updateStatus('Select difficulty', 'fas fa-brain');
    }

    selectDifficulty(difficulty) {
        this.difficulty = difficulty;
        this.playClickSound();
        this.startGame();
    }

    startGame() {
        this.gameModeSelection.style.display = 'none';
        this.difficultySelection.style.display = 'none';
        this.gameMain.style.display = 'block';
        
        this.restartGame();
        
        if (this.gameMode === 'pvc') {
            this.updateStatus(`Player vs Computer (${this.difficulty}) - Your turn`, 'fas fa-user');
        } else {
            this.updateStatus("Player X's turn", 'fas fa-user');
        }
    }

    handleCellClick(e) {
        const cell = e.target;
        const cellIndex = Array.from(this.cells).indexOf(cell);

        if (this.board[cellIndex] !== '' || !this.gameActive) {
            return;
        }

        // Handle player move
        this.makeMove(cellIndex, this.currentPlayer);

        if (this.checkWin()) {
            this.endGame(false);
        } else if (this.checkDraw()) {
            this.endGame(true);
        } else {
            this.switchPlayer();
            
            // If it's computer's turn in PvC mode
            if (this.gameMode === 'pvc' && this.currentPlayer === this.computerSymbol) {
                setTimeout(() => this.makeComputerMove(), 500);
            } else {
                this.updateStatus();
            }
        }
    }

    makeMove(cellIndex, player) {
        this.board[cellIndex] = player;
        this.cells[cellIndex].textContent = player;
        this.cells[cellIndex].classList.add(player.toLowerCase());
        this.playClickSound();
        this.createMoveEffect(this.cells[cellIndex]);
    }

    createMoveEffect(cell) {
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(102, 126, 234, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.pointerEvents = 'none';
        
        cell.style.position = 'relative';
        cell.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    makeComputerMove() {
        if (!this.gameActive) return;

        let move;
        
        switch (this.difficulty) {
            case 'easy':
                move = this.getRandomMove();
                break;
            case 'medium':
                move = Math.random() < 0.5 ? this.getBestMove() : this.getRandomMove();
                break;
            case 'hard':
                move = this.getBestMove();
                break;
            default:
                move = this.getRandomMove();
        }

        if (move !== -1) {
            this.makeMove(move, this.computerSymbol);
            
            if (this.checkWin()) {
                this.endGame(false);
            } else if (this.checkDraw()) {
                this.endGame(true);
            } else {
                this.switchPlayer();
                this.updateStatus();
            }
        }
    }

    getRandomMove() {
        const emptyCells = this.board
            .map((cell, index) => cell === '' ? index : -1)
            .filter(index => index !== -1);
        
        return emptyCells.length > 0 ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : -1;
    }

    getBestMove() {
        // Check for winning move
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = this.computerSymbol;
                if (this.checkWin()) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }

        // Block player's winning move
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = this.playerSymbol;
                if (this.checkWin()) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }

        // Take center if available
        if (this.board[4] === '') {
            return 4;
        }

        // Take corners if available
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(corner => this.board[corner] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }

        // Take any available edge
        const edges = [1, 3, 5, 7];
        const availableEdges = edges.filter(edge => this.board[edge] === '');
        if (availableEdges.length > 0) {
            return availableEdges[Math.floor(Math.random() * availableEdges.length)];
        }

        return -1;
    }

    checkWin() {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        return winConditions.some(condition => {
            const [a, b, c] = condition;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                // Highlight winning cells
                this.cells[a].classList.add('winning');
                this.cells[b].classList.add('winning');
                this.cells[c].classList.add('winning');
                return true;
            }
            return false;
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    endGame(draw) {
        this.gameActive = false;
        
        if (draw) {
            this.winningText.textContent = "It's a draw!";
            this.winningIcon.innerHTML = '<i class="fas fa-handshake"></i>';
            this.playDrawSound();
        } else {
            let winnerText;
            if (this.gameMode === 'pvc') {
                winnerText = this.currentPlayer === this.playerSymbol ? 'You win!' : 'Computer wins!';
                this.winningIcon.innerHTML = this.currentPlayer === this.playerSymbol ? 
                    '<i class="fas fa-trophy"></i>' : '<i class="fas fa-robot"></i>';
            } else {
                winnerText = `Player ${this.currentPlayer} wins!`;
                this.winningIcon.innerHTML = '<i class="fas fa-crown"></i>';
            }
            this.winningText.textContent = winnerText;
            this.scores[this.currentPlayer]++;
            this.updateScore();
            this.playWinSound();
            this.createConfetti();
        }
        
        this.winningMessage.classList.add('show');
    }

    createConfetti() {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#2ecc71', '#f39c12'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = '-10px';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = '50%';
                confetti.style.pointerEvents = 'none';
                confetti.style.zIndex = '9999';
                confetti.style.animation = 'confettiFall 3s linear forwards';
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 3000);
            }, i * 50);
        }
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }

    updateStatus(text = null, icon = null) {
        if (text) {
            this.status.innerHTML = `<i class="${icon} status-icon"></i><span>${text}</span>`;
        } else {
            if (this.gameMode === 'pvc') {
                if (this.currentPlayer === this.playerSymbol) {
                    this.status.innerHTML = `<i class="fas fa-user status-icon"></i><span>Player vs Computer (${this.difficulty}) - Your turn</span>`;
                } else {
                    this.status.innerHTML = `<i class="fas fa-robot status-icon"></i><span>Player vs Computer (${this.difficulty}) - Computer's turn</span>`;
                }
            } else {
                this.status.innerHTML = `<i class="fas fa-user status-icon"></i><span>Player ${this.currentPlayer}'s turn</span>`;
            }
        }
    }

    updateScore() {
        this.scoreX.textContent = this.scores.X;
        this.scoreO.textContent = this.scores.O;
        
        // Animate score update
        const scoreElement = this.currentPlayer === 'X' ? this.scoreX : this.scoreO;
        scoreElement.style.transform = 'scale(1.3)';
        scoreElement.style.color = this.currentPlayer === 'X' ? '#e74c3c' : '#3498db';
        
        setTimeout(() => {
            scoreElement.style.transform = 'scale(1)';
            scoreElement.style.color = '';
        }, 300);
    }

    restartGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning');
            cell.style.transform = '';
            cell.style.boxShadow = '';
        });
        
        this.winningMessage.classList.remove('show');
        this.updateStatus();
    }

    resetScore() {
        this.scores = { X: 0, O: 0 };
        this.updateScore();
        this.restartGame();
    }

    // Sound methods using Web Audio API
    playClickSound() {
        if (this.soundEnabled) {
            this.playTone(800, 0.1, 0.1);
        }
    }

    playHoverSound() {
        if (this.soundEnabled) {
            this.playTone(600, 0.05, 0.05);
        }
    }

    playWinSound() {
        if (this.soundEnabled) {
            this.playTone(1000, 0.2, 0.3);
            setTimeout(() => this.playTone(1200, 0.2, 0.3), 200);
            setTimeout(() => this.playTone(1400, 0.2, 0.3), 400);
        }
    }

    playDrawSound() {
        if (this.soundEnabled) {
            this.playTone(400, 0.15, 0.2);
            setTimeout(() => this.playTone(500, 0.15, 0.2), 200);
        }
    }

    playTone(frequency, duration, volume) {
        if (this.audioContext) {
            try {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + duration);
            } catch (e) {
                console.log('Tone generation failed:', e);
            }
        }
    }
}

// Add CSS for new animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
