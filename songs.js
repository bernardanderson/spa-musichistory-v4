var addMusicLink = document.getElementById("add-music");
var viewMusicLink = document.getElementById("view-music");
var addMusicButton = document.getElementById("add-form-button");
var mainViewForm = document.getElementById("main-view-form");
var mainAddForm = document.getElementById("main-add-form");
var moreButton = document.getElementById("more-button")

var songs = [];

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
  songHolder.innerHTML = "";
  for (var i = 0; i < songs.length; i++) {
    songHolder.innerHTML += `<li>${songs[i]}  <button class="dlt-song">Delete</button></li>`;
  };
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

function addSongObjectToArray(sentSongsObject) {
  for (var i = 0; i < sentSongsObject.length; i++) {
    var currentDirtyString = `${sentSongsObject[i].title} > ${sentSongsObject[i].artist} on the album ${sentSongsObject[i].album}`;
    var currentStringClean = currentDirtyString.replace(/[|;$!%@"<()+,*]/g, "");
    currentStringClean = currentStringClean.replace(/[>]/g, "-");
    songs.push(currentStringClean);
  };
}

function parseJson(){
  var songsObject = JSON.parse(this.responseText).song;
  addSongObjectToArray(songsObject);
  addSongsToViewMusic();
}

function getSongs(songNumber) {
  var songsXHR = new XMLHttpRequest();
  songsXHR.addEventListener("load", parseJson);
  songsXHR.open("GET", `songs-pt${songNumber}.json`);
  songsXHR.send();
}

getSongs(1);
showViewForm();

viewMusicLink.addEventListener("click", showViewForm);
addMusicLink.addEventListener("click", showAddForm);
addMusicButton.addEventListener("click", addSongsToArray);
songHolder.addEventListener("click", function(clickEventObject) {
  console.log(clickEventObject);
  if (clickEventObject.target.className === "dlt-song") {
    clickEventObject.currentTarget.removeChild(clickEventObject.target.parentElement);
  };
  clickEventObject.stopPropagation();
});

moreButton.addEventListener("click", function(){
  getSongs(2);
});