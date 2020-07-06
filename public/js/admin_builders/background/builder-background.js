
let socket = io();

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    $("#createButton").click(function(){
        $(this).unbind();
        finishBackground(false);
    });

});

function finishBackground(isUpdate){

    let backgroundName = $("#inputName").val();
    let backgroundVersion = $("#inputVersion").val();
    let backgroundDescription = $("#inputDescription").val();
    let backgroundBoostsArray = $("#inputBoosts").val();
    let backgroundCode = $("#inputCode").val();
    let backgroundContentSrc = $("#inputContentSource").val();
    
    let backgroundBoosts = '';
    for(let backgroundBoost of backgroundBoostsArray) {
        backgroundBoosts += backgroundBoost+',';
    }
    backgroundBoosts = backgroundBoosts.slice(0, -1); // Trim off that last ','

    let requestPacket = null;
    let backgroundID = null;
    if(isUpdate){
        requestPacket = "requestAdminUpdateBackground";
        backgroundID = getBackgroundEditorIDFromURL();
    } else {
        requestPacket = "requestAdminAddBackground";
    }

    socket.emit(requestPacket,{
        backgroundID,
        backgroundName,
        backgroundVersion,
        backgroundDescription,
        backgroundBoosts,
        backgroundCode,
        backgroundContentSrc
    });

}

socket.on("returnAdminCompleteBackground", function() {
    window.location.href = '/admin/manage/background';
});