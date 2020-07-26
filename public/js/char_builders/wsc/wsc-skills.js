/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

//------------------------- Processing Skills -------------------------//
function processingSkills(wscStatement, srcStruct, locationID){

    if(wscStatement.includes("GIVE-SKILL-INCREASE")){// GIVE-SKILL-INCREASE
        giveSkillIncrease(srcStruct, locationID);
    }
    else if(wscStatement.includes("GIVE-SKILL")){// GIVE-SKILL=T
        let prof = wscStatement.split('=')[1];
        giveSkillProf(srcStruct, locationID, prof);
    } else {
        displayError("Unknown statement (2-Skill): \'"+wscStatement+"\'");
        statementComplete();
    }

}

//////////////////////////////// Skill Increase ///////////////////////////////////

function giveSkillIncrease(srcStruct, locationID){
    giveSkill(srcStruct, locationID, 'UP');
}

function giveSkillProf(srcStruct, locationID, prof){
    giveSkill(srcStruct, locationID, prof);
}

function giveSkill(srcStruct, locationID, profType){

    let selectIncreaseID = "selectIncrease"+locationID+"-"+srcStruct.sourceCodeSNum;
    let selectIncreaseControlShellClass = selectIncreaseID+'ControlShell';
    let increaseDescriptionID = "selectIncreaseDescription"+locationID+"-"+srcStruct.sourceCodeSNum;
    let increaseCodeID = "selectIncreaseCode"+locationID+"-"+srcStruct.sourceCodeSNum;

    $('#'+locationID).append('<div class="field is-grouped is-grouped-centered is-marginless mt-1"><div class="select '+selectIncreaseControlShellClass+'"><select id="'+selectIncreaseID+'" class="selectIncrease"></select></div></div>');

    $('#'+locationID).append('<div id="'+increaseCodeID+'" class=""></div>');
    $('#'+locationID).append('<div id="'+increaseDescriptionID+'" class="pb-1"></div>');

    $('#'+selectIncreaseID).append('<option value="chooseDefault">Choose a Skill</option>');
    $('#'+selectIncreaseID).append('<hr class="dropdown-divider"></hr>');

    // Set saved skill choices
    let savedSkillData = wscChoiceStruct.ProfArray.find(prof => {
        return hasSameSrc(prof, srcStruct);
    });

    for(const [skillName, skillData] of wscSkillMap.entries()){

        if(savedSkillData != null && savedSkillData.To == skillName) {
            $('#'+selectIncreaseID).append('<option value="'+skillName+'" selected>'+skillName+'</option>');
        } else {
            if(skillData.NumUps < profToNumUp(profType)) {
                $('#'+selectIncreaseID).append('<option value="'+skillName+'">'+skillName+'</option>');
            }
        }

    }

    // Add Lore Option
    $('#'+selectIncreaseID).append('<hr class="dropdown-divider"></hr>');
    if(savedSkillData != null && savedSkillData.To == 'addLore') {
        $('#'+selectIncreaseID).append('<option value="addLore" selected>Add Lore</option>');
    } else {
        $('#'+selectIncreaseID).append('<option value="addLore">Add Lore</option>');
    }

    // On increase choice change
    $('#'+selectIncreaseID).change(function() {
        $('#'+increaseCodeID).html('');

        if($(this).val() == "chooseDefault"){

            $('.'+selectIncreaseControlShellClass).removeClass("is-danger");
            $('.'+selectIncreaseControlShellClass).addClass("is-info");

            skillsUpdateWSCChoiceStruct(srcStruct, null, null);
            socket.emit("requestProficiencyChange",
                getCharIDFromURL(),
                {srcStruct, isSkill : true},
                null);

        } else if($(this).val() == "addLore"){

            $('.'+selectIncreaseControlShellClass).removeClass("is-danger");
            $('.'+selectIncreaseControlShellClass).removeClass("is-info");

            socket.emit("requestProficiencyChange",
                getCharIDFromURL(),
                {srcStruct, isSkill : true},
                { For : "Skill", To : 'addLore', Prof : profType });
            processCode(
                'GIVE-LORE-CHOOSE',
                srcStruct,
                increaseCodeID);

        } else {

            $('.'+selectIncreaseControlShellClass).removeClass("is-info");

            let canSave = false;
            if(profType === 'UP') {
                let skillName = $('#'+selectIncreaseID).val();
                let numUps = wscSkillMap.get(skillName).NumUps;
                if(isAbleToSelectIncrease(numUps+1, wscChoiceStruct.Level)) {
                    canSave = true;
                    $('#'+increaseDescriptionID).html('');
                } else {
                    $('.'+selectIncreaseControlShellClass).addClass("is-danger");
                    $('#'+increaseDescriptionID).html('<p class="help is-danger text-center">You cannot increase the proficiency of this skill any further at your current level!</p>');
                }
            } else {
                canSave = true;
            }

            if(canSave) {
                $('.'+selectIncreaseControlShellClass).removeClass("is-danger");

                let skillName = $(this).val();

                skillsUpdateWSCChoiceStruct(srcStruct, skillName, profType);
                socket.emit("requestProficiencyChange",
                    getCharIDFromURL(),
                    {srcStruct, isSkill : true},
                    { For : "Skill", To : skillName, Prof : profType });
            }
            
        }

        $(this).blur();

    });

    $('#'+selectIncreaseID).trigger("change");

    statementComplete();

}

function isAbleToSelectIncrease(numUps, charLevel){
    if(numUps == 3){
        return (charLevel >= 7);
    } else if (numUps == 4){
        return  (charLevel >= 15);
    } else if (numUps > 4) {
        return false;
    } else {
        return true;
    }
}

function skillsUpdateWSCChoiceStruct(srcStruct, profTo, profType){

    let foundProfData = false;
    for(let profData of wscChoiceStruct.ProfArray){
        if(hasSameSrc(profData, srcStruct)){
            foundProfData = true;
            if(profTo != null && profType != null){
                profData.value = 'Skill:::'+profTo+':::'+profType;
                profData.For = 'Skill';
                profData.To = profTo;
                profData.Prof = profType;
            } else {
                profData = null;
            }
            break;
        }
    }

    if(!foundProfData){
        let profData = srcStruct;
        profData.value = 'Skill:::'+profTo+':::'+profType;
        profData.For = 'Skill';
        profData.To = profTo;
        profData.Prof = profType;
        wscChoiceStruct.ProfArray.push(profData);
    }

}

socket.on("returnProficiencyChange", function(profChangePacket){

    if(profChangePacket.isSkill){
        selectorUpdated();
        socket.emit("requestWSCUpdateSkills", getCharIDFromURL());
    }
    if(profChangePacket.isStatement != null && profChangePacket.isStatement){
        statementComplete();
    }

});