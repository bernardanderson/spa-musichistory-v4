"use strict";

// Empty array to hold the song information
var songs = [];

//This hides both view and add forms and then shows the addForm or the viewForm
function showAddOrViewForm(addOrView) {
  $("#main-add-form, #main-view-form").addClass("hidden");
  if (addOrView === "add"){
  $("#main-add-form").removeClass("hidden");
  } else {
    $("#main-view-form").removeClass("hidden");
  }
}

//This uses regex to globally remove characters from the song strings
//  and also replace > with -.  It then adds each song string to the 
//  rightmenu DOM.
function addSongsToViewMusic() {
  let songString = "";
  $(songs).each( (i, currentSong) => { 
    songString += `<div class="row">`;
    songString += `<div class="col-xs-1">`;
    songString += `<span class="glyphicon glyphicon-trash dlt-song" aria-hidden="true"></span></li>`;
    songString += `</div>`;
    songString += `<div class="col-xs-10">`;
    songString += `<li>${currentSong} `;
    songString += `</div>`;
    songString += `</div>`;
  });
  $("#song-holder-list").html(songString);
}

//This gets the input.values from the input boxes and pushes it into the song array
//  It then readds the music to the view Panel.
function addSongsToArray() {
  console.log("It's In");
  let newSong = {
    "album": $("#album-input").val(),
    "artist": $("#artist-input").val(),
    "title": $("#song-title-input").val()
  };
  $.ajax({
    url: `https://blazing-fire-8024.firebaseio.com/song/.json`,
    type: `POST`,
    data: JSON.stringify(newSong)
  }).done(function() {
    getSongs();
  })
  // songs.push(`${$("#song-title-input").val()} - by ${$("#artist-input").val()} on the album ${$("#album-input").val()}`);
  // addSongsToViewMusic();
}

// This makes a string out of the song object info, cleans the string of any dirty 
//  chars, replaces a > with a - and then pushes it into the array.
function addSongObjectToArray(sentSongsObject) {
  $.each(sentSongsObject, function(i, currentSong) {
      var currentStringClean = `${currentSong.title} > ${currentSong.artist} on the album ${currentSong.album}`.replace(/[|;$!%@"<()+,*]/g, "").replace(/\>/g, "-");
      songs.push(currentStringClean);
  })
}

// This calls the xml request and accepts a value so the same XHR can be used to
//  get both song files. It parses the JSON data as well.
function getSongs() {
  $.ajax({
    url: `https://blazing-fire-8024.firebaseio.com/song.json`,
    success: ( (jsonSongData) => {
      addSongObjectToArray(jsonSongData);
      addSongsToViewMusic();
    })
  });
}

// All of the event listeners for the app are attached to the body
$("body").click( function() {
  let eTarget = event.target;

  if ($(eTarget).hasClass("dlt-song")){
    $(eTarget).parent().parent().remove();
  } else if (eTarget.id === "more-button") {
    getSongs(2);
  } else if (eTarget.id === "view-music") {
    showAddOrViewForm("");
  } else if (eTarget.id === "add-music") {
    showAddOrViewForm("add");
  } else if (eTarget.id === "add-form-button") {
    addSongsToArray();
  }
});

getSongs(1);
showAddOrViewForm("");