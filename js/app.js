/*
 * Create a list that holds all of your cards
 */
//  8 pairs -> 16 items total to be shuffeled
const cardsArray = [
    'diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb',
    'diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb'
]

const DOMElements = {
    restart: document.querySelector('.restart'),
    deck: document.querySelector('.deck')
};

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
    console.log("new game");
    const currentCardsArray = shuffle(cardsArray);
    console.log(currentCardsArray);

    // remove all from ul with class='deck'
    const deck = document.querySelector('.deck');
    
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
    
}

const turnCard = (event) => {
    const target = event.target;
    // react only if unturned card (li with only one class= 'card') is clicked
    if (target.tagName !== 'LI' || target.className !== 'card') {
        // console.log(`li was not clicked or li has no or more than 'card' class`);
        return;
    }
    // add classes open and show to turn the card
    showCard(target);

    // check if another card is turned
    const cards = document.querySelectorAll('li.card.open.show');
    console.log(cards);
    if (cards.length === 2) {
        // check if cards are matching
        const cardPicture0 = cards[0].firstElementChild.className;
        console.log('cardPicture0: ' +cardPicture0);
        console.log(cardPicture0);
        const cardPicture1 = cards[1].firstElementChild.className;
        console.log('cardPicture1: ' +cardPicture1);
        console.log(cardPicture1);
        if ( cardPicture0 === cardPicture1) {
            console.log("BINGO");
            // lock matching cards = replace "open show" with "match" class
            lockCards(cards[0], cards[1]);
        } else {
            // wait 2s
             
            // turn back cards
            flipBack(cards[0], cards[1]);
        }
    }
}

flipBack = (card0, card1) => {
    card0.classList.remove("open", "show") ;
    card1.classList.remove("open", "show") ;
    return;
} 

const lockCards = (card0, card1) => {
    const card0ClassList = card0.classList;
    card0ClassList.replace("open", "match");
    card0ClassList.remove("show");

    const card1ClassList = card1.classList;
    card1ClassList.replace("open", "match");
    card1ClassList.remove("show");
    return;
}

const showCard = (cardElememt) => {
    cardElememt.classList.add("open", "show");
    return;
}

const setupEventListeners = () => {
    DOMElements.restart.addEventListener('click', newGame);
    DOMElements.deck.addEventListener('click', turnCard);
}

const init = () => {
    //newGame();
    setupEventListeners();
}

init();
