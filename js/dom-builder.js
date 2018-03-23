"use strict";

let $ = require("jquery"),
db = require("./db-interaction");
let firebase = require("./fb-config"),
    user = require("./user");

////////// Clicked Log In//////////////

var body = document.getElementById("body-container");

var clickedLogin;
function domLogin() {

clickedLogin = 
    `<nav>
    <ul class="nav">
        <li class="nav-item container-fluid">
            <a class="nav-link p-0 mt-3" href="#"><img src="images/playlistlogo.png" alt="playlist logo" class="float-right" width="45px"></a>
        </li>
    </ul>
</nav>

<h2 class="text-center mt-5">Vibe</h2>

<div class="text-center"> 

    <a href="create_playlist.html" class="btn create_playlist" id="create_playlist">Create Playlist</a> 

</div>

<div class="break">
    <div><hr class="deco"></div>
    <div id="or">OR</div>
    <div><hr class="deco"></div>
</div>

<div class="text-center"> 

    <a href="#" class="btn join_playlist" id="join_playlist">Join Playlist</a>


</div>`;
    body.innerHTML = clickedLogin;

     ////// Joining FB Playlist //////


  $("#join_playlist").click(function() {
      var clickedJoin;
      console.log("clicked join");
      clickedJoin = 
      `    <nav>
      <ul class="nav container">
          <li class="nav-item">
              <a class="nav-link mt-3" href="#"><img src="images/back_arrow.png" alt="back arrow" width="35px"></a>
          </li>
          <li class="nav-item">
              <h4>Join Playlist</h4>
          </li>
          <li class="nav-item">
              <a class="nav-link p-0 mt-3" href="#"><img src="images/playlistlogo.png" alt="playlist logo" width="45px"></a>
          </li>
      </ul>
      <div id="open_playlists"></div>
      
      </nav>`;
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
    getJoinPlaylists( ).then(
        (resolve)=>{ console.log(resolve);
            var keys = Object.entries(resolve).map(e => Object.assign(e[1], { key: e[0] }));
            console.log(keys);
            var i=0;
            for (i = 0; i < keys.length; i++) { 



            clickedJoin +=
            `<div class="open_playlist" id="${keys[i].key}">${keys[i].playlistName}
            </div>`
;
            body.innerHTML = clickedJoin; }
        });

        document.querySelector("body").addEventListener("click", sendJoin);
      
        function sendJoin(event){
            if (event.target.className === "open_playlist"){
                console.log("id", event.target.id);
                let id = event.target.id;
                let joinObj = buildJoinObj(id);
                addJoin(joinObj).then(
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
        
        //data poster
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
    
  
});
}




// function that will render the '#body-container' with the reservation form
$("#log_in").click(function() {

    domLogin();
});


