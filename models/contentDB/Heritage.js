const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const Heritage = db.define('heritages', {
  name: {
    type: Sequelize.STRING
  },
  ancestryID: {
    type: Sequelize.INTEGER
  },
  description: {
    type: Sequelize.TEXT
  },
  code: {
    type: Sequelize.TEXT
  }
});

module.exports = Heritage;