"use strict";
//install firebase into lib folder npm install firebase --save
let firebase = require("./fb-config"),
   db = require("./db-interaction"),
   $ = require("jquery");

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

// function getUserWeather(userObj) {
//    //either get weather from user obj or make call to weather
//    //make API Call
//    console.log("getUserWeather: userObj", getUserObj());
//    if (userObj.weatherTime != null) {
//       if (helper.compareDateHelper(getUserObj().weatherTime, new Date())) {
//          console.log("user.getUserWeather: compare true");
//          console.log("user.getUserWeather: use weather in obj");
//          showUser(userObj);
//       } else {
//          console.log("user.getUserWeather: compare false", userObj.zipCode);
//          getUpdateWeather(userObj.zipCode);
//       }
//    } else {
//       console.log("user.getUserWeather: no weather, go get some", userObj.zipCode);
//       getUpdateWeather(userObj.zipCode);
//    }
// }

// function getUpdateWeather(zip) {
//    //get weather
//    weather.getWeatherByZip(zip)
//       .then((weather) => {
//          let userObj = {
//             weatherTime: new Date(),
//             weather: weather.main.temp
//          };
//          return setUserVars(userObj);
//       }).then((userObj) => {
//          db.updateUserFB(userObj)
//             .then(() => {
//                showUser(userObj);
//             });
//       });
// }


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
            console.log("resolved");
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