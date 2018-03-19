"use strict";

let FBkeys = require("./fb-key"),
    FBconfig = require("./fb-config"),
    user = require("./user"),
    db = require("./db-interaction");

let buildUserObj = (displayName) => {
    let userObj = {
        Name:displayName,
        uid: user.getUser()
    };
    return userObj;
};


function addUser(userObj) {
	return $.ajax({
      url: `${FBconfig.getFBsettings().databaseURL}/users.json`,
      type: 'POST',
      data: JSON.stringify(userObj),
      dataType: 'json'
   }).done((userID) => {
      return userID;
   });
}



module.exports = {buildUserObj, addUser};