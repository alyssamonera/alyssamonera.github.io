$( () => {

  // =========================================================
  //                   USER INPUT OBJECT
  // =========================================================
  const userInput = {
    genre: $('#genre').children('option:selected').val(),
    bookAmt: 5
  };

  // =========================================================
  //                       APP LOGIC
  // =========================================================
  const app = {
    bookArray: [],
    summaryArray: [],
    titleArray: [],
    coverArray: [],
    currentIndex: 0,

    // ===============
    // runGame(index)
    // Runs inside of eventHandlers.prepareGame()
    // Runs user input as parameters in the API, then filters the data through app.populateArrays()
    // ===============
      runGame: (index) => {
        $.getJSON(`https://www.googleapis.com/books/v1/volumes?q=subject:${userInput.genre}&startIndex=${index}&maxResults=${userInput.bookAmt + 10}&langRestrict=en&key=AIzaSyCd0ecTLD6dtmD-DfQCX3bd_dtn-siboXc`, (data) => {
          app.populateArrays(data);
          app.printDOM();
        })
      },

    // ===============
    // clearMain()
    // Runs inside of this.printDOM()
    // Clears the main div to make room for the next stage of the game
    // ===============
      clearMain: () => {
        $('main').empty();
      },

    // ===============
    // populateArrays(data)
    // Runs inside of this.runGame()
    // Stores the summaries, titles, authors, and cover image URLs into appropriate arrays
    // ===============
    populateArrays: (data) => {
      this.bookArray = data.items;
      let i = 0;
      while (i < userInput.bookAmt){
        let bookInfo = this.bookArray[i].volumeInfo;
        if (bookInfo.description && bookInfo.imageLinks){
          if (bookInfo.description.length > 200){
            let summary = bookInfo.description;
            let title = bookInfo.title;
            let cover = bookInfo.imageLinks.thumbnail;
            app.summaryArray.push(summary);
            app.titleArray.push(title);
            app.coverArray.push(cover);
          }
        }
        i++
      }
    },

  // ===============
  // printDOM()
  // Runs inside of this.runGame()
  // Pulls the first summary in this.summaryArray and prints it to the DOM. Also sets up the initial HTML for the main div.
  // ===============
    printDOM: () => {
      app.clearMain();
      let innerhtml =
        `<div class=tinder-container>
          <div class=swipe-container>
            <button id="swipe-left"></button>
            <p>Swipe Left</p>
          </div>
          <div class=book-container>
            <p>${app.summaryArray[app.currentIndex]}</p>
          </div>
          <div class=swipe-container>
            <button id="swipe-right"></button>
            <p>Swipe Right</p>
          </div>`;
      $('main').append(innerhtml);
      $('#swipe-left').on('click', eventHandlers.leftSwipe);
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
      userInput[$id] = $(event.currentTarget).val();
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
    // Runs on left-swipe click
    //
    // ===============
    leftSwipe: () => {
      let index = app.currentIndex;
      app.summaryArray.splice(index, 1);
      app.printDOM();
    }
  };

  // =========================================================
  //                    EVENT LISTENERS
  // =========================================================
  $('#bookAmt').change(eventHandlers.updateVal);
  $('#genre').change(eventHandlers.updateVal);
  $('.go-div button').on('click', eventHandlers.prepareGame);

});
