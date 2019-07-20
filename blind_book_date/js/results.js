$( () => {
  const pageSetup = {
    currentIndex: 0,
    storedBooks: JSON.parse(localStorage.getItem("books")),

    // ===============
    // returnResults()
    // Runs upon page load
    // Displays the first match & appropriate messages
    // ===============
    returnResults: () => {
      let currentBook = pageSetup.storedBooks[0];
      $('#result').append(currentBook.profileInfo);
      // if (storedBooks.length < userInput.bookAmt){
      //   let apology =
      //   `<div class=message>
      //     <p>Sorry, that's all the swipes you have for today! You ended up with ${userLibrary.likedBooks} matches. Click the home link to start a new session.</p>
      //   </div>`;
      //   $('main').prepend(apology);
      // }
    },

    // ===============
    // updateResults()
    // Runs upon #prev or #next button click
    // Displays the previous/next match
    // ===============
    updateResults: () => {
      $('#result').empty();
      let i = pageSetup.currentIndex;
      $('#result').append(pageSetup.storedBooks[i].profileInfo);
    },

    // ===============
    // browseUp()
    // Runs on "prev" button click
    // Displays the previous book match
    // ===============
      browseUp: () => {
        pageSetup.currentIndex--;
        if (pageSetup.currentIndex < 0){
          pageSetup.currentIndex = pageSetup.storedBooks.length - 1;
        }
        pageSetup.updateResults();
      },

    // ===============
    // browseDown()
    // Runs on "next" button click
    // Displays the next book match
    // ===============
      browseDown: () => {
        pageSetup.currentIndex++;
        if (pageSetup.currentIndex > pageSetup.storedBooks.length-1){
          pageSetup.currentIndex = 0;
        }
        pageSetup.updateResults();
      },

  };

  $('.expand-button').on('click', eventHandlers.toggleReadMore);
  $('#prev').on('click', pageSetup.browseUp);
  $('#next').on('click', pageSetup.browseDown);
  pageSetup.returnResults();

});
