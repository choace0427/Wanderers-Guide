/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let socket = io();

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    socket.emit("requestAdminHeritageDetails");

});

socket.on("returnAdminHeritageDetails", function(heritageArray, ancestryArray){

    for(let ancestry of ancestryArray){
        if(ancestry.isArchived == 0){
            $('#inputHeritageFor').append('<option value="'+ancestry.name+'">'+ancestry.name+'</option>');
        }
    }

    $("#createButton").click(function(){
        $(this).unbind();
        finishHeritage(false);
    });

});

function finishHeritage(isUpdate){

    let name = $("#inputName").val();
    let rarity = $("#inputRarity").val();
    let description = $("#inputDesc").val();
    let code = $("#inputCode").val();
    let indivAncestryName = $("#inputHeritageFor").val();
    let contentSrc = $("#inputContentSource").val();
    
    let requestPacket = null;
    let heritageID = null;
    if(isUpdate){
        requestPacket = "requestAdminUpdateHeritage";
        heritageID = getHeritageEditorIDFromURL();
    } else {
        requestPacket = "requestAdminAddHeritage";
    }
    
    socket.emit(requestPacket,{
        heritageID,
        name: name+' '+indivAncestryName,
        rarity,
        description,
        code,
        indivAncestryName,
        contentSrc
    });

}

socket.on("returnAdminCompleteHeritage", function() {
    window.location.href = '/admin/manage/heritage';
});