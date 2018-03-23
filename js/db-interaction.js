"use strict";

let $ = require('jquery'),
    firebase = require("./fb-config"),
    youtube = require("./youtube_key"),
    provider = new firebase.auth.GoogleAuthProvider();

function getFBDetails(user){
    return $.ajax({
        url: `${firebase.getFBsettings().databaseURL}//user.json?orderBy="uid"&equalTo="${user}"`
     }).done((resolve) => {
        return resolve;
     }).fail((error) => {
        return error;
     });
  }

function addUserFB(userObj){
    return $.ajax({
        url: `${firebase.getFBsettings().databaseURL}/user.json`,
        type: 'POST',
        data: JSON.stringify(userObj),
        dataType: 'json'
     }).done((fbID) => {
        return fbID;
     });
}

function updateUserFB(userObj){
    return $.ajax({
        url: `${firebase.getFBsettings().databaseURL}/user/${userObj.fbID}.json`,
        type: 'PUT',
        data: JSON.stringify(userObj),
        dataType: 'json'
     }).done((userID) => {
        return userID;
     });
}

function logInGoogle() {
   //all firebase functions return a promise!! Add a then when called
   return firebase.auth().signInWithPopup(provider);
}

function logOut() {
   return firebase.auth().signOut();
}

function getYouTubeData() {
    console.log("button clicked");
    var search = document.getElementById("search").value;
    return new Promise((resolve,reject) => {
    var info = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search}&type=video&key=${youtube.youtubeKey}`; 
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

    function getJoinPlaylists(){
        return $.ajax({
            url: `${firebase.getFBsettings().databaseURL}/playlists.json`
         }).done((resolve) => {
             console.log("resolve", resolve);
            return resolve;
         }).fail((error) => {
            return error;
         });
      }

    function addJoin(joinObj){
        return $.ajax({
            url: `${firebase.getFBsettings().databaseURL}/playlist_members.json`,
            type: 'POST',
            data: JSON.stringify(joinObj),
            dataType: 'json'
        }).done((joinID) => {
          console.log(joinID);
            return joinID;
        });
      }

//example with delete
// function deleteItem(fbID) {
// 	return $.ajax({
//       	url: `${firebase.getFBsettings().databaseURL}/songs/${fbID}.json`,
//       	method: "DELETE"
// 	}).done((data) => {
// 		return data;
// 	});
// }

module.exports = {
    getFBDetails,
    getYouTubeData,
    addUserFB,
    updateUserFB,
    addJoin,
    getJoinPlaylists,
    logInGoogle,
    logOut
};