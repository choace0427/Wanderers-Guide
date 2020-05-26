
$(function () {

    socket.emit("requestAdminSpellDetails");

});

socket.on("returnAdminSpellDetails", function(spellObject){

    let spellMap = objToMap(spellObject);
    let spell = spellMap.get(getSpellEditorIDFromURL()+"");

    if(spell == null){
        window.location.href = '/admin/manage/spell';
        return;
    }

    $("#inputName").val(spell.Spell.name);
    $("#inputVersion").val(spell.Spell.version);
    $("#inputLevel").val(spell.Spell.level);
    $("#inputCasting").val(spell.Spell.cast);
    $("#inputCost").val(spell.Spell.cost);
    $("#inputTrigger").val(spell.Spell.trigger);
    $("#inputRequirements").val(spell.Spell.requirements);
    $("#inputRange").val(spell.Spell.range);
    $("#inputArea").val(spell.Spell.area);
    $("#inputTargets").val(spell.Spell.targets);
    $("#inputSavingThrow").val(spell.Spell.savingThrow);
    $("#inputDuration").val(spell.Spell.duration);
    $("#inputRarity").val(spell.Spell.rarity);
    $("#inputDesc").val(spell.Spell.description);
    $("#inputHeightenedOneVal").val(spell.Spell.heightenedOneVal);
    $("#inputHeightenedOneText").val(spell.Spell.heightenedOneText);
    $("#inputHeightenedTwoVal").val(spell.Spell.heightenedTwoVal);
    $("#inputHeightenedTwoText").val(spell.Spell.heightenedTwoText);
    $("#inputHeightenedThreeVal").val(spell.Spell.heightenedThreeVal);
    $("#inputHeightenedThreeText").val(spell.Spell.heightenedThreeText);  

    let isFocusSpell = (spell.Spell.isFocusSpell == 1) ? true : false;
    $("#inputIsFocusSpell").prop('checked', isFocusSpell);

    if(spell.Spell.traditions != null){
        let traditionsArray = JSON.parse(spell.Spell.traditions);
        for(let tradition of traditionsArray){
            $("#inputTraditions").find('option[value='+tradition+']').attr('selected','selected');
        }
    }

    if(spell.Spell.castingComponents != null){
        let componentsArray = JSON.parse(spell.Spell.castingComponents);
        for(let component of componentsArray){
            $("#inputCastingComponents").find('option[value='+component+']').attr('selected','selected');
        }
    }

    for(let tag of spell.Tags){
        $("#inputTags").find('option[value='+tag.id+']').attr('selected','selected');
    }
    $("#inputTags").trigger("change");

    $("#updateButton").click(function(){
        $(this).unbind();
        finishSpell(true);
    });

});