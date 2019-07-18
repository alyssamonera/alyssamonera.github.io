$( () => {
  // ================
  // GRABBING ELEMENTS
  // ================

  $('select.genre').change( () => {
    let selectedGenre = $(event.currentTarget).children('option:selected').val();
    console.log(selectedGenre);
  })

  })



  $.getJSON('https://www.googleapis.com/books/v1/volumes?q=subject:thriller&startIndex=100&maxResults=40&key=AIzaSyCd0ecTLD6dtmD-DfQCX3bd_dtn-siboXc', (data) => {
    // console.log(data);
  })
