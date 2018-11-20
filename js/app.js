{   // block of code created to avoid global variables, that could be accessed by other scripts

    let movesNumber, gameFinished, timerIsOn, timerIntervalID, timePassed;
    /*
    * Create a list that holds all of your cards
    */
    //  8 pairs -> 16 items total to be shuffeled
    const cardsArray = [
        'diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb',
        'diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb'
    ];

    const DOMElements = {
        restart: document.querySelectorAll('.restart'),
        deck: document.querySelector('.deck'),
        moves: document.querySelector('.moves'),
        scorePanel: document.querySelector('.score-panel'),
        winBoard: document.querySelector('.win-board'),
        winMessage: document.querySelector('.win-board h2'),
        time: document.getElementById('timer'),
        starList: document.querySelector('.stars'),
        stars: document.querySelectorAll('.stars .fa-star'),
        winStars: document.getElementById('win-stars')
    };



    // TODO: additional feature: time limit for a game
    // const MAX_GAME_TIME_IN_MINUTES = 1;

    /*
    * Display the cards on the page
    *   - shuffle the list of cards using the provided "shuffle" method below
    *   - loop through each card and create its HTML
    *   - add each card's HTML to the page
    */

    // Shuffle function from http://stackoverflow.com/a/2450976
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }


    /*
    * set up the event listener for a card. If a card is clicked:
    *  - display the card's symbol (put this functionality in another function that you call from this one)
    *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
    *  - if the list already has another card, check to see if the two cards match
    *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
    *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
    *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
    *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
    */
    const newGame = () => {
        stopTimer();

        timerIsOn = false;
        const currentCardsArray = shuffle(cardsArray);

        // remove all from ul with class='deck'
        const deck = DOMElements.deck;

        while(deck.firstChild) {
            deck.firstChild.remove();
        }

        // add cards from shuffeled array
        for (const card of currentCardsArray) {
            deck.insertAdjacentHTML('afterbegin',
                `<li class="card">
                    <i class="fa fa-${card}"></i>
                </li>`
            )
        }

        // zero moves counter
        movesNumber = 0;
        updateMoves(movesNumber);

        // zero time
        timePassed = `00:00`;
        updateTimer(timePassed);

        // reset rating and bring back stars to score-panel
        resetRating();
        const stars = DOMElements.stars;
        for (const star of stars) {
            DOMElements.starList.insertBefore(star, null);
        }

        // if game was finished bring back deck and score-panel and hide winBoard
        if (gameFinished) {
            toggleElements(DOMElements.deck);
            toggleElements(DOMElements.scorePanel);
            toggleElements(DOMElements.winBoard);
            gameFinished = false;
        }
    };

    const updateMoves = (movesNumber) => {
        DOMElements.moves.textContent = movesNumber;
    };

    const updateTimer = (timeString) => {
        DOMElements.time.textContent = timeString;
    };

    const startTimer = () => {
        const startTime = Date.now();
        timerIntervalID = setInterval( () => {
            const secondsFromStart = Math.floor((Date.now() - startTime)/1000);
            const seconds = secondsFromStart % 60;
            const minutes = secondsFromStart >= 60 ? Math.floor(secondsFromStart/60) : 0;
            timePassed = `${minutes>9 ? minutes : '0'+ minutes}:${seconds>9 ? seconds : '0' + seconds}`;

            // TODO: lose game when max allowed time of game reached
            // const timeText =  minutes === maxGameTimeInMinutes ? `Time's up!` : `Your time: ${timePassed}`;
            // if (minutes === maxGameTimeInMinutes) {
            //     // display end game board for exceeded max game time setting
            //     console.log('stopping interval');
            //     clearInterval(timerIntervalID);
            // }
            updateTimer(timePassed);
        }, 1000);
    };

    const turnCard = (event) => {
        const target = event.target;
        // react only if unturned card (li with only one class= 'card') is clicked
        if (target.tagName !== 'LI' || target.className !== 'card') {
            return;
        }
        // add classes open and show to turn the card
        toggleCard(target);

        // start timer if not on
        if(!timerIsOn) {
            timerIsOn = true;
            startTimer();
        }

        // check if another card is turned
        const cards = document.querySelectorAll('li.card.open.show');

        if (cards.length === 2) {
            addMove();
            // check if cards are matching
            const cardPicture0 = cards[0].firstElementChild.className;
            const cardPicture1 = cards[1].firstElementChild.className;
            if (cardPicture0 === cardPicture1) {
                // lock matching cards = replace "open show" with "match" class
                lockCards(cards[0], cards[1]);
                // check if all cards are matched
                if (checkGameEnd())
                    endGame();
            } else {
                blockCardsClick();
                // wait 1s and turn back cards
                window.setTimeout(flipBack, 1000, cards[0], cards[1]);
            }
        }
    };

    const winMessage = (moves, time) => {
        const text = `You won with ${moves} moves in ${time} !!!`;
        DOMElements.winMessage.textContent = text;
        const stars = DOMElements.stars;
        for (const star of stars) {
            DOMElements.winStars.appendChild(star);
        }

        return;
    };

    const toggleElements = (elements) => {
        // if NodeList
        if (elements.length) {
            for ( const el of elements) {
                el.classList.toggle('hidden');
            }
        // if element
        } else {
            elements.classList.toggle('hidden');
        }

        return;
    };

    const stopTimer = () => {
        clearInterval(timerIntervalID);
    }

    const endGame = () => {
        stopTimer();
        winMessage(movesNumber, timePassed);
        toggleElements(DOMElements.deck);
        toggleElements(DOMElements.scorePanel);

        toggleElements(DOMElements.winBoard);
        gameFinished = true;
    };

    const checkGameEnd = () => {
        // check if any unmatched cards left
        const cards = DOMElements.deck.querySelectorAll('.card');
        for (let card of cards) {
            if (card.classList.length === 1) {
                return false;
            }
        }
        return true;
    };

    const addMove = () => {
        movesNumber++;
        DOMElements.moves.textContent = movesNumber;
        // TODO: code it cleverer one day
        if (movesNumber === 13 || movesNumber === 16 || movesNumber === 19 || movesNumber === 22) {
            reduceRating();
        }
        return;
    };

    const getLastStarOn = () => {
        const starsOn = document.querySelectorAll('.star-on');
        return starsOn[starsOn.length-1];
    };

    const reduceRating = () => {
        getLastStarOn().classList.remove('star-on');
        return;
    };

    const resetRating = () => {
        const allStars = DOMElements.stars;
        for (const star of allStars) {
            star.classList.add('star-on');
        }
        return;
    };

    const blockCardsClick = () => {
        DOMElements.deck.removeEventListener('click', turnCard);
        return;
    };

    const allowCardsClick = () => {
        DOMElements.deck.addEventListener('click', turnCard);
        return;
    };

    const flipBack = (card0, card1) => {
        toggleCard(card0);
        toggleCard(card1);
        allowCardsClick();
        return;
    };

    const lockCards = (card0, card1) => {
        toggleCard(card0, true);
        toggleCard(card1, true);
        return;
    };

    const toggleCard = (cardElememt, match) => {
        const cl = cardElememt.classList;
        cl.toggle("open");
        cl.toggle("show");

        if(match) {
            cl.toggle("match");
        }

        return;
    };

    const setupEventListeners = () => {
        for (const r of DOMElements.restart) {
            r.addEventListener('click', newGame);
        }

        allowCardsClick();
    };

    const init = () => {
        newGame();
        setupEventListeners();
    };

    init();
};