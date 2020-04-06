const Sequelize = require('sequelize');
const db = require('../../config/databases/content-database');

const Tag = db.define('tags', {
  name: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT
  }
});

module.exports = Tag;