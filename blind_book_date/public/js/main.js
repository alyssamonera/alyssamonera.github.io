// =========================================================
//                        BOOK TRACKER
// =========================================================
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
    let isbn = newDate.isbn;
    newDate.profileInfo = `
    <div class=book-container>
      <div class=cover-container>
        <img src="${cover}" alt="${title} cover" title="${title} by ${author}">
      </div>
      <div class=details-container>
        <ul>
          <li><b>title:</b> ${title}</li>
          <li><b>author:</b> ${author}</li>
          <li><b>summary:</b> ${summary}</li>
        </ul>
      </div>
    </div>`;
    library.datesArray.push(newDate);
    let storedBooks = JSON.parse(localStorage.getItem("books"));
    storedBooks.unshift(newDate);
    localStorage.setItem("books", JSON.stringify(storedBooks))
  }

};

// =========================================================
//                        GLOBAL FUNCTIONS
// =========================================================

const globalFunc = {
  // ===============
  // goToPage(page)
  // Runs when conditions are met to go to the next page
  // Directs the user to the desired page
  // ===============
  goToPage: (page) => {
    let slicedHREF = window.location.pathname.split("_date/");
    window.location.pathname = `${slicedHREF[0]}_date/${page}`;
  },

  // ===============
  // checkMinMax()
  // Runs inside of eventHandlers.updateVal()
  // Returns true if the min and max ages are compatible, otherwise returns false
  // ===============
    checkMinMax: () => {
      let min = localStorage.getItem("age-min");
      let max = localStorage.getItem("age-max");
      if (min < max || max > min){
        return false;
      } else {
        return true;
      }
    },

  // ===============
  // checkStorage()
  // Runs on launch
  // If storage doesn't have a certain item, sets initial values
  // ===============
  checkStorage: () => {
    let list = ["genre", "bookAmt", "books", "age-min", "age-max"];
    for (let i = 0; i < list.length; i++){
      if (!localStorage.getItem(list[i])){
        switch (list[i]){
          case "genre":
            localStorage.setItem("genre", "Fiction");
            break;
          case "bookAmt":
            localStorage.setItem("bookAmt", 5);
            break;
          case "books":
            let books = [];
            localStorage.setItem("books", JSON.stringify(books));
            break;
          case "age-max":
            localStorage.setItem("age-max", 1719);
            break;
          case "age-min":
            localStorage.setItem("age-min", 2019);
            break;
        }
      }
    }
  }

};

// =========================================================
//                    WINDOW ON-LOAD
// =========================================================

$( () => {

  globalFunc.checkStorage();

});
