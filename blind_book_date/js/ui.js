// =========================================================
//                   USER INPUT OBJECTS
// =========================================================

// ====================
// userInput (object)
// Stores input from the select, number, and text inputs
// ====================
const userInput = {
  genre: "Fiction",
  bookAmt: 5,
  key: undefined,
};

// ====================
// userLibrary (object)
// Tracks/stores the user's selected books + book data from the API
// ====================
const userLibrary = {
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
    let i = userLibrary.currentIndex;
    let newDate = userLibrary.bookArray[i];
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
    userLibrary.datesArray.push(newDate);
    let storedBooks = JSON.parse(localStorage.getItem("books"));
    storedBooks.push(newDate);
    localStorage.setItem("books", JSON.stringify(storedBooks))
    console.log(storedBooks);
  },

  // =================
  // getSavedBooks()
  // Runs on launch
  // Checks if there is anything in local storage
  // =================
  getSavedBooks: () => {
    if (localStorage.length != 0){
      let storedBooks = JSON.parse(localStorage.getItem("books"));
      console.log(storedBooks);
    } else {
      let books = [];
      localStorage.setItem("books", JSON.stringify(books));
    }
  }

};
