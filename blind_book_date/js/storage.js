const storage = {
  storedBooks: JSON.parse(localStorage.getItem("books")),

  // ===================
  // populateStorage()
  // Runs on page load
  // Pulls past matches from local storage and adds to page
  // ===================
  populateStorage: () => {
    if (storage.storedBooks.length === 0){
      $('#storage-container').append('<p>No matches yet.</p>')
    } else {
      $('#storage-container').empty();
      for (let book of storage.storedBooks){
        let $container = $('<div>').addClass('match-container');
        let $button = $('<button>').addClass('remove-match').text("Remove Match");
        $button.attr("isbn", book.isbn)
        $container.append(book.profileInfo, $button);
        $('#storage-container').append($container);
      }
      $('.remove-match').on('click', storage.removeMatch);
    }
  },

  // ===================
  // removeMatch()
  // Runs on remove-match button click
  // Removes book from storage page and local storage memory
  // ===================
  removeMatch: () => {
    let $isbn = $(event.currentTarget).attr("isbn");
    for (let book of storage.storedBooks){
      if (book.isbn === $isbn){
        let index = storage.storedBooks.indexOf(book);
        storage.storedBooks.splice(index, 1);
        localStorage.setItem("books", JSON.stringify(storage.storedBooks));
        break;
      }
    }
    $(event.currentTarget).siblings()[0].remove();
    $(event.currentTarget).remove();
  }

}

$( () => {

  $('#storage-select').change(eventHandlers.sortMatches);
  storage.populateStorage();

})
