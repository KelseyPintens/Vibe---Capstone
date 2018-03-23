"use strict";

console.log("test");


let $ = require('jquery'),
    db = require("./db-interaction"),
    templates = require("./dom-builder"),
    user = require("./user"),
    dom = require("./dom-builder");

    document.querySelector("body").addEventListener("click", sendJoin);
      
        function sendJoin(event){
            if (event.target.className === "open_playlist"){
                console.log("id", event.target.id);
                let id = event.target.id;
                let joinObj = buildJoinObj(id);
                db.addJoin(joinObj).then(
                    (resolve) =>{
                        console.log("yay");
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

// $("#logout").addClass("is-hidden");
// $("#zip-container").addClass("is-hidden");

//***************************************************************
$("#log_in").click(function() {
  console.log("clicked login");
  user.logInGoogle()
  .then((result) => {
    console.log("result from login", result.user.uid);
    user.setUser(result.user.uid);
    $("#login").addClass("is-hidden");
    $("#logout").removeClass("is-hidden");
    user.checkUserFB(result.user.uid);
  });
});

// $("#logout").click(() => {
//     console.log("main.logout clicked");
//     db.logOut();
//     $("#login").removeClass("is-hidden");
//     $("#logout").addClass("is-hidden");
// });

