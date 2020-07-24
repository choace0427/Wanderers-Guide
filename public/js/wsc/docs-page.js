/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

$(function () {

    $(".text-processing").each(function(){
        $(this).html(processText($(this).text(), false));
    });
    
    updateHideables();

    $(window).on('hashchange', function(e){
        updateHideables();
    });

});

function updateHideables(){
    $('.isHideable').each(function(){
        $(this).addClass('is-hidden');
    });
    if(window.location.hash != ''){
        $(window.location.hash).removeClass('is-hidden');
        $(window.location.hash+'>div.is-hidden').removeClass("is-hidden");
    }
}