const storage = {
  storedBooks: JSON.parse(localStorage.getItem("books")),

  // ===================
  // populateStorage()
  // Runs on page load
  // Pulls past matches from local storage and adds to page
  // ===================
  populateStorage: () => {
    for (let book of storage.storedBooks){
      let $container = $('<div>').addClass('match-container');
      let $button = $('<button>').addClass('remove-match');
      $button.attr("id", book.title)
      $container.append(book.profileInfo, $button);
      $('#storage-container').append($container);
    }
    $('.remove-match').on('click', storage.removeMatch);
  },

  // ===================
  // removeMatch()
  // Runs on remove-match button click
  // Removes book from storage page and local storage memory
  // ===================
  removeMatch: () => {
    let $title = $(event.currentTarget).attr("id");
    for (let book of storage.storedBooks){
      if (book.title === $title){
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

  storage.populateStorage();

})
