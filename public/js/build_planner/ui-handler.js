/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

$(function () {

  // Assemble accords
  $('.accord-container').each(function() {
    let accordHeader = $(this).find('.accord-header');
    $(accordHeader).click(function() {
      let accordBody = $(this).parent().find('.accord-body');
      let accordChevron = $(this).parent().find('.accord-chevron');
      if($(accordBody).hasClass("is-hidden")) {
        $(accordBody).removeClass('is-hidden');
        $(accordChevron).removeClass('fa-chevron-down');
        $(accordChevron).addClass('fa-chevron-up');
      } else {
        $(accordBody).addClass('is-hidden');
        $(accordChevron).removeClass('fa-chevron-up');
        $(accordChevron).addClass('fa-chevron-down');
      }
    });
    $(accordHeader).mouseenter(function(){
      $(accordHeader).addClass('accord-hover');
    });
    $(accordHeader).mouseleave(function(){
      $(accordHeader).removeClass('accord-hover');
    });
  });

  $('.accord-like-button').each(function() {
    $(this).mouseenter(function(){
      $(this).addClass('accord-hover');
    });
    $(this).mouseleave(function(){
      $(this).removeClass('accord-hover');
    });
  });

  $('#hit-points-body').click(function() {
    openQuickView('hitPointsBreakdownView', {
      classHitPoints : getCharClass().Class.hitPoints,
    });
  });
  $('#class-dc-body').click(function() {
    openQuickView('generalBreakdownView', {
      title : 'Class DC',
      name : 'Class DC',
      varName : VARIABLE.CLASS_DC,
      isProfDC : true,
    });
  });
  $('#perception-body').click(function() {
    openQuickView('generalBreakdownView', {
      title : 'Perception',
      name : 'Perception',
      varName : VARIABLE.PERCEPTION
    });
  });

  populateAccord('resist-weaks-body', []);
  populateAccord('saves-body', []);
  populateAccord('skills-body', []);
  populateAccord('attacks-body', []);
  populateAccord('defenses-body', []);
  populateAccord('spellcasting-body', []);
  populateAccord('languages-body', []);

     
});



function populateAccord(accordBodyID, optionsList){

  let content = $('#'+accordBodyID);
  content.html('');

  if(optionsList.length == 0){
    content.append(`<div class="p-1"><p class="pl-2 accord-selection-none">None</p></div>`);
    return;
  }

  for(let i = 0; i < optionsList.length; i++){
    let optionEntryID = `${accordBodyID}-entry-${i}`;
    let option = optionsList[i];

    let value1 = option.Value1;
    let value2 = option.Value2;
    let value3 = option.Value3;
    let varName = option.VarName;

    if(value3 == null){
      content.append(`
        <div id="${optionEntryID}" class="columns is-mobile is-marginless p-1 border-bottom border-dark-lighter cursor-clickable">
          <div class="column is-8 is-paddingless"><p class="pl-2">${value1}</p></div>
          <div class="column is-4 is-paddingless"><p class="has-text-centered is-italic has-text-grey">${value2}</p></div>
        </div>
      `);
    } else {
      content.append(`
        <div id="${optionEntryID}" class="columns is-mobile is-marginless p-1 border-bottom border-dark-lighter cursor-clickable">
          <div class="column is-8 is-paddingless"><p class="pl-2">${value1}</p></div>
          <div class="column is-2 is-paddingless"><p class="has-text-centered">${value2}</p></div>
          <div class="column is-2 is-paddingless"><p class="has-text-centered is-italic has-text-grey">${value3}</p></div>
        </div>
      `);
    }

    if(varName != null){
      $('#'+optionEntryID).mouseenter(function(){
        $('#'+optionEntryID).addClass('entry-hover');
      });
      $('#'+optionEntryID).mouseleave(function(){
        $('#'+optionEntryID).removeClass('entry-hover');
      });
      $('#'+optionEntryID).click(function() {
        openQuickView('generalBreakdownView', {
          title : value1,
          name : value1,
          varName : varName,getProfHistoryHTML
        });
      });
    }

  }

}