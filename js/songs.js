"use strict";

// Empty local object to hold the song information pulled from firebase
var songCollection = {};

//This hides both view and add forms and then shows the addForm or the viewForm
function showAddOrViewForm(addOrView, sentTarget, jsonSongDataObj) {
  $("#main-add-form, #main-view-form").addClass("hidden");

  if (addOrView === "add" && sentTarget === null){   // For a new song addtion
    $("#album-input, #artist-input, #song-title-input").val("");   // Clears the "Add" Input Fields
    $("#main-add-form").removeClass("hidden");

  } else if (addOrView === "add" && sentTarget !== null) {   // For an edited song
    $("#song-title-input").val(jsonSongDataObj.title);
    $("#artist-input").val(jsonSongDataObj.artist);
    $("#album-input").val(jsonSongDataObj.album);
    $("#main-add-form").removeClass("hidden");

  } else { // For showing the song view after an additon or edit
    $("#main-view-form").removeClass("hidden");
  }
}

// This uses regex to globally remove characters from the song strings and also replace > with -.  It then adds each song 
//  string to the rightmenu song list DOM.
function addSongsToViewMusic(sentSongs) {

  if (sentSongs === null ) { // If there are no songs sent to it then get the song info from the local songCollection Object
    sentSongs = songCollection;
  }
  let songString = "";
  $.each(sentSongs, (i, currentSong) => { 
    songString += `<div class="row" db-key="${i}">`; // Gives each <li> song item a special key based on the database key
    songString += `<div class="col-xs-2">`;
    songString += `<span class="glyphicon glyphicon-trash dlt-song" aria-hidden="true"></span>`;
    songString += `<span class="glyphicon glyphicon-edit edit-song" aria-hidden="true"></span>`;
    songString += `</div>`;
    songString += `<div class="col-xs-10">`;
    songString += `<li>`;
    songString += `${currentSong.title} > ${currentSong.artist} on the album ${currentSong.album}`.replace(/[|;$!%@"<()+,*]/g, "").replace(/\>/g, "-");
    songString += `</li>`;
    songString += `</div>`;
    songString += `</div>`;
  });
  $("#song-holder-list").prepend(songString);
}

// This gets the input.values from the input boxes and makes a new song object and POSTs that to firebase
function addNewSongToDatabaseDOM() {

  // This builds the song object from the form input fields and converts it into a string so it can be POSTed as a JSON
  let newSongObjString = JSON.stringify({
    "album": $("#album-input").val(),
    "artist": $("#artist-input").val(),
    "title": $("#song-title-input").val()
  });
  mainAjaxCaller("", "POST", newSongObjString);
}

// Gets the db-key from the closest parent of the edit button and GETs that specific song info from firebase
function editSong(sentETarget) {

  let keyOfDbEntry = ($(sentETarget).closest("[db-key]").attr("db-key")); // Finds the nearest parent to the delete button with the attr "db-key" and gets the value
  mainAjaxCaller(keyOfDbEntry, "GET", null);
}

// Updates the DOM and firebase after a song has been edited
function updateSongToDatabaseDOM() {

  let keyOfDbEntry = ($("#add-form-button").attr("db-key")); // Gets the stored database key entry from the add-form-button
  $("#add-form-button").removeAttr("db-key"); //Removes the attribute "db-key" from the add-form-button

  let newSongObj = { // Builds the updated song object
    "album": $("#album-input").val(),
    "artist": $("#artist-input").val(),
    "title": $("#song-title-input").val()
  };

  songCollection[keyOfDbEntry] = newSongObj; // Updates the local songCollection
  
  mainAjaxCaller(keyOfDbEntry, "PUT", JSON.stringify(newSongObj)); // Updates the firebase entry

  $(`div[db-key="${keyOfDbEntry}"]`).remove();  // Removes the DOM entry of the song
  addSongsToViewMusic({[keyOfDbEntry]: newSongObj});  // Add the edited version of the song to the top of the DOM song list
}

// This gets the database "key" for the deleted song, deletes it from the DOM, deletes the entry from the database
//  and then deletes the song from the local song object.
function deleteSongs(sentETarget) {
  let keyOfDbEntry = ($(sentETarget).closest("[db-key]").attr("db-key")); // Finds the nearest parent to the delete button with the attr "db-key" and gets the value
  $(sentETarget).closest("[db-key]").remove(); // Deletes the whole row/song from the DOM
  delete songCollection[keyOfDbEntry]; // Removes the song from the local songCollection object list
  mainAjaxCaller(keyOfDbEntry, "DELETE", null); // Calls the XHR and Deletes that specific key from the database
}

// This is the main Ajax function which can be used to GET, POST, DELETE and PUT by sending it the appropriate arguements
function mainAjaxCaller(sentKey, ajaxRequestType, ajaxDataObjectString) {

  $.ajax({
    url: `https://blazing-fire-8024.firebaseio.com/song/${sentKey}.json`,
    type: ajaxRequestType,
    data: ajaxDataObjectString
  }).done( (dataReturned) => {
    
    if (sentKey === "" && ajaxRequestType === "GET") { // For Gettings the current list of Songs
      songCollection = dataReturned;
      addSongsToViewMusic(null);

    } else if (sentKey !== "" && ajaxRequestType === "GET") { // For getting a single song for editing 
      $("#add-form-button").attr("db-key", sentKey);
      showAddOrViewForm("add", "Edit was clicked", dataReturned);

    } else if (sentKey === "" && ajaxRequestType === "POST") { // For posting a new song
      let tempSongObject = JSON.parse(ajaxDataObjectString); // Converts the ajaxDataObjectString back into an object
      songCollection[dataReturned.name] = tempSongObject; // Adds the newest song to the local songCollection Object
      addSongsToViewMusic({[dataReturned.name]: tempSongObject}); // Adds the newest song to the top of the song list on the DOM
    }
  });
}

$(document).ready(function() { 

  // All of the event listeners for the app are attached to the body and various classes/id are checked
  $("body").click( function(event) {
    let eTarget = event.target;
    if ($(eTarget).hasClass("dlt-song")){ // Checks for a Delete Button Click
      deleteSongs(eTarget);
    } else if (eTarget.id === "view-music") { // Checks for a the "View-Music" Window View Click
      showAddOrViewForm("", null);
    } else if (eTarget.id === "add-music") { // Checks for a the "Add-Music" Window View Click
      showAddOrViewForm("add", null);
    } else if (eTarget.id === "add-form-button") { // Checks for the "Add-Music" "Add" Button Click
        
        if ($("#add-form-button").attr("db-key")) { // Does the add button have a "db-key" attr (aka editing)
          showAddOrViewForm(null);
          updateSongToDatabaseDOM();

        } else {
          showAddOrViewForm(null);
          addNewSongToDatabaseDOM();
        }

    } else if ($(eTarget).hasClass("edit-song")) { // Checks for an Edit Button Click
      editSong(eTarget);
    }
  });

  mainAjaxCaller("", "GET", null); // GETs the initial list of songs from Firebase
  showAddOrViewForm();

});