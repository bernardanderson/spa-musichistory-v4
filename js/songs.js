"use strict";

// Empty object to hold the song information
var songs = {};

//This hides both view and add forms and then shows the addForm or the viewForm
function showAddOrViewForm(addOrView) {
  $("#main-add-form, #main-view-form").addClass("hidden");
  if (addOrView === "add"){

  // Clears the "Add" Input Fields
    $("#album-input").val("");
    $("#artist-input").val("");
    $("#song-title-input").val("");

  $("#main-add-form").removeClass("hidden");
  } else {
    $("#main-view-form").removeClass("hidden");
  }
}

//This uses regex to globally remove characters from the song strings
//  and also replace > with -.  It then adds each song string to the 
//  rightmenu DOM.
function addSongsToViewMusic(sentSongs) {

  if (sentSongs === null ) {
    sentSongs = songs;
  }
  let songString = "";
  $.each(sentSongs, (i, currentSong) => { 
    songString += `<div class="row">`;
    songString += `<div class="col-xs-1">`;
    songString += `<span class="glyphicon glyphicon-trash dlt-song" aria-hidden="true"></span></li>`;
    songString += `</div>`;
    songString += `<div class="col-xs-10">`;
    songString += `<li db-key="${i}">`; // Gives each <li> song item a special key based on the database key
    songString += `${currentSong.title} > ${currentSong.artist} on the album ${currentSong.album}`.replace(/[|;$!%@"<()+,*]/g, "").replace(/\>/g, "-");
    songString += `</li>`;
    songString += `</div>`;
    songString += `</div>`;
  });
  $("#song-holder-list").prepend(songString);
}

//This gets the input.values from the input boxes and pushes it into the song array
//  It then readds the music to the view Panel.
function addSongsToArray() {
  let newSong = {
    "album": $("#album-input").val(),
    "artist": $("#artist-input").val(),
    "title": $("#song-title-input").val()
  };
  $.ajax({
    url: `https://blazing-fire-8024.firebaseio.com/song/.json`,
    type: `POST`,
    data: JSON.stringify(newSong)
  }).done(function(newPostKey) {
    let newSongObject = {[newPostKey.name]: newSong};
    addSongObjectToArray( newSongObject );
    addSongsToViewMusic(newSongObject);
  });
}

// This makes a string out of the song object info, cleans the string of any dirty 
//  chars, replaces a > with a - and then pushes it into the array.
function addSongObjectToArray(sentSongsObject) {
  $.each(sentSongsObject, function(i, currentSong) {
      songs[i] = sentSongsObject[i];
  });
}

// This calls the XHR request pulls the data from the firebase database and
//  parses the JSON data.  It then adds the database data to a local object and then 
//  displays the data on the DOM.
function getSongs() {
  $.ajax({
    url: `https://blazing-fire-8024.firebaseio.com/song.json`,
    success: ( (jsonSongData) => {
      addSongObjectToArray(jsonSongData);
      addSongsToViewMusic(null);
    })
  });
}

// This gets the database "key" for the deleted song <li>, deletes the li from the DOM, deletes the entry from the database
//  and then deletes the song from the local song object
function deleteSongs(sentETarget) {

  // Gets "database id" from clicked <li> sibling of delete button
  let keyOfDbEntry = ($(sentETarget).parent().siblings().children().attr("db-key"));
  $(sentETarget).parent().parent().remove(); // Deletes item from DOM

  // Deletes the database entry from firebase
  $.ajax({
    url: `https://blazing-fire-8024.firebaseio.com/song/${keyOfDbEntry}.json`,
    type: `DELETE`,
    success: ( (jsonSongData) => {
      delete songs[keyOfDbEntry]; // Deletes the song entry from the local object list
    })
  });
}

// All of the event listeners for the app are attached to the body
$("body").click( function(event) {
  let eTarget = event.target;
  if ($(eTarget).hasClass("dlt-song")){
    deleteSongs(eTarget);
  } else if (eTarget.id === "view-music") {
    showAddOrViewForm("");
  } else if (eTarget.id === "add-music") {
    showAddOrViewForm("add");
  } else if (eTarget.id === "add-form-button") {
    showAddOrViewForm(null);
    addSongsToArray();
  }
});

getSongs(1);
showAddOrViewForm("");