
const Character = require('../models/contentDB/Character');
const HomebrewBundle = require('../models/contentDB/HomebrewBundle');

// Returns UserID or -1 if not logged in.
function getUserID(socket){
  if(socket.request.session.passport != null){
      return socket.request.session.passport.user;
  } else {
      return -1;
  }
}

function canAccessHomebrew(socket, homebrewBundle){
  return homebrewBundle.isPublished === 1 || homebrewBundle.userID === getUserID(socket);
}

module.exports = class CharContentHomebrew {

    static getHomebrewArray(character){
        return JSON.parse(character.enabledHomebrew);
    }

    static addHomebrewBundle(socket, charID, homebrewID){
      return HomebrewBundle.findOne({ where: { id: homebrewID } })
      .then((homebrewBundle) => {
        if(homebrewBundle != null && canAccessHomebrew(socket, homebrewBundle)) {
          return Character.findOne({ where: { id: charID } })
          .then((character) => {
              let homebrewArray = CharContentHomebrew.getHomebrewArray(character);
              homebrewArray.push(homebrewID);
              let charUpVals = {enabledHomebrew: JSON.stringify(homebrewArray) };
              return Character.update(charUpVals, { where: { id: character.id } })
              .then((result) => {
                  return;
              });
          });
        }
      });
    }

    static removeHomebrewBundle(charID, homebrewID){
        return Character.findOne({ where: { id: charID } })
        .then((character) => {
            let homebrewArray = CharContentHomebrew.getHomebrewArray(character);
            let bundleIndex = homebrewArray.indexOf(homebrewID);
            if (bundleIndex > -1) {
              homebrewArray.splice(bundleIndex, 1);
            }
            let charUpVals = {enabledHomebrew: JSON.stringify(homebrewArray) };
            return Character.update(charUpVals, { where: { id: character.id } })
            .then((result) => {
                return;
            });
        });
    }

};