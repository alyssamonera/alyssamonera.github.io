// =========================================================
//                       APP LOGIC
// =========================================================
const app = {
  // ===============
  // runGame(index)
  // Runs inside of eventHandlers.prepareGame()
  // Runs user input as parameters in the API, then filters the data through app.populateArrays(). Resets relevant values.
  // ===============
    runGame: (index) => {
      $.getJSON(`https://www.googleapis.com/books/v1/volumes?q=subject:${userInput.genre}&startIndex=${index}&maxResults=40&langRestrict=en&key=${userInput.key}`, (data) => {
        app.populateArrays(data);
        app.shortenSummary();
        app.printDOM();
      })
    },

  // ===============
  // populateArrays(data)
  // Runs inside of this.runGame()
  // Stores the summaries, titles, authors, and cover image URLs into appropriate arrays
  // ===============
  populateArrays: (data) => {
    for (let i = 0; i < data.items.length; i++){
      let bookInfo = data.items[i].volumeInfo;
      if (bookInfo.description && bookInfo.imageLinks && bookInfo.authors){
        if (bookInfo.description.length > 200){
          let author = bookInfo.authors[0];
          let summary = bookInfo.description;
          let title = bookInfo.title;
          let cover = bookInfo.imageLinks.thumbnail;
          let newBook = {
            author: author,
            summary: summary,
            title: title,
            cover: cover
          }
          userLibrary.bookArray.push(newBook);
        }
      }
    }
  },

// ===============
// shortenSummary()
// Runs inside of this.runGame()
// Gives extra text a hidden class so it can be hidden on mobile
// ===============
  shortenSummary: () => {
    for (let i = 0; i < userLibrary.bookArray.length; i++){
      let summary = userLibrary.bookArray[i].summary;
      if (summary.length > 400){
        let shortSummary = `
        ${summary.slice(0, 400)}<span>...</span><button class=expand-button>Read more</button><span class=hidden>${summary.slice(400)}</span><button class="expand-button hidden">Show less</button>`;
        userLibrary.bookArray[i].summary = shortSummary;
      }
    }
  },

// ===============
// printDOM()
// Runs inside of this.runGame()
// Prints the first summary and necessary buttons the first time
// ===============
  printDOM: () => {
    $('main').empty();
    let summary = userLibrary.bookArray[0].summary;
    let innerhtml =
      `<div class=tinder-container>
        <div class=swipe-container id=left-container>
          <button id="swipe-left">‹</button>
          <p>Swipe Left</p>
        </div>
        <div id=book-container>
          <p>${summary}</p>
        </div>
        <div class=swipe-container id=right-container>
          <button id="swipe-right">›</button>
          <p>Swipe Right</p>
        </div>`;
    $('main').append(innerhtml);
    $('#left-container').on('click', eventHandlers.leftSwipe);
    $('#right-container').on('click', eventHandlers.rightSwipe);
    $('.expand-button').on('click', eventHandlers.toggleReadMore);
  },

  // ===============
  // updateDOM()
  // Runs inside of the left and right click event handlers
  // Updates the book-container div with a new summary
  // ===============
  updateDOM: () => {
    let i = userLibrary.currentIndex;
    let summary = userLibrary.bookArray[i].summary;
    $('#book-container').empty();
    $('#book-container').append(`<p>${summary}</p>`);
    $('.expand-button').on('click', eventHandlers.toggleReadMore);
  },

  // ===============
  // goToResults()
  // Runs upon swipe left or right when the user has found the desired amt of matches, or they run out of books
  // Directs the user to the results page
  // ===============
  goToResults: () => {
    let slicedHREF = window.location.pathname.split("_date/");
    window.location.pathname = `${slicedHREF[0]}_date/html/liked_books.html`;
  }
};


// =========================================================
//                    EVENT HANDLERS
// =========================================================
const eventHandlers = {

// ===============
// updateVal()
// Runs every time the genre or amount of books changes
// Updates the value of each variable in the user object
// ===============
  updateVal: () => {
    let $id = $(event.currentTarget).attr('id');
    if ($id === "bookAmt"){
      userInput[$id] = parseInt($(event.currentTarget).val())
    } else if ($id === "api-submit"){
      eventHandlers.toggleModal();
      $id = "key";
      userInput[$id] = $("#key").val();
      eventHandlers.prepareGame();
    } else {
      userInput[$id] = $(event.currentTarget).val();
    }
  },

// ===============
// prepareGame()
// Runs upon click of "submit" button in the modal
// Picks a random index num based on the length of the data's book array, then runs it through app.runGame()
// ===============
  prepareGame: () => {
    if (!userInput.key){
      eventHandlers.toggleModal()
    }
    else {
      eventHandlers.reset();
      $.getJSON(`https://www.googleapis.com/books/v1/volumes?q=subject:${userInput.genre}&langRestrict=en&key=${userInput.key}`, (data) => {
        let minIndex = data.totalItems - 40;
        let randomIndex = Math.floor(Math.random() * minIndex);
        app.runGame(randomIndex)})
      }
    },

// ===============
// leftSwipe()
// Runs on swipe-left button click
// Moves on to the next summary or runs the results method
// ===============
  leftSwipe: () => {
    let index = userLibrary.currentIndex;
    if (!userLibrary.bookArray[index] || !userLibrary.bookArray[index+1]){
      app.goToResults();
    } else {
      userLibrary.currentIndex++;
      app.updateDOM();
    }
  },

// ===============
// rightSwipe()
// Runs on swipe-right button click
// Adds a new book object to datesArray. Moves on to the next book or runs the results method.
// ===============
  rightSwipe: () => {
    userLibrary.addNewDate();
    userLibrary.likedBooks++;
    userLibrary.currentIndex++;
    let index = userLibrary.currentIndex;
    if (userLibrary.likedBooks >= userInput.bookAmt || !userLibrary.bookArray[index]){
      app.goToResults();
    } else {
      app.updateDOM();
    }
  },

// ===============
// toggleModal()
// Runs on API nav link click OR on the go button
// Displays/hides a modal prompting the user to enter an API key
// ===============
  toggleModal: () => {
    $('#modal').toggleClass("hidden");
  },

// ===============
// toggleReadMore()
// Runs on "Read more" or "Read less" button click
// Displays/hides extra text in a summary
// ===============
  toggleReadMore: () => {
        $(event.currentTarget).toggleClass('hidden');
        $(event.currentTarget).siblings('span, .expand-button').toggleClass('hidden');
      },

// ===============
// reset()
// Runs upon clicking the home menu item
// Resets all relevant values
// ===============
  reset: () => {
    userLibrary.currentIndex = 0;
    userLibrary.likedBooks = 0;
    userLibrary.datesArray = [];
    userLibrary.bookArray = [];
  }
  
};

$( () => {

  // =========================================================
  //                    EVENT LISTENERS
  // =========================================================
  $('#bookAmt, #genre').change(eventHandlers.updateVal);
  $('#modal-textbox button').on('click', eventHandlers.updateVal);
  $('.go-div button').on('click', eventHandlers.toggleModal);
  $('#menu-api, #exit').on('click', eventHandlers.toggleModal);
  $('#home').on('click', eventHandlers.reset);

  userLibrary.getSavedBooks();

});
