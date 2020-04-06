const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const Class = db.define('classes', {
  name: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT
  },
  keyAbility: {
    type: Sequelize.STRING
  },
  hitPoints: {
    type: Sequelize.INTEGER
  },
  tPerception: {
    type: Sequelize.STRING
  },
  tFortitude: {
    type: Sequelize.STRING
  },
  tReflex: {
    type: Sequelize.STRING
  },
  tWill: {
    type: Sequelize.STRING
  },
  tSkills: {
    type: Sequelize.STRING
  },
  tSkillsMore: {
    type: Sequelize.INTEGER
  },
  tWeapons: {
    type: Sequelize.STRING
  },
  tArmor: {
    type: Sequelize.STRING
  },
  tSpellTradition: {
    type: Sequelize.STRING
  },
});

module.exports = Class;