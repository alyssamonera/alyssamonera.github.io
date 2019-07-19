$( () => {

  // =========================================================
  //                   USER INPUT OBJECT
  // =========================================================
  const userInput = {
    genre: $('#genre').children('option:selected').val(),
    bookAmt: 5,
    key: undefined,
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
        cover: userLibrary.coverArray[index],
        profileInfo: `<div class=result>
                <div class=cover-container>
                  <img src="${userLibrary.coverArray[index]}">
                </div>
                <div class=details-container>
                  <ul>
                    <li><b>title:</b> ${userLibrary.titleArray[index]}</li>
                    <li><b>author:</b> ${userLibrary.authorArray[index]}</li>
                    <li><b>summary:</b> ${userLibrary.summaryArray[index]}</li>
                  </ul>
                </div>
              </div>`
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
        $.getJSON(`https://www.googleapis.com/books/v1/volumes?q=subject:${userInput.genre}&startIndex=${index}&maxResults=40&langRestrict=en&key=${userInput.key}`, (data) => {
          app.populateArrays(data);
          app.shortenSummary();
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
  // shortenSummary()
  // Runs inside of this.runGame()
  // Gives extra text a hidden class so it can be hidden on mobile
  // ===============
    shortenSummary: () => {
      for (let i = 0; i < userLibrary.summaryArray.length; i++){
        let summary = userLibrary.summaryArray[i];
        if (summary.length > 400){
          let shortSummary = `
          ${summary.slice(0, 400)}<span>...</span><button class=expand-button>Read more</button><span class=hidden>${summary.slice(400)}</span>
          <button class="expand-button hidden">Read less</button>`;
          userLibrary.summaryArray[i] = shortSummary;
        }
      }
    },

  // ===============
  // printDOM()
  // Runs inside of this.runGame()
  // Prints the first summary and necessary buttons the first time
  // ===============
    printDOM: () => {
      $('main').empty();
      let innerhtml =
        `<div class=tinder-container>
          <div class=swipe-container>
            <button id="swipe-left">‹</button>
            <p>Swipe Left</p>
          </div>
          <div id=book-container>
            <p>${userLibrary.summaryArray[userLibrary.currentIndex]}</p>
          </div>
          <div class=swipe-container>
            <button id="swipe-right">›</button>
            <p>Swipe Right</p>
          </div>`;
      $('main').append(innerhtml);
      $('#swipe-left').on('click', eventHandlers.leftSwipe);
      $('#swipe-right').on('click', eventHandlers.rightSwipe);
      $('.expand-button').on('click', eventHandlers.toggleReadMore);
    },

    // ===============
    // updateDOM()
    // Runs inside of the left and right click event handlers
    // Updates the book-container div with a new summary
    // ===============
    updateDOM: () => {
      $('#book-container').empty();
      $('#book-container').append(`<p>${userLibrary.summaryArray[userLibrary.currentIndex]}</p>`);
      $('.expand-button').on('click', eventHandlers.toggleReadMore);
    },

    // ===============
    // returnDates()
    // Runs upon swipe left or right when the user has found the desired amt of matches, or they run out of books
    // Prints all the user's matches to the DOM
    // ===============
    returnDates: () => {
      $('main').empty();
      userLibrary.currentIndex = 0;
      let currentDate = userLibrary.datesArray[0];
      let result = `
      <div class="results-container">
      <button id="prev">▲</button> ${userLibrary.datesArray[0].profileInfo}
      <button id="next">▼</button></div>`;
      if (userLibrary.datesArray.length < userInput.bookAmt){
        let apology =
        `<div class=message>
          <p>Sorry, that's all the swipes you have for today! You ended up with ${userLibrary.likedBooks} matches. Click the home link to start a new session.</p>
        </div>`;
        $('main').append(apology);
      }
      $('main').append(result);
      $('.expand-button').on('click', eventHandlers.toggleReadMore);
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
      } else if ($id === "api-submit"){
        eventHandlers.toggleModal();
        $id = "key";
        userInput[$id] = $("#key").val();
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
      if (!userInput.key){
        eventHandlers.toggleModal()
      }
      else {
        $.getJSON(`https://www.googleapis.com/books/v1/volumes?q=subject:${userInput.genre}&langRestrict=en&key=${userInput.key}`, (data) => {
          let minIndex = data.totalItems - 40;
          let randomIndex = Math.floor(Math.random() * minIndex);
          app.runGame(randomIndex)})
        }
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
    }
  };

  // =========================================================
  //                    EVENT LISTENERS
  // =========================================================
  $('#bookAmt, #genre').change(eventHandlers.updateVal);
  $('#modal-textbox button').on('click', eventHandlers.updateVal);
  $('.go-div button').on('click', eventHandlers.prepareGame);
  $('#menu-api, #exit').on('click', eventHandlers.toggleModal);

});
