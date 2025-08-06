// TypeWarrior - Enhanced Typing Game
class TypeWarrior {
    constructor() {
        this.gameState = {
            isPlaying: false,
            mode: 'story',
            level: 1,
            xp: 0,
            streak: 0,
            chapter: 1,
            combo: 1,
            startTime: null,
            currentText: '',
            typedText: '',
            wpm: 0,
            accuracy: 100,
            timeLeft: 60,
            powerUps: {
                slowTime: { active: false, cooldown: 0 },
                doublePoints: { active: false, cooldown: 0 },
                shield: { active: false, cooldown: 0 }
            },
            achievements: [],
            soundEnabled: true,
            theme: 'dark'
        };

        this.quotes = {
            story: [
                {
                    chapter: 1,
                    title: "The Typing Apprentice",
                    text: "In the mystical realm of keyboards, young warriors learn the ancient art of rapid text transcription. Every keystroke echoes through the digital void, building strength and precision."
                },
                {
                    chapter: 2,
                    title: "The Speed Trials",
                    text: "As darkness falls upon the mechanical switches, only those with lightning-fast fingers can hope to survive the grueling trials ahead. Each letter demands perfect timing and unwavering focus."
                },
                {
                    chapter: 3,
                    title: "Master of Letters",
                    text: "The ancient scrolls speak of legendary typists who could weave words at impossible speeds, their fingers dancing across keys like virtuoso pianists performing symphonies of text."
                }
            ],
            battle: [
                "In the heat of battle, every keystroke counts. Warriors clash with words, each error a weakness to exploit. Only the fastest and most accurate will claim victory.",
                "The arena trembles as typing gladiators face off in epic combat. Fingers fly across keyboards like lightning, each word a weapon in this digital colosseum.",
                "Champions rise and fall with each passing second. In this realm, speed is power, accuracy is armor, and victory belongs to the swift."
            ],
            challenge: [
                "Today's challenge demands the precision of a surgeon and the speed of light. Ancient runes and mystical incantations test even the most skilled practitioners.",
                "Beware the cursed texts that twist tongues and tangle fingers. Only true masters can navigate these treacherous linguistic labyrinths.",
                "The daily ritual begins with words of power, each character charged with magical energy that grows stronger with perfect execution."
            ]
        };

        this.achievements = [
            { id: 'first_steps', name: 'First Steps', description: 'Complete your first test', icon: 'fas fa-baby', unlocked: false },
            { id: 'speed_demon', name: 'Speed Demon', description: 'Type 60+ WPM', icon: 'fas fa-tachometer-alt', unlocked: false },
            { id: 'accuracy_ace', name: 'Accuracy Ace', description: 'Achieve 98%+ accuracy', icon: 'fas fa-bullseye', unlocked: false },
            { id: 'combo_master', name: 'Combo Master', description: 'Reach 10x combo multiplier', icon: 'fas fa-fire', unlocked: false },
            { id: 'power_user', name: 'Power User', description: 'Use all power-ups in one game', icon: 'fas fa-magic', unlocked: false },
            { id: 'chapter_complete', name: 'Chapter Master', description: 'Complete a story chapter', icon: 'fas fa-book', unlocked: false }
        ];

        this.leaderboard = [
            { name: 'TypeMaster', score: 156 },
            { name: 'SpeedDemon', score: 142 },
            { name: 'KeyboardNinja', score: 138 },
            { name: 'FingerFlash', score: 129 },
            { name: 'TextTornado', score: 124 }
        ];

        this.bindEvents();
        this.initializeUI();
    }

    bindEvents() {
        // Mode switching
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchMode(btn.dataset.mode));
        });

        // Game controls
        document.getElementById('start-game').addEventListener('click', () => this.startGame());
        document.getElementById('restart').addEventListener('click', () => this.restartGame());
        
        // Input handling
        const input = document.getElementById('input');
        input.addEventListener('input', (e) => this.handleInput(e));
        input.addEventListener('keydown', (e) => this.handleKeyDown(e));

        // Power-ups
        document.getElementById('slow-time').addEventListener('click', () => this.activatePowerUp('slowTime'));
        document.getElementById('double-points').addEventListener('click', () => this.activatePowerUp('doublePoints'));
        document.getElementById('shield').addEventListener('click', () => this.activatePowerUp('shield'));

        // Settings
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
        document.getElementById('sound-toggle').addEventListener('click', () => this.toggleSound());

        // Battle mode
        document.getElementById('join-battle').addEventListener('click', () => this.joinBattle());
    }

    initializeUI() {
        this.updateStats();
        this.updateAchievements();
        this.updateLeaderboard();
        this.setRandomQuote();
    }

    switchMode(mode) {
        this.gameState.mode = mode;
        
        // Update mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Show/hide mode panels
        document.querySelectorAll('.game-mode').forEach(panel => {
            panel.classList.toggle('active', panel.id === `${mode}-mode`);
        });

        this.setRandomQuote();
        this.playSound('mode-switch');
    }

    startGame() {
        if (this.gameState.isPlaying) return;

        this.gameState.isPlaying = true;
        this.gameState.startTime = Date.now();
        this.gameState.typedText = '';
        this.gameState.combo = 1;
        this.gameState.timeLeft = 60;

        const input = document.getElementById('input');
        input.disabled = false;
        input.focus();
        input.value = '';

        document.querySelector('.typing-area').classList.add('active');
        
        this.startTimer();
        this.updateTextDisplay();
        this.playSound('game-start');
        
        // Update button states
        document.getElementById('start-game').style.display = 'none';
        document.getElementById('restart').style.display = 'inline-flex';
    }

    restartGame() {
        this.gameState.isPlaying = false;
        this.gameState.startTime = null;
        this.gameState.typedText = '';
        this.gameState.combo = 1;
        this.gameState.timeLeft = 60;

        const input = document.getElementById('input');
        input.disabled = true;
        input.value = '';

        document.querySelector('.typing-area').classList.remove('active');
        
        this.setRandomQuote();
        this.updateStats();
        this.updateTextDisplay();
        
        // Reset power-ups
        Object.keys(this.gameState.powerUps).forEach(key => {
            this.gameState.powerUps[key].active = false;
            this.gameState.powerUps[key].cooldown = 0;
        });
        this.updatePowerUpUI();

        // Update button states
        document.getElementById('start-game').style.display = 'inline-flex';
        document.getElementById('restart').style.display = 'none';

        this.playSound('game-reset');
    }

    handleInput(e) {
        if (!this.gameState.isPlaying) return;

        this.gameState.typedText = e.target.value;
        this.updateTextDisplay();
        this.calculateStats();
        this.updateStats();

        // Check for completion
        if (this.gameState.typedText === this.gameState.currentText) {
            this.completeGame();
        }

        // Combo system
        const accuracy = this.calculateAccuracy();
        if (accuracy > 95) {
            this.gameState.combo = Math.min(this.gameState.combo + 0.1, 10);
        } else if (accuracy < 85) {
            this.gameState.combo = Math.max(1, this.gameState.combo - 0.5);
        }

        this.playSound('keystroke');
    }

    handleKeyDown(e) {
        // Special key combinations
        if (e.ctrlKey && e.key === ' ') {
            e.preventDefault();
            this.activatePowerUp('slowTime');
        }
    }

    updateTextDisplay() {
        const textDisplay = document.getElementById('quote');
        const typed = this.gameState.typedText;
        const original = this.gameState.currentText;
        
        let html = '';
        
        for (let i = 0; i < original.length; i++) {
            const char = original[i];
            let className = '';
            
            if (i < typed.length) {
                className = typed[i] === char ? 'correct' : 'incorrect';
            } else if (i === typed.length) {
                className = 'current';
            }
            
            html += `<span class="char ${className}">${char}</span>`;
        }
        
        textDisplay.innerHTML = html;

        // Add error shake effect
        if (typed.length > 0 && typed[typed.length - 1] !== original[typed.length - 1]) {
            this.createParticleEffect('error');
            this.playSound('error');
        }
    }

    setRandomQuote() {
        const quotes = this.quotes[this.gameState.mode] || this.quotes.story;
        let quote;

        if (this.gameState.mode === 'story') {
            const chapterIndex = (this.gameState.chapter - 1) % quotes.length;
            quote = quotes[chapterIndex];
            this.gameState.currentText = quote.text;
            document.getElementById('chapter').textContent = this.gameState.chapter;
            document.getElementById('chapter-text').textContent = quote.title;
        } else {
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            this.gameState.currentText = randomQuote;
        }

        document.getElementById('quote').textContent = this.gameState.currentText;
    }

    calculateStats() {
        if (!this.gameState.startTime) return;

        const timeElapsed = (Date.now() - this.gameState.startTime) / 1000 / 60; // minutes
        const wordsTyped = this.gameState.typedText.split(' ').length;
        
        this.gameState.wpm = Math.round(wordsTyped / timeElapsed) || 0;
        this.gameState.accuracy = this.calculateAccuracy();
    }

    calculateAccuracy() {
        if (this.gameState.typedText.length === 0) return 100;
        
        let correct = 0;
        for (let i = 0; i < this.gameState.typedText.length; i++) {
            if (this.gameState.typedText[i] === this.gameState.currentText[i]) {
                correct++;
            }
        }
        
        return Math.round((correct / this.gameState.typedText.length) * 100);
    }

    updateStats() {
        document.getElementById('wpm').textContent = this.gameState.wpm;
        document.getElementById('accuracy').textContent = this.gameState.accuracy + '%';
        document.getElementById('combo').textContent = 'x' + Math.floor(this.gameState.combo);
        document.getElementById('timer').textContent = this.gameState.timeLeft;
        document.getElementById('level').textContent = 'Level ' + this.gameState.level;
        document.getElementById('xp').textContent = this.gameState.xp + ' XP';
        document.getElementById('streak').textContent = this.gameState.streak + ' Streak';
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.gameState.timeLeft--;
            this.updateStats();
            
            if (this.gameState.timeLeft <= 0) {
                this.completeGame();
            }
        }, this.gameState.powerUps.slowTime.active ? 1500 : 1000);
    }

    completeGame() {
        this.gameState.isPlaying = false;
        clearInterval(this.timer);
        
        // Calculate XP and rewards
        const baseXP = Math.round(this.gameState.wpm * this.gameState.accuracy / 100 * this.gameState.combo);
        this.gameState.xp += baseXP;
        
        // Level up check
        const newLevel = Math.floor(this.gameState.xp / 1000) + 1;
        if (newLevel > this.gameState.level) {
            this.gameState.level = newLevel;
            this.showLevelUp();
        }

        // Update streak
        if (this.gameState.accuracy >= 90) {
            this.gameState.streak++;
        } else {
            this.gameState.streak = 0;
        }

        // Check achievements
        this.checkAchievements();
        
        // Show completion effects
        this.createParticleEffect('success');
        this.showComboMultiplier();
        this.playSound('game-complete');
        
        document.querySelector('.typing-area').classList.remove('active');
        document.getElementById('input').disabled = true;
        
        // Update button states
        document.getElementById('start-game').style.display = 'inline-flex';
        document.getElementById('restart').style.display = 'none';

        // Auto-advance in story mode
        if (this.gameState.mode === 'story') {
            setTimeout(() => {
                this.gameState.chapter++;
                this.setRandomQuote();
            }, 3000);
        }
    }

    activatePowerUp(powerUp) {
        if (this.gameState.powerUps[powerUp].cooldown > 0 || this.gameState.powerUps[powerUp].active) return;

        this.gameState.powerUps[powerUp].active = true;
        this.gameState.powerUps[powerUp].cooldown = 30; // 30 second cooldown

        switch (powerUp) {
            case 'slowTime':
                // Slow down timer
                setTimeout(() => {
                    this.gameState.powerUps[powerUp].active = false;
                }, 10000);
                break;
            case 'doublePoints':
                // Double XP for 15 seconds
                setTimeout(() => {
                    this.gameState.powerUps[powerUp].active = false;
                }, 15000);
                break;
            case 'shield':
                // Protect from errors for 20 seconds
                setTimeout(() => {
                    this.gameState.powerUps[powerUp].active = false;
                }, 20000);
                break;
        }

        this.updatePowerUpUI();
        this.playSound('power-up');
        this.createParticleEffect('powerup');

        // Start cooldown
        this.startPowerUpCooldown(powerUp);
    }

    startPowerUpCooldown(powerUp) {
        const interval = setInterval(() => {
            this.gameState.powerUps[powerUp].cooldown--;
            this.updatePowerUpUI();
            
            if (this.gameState.powerUps[powerUp].cooldown <= 0) {
                clearInterval(interval);
            }
        }, 1000);
    }

    updatePowerUpUI() {
        Object.keys(this.gameState.powerUps).forEach(key => {
            const button = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
            const powerUp = this.gameState.powerUps[key];
            
            button.classList.toggle('active', powerUp.active);
            button.classList.toggle('cooldown', powerUp.cooldown > 0);
            
            if (powerUp.cooldown > 0) {
                button.title = `Cooldown: ${powerUp.cooldown}s`;
            } else {
                button.title = button.getAttribute('data-original-title') || button.title;
            }
        });
    }

    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (achievement.unlocked) return;

            let unlock = false;

            switch (achievement.id) {
                case 'first_steps':
                    unlock = true;
                    break;
                case 'speed_demon':
                    unlock = this.gameState.wpm >= 60;
                    break;
                case 'accuracy_ace':
                    unlock = this.gameState.accuracy >= 98;
                    break;
                case 'combo_master':
                    unlock = this.gameState.combo >= 10;
                    break;
                case 'chapter_complete':
                    unlock = this.gameState.mode === 'story';
                    break;
            }

            if (unlock) {
                achievement.unlocked = true;
                this.gameState.achievements.push(achievement);
                this.showAchievement(achievement);
                this.playSound('achievement');
            }
        });

        this.updateAchievements();
    }

    showAchievement(achievement) {
        const achievementEl = document.createElement('div');
        achievementEl.className = 'achievement achievement-popup';
        achievementEl.innerHTML = `
            <i class="${achievement.icon}"></i>
            <div>
                <strong>${achievement.name}</strong>
                <div>${achievement.description}</div>
            </div>
        `;
        
        document.body.appendChild(achievementEl);
        
        setTimeout(() => {
            achievementEl.remove();
        }, 5000);
    }

    showLevelUp() {
        const levelUpEl = document.createElement('div');
        levelUpEl.className = 'level-up-popup';
        levelUpEl.innerHTML = `
            <h2>LEVEL UP!</h2>
            <div>Level ${this.gameState.level}</div>
        `;
        
        document.body.appendChild(levelUpEl);
        this.playSound('level-up');
        
        setTimeout(() => {
            levelUpEl.remove();
        }, 3000);
    }

    showComboMultiplier() {
        if (this.gameState.combo <= 1) return;

        const comboEl = document.createElement('div');
        comboEl.className = 'combo-multiplier';
        comboEl.textContent = `${Math.floor(this.gameState.combo)}x COMBO!`;
        
        document.querySelector('.typing-area').appendChild(comboEl);
        
        setTimeout(() => {
            comboEl.remove();
        }, 1000);
    }

    updateAchievements() {
        const achievementsList = document.getElementById('achievements');
        achievementsList.innerHTML = '';
        
        this.gameState.achievements.slice(-3).forEach(achievement => {
            const achievementEl = document.createElement('div');
            achievementEl.className = 'achievement';
            achievementEl.innerHTML = `
                <i class="${achievement.icon}"></i>
                <span>${achievement.name} - ${achievement.description}</span>
            `;
            achievementsList.appendChild(achievementEl);
        });

        if (this.gameState.achievements.length === 0) {
            achievementsList.innerHTML = `
                <div class="achievement">
                    <i class="fas fa-baby"></i>
                    <span>First Steps - Complete your first test</span>
                </div>
            `;
        }
    }

    updateLeaderboard() {
        const leaderboardList = document.getElementById('leaderboard');
        leaderboardList.innerHTML = '';
        
        this.leaderboard.forEach((player, index) => {
            const rankEl = document.createElement('div');
            rankEl.className = 'rank-item';
            rankEl.innerHTML = `
                <span class="rank">#${index + 1}</span>
                <span class="name">${player.name}</span>
                <span class="score">${player.score} WPM</span>
            `;
            leaderboardList.appendChild(rankEl);
        });
    }

    joinBattle() {
        this.switchMode('battle');
        
        // Simulate finding opponents
        document.getElementById('players-online').textContent = 'Joining battle...';
        
        setTimeout(() => {
            document.getElementById('players-online').textContent = '3 players in battle';
            this.startGame();
        }, 2000);
    }

    createParticleEffect(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            powerup: '#f59e0b'
        };

        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.background = colors[type] || colors.success;
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = Math.random() * window.innerHeight + 'px';
            
            document.getElementById('particles').appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 3000);
        }
    }

    playSound(type) {
        if (!this.gameState.soundEnabled) return;
        
        // Create audio context and play sound
        // This is a simplified version - in a real app you'd load actual sound files
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        const frequencies = {
            'keystroke': 800,
            'error': 200,
            'power-up': 1200,
            'achievement': 1000,
            'level-up': 1500,
            'game-start': 600,
            'game-complete': 1000,
            'game-reset': 400,
            'mode-switch': 700
        };
        
        oscillator.frequency.setValueAtTime(frequencies[type] || 800, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    toggleTheme() {
        this.gameState.theme = this.gameState.theme === 'dark' ? 'light' : 'dark';
        document.body.classList.toggle('light-theme', this.gameState.theme === 'light');
        
        const icon = document.querySelector('#theme-toggle i');
        icon.className = this.gameState.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    toggleSound() {
        this.gameState.soundEnabled = !this.gameState.soundEnabled;
        
        const icon = document.querySelector('#sound-toggle i');
        icon.className = this.gameState.soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
        
        document.body.classList.toggle('sound-enabled', this.gameState.soundEnabled);
    }
}

// Initialize the game
function initializeTypeWarrior() {
    window.typeWarrior = new TypeWarrior();
}

// Legacy compatibility
document.addEventListener("DOMContentLoaded", function () {
    // This maintains compatibility with any existing functionality
    // while the new TypeWarrior class takes over
    console.log("TypeWarrior initialized - Ready for battle!");
});
  