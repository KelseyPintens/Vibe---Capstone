"use strict";

let $ = require('jquery');
let youtubeKey = require('./youtube_key'),
    firebase = require("./fb-config");


function getYouTubeData() {
    console.log("button clicked");
    var search = document.getElementById("search").value;
    return new Promise((resolve,reject) => {
    var info = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search}&type=video&key=AIzaSyBBxuBPBuPj38toMJ_ZLRQqLpNQuIVmeRc`; 
    console.log(info);
    var youtubeData = new XMLHttpRequest();
      
      youtubeData.addEventListener('load', function(){
        var youtube = JSON.parse(this.responseText);
        resolve(youtube);
      });
      youtubeData.addEventListener('error', function(){
        reject();
      });
      youtubeData.open("GET", info);
      youtubeData.send();
    });
    }

//     $("#search_songs").click(function() {
//       console.log("click");
//         getYouTubeData().then((resolve) => {
//           console.log(resolve.items);
//           var songList = document.getElementById("song_list");
//           var i = 0;
//           songList.innerHTML = "";
  
//           for (i = 0; i < resolve.items.length; i++) { 
//             songList.innerHTML += 
//             `<div class="print_song_list">
//               <div><hr class="col deco_long" align="center"></div>
//               <div class="song_container">
//                 <div><img src="${resolve.items[i].snippet.thumbnails.default.url}" alt="song thumbnail" class="song_image"></div>
//                 <div class="song_info">
//                   <h1 class="song_title">${resolve.items[i].snippet.title}</h1>
//                   <h2 class="song_artist">${resolve.items[i].snippet.channelTitle}</h2>
//                 </div>
//                 <div><img src="images/add_song.png" alt="add song" class="add_song_image" id="${i}"></div>
//               </div>
//             </div>`;
                    
//         }  
        
//         document.querySelector("body").addEventListener("click", sendSong);

// //clicked build data
// function sendSong(event){
//     if (event.target.className === "add_song_image"){
//         console.log("id", event.target.id);
//         let id = event.target.id;
//         let sendSongObj = buildSendSongObj(id);
//         addSendSong(sendSongObj).then(
//             (resolve) =>{
//                 console.log("yay");
//             });
//     }
// }

// // data builder
// function buildSendSongObj(input){
//   let id = input;
//   let playlistID = document.getElementsByClassName("currentPlaylist");
//   let sendSongObj = {
//       title: `${resolve.items[`${id}`].snippet.title}`,
//       artist: `${resolve.items[`${id}`].snippet.channelTitle}`,
//       thumbnail: `${resolve.items[`${id}`].snippet.thumbnails.default.url}`,
//       videoID: `${resolve.items[`${id}`].id.videoId}`,
//       playlist_uid: playlistID
//   };
//   return sendSongObj;
// }

// //data poster
// function addSendSong(sendSongObj){
//   return $.ajax({
//       url: `${firebase.getFBsettings().databaseURL}/songs.json`,
//       type: 'POST',
//       data: JSON.stringify(sendSongObj),
//       dataType: 'json'
//   }).done((sendSongID) => {
//     console.log(sendSongID);
//       return sendSongID;
//   });
// }

//   });
//   });





  


      module.exports = {
        getYouTubeData
    };
    
