$( () => {

  // =========================================================
  //                   USER INPUT OBJECT
  // =========================================================
  const userInput = {
    genre: $('#genre').children('option:selected').val(),
    bookAmt: 5
  };

  const userLibrary = {
    bookArray: [],
    summaryArray: [],
    titleArray: [],
    coverArray: [],
    authorArray: [],
    datesArray: [],
    currentIndex: 0,
    likedBooks: 0,
    addNewDate: () => {
      let index = userLibrary.currentIndex;
      let newDate = {
        title: userLibrary.titleArray[index],
        author: userLibrary.authorArray[index],
        summary: userLibrary.summaryArray[index],
        cover: userLibrary.coverArray[index]
      };
      userLibrary.datesArray.push(newDate);
    }
  }

  // =========================================================
  //                       APP LOGIC
  // =========================================================
  const app = {
    // ===============
    // runGame(index)
    // Runs inside of eventHandlers.prepareGame()
    // Runs user input as parameters in the API, then filters the data through app.populateArrays()
    // ===============
      runGame: (index) => {
        $.getJSON(`https://www.googleapis.com/books/v1/volumes?q=subject:${userInput.genre}&startIndex=${index}&maxResults=40&langRestrict=en&key=AIzaSyCd0ecTLD6dtmD-DfQCX3bd_dtn-siboXc`, (data) => {
          app.populateArrays(data);
          app.printDOM();
        })
      },

    // ===============
    // populateArrays(data)
    // Runs inside of this.runGame()
    // Stores the summaries, titles, authors, and cover image URLs into appropriate arrays
    // ===============
    populateArrays: (data) => {
      userLibrary.bookArray = data.items;
      for (let i = 0; i < userLibrary.bookArray.length; i++){
        let bookInfo = userLibrary.bookArray[i].volumeInfo;
        if (bookInfo.description && bookInfo.imageLinks && bookInfo.authors){
          if (bookInfo.description.length > 200){
            let author = bookInfo.authors[0];
            let summary = bookInfo.description;
            let title = bookInfo.title;
            let cover = bookInfo.imageLinks.thumbnail;
            userLibrary.summaryArray.push(summary);
            userLibrary.titleArray.push(title);
            userLibrary.coverArray.push(cover);
            userLibrary.authorArray.push(author);
          }
        }
      }
    },

  // ===============
  // printDOM()
  // Runs inside of this.runGame()
  // Prints the first summary and necessary buttons the first time. See updateDOM() for more.
  // ===============
    printDOM: () => {
      $('main').empty();
      let innerhtml =
        `<div class=tinder-container>
          <div class=swipe-container>
            <button id="swipe-left"></button>
            <p>Swipe Left</p>
          </div>
          <div id=book-container>
            <p>${userLibrary.summaryArray[userLibrary.currentIndex]}</p>
          </div>
          <div class=swipe-container>
            <button id="swipe-right"></button>
            <p>Swipe Right</p>
          </div>`;
      $('main').append(innerhtml);
      $('#swipe-left').on('click', eventHandlers.leftSwipe);
      $('#swipe-right').on('click', eventHandlers.rightSwipe)
    },

    // ===============
    // updateDOM()
    // Runs inside of the left and right click event handlers
    // Updates the book-container div with a new summary
    // ===============
    updateDOM: () => {
      $('#book-container').empty();
      $('#book-container').append(`<p>${userLibrary.summaryArray[userLibrary.currentIndex]}</p>`);
    },

    // ===============
    // returnDates()
    // Runs upon swipe left or right when the user has found the desired amt of matches, or they run out of books
    // Prints all the user's matches to the DOM
    // ===============
    returnDates: () => {
      $('main').empty();
      let $resultsContainer = $('<div>').addClass('results-container');
      for (let i = 0; i < userLibrary.datesArray.length; i++){
        let cover = userLibrary.datesArray[i].cover;
        let title = userLibrary.datesArray[i].title;
        let author = userLibrary.datesArray[i].author;
        let summary = userLibrary.datesArray[i].summary;
        let innerhtml =
        `<div class=result>
          <div class=cover-container>
            <img src="${cover}">
          </div>
          <div class=details-container>
            <ul>
              <li>title: ${title}</li>
              <li>author: ${author}</li>
              <li>summary: ${summary}</li>
            </ul>
          </div>
        </div>`;
        $resultsContainer.append(innerhtml);
      }
      if (userLibrary.datesArray.length < userInput.bookAmt){
        let apology =
        `<div class=message>
          <p>Sorry, that's all the swipes you have for today! You ended up with ${userLibrary.likedBooks} matches. Click the home link to start a new session.</p>
        </div>`;
        $resultsContainer.prepend(apology);
      }
      $('main').append($resultsContainer);
    }
  };


  // =========================================================
  //                    EVENT HANDLERS
  // =========================================================
  const eventHandlers = {

  // ===============
  // updateVal()
  // Runs every time the genre or amount of books changes
  // Updates the value of each variable in the user object
  // ===============
    updateVal: () => {
      let $id = $(event.currentTarget).attr('id');
      if ($id === "bookAmt"){
        userInput[$id] = parseInt($(event.currentTarget).val())
      } else {
        userInput[$id] = $(event.currentTarget).val();
      }
    },

  // ===============
  // prepareGame()
  // Runs upon click of "go" button
  // Picks a random index num based on the length of the data's book array, then runs it through app.runGame()
  // ===============
    prepareGame: () => {
      $.getJSON(`https://www.googleapis.com/books/v1/volumes?q=subject:${userInput.genre}&langRestrict=en&key=AIzaSyCd0ecTLD6dtmD-DfQCX3bd_dtn-siboXc`, (data) => {
        let minIndex = data.totalItems - 40;
        let randomIndex = Math.floor(Math.random() * minIndex);
        app.runGame(randomIndex)})
    },

  // ===============
  // leftSwipe()
  // Runs on swipe-left button click
  // Moves on to the next summary or runs the results method
  // ===============
    leftSwipe: () => {
      let index = userLibrary.currentIndex;
      if (!userLibrary.summaryArray[index] || !userLibrary.summaryArray[index+1]){
        app.returnDates();
      } else {
        userLibrary.currentIndex++;
        app.updateDOM();
      }
    },

  // ===============
  // rightSwipe()
  // Runs on swipe-right button click
  // Adds a new book object to datesArray. Moves on to the next book or runs the results method.
  // ===============
    rightSwipe: () => {
      userLibrary.addNewDate();
      userLibrary.likedBooks++;
      userLibrary.currentIndex++;
      let index = userLibrary.currentIndex;
      if (userLibrary.likedBooks >= userInput.bookAmt || !userLibrary.summaryArray[index]){
        app.returnDates();
      } else {
        app.updateDOM();
      }
    }

  };

  // =========================================================
  //                    EVENT LISTENERS
  // =========================================================
  $('#bookAmt').change(eventHandlers.updateVal);
  $('#genre').change(eventHandlers.updateVal);
  $('.go-div button').on('click', eventHandlers.prepareGame);

});
