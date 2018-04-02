"use strict";

console.log("test");

let $ = require('jquery'),
    db = require("./db-interaction"),
    templates = require("./dom-builder"),
    user = require("./user");

$("#log_in").click(function() {
  console.log("clicked login");
  user.logInGoogle()
  .then((result) => {
    console.log("result from login", result.user.uid);
    user.setUser(result.user.uid);
    user.checkUserFB(result.user.uid);
  });
});


document.querySelector("body").addEventListener("click", logOut);

function logOut() {
if (event.target.id === "logout") {
  db.logOut();
  location.href = "index.html";
} }

