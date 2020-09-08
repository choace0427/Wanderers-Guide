/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let socket = io();

// ~~~~~~~~~~~~~~ // Run on Load // ~~~~~~~~~~~~~~ //
$(function () {

    // ~ Content Sources ~ //
    for(let contSrcData of g_contentSources){
      if(g_currentContentSource === contSrcData.CodeName){
        $("#inputContentSource").append('<option value="'+contSrcData.CodeName+'" selected>'+contSrcData.TextName+'</option>');
      } else {
        $("#inputContentSource").append('<option value="'+contSrcData.CodeName+'">'+contSrcData.TextName+'</option>');
      }
    }
    // ~ ~~~~~~~~~~~~~~~ ~ //

    $("#inputLangs").chosen();
    $("#inputBonusLangs").chosen();
    
    let heritageCount = 0;
    $("#addHeritageButton").click(function(){
        heritageCount++;

        let heritageID = "heritage"+heritageCount;

        let newHeritage = $("#heritageLayout").clone();
        newHeritage.attr('id', heritageID);
        newHeritage.removeClass('is-hidden');
        newHeritage.appendTo("#heritageContent");

        let cardHeader = $("#"+heritageID).find(".card-header");
        let cardContent = $("#"+heritageID).find(".card-content");

        cardHeader.click(function(){
            if(cardContent.is(":visible")) {
                cardContent.addClass('is-hidden');
            } else {
                cardContent.removeClass('is-hidden');
            }
        });

        let cardHeaderIcon = $("#"+heritageID).find(".card-header-icon");
        cardHeaderIcon.click(function(){
            $("#"+heritageID).remove();
        });

        let inputHeritageName = $("#"+heritageID).find(".inputHeritageName");
        inputHeritageName.change(function(){
            $("#"+heritageID).find(".card-header-title").html('Heritage - '+inputHeritageName.val());
        });

    });


    let featCount = 0;
    $("#addFeatButton").click(function(){
        featCount++;

        let featID = "feat"+featCount;

        let newFeat = $("#featLayout").clone();
        newFeat.attr('id', featID);
        newFeat.removeClass('is-hidden');
        newFeat.appendTo("#featContent");

        let cardHeader = $("#"+featID).find(".card-header");
        let cardContent = $("#"+featID).find(".card-content");

        cardHeader.click(function(){
            if(cardContent.is(":visible")) {
                cardContent.addClass('is-hidden');
            } else {
                cardContent.removeClass('is-hidden');
            }
        });

        let cardHeaderIcon = $("#"+featID).find(".card-header-icon");
        cardHeaderIcon.click(function(){
            $("#"+featID).remove();
        });

        let inputFeatName = $("#"+featID).find(".inputFeatName");
        inputFeatName.change(function(){
            $("#"+featID).find(".card-header-title").html('Ancestry Feat - '+inputFeatName.val());
        });

        $("#"+featID).find(".inputFeatTags").chosen();

    });


    $("#createAncestryButton").click(function(){
        $(this).unbind();
        finishAncestry(false);
    });

});

function finishAncestry(isUpdate){

    let ancestryName = $("#inputName").val();
    let ancestryVersion = $("#inputVersion").val();
    let ancestryRarity = $("#inputRarity").val();
    let ancestryHitPoints = $("#inputHitPoints").val();
    let ancestrySize = $("#inputSize").val();
    let ancestrySpeed = $("#inputSpeed").val();
    let ancestryVisionSenseID = $("#inputVisionSense").val();
    let ancestryAdditionalSenseID = $("#inputAdditionalSense").val();
    let ancestryPhysicalFeatureOneID = $("#inputPhysicalFeatureOne").val();
    let ancestryPhysicalFeatureTwoID = $("#inputPhysicalFeatureTwo").val();
    let ancestryDescription = $("#inputDescription").val();
    let ancestryBoostsArray = $("#inputBoosts").val();
    let ancestryFlawsArray = $("#inputFlaws").val();
    let ancestryLangsArray = $("#inputLangs").val();
    let ancestryBonusLangsArray = $("#inputBonusLangs").val();
    let ancestryContentSrc = $("#inputContentSource").val();

    let ancestryHeritagesArray = [];
    $(".ancestryHeritage").each(function(){
        if($(this).is(":visible")) {
            let heritageName = $(this).find(".inputHeritageName").val();
            let heritageDesc = $(this).find(".inputHeritageDesc").val();
            let heritageCode = $(this).find(".inputHeritageCode").val();
            ancestryHeritagesArray.push({
                name: heritageName,
                description: heritageDesc,
                code: heritageCode
            });
        }
    });

    let ancestryFeatsArray = [];
    $(".ancestryFeat").each(function(){
        if($(this).is(":visible")) {
            let featName = $(this).find(".inputFeatName").val();
            let featLevel = $(this).find(".inputFeatLevel").val();
            let featActions = $(this).find(".inputFeatActions").val();
            let featRarity = $(this).find(".inputFeatRarity").val();
            let featTagsArray = $(this).find(".inputFeatTags").val();
            let featPrereq = $(this).find(".inputFeatPrereq").val();
            let featReq = $(this).find(".inputFeatReq").val();
            let featFreq = $(this).find(".inputFeatFreq").val();
            let featCost = $(this).find(".inputFeatCost").val();
            let featTrigger = $(this).find(".inputFeatTrigger").val();
            let featDesc = $(this).find(".inputFeatDesc").val();
            let featSpecial = $(this).find(".inputFeatSpecial").val();
            let featSelectMultiple = ($(this).find(".inputFeatSelectMultiple:checked").val() == '1') ? 1 : 0;
            let featCode = $(this).find(".inputFeatCode").val();
            ancestryFeatsArray.push({
                name: featName,
                actions: featActions,
                level: featLevel,
                rarity: featRarity,
                prerequisites: featPrereq,
                frequency: featFreq,
                cost: featCost,
                trigger: featTrigger,
                requirements: featReq,
                description: featDesc,
                special: featSpecial,
                canSelectMultiple: featSelectMultiple,
                code: featCode,
                featTagsArray
            });
        }
    });
    
    let requestPacket = null;
    let ancestryID = null;
    if(isUpdate){
        requestPacket = "requestAdminUpdateAncestry";
        ancestryID = getAncestryEditorIDFromURL();
    } else {
        requestPacket = "requestAdminAddAncestry";
    }

    socket.emit(requestPacket,{
        ancestryID,
        ancestryName,
        ancestryVersion,
        ancestryRarity,
        ancestryHitPoints,
        ancestrySize,
        ancestrySpeed,
        ancestryVisionSenseID,
        ancestryAdditionalSenseID,
        ancestryPhysicalFeatureOneID,
        ancestryPhysicalFeatureTwoID,
        ancestryDescription,
        ancestryBoostsArray,
        ancestryFlawsArray,
        ancestryLangsArray,
        ancestryBonusLangsArray,
        ancestryHeritagesArray,
        ancestryFeatsArray,
        ancestryContentSrc
    });

}

socket.on("returnAdminCompleteAncestry", function() {
    window.location.href = '/admin/manage/ancestry';
});