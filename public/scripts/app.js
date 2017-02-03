$(document).ready(function() {

  let userid = 1;
  let userItems = [];
  let newItem = {};

  let saveSearch = (searchValue, userid) => {
      let data = {searchValue: searchValue, comment: "I AM A COMMENT", user_id: userid };
      console.log(data);
      $.ajax({
        method: "POST",
        url: "/api/users/search",
        data: data,
        success: () => {
          console.log("Successfully saved search to db");
        },
        error: () => {
          console.log("Failed to save search to db");
        }
      });
    };

    let getImdbItem = (itemName) => {
      return new Promise((resolve, reject) => {
        $.ajax({
          method: "GET",
          url: "/imdb",
          data: itemName,
          success: (itemData) => {
            console.log("Successful iMDB API request");
            newItem = {
              title: itemData.title,
              year: itemData.year,
              rating: itemData.imdb.rating,
              poster: itemData.poster,
              genres: itemData.genres,
              rated: itemData.rated,
              director: itemData.director,
              runtime: itemData.runtime,
              plot: itemData.plot,
              date: Date.now()
            }
            userItems.push(newItem);
            saveNewMovie(newItem);
            resolve(itemData);
          },
          error: () => {
            console.log("Failed iMDB API request");
          }
        });
      });
    };

    let saveNewMovie = (newItem) => {
      $.ajax({
        method: "POST",
        url: "/api/users/save",
        data: newItem,
        success: () => {
          console.log("Successfully saved movie to db");
          // append new html element
        },
        error: () => {
          console.log("Failed to save movie to db");
        }
      });
    };

    function createMovieItem(movie, comment, date) {
      return `<article class="movie">
        <header>
          <h2 class="title">${movie.title}</h2>
          <h3 class="rating">${movie.imdb.rating}/10</h3>
          <p class="comment">- ${comment}</p>
        </header>
        <div class="container">
          <img class="poster" src=${movie.poster}>
          <div class="flex">
            <div class="genres">Genre(s): ${movie.genres}</div>
            <div class="rated">Rated: ${movie.rated}</div>
            <div class="director">Director(s): ${movie.director}</div>
            <div class="year">Year: ${movie.year}</div>
            <div class="runtime">Runtime: ${movie.runtime} mins</div>
            <div class="plot">Plot:<br>${movie.plot}</div>
          </div>
          <footer>Item added on ${Date(date)}</footer>
        </div>
        <div class="bottom"></div>
      </article>`
    }

  // Submit item and send GET req to oMDB to scrape for item data, then POST to save data to db
  $(function() {
    let newItemButton = $(".addItemBtn");

    newItemButton.click(function() {
      event.preventDefault();

      // let searchValue = $(".inputItem").val();
      // let itemName = $(".addItem form").serialize();

      let userInput = { itemName: $(".inputItem").serialize(),
                        inputComment: $(".inputComment").val()}
      console.log("Submit item button clicked, performing Ajax call...");

      // Check for empty form and return alert error
      if (userInput.itemName === "text=") {
        console.log("Empty form");
        if ($("alert")) {
          $("alert").remove();
          let alert = $("<alert>").addClass("alert").text("Write something dummy!");
          $(".addItem").addClass("alert").append(alert);
          return;
        } else {
          let alert = $("<alert>").addClass("alert").text("You can't send an empty tweet!");
          $(".addItem").addClass("alert").append(alert);
          return;
        }
      } else {
        if ($("alert")) {
          $("alert").remove();
          saveSearch(userInput.itemName, userid);
          getImdbItem(userInput.itemName)
          .then((movieData) => {
            let movieItem = createMovieItem(movieData, userInput.inputComment, Date.now());
            $(".movieList").append(movieItem);
          })
        } else {
          saveSearch(userInput.itemName, userid);
          getImdbItem(userInput.itemName)
          .then((movieData) => {
            let movieItem = createMovieItem(movieData, userInput.inputComment, Date.now());
            $(".movieList").append(movieItem);
          })
        }
      }
    });

  // getUsers();
  });

});

$(function() {
  $(".movieList").on("click", '.movie', function() {
    if ($(this).children('.container').css('display') === 'none') {
      $(this).children('.container').css('display', 'block');
    } else {
      $(this).children('.container').css('display', 'none');
    }
  });
});
