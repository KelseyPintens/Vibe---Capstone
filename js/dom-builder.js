"use strict";

let $ = require('jquery');
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

<a href="create_playlist.html">click</a>

<div class="text-center"> 
        <button class="btn create_playlist">Create Playlist</button> 
</div>

<div class="break">
    <div><hr class="deco"></div>
    <div id="or">OR</div>
    <div><hr class="deco"></div>
</div>

<div class="text-center"> 
        <button class="btn join_playlist">Join Playlist</button> 
</div>`;
    body.innerHTML = clickedLogin;
}


// function that will render the '#body-container' with the reservation form
$("#log_in").click(function() {
    console.log("load the DOM with a reservation - function (renderReservationForm)");
    domLogin();
});

// module.exports = {callRestaurants};