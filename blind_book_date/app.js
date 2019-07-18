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
    authorArray: [],
    currentIndex: 0,
    clicks: 0,

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
      this.bookArray = data.items;
      let b = 0;
      let i = 0;
      while (b < userInput.bookAmt){
        let bookInfo = this.bookArray[i].volumeInfo;
        if (bookInfo.description && bookInfo.imageLinks){
          if (bookInfo.description.length > 200){
            let author = bookInfo.authors[0];
            let summary = bookInfo.description;
            let title = bookInfo.title;
            let cover = bookInfo.imageLinks.thumbnail;
            app.summaryArray.push(summary);
            app.titleArray.push(title);
            app.coverArray.push(cover);
            app.authorArray.push(author);
            b++;
          }
        }
        i++
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
            <p>${app.summaryArray[app.currentIndex]}</p>
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
      $('#book-container').append(`<p>${app.summaryArray[app.currentIndex]}</p>`);
    },
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
    // Removes the currently displayed summary from all relevant arrays and displays a new summary
    // ===============
    leftSwipe: () => {
      app.clicks++;
      let index = app.currentIndex;
      app.summaryArray.splice(index, 1);
      app.titleArray.splice(index, 1);
      app.coverArray.splice(index, 1);
      app.authorArray.splice(index, 1);
      if (app.clicks >= userInput.bookAmt){
        console.log("time to show the user their lucky dates!");
      } else {
        app.updateDOM();
      }
    },

    // ===============
    // rightSwipe()
    // Runs on swipe-right button click
    // Moves on to the next summary
    // ===============
    rightSwipe: () => {
      app.clicks++;
      app.currentIndex++;
      if (app.clicks >= userInput.bookAmt){
        console.log("time to show the user their lucky dates");
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
