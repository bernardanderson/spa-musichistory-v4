"use strict";

var addMusicLink = document.getElementById("add-music");
var viewMusicLink = document.getElementById("view-music");
var addMusicButton = document.getElementById("add-form-button");
var mainViewForm = document.getElementById("main-view-form");
var mainAddForm = document.getElementById("main-add-form");

// Empty array to hold the song information
var songs = [];

// Targets the <ol> that holds the songs 
var songHolder = document.getElementById("song-holder-list");

//This hides both view and add forms and then shows the viewForm
function showViewForm() {
  mainAddForm.classList.add("hidden");
  mainViewForm.classList.add("hidden");
  mainViewForm.classList.remove("hidden");
}

//This hides both view and add forms and then shows the addForm
function showAddForm() {
  mainAddForm.classList.add("hidden");
  mainViewForm.classList.add("hidden");
  mainAddForm.classList.remove("hidden");
}

//This uses regex to globally remove characters from the song strings
//  and also replace > with -.  It then adds each song string to the 
//  rightmenu DOM.
function addSongsToViewMusic() {
  // $("song-holder-list").html("");
  let songString;
  $(songs).each( (i, currentSong) => { 
    songString += `<li>${currentSong} <button class="dlt-song">Delete</button></li>`;
  });
  $("#song-holder-list").html(songString);
}

//This gets the input.values from the input boxes and pushes it into the song array
//  It then readds the music to the view Panel.
function addSongsToArray() {
  var songInput = document.getElementById("song-title-input");
  var artistInput = document.getElementById("artist-input");
  var albumInput = document.getElementById("album-input");
  songs.push(`${songInput.value} > by ${artistInput.value} on the album ${albumInput.value}`);
  
  addSongsToViewMusic();

  songInput.value = "";
  artistInput.value = "";
  albumInput.value = "";
}

// This makes a string out of the song object info, cleans the string of any dirty 
//  chars, replaces a > with a - and then pushes it into the array.
function addSongObjectToArray(sentSongsObject) {
  for (var i = 0; i < sentSongsObject.length; i++) {
    var currentDirtyString = `${sentSongsObject[i].title} > ${sentSongsObject[i].artist} on the album ${sentSongsObject[i].album}`;
    var currentStringClean = currentDirtyString.replace(/[|;$!%@"<()+,*]/g, "");
    currentStringClean = currentStringClean.replace(/[>]/g, "-");
    songs.push(currentStringClean);
  }
}

// This calls the xml request and accepts a value so the same XHR can be used to
//  get both song files. It parses the JSON data as well.
function getSongs(songNumber) {
  $.ajax({
    url: `songs-pt${songNumber}.json`,
    success: ( (jsonSongData) => {
      addSongObjectToArray(jsonSongData.song);
      addSongsToViewMusic();
    })
  });
}

getSongs(1);
showViewForm();

// All of the event listeners for the app (this can be condensed into one eL)

$("body").click( () => {
  console.log("Body: ", $(event.target).html());
  // if $("#view-music")
});

// viewMusicLink.addEventListener("click", showViewForm);
// addMusicLink.addEventListener("click", showAddForm);
// addMusicButton.addEventListener("click", addSongsToArray);
// songHolder.addEventListener("click", function(clickEventObject) {
//   if (clickEventObject.target.className === "dlt-song") {
//     clickEventObject.currentTarget.removeChild(clickEventObject.target.parentElement);
//   };
//   clickEventObject.stopPropagation();
// });

$("#more-button").click( () => {getSongs(2);} );
