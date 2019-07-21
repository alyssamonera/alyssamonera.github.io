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
//                    EVENT HANDLERS
// =========================================================
const eventHandlers = {

// ===============
// updateVal()
// Runs every time some user input changes
// Updates the value of each variable in local storage
// ===============
  updateVal: () => {
    let $id = $(event.currentTarget).attr('id');
    if ($id === "bookAmt"){
      let parsedValue = parseInt($(event.currentTarget).val())
      localStorage.setItem("bookAmt", parsedValue);
    } else if ($id === "api-submit"){
      eventHandlers.toggleModal();
      localStorage.setItem("key", $("#key").val())
      globalFunc.goToPage("app");
    } else if ($id === "age-range") {
      $('#current-age').text($(event.currentTarget).val());
    } else {
      localStorage.setItem($id, $(event.currentTarget).val())
      console.log(localStorage.getItem($id));
    }
  },

// ===============
// prepareGame()
// Runs upon click of "submit" button in the modal
// Checks for an API key, then goes to the next page
// ===============
  prepareGame: () => {
    if (!localStorage.getItem("key")){eventHandlers.toggleModal()}
    else {globalFunc.goToPage("app");}
  },

// ===============
// leftSwipe()
// Runs on swipe-left button click
// Moves on to the next summary or runs the results method
// ===============
  leftSwipe: () => {
    let index = library.currentIndex;
    if (!library.bookArray[index] || !library.bookArray[index+1]){
      globalFunc.goToPage("results");
    } else {
      library.currentIndex++;
      app.updateDOM();
    }
  },

// ===============
// rightSwipe()
// Runs on swipe-right button click
// Adds a new book object to datesArray. Moves on to the next book or heads to the results page.
// The JSON stringify solution: https://stackoverflow.com/questions/38380462/syntaxerror-unexpected-token-o-in-json-at-position-1/38380728
// ===============
  rightSwipe: () => {
    library.addNewDate();
    library.likedBooks++;
    library.currentIndex++;
    let index = library.currentIndex;
    let bookAmt = parseInt(localStorage.getItem("bookAmt"));
    if (library.likedBooks >= bookAmt || !library.bookArray[index]){
      let newBooks = JSON.stringify(library.datesArray);
      localStorage.setItem("newBooks", newBooks);
      globalFunc.goToPage("results");
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
// sortMatches()
// Runs on the select element in storage.html
// Sorts the match history oldest-newest and vice versa
// ===============
  sortMatches: () => {
    if ($(event.currentTarget).val() === "Newest to oldest"){
      storage.populateStorage();
    } else {
      $('#storage-container').empty();
      for (let i = storage.storedBooks.length - 1; i > -1; i--){
        let book = storage.storedBooks[i];
        let $container = $('<div>').addClass('match-container');
        let $button = $('<button>').addClass('remove-match').text("Remove Match");
        $button.attr("isbn", book.isbn)
        $container.append(book.profileInfo, $button);
        $('#storage-container').append($container);
      }
      $('.remove-match').on('click', storage.removeMatch);
    }
  }

};

const globalFunc = {
  // ===============
  // goToPage(page)
  // Runs when conditions are met to go to the next page
  // Directs the user to the desired page
  // ===============
  goToPage: (page) => {
    let slicedHREF = window.location.pathname.split("_date/");
    window.location.pathname = `${slicedHREF[0]}_date/html/${page}.html`;
  },

  // ===============
  // reset()
  // Runs upon clicking the home menu item
  // Resets all relevant values
  // ===============
  reset: () => {
    library.currentIndex = 0;
    library.likedBooks = 0;
    library.datesArray = [];
    library.bookArray = [];
    localStorage.setItem("genre", "Fiction");
    localStorage.setItem("bookAmt", 5);
  },

  // ===============
  // checkStorage()
  // Runs on launch
  // If storage doesn't have a certain item, sets initial values
  // ===============
  checkStorage: (item) => {
    if (!localStorage.getItem(item)){
      switch (item){
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
        case "age-range":
          localStorage.setItem("age-range", 1000);
          break;
      }
    }
  }

};

// =========================================================
//                    EVENT LISTENERS
// =========================================================
$( () => {

  $('#bookAmt, #genre').change(eventHandlers.updateVal);
  $('#modal-textbox button').on('click', eventHandlers.updateVal);
  $('.go-div button').on('click', eventHandlers.toggleModal);
  $('#menu-api, #exit').on('click', eventHandlers.toggleModal);
  $('#home').on('click', eventHandlers.reset);
  $('#age-range').on('input', eventHandlers.updateVal);

  globalFunc.checkStorage("genre");
  globalFunc.checkStorage("bookAmt");
  globalFunc.checkStorage("books");
  globalFunc.checkStorage("age-range");

});
