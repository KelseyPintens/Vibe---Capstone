"use strict";

let FBkeys = require("./fb-key"),
    FBconfig = require("./fb-config"),
    user = require("./user"),
    DOM = require("./DOM-builder"),
    db = require("./db-interaction"),
    $ = require("jquery");


$("#log_in").click(function() {
    console.log("clicked auth");
    user.logInGoogle()
    .then((userData) => {
        console.log(userData);
        db.addUser(db.buildUserObj(userData.user.displayName));
    });
});
