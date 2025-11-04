document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Define Constants and Variables ---
    
    // The icons we'll use for the cards. We need 8 pairs (16 cards total).
    const icons = [
        "fa-sun", "fa-sun",
        "fa-star", "fa-star",
        "fa-heart", "fa-heart",
        "fa-moon", "fa-moon",
        "fa-cloud", "fa-cloud",
        "fa-anchor", "fa-anchor",
        "fa-car", "fa-car",
        "fa-bolt", "fa-bolt"
    ];

    // Get all the DOM elements we need
    const gameBoard = document.getElementById("game-board");
    const movesCountEl = document.getElementById("moves-count");
    const timeElapsedEl = document.getElementById("time-elapsed");
    const resetButton = document.getElementById("reset-button");
    const winModal = document.getElementById("win-modal");
    const winStatsEl = document.getElementById("win-stats");
    const playAgainButton = document.getElementById("play-again-button");

    // Game state variables
    let flippedCards = []; // Stores the 2 cards that are currently flipped
    let matchedPairs = 0;
    let moves = 0;
    let timer; // Will hold our interval function
    let seconds = 0;
    let isLocked = false; // Prevents clicking more than 2 cards at a time

    // --- 2. Game Functions ---

    // Function to shuffle an array (Fisher-Yates Shuffle)
    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    // Function to start the game
    function startGame() {
        // Reset all game state
        isLocked = false;
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        seconds = 0;
        
        // Update the UI
        movesCountEl.textContent = "0";
        timeElapsedEl.textContent = "0s";
        gameBoard.innerHTML = ""; // Clear the board
        winModal.classList.remove("show"); // Hide the win modal
        
        // Start the timer
        stopTimer(); // Clear any existing timer
        startTimer();

        // Shuffle the icons
        const shuffledIcons = shuffle(icons);

        // Create the card elements and add them to the board
        for (const icon of shuffledIcons) {
            const card = document.createElement("div");
            card.className = "card";
            card.dataset.icon = icon; // Store the icon name on the card
            
            card.innerHTML = `
                <div class="card-face card-front"></div>
                <div class="card-face card-back">
                    <i class="fa-solid ${icon}"></i>
                </div>
            `;
            
            gameBoard.appendChild(card);
            
            // Add the click event listener to the new card
            card.addEventListener("click", flipCard);
        }
    }

    // --- 3. Timer Functions ---
    
    function startTimer() {
        timer = setInterval(() => {
            seconds++;
            timeElapsedEl.textContent = `${seconds}s`;
        }, 1000); // Run every 1 second
    }

    function stopTimer() {
        clearInterval(timer);
    }

    // --- 4. Main Game Logic ---

    // Function to handle clicking a card
    function flipCard(event) {
        // 'this' refers to the card that was clicked
        const clickedCard = event.currentTarget; 

        // If the board is locked, or the card is already flipped/matched, do nothing
        if (isLocked || clickedCard.classList.contains("is-flipped")) {
            return;
        }

        // Flip the card
        clickedCard.classList.add("is-flipped");
        flippedCards.push(clickedCard);

        // Check if this is the 2nd card flipped
        if (flippedCards.length === 2) {
            isLocked = true; // Lock the board
            updateMoves();
            checkForMatch();
        }
    }
    
    // Function to check if the two flipped cards match
    function checkForMatch() {
        const [card1, card2] = flippedCards;
        
        if (card1.dataset.icon === card2.dataset.icon) {
            // It's a match!
            card1.classList.add("is-matched");
            card2.classList.add("is-matched");
            
            matchedPairs++;
            flippedCards = []; // Reset the flipped cards array
            isLocked = false; // Unlock the board
            
            // Check if the game is won
            if (matchedPairs === 8) {
                endGame();
            }
        } else {
            // Not a match. Unflip them after a short delay
            setTimeout(() => {
                card1.classList.remove("is-flipped");
                card2.classList.remove("is-flipped");
                
                flippedCards = []; // Reset the flipped cards array
                isLocked = false; // Unlock the board
            }, 1000); // 1 second delay
        }
    }

    // Function to update the move counter
    function updateMoves() {
        moves++;
        movesCountEl.textContent = moves;
    }

    // Function to handle the end of the game
    function endGame() {
        stopTimer();
        winStatsEl.textContent = `You finished in ${seconds} seconds with ${moves} moves!`;
        winModal.classList.add("show");
    }

    // --- 5. Event Listeners ---
    
    // Listen for clicks on the reset buttons
    resetButton.addEventListener("click", startGame);
    playAgainButton.addEventListener("click", startGame);

    // --- 6. Initial Start ---
    startGame();
});
