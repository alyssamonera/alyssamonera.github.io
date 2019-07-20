// =========================================================
//                     RESULTS APP LOGIC
// =========================================================

const bookStorage = {
  currentIndex: 0,
  storedBooks: JSON.parse(localStorage.getItem("newBooks")),

  // ===============
  // returnResults()
  // Runs upon page load
  // Displays the first match & appropriate messages
  // ===============
  returnResults: () => {
    let currentBook = bookStorage.storedBooks[0];
    $('#result').append(currentBook.profileInfo);
    $('.expand-button').on('click', eventHandlers.toggleReadMore);

    let bookAmt = localStorage.getItem("bookAmt")
    if (bookStorage.storedBooks.length < bookAmt){
      let apology =
      `<div class=message>
        <p>Sorry, that's all the swipes you have for today! You ended up with ${userLibrary.likedBooks} matches. Click the home link to start a new session.</p>
      </div>`;
      $('main').prepend(apology);
    }
  },

  // ===============
  // updateResults()
  // Runs upon #prev or #next button click
  // Displays the previous/next match
  // ===============
  updateResults: () => {
    $('#result').empty();
    let i = bookStorage.currentIndex;
    $('#result').append(bookStorage.storedBooks[i].profileInfo);
  },

  // ===============
  // browseUp()
  // Runs on "prev" button click
  // Displays the previous book match
  // ===============
    browseUp: () => {
      bookStorage.currentIndex--;
      if (bookStorage.currentIndex < 0){
        bookStorage.currentIndex = bookStorage.storedBooks.length - 1;
      }
      bookStorage.updateResults();
    },

  // ===============
  // browseDown()
  // Runs on "next" button click
  // Displays the next book match
  // ===============
    browseDown: () => {
      bookStorage.currentIndex++;
      if (bookStorage.currentIndex > bookStorage.storedBooks.length-1){
        bookStorage.currentIndex = 0;
      }
      bookStorage.updateResults();
    },

};

// =========================================================
//                       EVENT LISTENERS
// =========================================================
$( () => {

  $('#prev').on('click', bookStorage.browseUp);
  $('#next').on('click', bookStorage.browseDown);
  bookStorage.returnResults();
  $('.expand-button').on('click', eventHandlers.toggleReadMore);

});
