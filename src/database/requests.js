const knex = require('../database/knex');

const getTable = (tableName) => {
  return knex(tableName).select('*');
};

module.exports = { getTable };
