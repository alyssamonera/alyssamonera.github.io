// =========================================================
//                     RESULTS APP LOGIC
// =========================================================

const resultsList = {
  currentIndex: 0,
  storedBooks: JSON.parse(localStorage.getItem("newBooks")),

  // ===============
  // returnResults()
  // Runs upon page load
  // Displays the first match & appropriate messages
  // ===============
  returnResults: () => {
    let currentBook = resultsList.storedBooks[0];
    $('#result').append(currentBook.profileInfo);
    $('.expand-button').on('click', eventHandlers.toggleReadMore);

    let bookAmt = localStorage.getItem("bookAmt")
    if (resultsList.storedBooks.length < bookAmt){
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
    let i = resultsList.currentIndex;
    $('#result').append(resultsList.storedBooks[i].profileInfo);
    $('.expand-button').on('click', eventHandlers.toggleReadMore);
  },

  // ===============
  // browseUp()
  // Runs on "prev" button click
  // Displays the previous book match
  // ===============
    browseUp: () => {
      resultsList.currentIndex--;
      if (resultsList.currentIndex < 0){
        resultsList.currentIndex = resultsList.storedBooks.length - 1;
      }
      resultsList.updateResults();
    },

  // ===============
  // browseDown()
  // Runs on "next" button click
  // Displays the next book match
  // ===============
    browseDown: () => {
      resultsList.currentIndex++;
      if (resultsList.currentIndex > resultsList.storedBooks.length-1){
        resultsList.currentIndex = 0;
      }
      resultsList.updateResults();
    },

};

// =========================================================
//                       EVENT LISTENERS
// =========================================================
$( () => {

  $('#prev').on('click', resultsList.browseUp);
  $('#next').on('click', resultsList.browseDown);
  resultsList.returnResults();
  $('.expand-button').on('click', eventHandlers.toggleReadMore);

});
