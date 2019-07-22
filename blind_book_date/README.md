# Blind Book Date

**NOTE: This app is currently in development.** It was started as a project for [the General Assembly Software Engineering Immersive (Remote)](https://generalassemb.ly/education/software-engineering-immersive/new-york-city) and will likely see further development upon completion of the course.

*Imagine Tinder without pictures, and all your dates are books. That's what this app is striving for.*

Blind Book Date is a book discovery engine. It pulls book information from an API and lets users decide which books to try based solely on their description--in a way, preventing the user from "judging a book by its cover." (Or its author. Or title.)

* Blind Book Date searches are filtered based on genre and publish date.
* All matches are saved in local storage, so the user can revisit them later.
* After matching, the user will be able to see the title, cover, and author of all their matches.

## How It Works

As this is my first application as a budding software engineer, the app is currently run exclusively on front-end technologies.

###Technologies Used

This app currently utilizes HTML5, CSS3, JavaScript, jQuery, JSON/AJAX, and [the Google Books API](https://developers.google.com/books/).

* Major HTML features include: links, buttons, modals, input fields, "carousels"

* Major CSS features include: animation loops, flex-box

* Major JavaScript/jQuery features include: Object-Oriented Programming (OOP), methods, conditionals, DOM manipulation, saving to local storage

###Approaches Taken

* Blind Book Dating utilizes local storage to save user input and past matches across multiple pages. Inputs such as genre, number of desired matches, book age, match history, and recent match history are all stored in local storage. **The user's API key is also saved here.**

```
updateVal: () => {
  let $id = $(event.currentTarget).attr('id');
  switch ($id){
    case "bookAmt":
      let parsedValue = parseInt($(event.currentTarget).val())
      localStorage.setItem("bookAmt", parsedValue);
      break;
    case "api-submit":
    [...]
```

* Local storage should reset every time the user returns to the main page or refreshes the app page.

* The app takes the user's genre input, plugs it into the API via interpolation, and filters that data through a series of checks (i.e. if statements) to ensure that the required information can be displayed on the site (i.e. isn't undefined or incomplete).

```
checkBook: (bookInfo) => {
  if (bookInfo.description && bookInfo.imageLinks && bookInfo.authors && bookInfo.publishedDate && bookInfo.industryIdentifiers){
    if (bookInfo.description.length > 150){
    [...]
```

* After the filtering process, the app creates a book object for each book with the relevant properties (e.g. title, author, cover, and summary). That book object is then pushed to an array that will then be cycled through as the user "swipes" through the summary carousel.

```
addBook: (bookInfo, isbn) => {
  let author = bookInfo.authors[0];
  let summary = bookInfo.description;
  let title = bookInfo.title;
  let cover = bookInfo.imageLinks.thumbnail;
  let newBook = {
    author: author,
    summary: app.shortenSummary(summary),
    [...]
```

* Left-swipes simply progress the carousel one step forward.

* Right-swipes will do the same and also create an HTML string "profile" property that will serve as the desired book object's profile later on. The object is then pushed into an array that will later serve as the basis for the "results" carousel on the next page.

```
newDate.profileInfo = `
<div class=book-container>
  <div class=cover-container>
    <img src="${cover}" alt="${title} cover" title="${title} by ${author}">
  </div>
  <div class=details-container>
  [...]
```

* Each swipe will also check to see if the user is ready to move on to the results page.

* The results page is simply a carousel that lets the user browse their most recent matches.

* The match history page pulls from a local storage array that holds all the player's matches. It then prints each saved book object's profile to a designated div.

```
const storage = {
  storedBooks: JSON.parse(localStorage.getItem("books")),
  populateStorage: () => {
    if (storage.storedBooks.length === 0){
      $('#storage-container').append('<p>No matches yet.</p>')
    } else {
      $('#storage-container').empty();
      for (let book of storage.storedBooks){
      [...]
```

* When users select new sorting options on this page, the array holding these saved book objects will be re-sorted, and the page will be emptied and refilled using the newly sorted array.

###Instructions

1. To begin, select a genre. Then input how many books you would like to match with, and pick how "old" or "young" you'd like the books to be. This last part will narrow down how long ago your results were published.<br>If you don't select anything, these values will default to fiction, 5, 1719, and 2019 respectively. Hit "go" when you're ready.

2. **After hitting "go," a modal will come up and prompt you to enter an API key.** See Installation below for details on obtaining a key. *You must hit submit after entering a valid API key to get to the next page. The "go" button will not take you there.*

3. This will take you to the next page. Assuming the data is successfully retrieved, you will be presented with a series of summaries displayed on a "carousel."<br> Hit the arrow on the right to "swipe right" and save the book. <br> Hit the left arrow to "swipe left" and discard it. <br> This will continue until you've either hit your book quota (the amount you entered earlier) or until you've run out of books to swipe through.

4. Once you've completed your swipes, you will be taken to a results page that displays your most recent matches from the most recent round of swipes. These are also presented on a carousel, but now they come with a title, author, and cover in addition to the summary.

5. At any time after you've matched with a book, regardless of whether you've hit the results screen, you may navigate to your match history and view all the matches you've had so far. The link to this page is located up top, titled "Your Match History." <br> On this page, you may sort through your matches by date added, title, and author. You may also remove any match from your history.

###Installation

To install this app on your local computer:

1. Clone the repository.

<img src="https://i.imgur.com/zyyI0vd.png">

2. Open index.html in your browser.

<img src="https://i.imgur.com/bXqjE8p.png">

3. Enter an API key. [If you don't already have one, here's how to obtain it.](https://developers.google.com/books/docs/v1/getting_started).

4. You may also test out the app over at [the live site here](https://alyssamonera.github.io/blind_book_date).


## Known Issues

1. **This app requires a Google Books API key to run in its current state.** This app was developed for a General Assembly front-end development project and currently has no back-end to securely store an API key. This is a known issue and will be fixed in a forthcoming update. See Installation below for details on obtaining a key.

2. **Data will occasionally fail to load from the API and fail to display summaries on the app page.** If this happens, an error message will usually display instructing the user to refresh the page. If the app page opens with only a read-more inside, please refresh the page and try again. *If this doesn't fix the issue, please contact me.*

3. **If you encounter any other issues, feel free to contact me.** I am new to the software engineering scene and always open to pointers.
