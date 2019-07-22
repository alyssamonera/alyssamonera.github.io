// =========================================================
//                      SWIPE APP LOGIC
// =========================================================
const app = {

  // ===============
  // searchGenres()
  // Runs on page load
  // Plugs user input genre into app.grabJSON, as well as related genres
  // ===============
  searchGenres: () => {
    let genre = localStorage.getItem("genre");
    app.grabJSON(genre);

    switch (genre){
      case "Nonfiction":
        app.grabJSON("autobiography");
        app.grabJSON("biology");
        break;
      case "Thriller":
        app.grabJSON('"crime fiction"');
        app.grabJSON("suspense");
        break;
      default:
        break;
    }
  },

  // ===============
  // grabJSON()
  // Runs inside of app.searchGenres()
  // Grabs data from the API for the selected genre, then runs app.randomizeIndex()
  // ===============
  grabJSON: (genre) => {
    let subjectString = "https://www.googleapis.com/books/v1/volumes?q=subject:";
    let key = localStorage.getItem("key");
    let keyString = `&langRestrict=en&key=${key}`;
    $.getJSON(subjectString + genre + keyString, (data) => {
      let index = app.randomizeIndex(data);
      app.runGame(index, genre);
    });
  },

  // ===============
  // randomizeIndex()
  // Runs inside of app.grabJSON()
  // Gets a random index and returns it
  // ===============
  randomizeIndex: (data) => {
    let minIndex = data.totalItems - 40;
    let randomIndex = Math.floor(Math.random() * minIndex);
    return randomIndex;
  },

  // ===============
  // runGame(index, genre)
  // Runs inside of app.grabJSON()
  // Runs user input as parameters in the API, then filters the data through app.populateArrays() and updates the DOM
  // ===============
  runGame: (index, genre) => {
    let key = localStorage.getItem("key");
    $.getJSON(`https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&startIndex=${index}&maxResults=40&langRestrict=en&key=${key}`, (data) => {
      for (let i = 0; i < data.items.length; i++){
        let bookInfo = data.items[i].volumeInfo;
        let isbn = app.checkBook(bookInfo);
        if (isbn){app.addBook(bookInfo)};
      }
      app.updateDOM();
    })
  },

  // ===============
  // checkBook(bookInfo)
  // Runs inside of app.populateArrays(data)
  // Checks if the book object has all the required properties and, if so, returns the ISBN. Otherwise returns false.
  // ===============
  checkBook: (bookInfo) => {
    if (bookInfo.description && bookInfo.imageLinks && bookInfo.authors && bookInfo.publishedDate && bookInfo.industryIdentifiers){
      if (bookInfo.description.length > 200){
        let year = parseInt(bookInfo.publishedDate.split("-")[0]);
        let yearMax = parseInt(localStorage.getItem("age-max"));
        let yearMin = parseInt(localStorage.getItem("age-min"));
        if (year >= yearMax && year <= yearMin){
          for (let value of bookInfo.industryIdentifiers){
            if (value.type === "ISBN_13"){
              return value.identifier;
            }
          }
        }
      }
    } else {return false}
  },

  // ===============
  // populateArrays(data)
  // Runs inside of app.runGame()
  // Stores books as objects in the library bookArray property
  // ===============
  populateArrays: (data) => {
    if (data.items === undefined){
      let errorMessage = `<h1>We're sorry.</h1><p>We've encountered a problem fetching data from the server. Please refresh the page. If the problem persists, you can contact our developer through the "About" page.</p>`;
      $('#book-container').prepend(errorMessage);
      $('.expand-button').remove();
    } else {
      for (let i = 0; i < data.items.length; i++){
        let bookInfo = data.items[i].volumeInfo;
        let isbn = app.checkBook(bookInfo);
        if (isbn){
          let author = bookInfo.authors[0];
          let summary = bookInfo.description;
          let title = bookInfo.title;
          let cover = bookInfo.imageLinks.thumbnail;
          let newBook = {
            author: author,
            summary: app.shortenSummary(summary),
            title: title,
            cover: app.prepareImage(cover),
            isbn: isbn
            }
            library.bookArray.push(newBook);
          }
        }
      }
    },

// ===============
// prepareImage(img)
// Runs inside of app.populateArrays(data)
// Turns http:// links into https://
// ===============
  prepareImage: (img) => {
    let safeImage = "https://" + img.split("http://")[1];
    return safeImage;
  },

// ===============
// shortenSummary()
// Runs inside of app.populateArrays()
// Returns either an abbreviated summary with a read-more, or just a regular summary
// ===============
  shortenSummary: (summary) => {
    if (summary.length > 400){
      let shortSummary = `
      ${summary.slice(0, 400)}<span>...</span><button class=expand-button>Read more</button><span class=hidden>${summary.slice(400)}</span><button class="expand-button hidden">Show less</button>`;
      return shortSummary;
    } else {return summary}
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
  },

  // ===============
  // reset()
  // Runs upon page load
  // Resets the appropriate arrays upon page refresh
  // ===============
  reset: () => {
    library.bookArray = [];
    localStorage.setItem("newBooks", JSON.stringify(library.bookArray));
  }

};

// =========================================================
//                    EVENT LISTENERS
// =========================================================
$( () => {

  $('#left-container').on('click', eventHandlers.leftSwipe);
  $('#right-container').on('click', eventHandlers.rightSwipe);
  app.reset();
  app.searchGenres();
})
