
const Character = require('../models/contentDB/Character');

function getConstantSources(){ // HARDCODED - Constant Content Sources
  return ['BEST-1', 'BEST-2', 'BEST-3'];
}

module.exports = class CharContentSources {

    static getSourceArray(enabledSources){
      let array = JSON.parse(enabledSources);
      array = array.concat(getConstantSources());
      return [...new Set(array)];
    }

    static getSourceArrayPrisma(enabledSources){
      let array = JSON.parse(enabledSources);
      array = array.concat(getConstantSources());
      let newArray = [];
      for(let arr of array){
        newArray.push({ contentSrc: arr });
      }
      return [...new Set(newArray)];
    }

    static addSource(charID, sourceName){
        return Character.findOne({ where: { id: charID} })
        .then((character) => {
            let sourceArray = CharContentSources.getSourceArray(character.enabledSources);
            sourceArray.push(sourceName);
            let charUpVals = {enabledSources: JSON.stringify(sourceArray) };
            return Character.update(charUpVals, { where: { id: character.id } })
            .then((result) => {
                return;
            });
        });
    }

    static removeSource(charID, sourceName){
        return Character.findOne({ where: { id: charID} })
        .then((character) => {
            let sourceArray = CharContentSources.getSourceArray(character.enabledSources);
            let sourceIndex = sourceArray.indexOf(sourceName);
            if (sourceIndex > -1) {
                sourceArray.splice(sourceIndex, 1);
            }
            let charUpVals = {enabledSources: JSON.stringify(sourceArray) };
            return Character.update(charUpVals, { where: { id: character.id } })
            .then((result) => {
                return;
            });
        });
    }

    static setSources(charID, inputSourceArray){
      return Character.findOne({ where: { id: charID} })
      .then((character) => {
        let sourceArray = [];
        try{
          for(let source of inputSourceArray){
            sourceArray.push(source+'');
          }
        } catch (err){}
        let charUpVals = {enabledSources: JSON.stringify(sourceArray) };
        return Character.update(charUpVals, { where: { id: character.id } })
        .then((result) => {
          return;
        });
      });
    }

};