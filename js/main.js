"use strict";

console.log("test");


let $ = require('jquery'),
    db = require("./db-interaction"),
    templates = require("./dom-builder"),
    user = require("./user");



        
        


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
