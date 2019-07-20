// =========================================================
//                      SWIPE APP LOGIC
// =========================================================
const app = {

  // ===============
  // randomizeIndex()
  // Runs on page load
  // Gets a random index and plugs it into app.runGame()
  // ===============
  randomizeIndex: () => {
    let genre = localStorage.getItem("genre");
    let key = localStorage.getItem("key");
    $.getJSON(`https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&langRestrict=en&key=${key}`, (data) => {
      let minIndex = data.totalItems - 40;
      let randomIndex = Math.floor(Math.random() * minIndex);
      app.runGame(randomIndex)})
  },

  // ===============
  // runGame(index)
  // Runs inside of eventHandlers.prepareGame()
  // Runs user input as parameters in the API, then filters the data through app.populateArrays().
  // ===============
  runGame: (index) => {
    globalFunc.reset();
    let genre = localStorage.getItem("genre");
    let key = localStorage.getItem("key");
    $.getJSON(`https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&startIndex=${index}&maxResults=40&langRestrict=en&key=${key}`, (data) => {
      app.populateArrays(data);
      app.shortenSummary();
      app.updateDOM();
    })
  },

  // ===============
  // populateArrays(data)
  // Runs inside of app.runGame()
  // Stores books as objects in the library bookArray property
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
          library.bookArray.push(newBook);
        }
      }
    }
  },

// ===============
// shortenSummary()
// Runs inside of app.runGame()
// Gives extra text a hidden class so it can be hidden on mobile
// ===============
  shortenSummary: () => {
    for (let i = 0; i < library.bookArray.length; i++){
      let summary = library.bookArray[i].summary;
      if (summary.length > 400){
        let shortSummary = `
        ${summary.slice(0, 400)}<span>...</span><button class=expand-button>Read more</button><span class=hidden>${summary.slice(400)}</span><button class="expand-button hidden">Show less</button>`;
        library.bookArray[i].summary = shortSummary;
      }
    }
  },

  // ===============
  // updateDOM()
  // Runs inside of the left and right click event handlers
  // Updates the book-container div with a new summary
  // ===============
  updateDOM: () => {
    let i = library.currentIndex;
    let summary = library.bookArray[i].summary;
    $('#book-container').empty();
    $('#book-container').append(`<p>${summary}</p>`);
    $('.expand-button').on('click', eventHandlers.toggleReadMore);
  }
  
};

// =========================================================
//                    EVENT LISTENERS
// =========================================================
$( () => {

  $('#left-container').on('click', eventHandlers.leftSwipe);
  $('#right-container').on('click', eventHandlers.rightSwipe);
  app.randomizeIndex();
})
