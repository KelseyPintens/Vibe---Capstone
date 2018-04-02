"use strict";
//install firebase into lib folder npm install firebase --save
let firebase = require("./fb-config"),
   db = require("./db-interaction"),
   $ = require("jquery"),
   provider = new firebase.auth.GoogleAuthProvider();

let currentUser = {
     uid: null,
    };

    function logInGoogle() {
        //all firebase functions return a promise!! Add a then when called
        return firebase.auth().signInWithPopup(provider);
     }
     
     function logOut() {
        return firebase.auth().signOut();
     }

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
    console.log("current user", currentUser.uid);
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
        }
    });
}


function makeUserObj(uid){
   let userObj = {
      uid: uid
   };
   return userObj;
}


module.exports = {
   checkUserFB,
   getUser,
   setUser,
   setUserVars,
   getUserObj,
   logInGoogle,
   logOut,
   showUser
};