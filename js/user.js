"use strict";
//install firebase into lib folder npm install firebase --save
let firebase = require("./fb-config"),
   db = require("./db-interaction"),
   $ = require("jquery"),
   youtube = require("./youtube_api");

let currentUser = {
     uid: null,
    };

// call logout when page loads to avoid currentUser.uid
// db.logOut();
//listen for changed state
firebase.auth().onAuthStateChanged((user) => {
	console.log("onAuthStateChanged", user);
	if (user){
		currentUser.uid = user.uid;
      console.log("current user Logged in?", currentUser);
	}else {
      currentUser.uid = null;
      console.log("current user NOT logged in:", currentUser);
	}
});


function getUser(){
    console.log("current user", currentUser);
	return currentUser.uid;
}

function setUser(val){
	currentUser.uid = val;
}

function getUserObj(){
    return currentUser;
}

function setUserVars(obj){
    console.log("user.setUserVars: obj", obj);
    return new Promise((resolve, reject) => {
        currentUser.uid = obj.uid ? obj.uid : currentUser.uid;
        resolve(currentUser);
    });
}

function showUser(obj) {
   let userDetails = getUserObj();
   console.log("user.showUser: userDetails:", userDetails);
}

function checkUserFB(uid){
    console.log("db",db);
    db.getFBDetails(uid)
    .then((result) => {
        let data = Object.values(result);
        console.log("user: any data?", data.length);
        if (data.length === 0){
            console.log("need to add this user to FB" , data);
           db.addUserFB(makeUserObj(uid))
            .then((result) => {
               console.log("user: user added", uid, result.name);
               let tmpUser = {
                  fbID: result.name,
                  uid: uid
               };
               return tmpUser;
            }).then((tmpUser) => {
                  return setUserVars(tmpUser);
            });
            // .then((userObj) => {
            //    getUserWeather(userObj);
            // });
        }
        // else{
        //     console.log("user: already a user", data);
        //     var key = Object.keys(result);
        //     data[0].fbID = key[0];
        //     setUserVars(data[0])
        //        .then((resolve) => {
        //           getUserWeather(resolve);
        //        });
        // }
      //only show once a user is logged in
       $("#zip-container").removeClass("is-hidden");
    });
}


function makeUserObj(uid){
   let userObj = {
      uid: uid
   };
   return userObj;
}

////// Creating FB Playlist ///////

//data builder
function buildPlaylistObj(data){
    var playlist = document.getElementById("playlist_name").value;
    var password = document.getElementById("password").value;
    let playlistObj = {
      code: password,  
      playlistName: playlist,
      uid: getUser()
    };
    return playlistObj;
  }
  
  //data poster
  function addPlaylist(playlistObj){
    return $.ajax({
        url: `${firebase.getFBsettings().databaseURL}/playlists.json`,
        type: 'POST',
        data: JSON.stringify(playlistObj),
        dataType: 'json'
    }).done((playlistID) => {
        return playlistID;
    });
  }


  $("#create_playlist").click(function() {
    let playlistObj = buildPlaylistObj();
    addPlaylist(playlistObj).then(
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
                    <a class="nav-link p-0 mt-3" href="#"><img src="images/playlistlogo.png" alt="playlist logo" width="45px"></a>
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
        `<div class="currentPlaylist" style="display: none;" id="currentPlaylist" id="${resolve.name}">${resolve.name}</div>`; 

                /////// viewing playlist////////

                $("#view_playlist").click(function() {
                    function getPlaylistdata(){
                        return $.ajax({
                            url: `${firebase.getFBsettings().databaseURL}/playlists.json`
                         }).done((resolve) => {
                            return resolve;
                         }).fail((error) => {
                            return error;
                         });
                      }
                      function getVideodata(){
                        return $.ajax({
                            url: `${firebase.getFBsettings().databaseURL}/songs.json`
                         }).done((resolve) => {
                            return resolve;
                         }).fail((error) => {
                            return error;
                         });
                      }
                    console.log("clicked view playlist");
                    getPlaylistdata(resolve).then(
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
                                             <a class="nav-link p-0 mt-3" href="#"><img src="images/playlistlogo.png" alt="playlist logo" width="45px"></a>
                                         </li>
                                     </ul>
                                     <div id="player"></div>
                                     <div id="playlist_songs"></div>
                                </nav>
                                <script src="https://www.youtube.com/iframe_api"></script>    `;
                            console.log(keys[i].playlistName);
                            }
                        } 
            
                    }).then(
                        getVideodata(resolve).then((resolve)=>{
                            console.log(resolve);
                            var playlistID = $(".currentPlaylist").text();
                            console.log("playlistID", playlistID);
                            var keys = Object.entries(resolve).map(e => Object.assign(e[1], { key: e[0] }));
                            console.log(keys);
                            var i=0;
                            for (i = 0; i < keys.length; i++) { 
                            if (keys[i].playlist_uid == playlistID) {
                            var body = document.getElementById("playlist_songs"); 
                            body.innerHTML +=                   
                            `<div class="print_song_list">
                            <div id="player"></div>
                                    <div><hr class="col deco_long" align="center"></div>
                                    <div class="song_container">
                                    <div><img src="${keys[i].thumbnail}" alt="song thumbnail" class="song_image"></div>
                                    <div class="song_info">
                                        <h1 class="song_title">${keys[i].title}</h1>
                                        <h2 class="song_artist">${keys[i].artist}</h2>
                                    </div>
                                    <div><img src="images/add_song.png" alt="add song" class="add_song_image" id="${i}"></div>
                                    </div>
                                </div>`;
                            console.log(keys[i].title);
                            }
                        } 
                        })
                    );  
                });

        //////// search songs//////////////

        $("#search_songs").click(function() {
            console.log("click");
              youtube.getYouTubeData().then((resolve) => {
                  console.log(resolve);
                console.log(resolve.items);
                var songList = document.getElementById("song_list");
                var i = 0;
                songList.innerHTML = "";
        
                for (i = 0; i < resolve.items.length; i++) { 
                  songList.innerHTML += 
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

            //////////send songs to firebase///////////////
              
    document.querySelector("body").addEventListener("click", sendSong);
      
      function sendSong(event){
          if (event.target.className === "add_song_image"){
              console.log("id", event.target.id);
              let id = event.target.id;
              let sendSongObj = buildSendSongObj(id);
              addSendSong(sendSongObj).then(
                  (resolve) =>{
                      console.log("yay");
                  });
          }
      }
      
      var playlistID = $(".currentPlaylist").text();

      // data builder
      function buildSendSongObj(input){
          console.log(playlistID);
        let id = input;

        let sendSongObj = {
            title: `${resolve.items[`${id}`].snippet.title}`,
            artist: `${resolve.items[`${id}`].snippet.channelTitle}`,
            thumbnail: `${resolve.items[`${id}`].snippet.thumbnails.default.url}`,
            videoID: `${resolve.items[`${id}`].id.videoId}`,
            playlist_uid: playlistID
        };
        return sendSongObj;
      }
      
      //data poster
      function addSendSong(sendSongObj){
        return $.ajax({
            url: `${firebase.getFBsettings().databaseURL}/songs.json`,
            type: 'POST',
            data: JSON.stringify(sendSongObj),
            dataType: 'json'
        }).done((sendSongID) => {
          console.log(sendSongID);
            return sendSongID;
        });
      }
      
        });
        });
    
    });
  });


  ////// Joining FB Playlist ///////

//data builder
function buildPlaylistObj(data){
    var playlist = document.getElementById("playlist_name").value;
    var password = document.getElementById("password").value;
    let playlistObj = {
      code: password,  
      playlistName: playlist,
      uid: getUser()
    };
    return playlistObj;
  }
  
  //data poster
  function addPlaylist(playlistObj){
    return $.ajax({
        url: `${firebase.getFBsettings().databaseURL}/playlists.json`,
        type: 'POST',
        data: JSON.stringify(playlistObj),
        dataType: 'json'
    }).done((playlistID) => {
        return playlistID;
    });
  }


  $("#join_playlist").click(function() {
    let playlistObj = buildPlaylistObj();
    addPlaylist(playlistObj).then(
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
                    <a class="nav-link p-0 mt-3" href="#"><img src="images/playlistlogo.png" alt="playlist logo" width="45px"></a>
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
        `<div class="currentPlaylist" style="display: none;" id="currentPlaylist" id="${resolve.name}">${resolve.name}</div>`; 

                /////// viewing playlist////////

                $("#view_playlist").click(function() {
                    function getPlaylistdata(){
                        return $.ajax({
                            url: `${firebase.getFBsettings().databaseURL}/playlists.json`
                         }).done((resolve) => {
                            return resolve;
                         }).fail((error) => {
                            return error;
                         });
                      }
                      function getVideodata(){
                        return $.ajax({
                            url: `${firebase.getFBsettings().databaseURL}/songs.json`
                         }).done((resolve) => {
                            return resolve;
                         }).fail((error) => {
                            return error;
                         });
                      }
                    console.log("clicked view playlist");
                    getPlaylistdata(resolve).then(
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
                                             <a class="nav-link p-0 mt-3" href="#"><img src="images/playlistlogo.png" alt="playlist logo" width="45px"></a>
                                         </li>
                                     </ul>
                                     <div id="player"></div>
                                     <div id="playlist_songs"></div>
                                </nav>
                                <script src="https://www.youtube.com/iframe_api"></script>    `;
                            console.log(keys[i].playlistName);
                            }
                        } 
            
                    }).then(
                        getVideodata(resolve).then((resolve)=>{
                            console.log(resolve);
                            var playlistID = $(".currentPlaylist").text();
                            console.log("playlistID", playlistID);
                            var keys = Object.entries(resolve).map(e => Object.assign(e[1], { key: e[0] }));
                            console.log(keys);
                            var i=0;
                            for (i = 0; i < keys.length; i++) { 
                            if (keys[i].playlist_uid == playlistID) {
                            var body = document.getElementById("playlist_songs"); 
                            body.innerHTML +=                   
                            `<div class="print_song_list">
                                    <div><hr class="col deco_long" align="center"></div>
                                    <div class="song_container">
                                    <div><img src="${keys[i].thumbnail}" alt="song thumbnail" class="song_image"></div>
                                    <div class="song_info">
                                        <h1 class="song_title">${keys[i].title}</h1>
                                        <h2 class="song_artist">${keys[i].artist}</h2>
                                    </div>
                                    <div><img src="images/add_song.png" alt="add song" class="add_song_image" id="${i}"></div>
                                    </div>
                                </div>`;
                            console.log(keys[i].title);
                            }
                        } 
                        })
                    );  
                });

        //////// search songs//////////////

        $("#search_songs").click(function() {
            console.log("click");
              youtube.getYouTubeData().then((resolve) => {
                  console.log(resolve);
                console.log(resolve.items);
                var songList = document.getElementById("song_list");
                var i = 0;
                songList.innerHTML = "";
        
                for (i = 0; i < resolve.items.length; i++) { 
                  songList.innerHTML += 
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

            //////////send songs to firebase///////////////
              
    document.querySelector("body").addEventListener("click", sendSong);
      
      function sendSong(event){
          if (event.target.className === "add_song_image"){
              console.log("id", event.target.id);
              let id = event.target.id;
              let sendSongObj = buildSendSongObj(id);
              addSendSong(sendSongObj).then(
                  (resolve) =>{
                      console.log("yay");
                  });
          }
      }
      
      var playlistID = $(".currentPlaylist").text();

      // data builder
      function buildSendSongObj(input){
          console.log(playlistID);
        let id = input;

        let sendSongObj = {
            title: `${resolve.items[`${id}`].snippet.title}`,
            artist: `${resolve.items[`${id}`].snippet.channelTitle}`,
            thumbnail: `${resolve.items[`${id}`].snippet.thumbnails.default.url}`,
            videoID: `${resolve.items[`${id}`].id.videoId}`,
            playlist_uid: playlistID
        };
        return sendSongObj;
      }
      
      //data poster
      function addSendSong(sendSongObj){
        return $.ajax({
            url: `${firebase.getFBsettings().databaseURL}/songs.json`,
            type: 'POST',
            data: JSON.stringify(sendSongObj),
            dataType: 'json'
        }).done((sendSongID) => {
          console.log(sendSongID);
            return sendSongID;
        });
      }
      
        });
        });
    
    });
  });


module.exports = {
   checkUserFB,
   buildPlaylistObj,
   addPlaylist,
   getUser,
   setUser,
   setUserVars,
   getUserObj,
   showUser
};