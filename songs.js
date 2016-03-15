var addMusicLink = document.getElementById("add-music");
var viewMusicLink = document.getElementById("view-music");
var addMusicButton = document.getElementById("add-form-button");
var mainViewForm = document.getElementById("main-view-form");
var mainAddForm = document.getElementById("main-add-form");

var songs = [];

songs[songs.length] = "Legs > by Z*ZTop on the album Eliminator";
songs[songs.length] = "The Logical Song > by Supertr@amp on the album Breakfast in America";
songs[songs.length] = "Another Brick in the Wall > by Pink Floyd on the album The Wall";
songs[songs.length] = "Welco(me to the Jungle > by Guns & Roses on the album Appetite for Destruction";
songs[songs.length] = "Ironi!c > by Alanis Moris*ette on the album Jagged Little Pill";
songs[songs.length] = "Enter Sand|man > by Metallica on the album Metallica";
songs[songs.length] = "Enjoy the Silence > by Depeche Mode on the album Violator";
songs[songs.length] = "Maneater > by Hall and Oates on the album H2O";
songs[songs.length] = "Whip It > by Devo on the album Freedom of Choice";
songs[songs.length] = "Down Under > by Men At W+ork on the album Business As Usual";
songs[songs.length] = "Pump Up the Volume > by Colourbox on the album Colourbox";
songs[songs.length] = "Beat It > by Michael Jackson on the album Thriller";
songs[songs.length] = "Addicted to Love > by Robert Palmer on the album Riptide";
songs[songs.length] = "Need You Tonight > by INXS on the album Kick";
songs[songs.length] = "Tainted Love > by So,ft Cell on the album Non-Stop Erotic Cabaret";
songs[songs.length] = "Bette Davis Eyes > by Kim Carnes on the album Mistaken Identity";
songs[songs.length] = "Hair of the Dog > by Nazareth on the album Hair of the Dog";
songs[songs.length] = "Star Star > by The Rolling Stones on the album Goats Head Soup";
songs[songs.length] = "Burning Down the House > by Talking Heads on the album Speaking in Tongues";
songs[songs.length] = "Devil in My Car > by The B-52's on the album Wild Planet";

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
  var currentStringClean = songs[i].replace(/[|;$!%@"<()+,*]/g, "");
  currentStringClean = currentStringClean.replace(/[>]/g, "-");
  songHolder.innerHTML += "<li>" + currentStringClean + "</li>";
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

addSongsToViewMusic();
showViewForm();
viewMusicLink.addEventListener("click", showViewForm);
addMusicLink.addEventListener("click", showAddForm);
addMusicButton.addEventListener("click", addSongsToArray);
