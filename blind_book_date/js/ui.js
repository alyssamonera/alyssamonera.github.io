// =========================================================
//                   USER INPUT OBJECTS
// =========================================================

// ====================
// library (object)
// Tracks/stores the user's selected books + book data from the API
// ====================
const library = {
  bookArray: [],
  datesArray: [],
  currentIndex: 0,
  likedBooks: 0,

  // =================
  // addNewDate()
  // Runs on right swipe
  // Creates and stores a right-swiped book object
  // JSON/stringify solution found at: https://stackoverflow.com/questions/16083919/push-json-objects-to-array-in-localstorage
  // =================
  addNewDate: () => {
    let i = library.currentIndex;
    let newDate = library.bookArray[i];
    let cover = newDate.cover;
    let title = newDate.title;
    let author = newDate.author;
    let summary = newDate.summary;
    newDate.profileInfo = `
      <div class=cover-container>
        <img src="${cover}">
      </div>
      <div class=details-container>
        <ul>
          <li><b>title:</b> ${title}</li>
          <li><b>author:</b> ${author}</li>
          <li><b>summary:</b> ${summary}</li>
        </ul>
      </div>`;
    library.datesArray.push(newDate);
    let storedBooks = JSON.parse(localStorage.getItem("books"));
    storedBooks.push(newDate);
    localStorage.setItem("books", JSON.stringify(storedBooks))
  },

  // =================
  // getSavedBooks()
  // Runs on launch
  // Checks if there is anything in local storage
  // =================
  getSavedBooks: () => {
    if (localStorage.length != 0){
      let storedBooks = JSON.parse(localStorage.getItem("books"));
    } else {
      let books = [];
      localStorage.setItem("books", JSON.stringify(books));
    }
  }

};
