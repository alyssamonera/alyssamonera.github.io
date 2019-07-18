$( () => {

  // =========================================================
  //                   USER INPUT OBJECT
  // =========================================================
  const userInput = {
    genre: $('#genre').children('option:selected').val(),
    bookAmt: 5,
  };

  // =========================================================
  //                       APP LOGIC
  // =========================================================
  const app = {
    clearMain: () => {
      $('main').empty();
    }
    // launchTinder: (data) => {
    //   data.
    // }
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
  // Gets a random selection of books from the desired genre and prepares the next page
  // ===============
    prepareGame: () => {
      $.getJSON(`https://www.googleapis.com/books/v1/volumes?q=subject:${userInput.genre}&startIndex=100&maxResults=40&key=AIzaSyCd0ecTLD6dtmD-DfQCX3bd_dtn-siboXc`, (data) => {
        let minIndex = data.totalItems - 40;
        let randomIndex = Math.floor(Math.random() * minIndex);
        $.getJSON(`https://www.googleapis.com/books/v1/volumes?q=subject:${userInput.genre}&startIndex=${randomIndex}&maxResults=40&key=AIzaSyCd0ecTLD6dtmD-DfQCX3bd_dtn-siboXc`, (data) => {
          app.clearMain();
          // app.launchTinder(data);
        })
      })
    }
  };

  // =========================================================
  //                    EVENT LISTENERS
  // =========================================================
  $('#bookAmt').change(eventHandlers.updateVal);
  $('#genre').change(eventHandlers.updateVal);
  $('.go-div button').on('click', eventHandlers.prepareGame);

});
