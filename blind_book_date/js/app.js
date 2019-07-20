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
    if (data.items === undefined){
      let errorMessage = `<h1>We're sorry.</h1><p>We've encountered a problem fetching data from the server. Please return to the homepage to try again.</p>`;
      $('#book-container').append(errorMessage);
    } else {
      for (let i = 0; i < data.items.length; i++){
        let bookInfo = data.items[i].volumeInfo;
        let isbn = app.checkBook(bookInfo);
        if (isbn);
          let author = bookInfo.authors[0];
          let summary = bookInfo.description;
          let title = bookInfo.title;
          let cover = bookInfo.imageLinks.thumbnail;
          let newBook = {
            author: author,
            summary: summary,
            title: title,
            cover: cover,
            isbn: isbn
            }
            library.bookArray.push(newBook);
          }
        }
    },

  // ===============
  // checkBook(bookInfo)
  // Runs inside of app.populateArrays(data)
  // Checks if the book object has all the required properties and, if so, returns the ISBN. Otherwise returns false.
  // ===============
  checkBook: (bookInfo) => {
    if (bookInfo.description && bookInfo.imageLinks && bookInfo.authors){
      if (bookInfo.description.length > 200){
        for (let value of bookInfo.industryIdentifiers){
          if (value.type === "ISBN_13"){
            return value.identifier;
          }
        }
      }
    } else {return false}
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
