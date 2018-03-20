"use strict";
// This module has no knowledge of the DOM, or where the data goes after it is fetched from Firebase.
// It is only concerned with getting and setting data in the db

let $ = require('jquery'),
    firebase = require("./fb-config"),
    // users = require("./user"),
    provider = new firebase.auth.GoogleAuthProvider();

// ****************************************
// DB interaction using Firebase REST API
// ****************************************

// POST - Submits data to be processed to a specified resource.
// GET - Requests/read data from a specified resource
// PUT - Update data to a specified resource.

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
//example with delete
// function deleteItem(fbID) {
// 	return $.ajax({
//       	url: `${firebase.getFBsettings().databaseURL}/songs/${fbID}.json`,
//       	method: "DELETE"
// 	}).done((data) => {
// 		return data;
// 	});
// }

////// Creating FB Playlist ///////

//data builder
function buildPlaylistObj(data){
    var playlist = document.getElementById("playlist_name").value;
    var password = document.getElementById("password").value;
    let playlistObj = {
      code: password,  
      playlistName: playlist,
    //   uid: users.getUser()
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
            console.log("resolved");
    });
  });

module.exports = {
    buildPlaylistObj,
    addPlaylist,
    getFBDetails,
    addUserFB,
    updateUserFB,
    logInGoogle,
    logOut
};