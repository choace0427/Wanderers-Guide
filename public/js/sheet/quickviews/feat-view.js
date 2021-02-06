/* Copyright (C) 2020, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

/*
data = {
  Feat : selectedFeat.Feat,
  Tags : selectedFeat.Tags,
  _prevBackData: {Type: g_QViewLastType, Data: g_QViewLastData},
}
Requires:
  - Text-Processing
    - g_allConditions
    - g_allLanguages
    - g_featMap
    - g_itemMap
    - g_spellMap
  - Add-Text-Processing
  - g_skillMap (either CharGathering or GeneralGathering version)
  - g_allTags
*/
function openFeatQuickview(data) {
    addBackFunctionality(data);
    addContentSource(data.Feat.id, data.Feat.contentSrc, data.Feat.homebrewID);

    let featNameInnerHTML = '<span>'+data.Feat.name+'</span>';
    switch(data.Feat.actions) {
        case 'FREE_ACTION': featNameInnerHTML += '<span class="px-2 pf-icon">[free-action]</span>'; break;
        case 'REACTION': featNameInnerHTML += '<span class="px-2 pf-icon">[reaction]</span>'; break;
        case 'ACTION': featNameInnerHTML += '<span class="px-2 pf-icon">[one-action]</span>'; break;
        case 'TWO_ACTIONS': featNameInnerHTML += '<span class="px-2 pf-icon">[two-actions]</span>'; break;
        case 'THREE_ACTIONS': featNameInnerHTML += '<span class="px-2 pf-icon">[three-actions]</span>'; break;
        default: break;
    }

    if(data.Feat.isArchived === 1){
        featNameInnerHTML += '<em class="pl-1">(archived)</em>';
    }

    $('#quickViewTitle').html(featNameInnerHTML);
    if(data.Feat.level > 0){
        $('#quickViewTitleRight').html('<span class="pr-2">Level '+data.Feat.level+'</span>');
    }
    let qContent = $('#quickViewContent');

    let featTagsInnerHTML = '<div class="columns is-centered is-marginless"><div class="column is-9 is-paddingless"><div class="buttons is-marginless is-centered">';
    switch(data.Feat.rarity) {
    case 'UNCOMMON': featTagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-uncommon">Uncommon</button>';
        break;
    case 'RARE': featTagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-rare">Rare</button>';
        break;
    case 'UNIQUE': featTagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-unique">Unique</button>';
        break;
    default: break;
    }
    if(data.Feat.skillID != null){
        let skill = null;
        for(const [skillName, skillData] of g_skillMap.entries()){
            if(skillData.Skill.id == data.Feat.skillID) {
                skill = skillData.Skill;
                break;
            }
        }
        if(skill != null){
            featTagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-info has-tooltip-bottom has-tooltip-multiline" data-tooltip="An action with this trait is categorized under the '+skill.name+' skill. It usually requires a certain proficiency in the skill to perform.">'+skill.name+'</button>';
        }
    }

    data.Tags = data.Tags.sort(
        function(a, b) {
            return a.name > b.name ? 1 : -1;
        }
    );
    for(const tag of data.Tags){
        if(data.Feat.level == -1 && tag.name == 'General'){ continue; }
        let tagDescription = tag.description;
        if(tagDescription.length > g_tagStringLengthMax){
            tagDescription = tagDescription.substring(0, g_tagStringLengthMax);
            tagDescription += '...';
        }
        featTagsInnerHTML += '<button class="button is-paddingless px-2 is-marginless mr-2 mb-1 is-very-small is-info has-tooltip-bottom has-tooltip-multiline tagButton" data-tooltip="'+tagDescription+'">'+tag.name+'</button>';
    }
    featTagsInnerHTML += '</div></div></div>';

    qContent.append(featTagsInnerHTML);

    $('.tagButton').click(function(){
        let tagName = $(this).text();
        openQuickView('tagView', {
            TagName : tagName,
            _prevBackData: {Type: g_QViewLastType, Data: g_QViewLastData},
        }, $('#quickviewDefault').hasClass('is-active'));
    });

    let featContentInnerHTML = '';
    let foundUpperFeatLine = false;
    if(data.Feat.prerequisites != null){
        if(isBuilderPage() && wscChoiceStruct.Character.optionAutoDetectPreReqs === 1) {
            let resultArray = preReqResultArray(data.Feat);

            let preReqStr = '';
            for(let resultData of resultArray){
                let featLinkClass = 'featLink-'+Math.floor((Math.random()*9999));
                if(resultData.Result == 'TRUE'){
                    if(resultData.Type == 'FEAT'){
                        preReqStr += '<span class="prereq-true '+featLinkClass+' has-tooltip-bottom" data-tooltip="Feat">'+resultData.PreReqPart+'</span>'+preReqGetIconTrue();
                        preReqFeatLink(featLinkClass, resultData.PreReqPart);
                    } else if(resultData.Type == 'CLASS-FEATURE'){
                        preReqStr += '<span class="prereq-true has-tooltip-bottom" data-tooltip="Class Feature">'+resultData.PreReqPart+'</span>'+preReqGetIconTrue();
                    } else {
                        preReqStr += '<span class="prereq-true">'+resultData.PreReqPart+'</span>'+preReqGetIconTrue();
                    }
                } else if(resultData.Result == 'FALSE') {
                    if(resultData.Type == 'FEAT'){
                        preReqStr += '<span class="prereq-false '+featLinkClass+' has-tooltip-bottom" data-tooltip="Feat">'+resultData.PreReqPart+'</span>'+preReqGetIconFalse();
                        preReqFeatLink(featLinkClass, resultData.PreReqPart);
                    } else if(resultData.Type == 'CLASS-FEATURE'){
                        preReqStr += '<span class="prereq-false has-tooltip-bottom" data-tooltip="Class Feature">'+resultData.PreReqPart+'</span>'+preReqGetIconFalse();
                    } else {
                        preReqStr += '<span class="prereq-false">'+resultData.PreReqPart+'</span>'+preReqGetIconFalse();
                    }
                } else if(resultData.Result == 'UNKNOWN') {
                    preReqStr += '<span class="prereq-unknown">'+resultData.PreReqPart+'</span>'+preReqGetIconUnknown();
                }
                preReqStr += ', ';
            }
            preReqStr = preReqStr.slice(0, -2);// Trim off that last ', '
            featContentInnerHTML += '<div><p class=""><span><strong>Prerequisites </strong></span><span>'+preReqStr+'</span></p></div>';
        } else if(isSheetPage()) {
            // Don't display prereq, unnecessary
        } else {
            featContentInnerHTML += '<div><p class="negative-indent"><span><strong>Prerequisites </strong></span><span>'+data.Feat.prerequisites+'</span></p></div>';
        }
        foundUpperFeatLine = true;
    }
    if(data.Feat.frequency != null){
        featContentInnerHTML += '<div><p class="negative-indent"><span><strong>Frequency </strong></span><span>'+data.Feat.frequency+'</span></p></div>';
        foundUpperFeatLine = true;
    }
    if(data.Feat.cost != null){
        featContentInnerHTML += '<div><p class="negative-indent"><span><strong>Cost </strong></span><span>'+data.Feat.cost+'</span></p></div>';
        foundUpperFeatLine = true;
    }
    if(data.Feat.trigger != null){
        featContentInnerHTML += '<div><p class="negative-indent"><span><strong>Trigger </strong></span><span>'+data.Feat.trigger+'</span></p></div>';
        foundUpperFeatLine = true;
    }
    if(data.Feat.requirements != null){
        featContentInnerHTML += '<div><p class="negative-indent"><span><strong>Requirements </strong></span><span>'+data.Feat.requirements+'</span></p></div>';
        foundUpperFeatLine = true;
    }

    if(foundUpperFeatLine){
        featContentInnerHTML += '<hr class="m-1">';
    }

    let description = featViewTextProcessor(data.Feat.description);
    featContentInnerHTML += '<div>'+processText(description, true, true, 'MEDIUM')+'</div>';

    if(data.Feat.special != null){
        featContentInnerHTML += '<div>'+processText('~ Special: '+data.Feat.special, true, true, 'MEDIUM')+'</div>';
    }

    qContent.append(featContentInnerHTML);

    // Add Text Statements
    processAddText(data.Feat.code, 'quickViewContent');

    // Note Field Statements
    if(data.SrcStruct != null){
        displayNotesField(qContent, data.SrcStruct);
    }

    showFeatListOptions(qContent, data.Feat.code);

}

function showFeatListOptions(qContent, wscStatements){
  if(wscStatements == null) {return;}
  for(let statement of wscStatements.split(/\n/)) {
    if(statement.includes("GIVE-FEAT-FROM=")){ // GIVE-FEAT-FROM=Choose a Tradition:feat 1,feat 2,feat 2
      let value = statement.split('=')[1];
      let valueParts = value.split(':');
      let selectorTitle = valueParts[0];
      let featNameList = valueParts[1].split(',');

      let listText = '**'+selectorTitle+'**\n';
      for(let featName of featNameList){
        listText += '* : (feat: '+featName+')\n';
      }
      qContent.append('<hr class="m-2">');
      qContent.append('<div>'+processText(listText, true, true, 'MEDIUM')+'</div>');
    }
  }
}

function featViewTextProcessor(text){
    if(!isSheetPage()) { return text; }

    let speedNum = getStatTotal('SPEED');
    speedNum = (speedNum > 5) ? speedNum : 5;

    text = text.replace('for 5 feet plus 5 feet per 20 feet of your land Speed', '<span class="has-text-info has-tooltip-top" data-tooltip="5+5 per 20ft of land Speed">'+(5+5*Math.floor(speedNum/20))+' feet</span>');
    text = text.replace('for 5 feet per 20 feet of your land Speed', '<span class="has-text-info has-tooltip-top" data-tooltip="5 per 20ft of land Speed">'+(5*Math.floor(speedNum/20) != 0 ? 5*Math.floor(speedNum/20) : 5)+' feet</span>');

    text = text.replace('10 feet plus 5 feet per 20 feet of your land Speed', '<span class="has-text-info has-tooltip-top" data-tooltip="10+5 per 20ft of land Speed">'+(10+5*Math.floor(speedNum/20))+' feet</span>');
    text = text.replace('5 feet plus 5 feet per 20 feet of your land Speed.', '<span class="has-text-info has-tooltip-top" data-tooltip="5+5 per 20ft of land Speed">'+(5+5*Math.floor(speedNum/20))+' feet</span>');

    return text;
}