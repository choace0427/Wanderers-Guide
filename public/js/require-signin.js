/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

$(function () {
  setInterval(() => {

    if(typeof socket === 'undefined'){
      socket = io();
    }

    socket.on("userNotLoggedIn", function(){
      // Hardcoded redirect
      window.location.href = '/auth/login';
    });

  }, 100);
});