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
    switch ($id){
      case "bookAmt":
        let parsedValue = parseInt($(event.currentTarget).val())
        localStorage.setItem("bookAmt", parsedValue);
        break;
      case "api-submit":
        eventHandlers.toggleModal();
        localStorage.setItem("key", $("#key").val());
        if (globalFunc.checkMinMax()){
          globalFunc.goToPage("html/app.html");
        } else {
          alert("Error! Please adjust your book age sliders.")
        }
        break;
      case "age-min":
      case "age-max":
        let age = parseInt($(event.currentTarget).val());
        let currentYear = new Date().getFullYear();
        let furthestYear = currentYear - age;
        localStorage.setItem($id, furthestYear);
        let p = $id.split("-")[1];
        $(`#current-${p}`).text(age);
        break;
      case "genre":
        localStorage.setItem($id, $(event.currentTarget).val())
        break;
    }
  },

// ===============
// leftSwipe()
// Runs on swipe-left button click
// Moves on to the next summary or runs the results method
// ===============
  leftSwipe: () => {
    library.currentIndex++;
    let index = library.currentIndex;
    if (!library.bookArray[index]){
      let newBooks = JSON.stringify(library.datesArray);
      localStorage.setItem("newBooks", newBooks);
      globalFunc.goToPage("html/results.html");
    } else {
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
      globalFunc.goToPage("html/results.html");
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
// Alphabetical solution from https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
// ===============
  sortMatches: () => {
    $('#storage-container').empty();
    let value = $(event.currentTarget).val();
    switch (value){
      case "Least recent":
        storage.storedBooks.reverse();
        storage.populateStorage();
        break;
      case "Alphabetical Title":
        storage.storedBooks.sort((a, b) => (a.title > b.title) ? 1 : -1);
        storage.populateStorage();
        break;
      case "Alphabetical Author":

        storage.storedBooks.sort((a, b) => {
          let aArray = a.author.split(" ");
          let bArray = b.author.split(" ");
          let aString = aArray[aArray.length-1];
          let bString = bArray[bArray.length-1];
          if (aString > bString){
            return 1;
          } else if (bString > aString){
            return -1;
          } else {
            return 0;
          }
        });

        storage.populateStorage();
        break;
      case "Recently added":
      default:
        storage.storedBooks = JSON.parse(localStorage.getItem("books"));
        storage.populateStorage();
        break;
    }
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
    localStorage.setItem("age-max", 1719);
    localStorage.setItem("age-min", 2019);
  },

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
  $('#age-max, #age-min').on('input', eventHandlers.updateVal);

});
