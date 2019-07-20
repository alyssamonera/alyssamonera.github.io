const storage = {

  populateStorage: () => {
    let storedBooks = JSON.parse(localStorage.getItem("books"));
    for (let book of storedBooks){
      $('#storage-container').append(book.profileInfo);
    }
  }
}

$( () => {

  storage.populateStorage();

})
