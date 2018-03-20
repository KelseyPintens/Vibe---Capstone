"use strict";

let $ = require('jquery');
let youtubeKey = require('./youtube_key');

$("#search_songs").click(function() {
    console.log("click");
      getYouTubeData().then((resolve) => {
        console.log(resolve.items);
});
});

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


      module.exports = {
        getYouTubeData
    };
    
