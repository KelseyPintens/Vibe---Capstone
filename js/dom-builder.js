"use strict";

let $ = require("jquery"),
    db = require("./db-interaction"),
    firebase = require("./fb-config"),
    user = require("./user");

////////// Clicked Log In//////////////

var body = document.getElementById("body-container");

var clickedLogin;
function domLogin() {

clickedLogin = 
    `<nav>
    <ul class="nav">
        <li class="nav-item container-fluid">
            <a class="playlist_logo nav-link p-0 mt-3" href="home.html"><img src="images/playlistlogo.png" alt="playlist logo" class="float-right" width="45px"></a>
        </li>
    </ul>
</nav>

<h2 class="text-center mt-5">Vibe</h2>

<div class="text-center"> 

    <a href="create_playlist.html" class="btn create_playlist" id="create_playlist">Create Playlist</a> 

</div>

<div class="break">
    <div><hr class="deco"></div>
    <div id="or">OR</div>
    <div><hr class="deco"></div>
</div>

<div class="text-center"> 

    <a href="#" class="btn join_playlist" id="join_playlist">Join Playlist</a>


</div>`;
    body.innerHTML = clickedLogin;

////// Joining FB Playlist //////

document.querySelector("body").addEventListener("click", sendJoin);

function sendJoin(event){
    if (event.target.className === "join_list"){
        console.log("id", event.target.id);
        let id = event.target.id;
        let joinObj = buildJoinObj(id);
        db.addJoin(joinObj).then(
            (resolve) =>{
                var id = event.target.id; 
                // if (event.target.id === "view_playlist"  || event.target.className === "delete"){
                console.log("clicked view playlist");
                db.getPlaylistdata(resolve).then(
                (resolve)=>{ console.log(resolve);
                    var keys = Object.entries(resolve).map(e => Object.assign(e[1], { key: e[0] }));
                    console.log(keys);
                    var i=0;
                        for (i = 0; i < keys.length; i++) { 
                        if (keys[i].key == id) {
                        var body = document.getElementById("body-container"); 
                        body.innerHTML = `<nav>
                                    <ul class="nav container">
                                        <li class="nav-item">
                                            <a class="nav-link mt-3" href="#"><img src="images/back_arrow.png" alt="back arrow" width="35px"></a>
                                        </li>
                                        <li class="nav-item">
                                            <h4>${keys[i].playlistName}</h4>
                                        </li>
                                        <li class="nav-item">
                                            <a class="playlist_logo nav-link p-0 mt-3" href="home.html"><img src="images/playlistlogo.png" alt="playlist logo" width="45px"></a>
                                        </li>
                                    </ul>
                                    <div id="playerDiv"></div>
                                    <div id="playlist_songs"></div>
                            </nav>  `;
                        console.log(keys[i].playlistName);
                        }
                    } 
            
                }).then(
                    db.getVideodata(resolve).then((resolve)=>{
                        console.log(resolve);
                        var keys = Object.entries(resolve).map(e => Object.assign(e[1], { key: e[0] }));
                        console.log(keys);
                        var songs = [];
                        var i=0;
                        for (i = 0; i < keys.length; i++) { 
                        if (keys[i].playlist_uid == id) {
                        songs.push(`${keys[i].videoID}`);
                        var body = document.getElementById("playlist_songs"); 
                        body.innerHTML +=                   
                        `<div class="print_song_list">
                                <div><hr class="col deco_long" align="center"></div>
                                <div class="song_container">
                                <div><img src="${keys[i].thumbnail}" alt="song thumbnail" class="song_image"></div>
                                <div class="song_info">
                                    <h1 class="song_title">${keys[i].title}</h1>
                                    <h2 class="song_artist">${keys[i].artist}</h2>
                                    <div class="delete" id="${keys[i].key}">DELETE</div>
                                </div>
            
                                </div>
                            </div>`;
                        console.log(keys[i].title);
                        }
                    } console.log("list", songs);
                    var player = document.getElementById("playerDiv");
                    player.innerHTML = `<iframe id="player" type="text/html" class="col" align="center" width="320" height="195"
                    src="http://www.youtube.com/embed/${songs[0]}?autoplay=1"
                    frameborder="0"></iframe>`;
                    })
                );
            });
    }
}

var playlistID = $(".currentPlaylist").text();

// data builder
function buildJoinObj(input){
    console.log(playlistID);
let id = input;

let joinObj = {
    playlist_id: id,
    member_uid: user.getUser()
};
return joinObj;
}


$("#join_playlist").click(function() {
var clickedJoin;
console.log("clicked join");
clickedJoin = 
`    <nav>
<ul class="nav container">
    <li class="nav-item">
        <a class="nav-link mt-3" href="#"><img src="images/back_arrow.png" alt="back arrow" width="35px"></a>
    </li>
    <li class="nav-item">
        <h4>Join Playlist</h4>
    </li>
    <li class="nav-item">
        <a class="playlist_logo nav-link p-0 mt-3" href="home.html"><img src="images/playlistlogo.png" alt="playlist logo" width="45px"></a>
    </li>
</ul>
<div id="open_playlists"></div>

</nav>`;



db.getJoinPlaylists( ).then(
(resolve)=>{ console.log(resolve);
    var keys = Object.entries(resolve).map(e => Object.assign(e[1], { key: e[0] }));
    console.log(keys);
    var userid = user.getUser();
    var i=0;
    for (i = 0; i < keys.length; i++) {
    if (userid !== keys[i].uid) {     
    clickedJoin +=
    `<div class="print_playlists">
        <div><hr class="col deco_long" align="center"></div>
        <div class="playlist_list">
            <div class="open_playlist">${keys[i].playlistName}</div>
            <div class="join_list" id="${keys[i].key}">JOIN</div>
        </div>
        <div class="currentPlaylist" style="display: none;">${keys[i].key}</div>
    </div>`;
    body.innerHTML = clickedJoin; } }
});

});
}

////// Creating FB Playlist ///////

//data builder
function buildPlaylistObj(){
    var playlist = document.getElementById("playlist_name").value;
    // var password = document.getElementById("password").value;
    let playlistObj = {
    //   code: password,  
      playlistName: playlist,
      uid: user.getUser()
    };
    return playlistObj;
  }
  

  $("#create_playlist").click(function() {
    let playlistObj = buildPlaylistObj();
    db.addPlaylist(playlistObj).then(
        (resolve) =>{
            console.log(resolve.name);
            var body = document.getElementById("body-container"); 
            body.innerHTML = `<nav>
            <ul class="nav container">
                <li class="nav-item">
                    <a class="nav-link mt-3" href="#"><img src="images/back_arrow.png" alt="back arrow" width="35px"></a>
                </li>
                <li class="nav-item">
                    <h4>Add Songs</h4>
                </li>
                <li class="nav-item">
                    <a class="playlist_logo nav-link p-0 mt-3" href="home.html"><img src="images/playlistlogo.png" alt="playlist logo" width="45px"></a>
                </li>
            </ul>
        </nav>
    
        <div class="col" align="center">
                <input type="text" class="form_control" id="search" text-align="center" placeholder="Search Songs"><br>
        </div>
    
        <div class="text-center"> 
            <a href="#" class="btn search_songs" id="search_songs">Search</a>
        </div>
    
        <div id="song_list"></div>
    
        <nav class="fixed-bottom navbar-light bg-light">
            <div class="text-center"> 
                <a href="#" class="btn view_playlist" id="view_playlist">View Playlist</a>
            </div>
        </nav>`;
        var id = document.getElementById("hidden");
        id.innerHTML =
        `<div class="currentPlaylist" style="display: none;" id="currentPlaylist" id="${resolve.name}">${resolve.name}</div>`;         });
    });

/////// viewing playlist////////

document.querySelector("body").addEventListener("click", runPlaylist);

function runPlaylist() {
if (event.target.id === "view_playlist") {
    playlist();
} }
function playlist(event){
    // if (event.target.id === "view_playlist"  || event.target.className === "delete"){
    console.log("clicked view playlist");
    var resolve;
    db.getPlaylistdata(resolve).then(
    (resolve)=>{ console.log(resolve);
        var playlistID = $(".currentPlaylist").text();
        var keys = Object.entries(resolve).map(e => Object.assign(e[1], { key: e[0] }));
        console.log(keys);
        var i=0;
            for (i = 0; i < keys.length; i++) { 
            if (keys[i].key == playlistID) {
            var body = document.getElementById("body-container"); 
            body.innerHTML = `<nav>
                        <ul class="nav container">
                            <li class="nav-item">
                                <a class="nav-link mt-3" href="#"><img src="images/back_arrow.png" alt="back arrow" width="35px"></a>
                            </li>
                            <li class="nav-item">
                                <h4>${keys[i].playlistName}</h4>
                            </li>
                            <li class="nav-item">
                                <a class="playlist_logo nav-link p-0 mt-3" href="home.html"><img src="images/playlistlogo.png" alt="playlist logo" width="45px"></a>
                            </li>
                        </ul>
                        <div id="playerDiv"></div>
                        <div id="playlist_songs"></div>
                </nav>  `;
            console.log(keys[i].playlistName);
            }
        } 

    }).then(
        db.getVideodata(resolve).then((resolve)=>{
            console.log(resolve);
            var playlistID = $(".currentPlaylist").text();
            console.log("playlistID", playlistID);
            var keys = Object.entries(resolve).map(e => Object.assign(e[1], { key: e[0] }));
            console.log(keys);
            var songs = [];
            var i=0;
            for (i = 0; i < keys.length; i++) { 
            if (keys[i].playlist_uid == playlistID) {
            songs.push(`${keys[i].videoID}`);
            var body = document.getElementById("playlist_songs"); 
            body.innerHTML +=                   
            `<div class="print_song_list">
                    <div><hr class="col deco_long" align="center"></div>
                    <div class="song_container">
                    <div><img src="${keys[i].thumbnail}" alt="song thumbnail" class="song_image"></div>
                    <div class="song_info">
                        <h1 class="song_title">${keys[i].title}</h1>
                        <h2 class="song_artist">${keys[i].artist}</h2>
                        <div class="delete" id="${keys[i].key}">DELETE</div>
                    </div>

                    </div>
                </div>`;
            console.log(keys[i].title);
            }
        } console.log("list", songs);
        var player = document.getElementById("playerDiv");
        player.innerHTML = `<iframe id="player" type="text/html" class="col" align="center" width="320" height="195"
        src="http://www.youtube.com/embed/${songs[0]}?autoplay=1"
        frameborder="0"></iframe>`;
        // var i=0;
        // for (i = 0; i < songs.length; i++) {
        // }
        })
    );  
}

///////////// search songs///////////////////

document.querySelector("body").addEventListener("click", searchSong);
      
function searchSong(event){
    if (event.target.id === "search_songs"){
        var songList = document.getElementById("song_list");
        db.getYouTubeData().then((resolve) => {
            var songList = document.getElementById("song_list");
            var i = 0;
            var songPrintList = "";
            for (i = 0; i < resolve.items.length; i++) { 
                songPrintList += 
                    `<div class="print_song_list">
                        <div><hr class="col deco_long" align="center"></div>
                        <div class="song_container">
                            <div><img src="${resolve.items[i].snippet.thumbnails.default.url}" alt="song thumbnail" class="song_image"></div>
                            <div class="song_info">
                                <h1 class="song_title">${resolve.items[i].snippet.title}</h1>
                                <h2 class="song_artist">${resolve.items[i].snippet.channelTitle}</h2>
                            </div>
                        <div><img src="images/add_song.png" alt="add song" class="add_song_image" id="${i}"></div>
                        </div>
                    </div>`;
            } 
            songList.innerHTML = songPrintList; });
            }
}

//////////send songs to firebase///////////////
              
document.querySelector("body").addEventListener("click", sendSong);
      
    function sendSong(event){
        if (event.target.className === "add_song_image"){
            db.getYouTubeData().then((resolve) => {
            let id = event.target.id;
            let sendSongObj = buildSendSongObj(id);
            db.addSendSong(sendSongObj).then(
                (resolve) =>{
                });

// song data builder
function buildSendSongObj(input){
    let id = input;
    var playlistID = $(".currentPlaylist").text();
    let sendSongObj = {
        title: `${resolve.items[`${id}`].snippet.title}`,
        artist: `${resolve.items[`${id}`].snippet.channelTitle}`,
        thumbnail: `${resolve.items[`${id}`].snippet.thumbnails.default.url}`,
        videoID: `${resolve.items[`${id}`].id.videoId}`,
        playlist_uid: playlistID
    };
        return sendSongObj;
    } });
    }
}


//////////delete songs///////////////

$(document).on("click", ".delete", deleteSong);

function deleteSong(event){
        let songID = event.target.id;
        console.log("songID", songID);
        db.removeSong(songID).then(
            (resolve) => {
                playlist();
            },
            (reject) => {
                console.log("didn't load");
            }
        );
}

var playlistArray = [];


    //do what you need here
function populatePage() {
    setTimeout(function(){
    db.getJoinPlaylists( ).then(
    (resolve)=>{ console.log(resolve);
        var keys = Object.entries(resolve).map(e => Object.assign(e[1], { key: e[0] }));
        console.log(keys);

        var userid = user.getUser();
        var user_playlists = document.getElementById("user_playlists");
        var clickedJoin = "";
        var i=0;
        for (i = 0; i < keys.length; i++) {
        if (userid === keys[i].uid) {     
        clickedJoin +=
        `<div class="print_playlists">
            <div><hr class="col deco_long" align="center"></div>
            <div class="playlist_list">
                <div class="open_playlist">${keys[i].playlistName}</div>
                <div class="see_list" id="${keys[i].key}">VIEW</div>
            </div>
            <div class="currentPlaylist" style="display: none;">${keys[i].key}</div>
        </div>`;
        user_playlists.innerHTML = clickedJoin; } }

        db.getJoinedPlaylists().then(
        (resolve)=>{ console.log(resolve);
            var keys = Object.entries(resolve).map(e => Object.assign(e[1], { key: e[0] }));
            console.log(keys);
            var userid = user.getUser();
            var i=0;
            for (i = 0; i < keys.length; i++) {
            if (userid === keys[i].member_uid) {     
                playlistArray.push(keys[i].playlist_id);
                 } }
                console.log("playlistArray", playlistArray);
        }).then(
        db.getJoinPlaylists().then(
            (resolve)=>{ console.log(resolve);
                var keys = Object.entries(resolve).map(e => Object.assign(e[1], { key: e[0] }));
                console.log(keys);
                console.log("playlistArray2", playlistArray);
                var user_playlists = document.getElementById("joined_playlist_list");
                var clickedJoin = "";
                var i=0;
                var x=0;
                for (x = 0; x < playlistArray.length; x++) {
                    for (i = 0; i < keys.length; i++) {
                        if (playlistArray[x] === keys[i].key) {     
                        console.log("playlistName", keys[i].playlistName); 
                        clickedJoin +=
                        `<div class="print_playlists">   
                            <div><hr class="col deco_long" align="center"></div>
                            <div class="playlist_list">
                                <div class="open_playlist">${keys[i].playlistName}</div>
                                <div class="join_list" id="${keys[i].key}">VIEW</div>
                            </div>
                        </div>`;
                        user_playlists.innerHTML = clickedJoin;}}    
                }
  
            }));
    

}, 1000);        });}

if (window.location.pathname === "/home.html") {
    populatePage();
}


document.querySelector("body").addEventListener("click", runList);

function runList() {
if (event.target.className === "see_list") {
    var id = event.target.id; 
    // if (event.target.id === "view_playlist"  || event.target.className === "delete"){
    console.log("clicked view playlist");
    var resolve;
    db.getPlaylistdata(resolve).then(
    (resolve)=>{ console.log(resolve);
        var keys = Object.entries(resolve).map(e => Object.assign(e[1], { key: e[0] }));
        console.log(keys);
        var i=0;
            for (i = 0; i < keys.length; i++) { 
            if (keys[i].key == id) {
            var body = document.getElementById("body-container"); 
            body.innerHTML = `<nav>
                        <ul class="nav container">
                            <li class="nav-item">
                                <a class="nav-link mt-3" href="#"><img src="images/back_arrow.png" alt="back arrow" width="35px"></a>
                            </li>
                            <li class="nav-item">
                                <h4>${keys[i].playlistName}</h4>
                            </li>
                            <li class="nav-item">
                                <a class="playlist_logo nav-link p-0 mt-3" href="home.html"><img src="images/playlistlogo.png" alt="playlist logo" width="45px"></a>
                            </li>
                        </ul>
                        <div id="playerDiv"></div>
                        <div id="playlist_songs"></div>
                </nav>  `;
            console.log(keys[i].playlistName);
            }
        } 

    }).then(
        db.getVideodata(resolve).then((resolve)=>{
            console.log(resolve);
            var keys = Object.entries(resolve).map(e => Object.assign(e[1], { key: e[0] }));
            console.log(keys);
            var songs = [];
            var i=0;
            for (i = 0; i < keys.length; i++) { 
            if (keys[i].playlist_uid == id) {
            songs.push(`${keys[i].videoID}`);
            var body = document.getElementById("playlist_songs"); 
            body.innerHTML +=                   
            `<div class="print_song_list">
                    <div><hr class="col deco_long" align="center"></div>
                    <div class="song_container">
                    <div><img src="${keys[i].thumbnail}" alt="song thumbnail" class="song_image"></div>
                    <div class="song_info">
                        <h1 class="song_title">${keys[i].title}</h1>
                        <h2 class="song_artist">${keys[i].artist}</h2>
                        <div class="delete" id="${keys[i].key}">DELETE</div>
                    </div>

                    </div>
                </div>`;
            console.log(keys[i].title);
            }
        } console.log("list", songs);
        var player = document.getElementById("playerDiv");
        player.innerHTML = `<iframe id="player" type="text/html" class="col" align="center" width="320" height="195"
        src="http://www.youtube.com/embed/${songs[0]}?autoplay=1"
        frameborder="0"></iframe>`;
        })
    );  
}

} 

$(".toggle_new_playlist").click(function() {
    domLogin();
});

//////////// log in /////////////////

$("#log_in").click(function() {
    domLogin();
});




