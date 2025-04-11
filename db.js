'use strict';

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Database client configuration
const pgclient = new Client({
  host: 'localhost',
  port: '5432',
  user: 'user',
  password: 'pass',
  database: 'actifai'
});

// Connect to the database
pgclient.connect()
  .then(() => console.log('Connected to the database.'))
  .catch(err => console.error('Failed to connect to the database:', err));

/**
 * Executes a SQL file with the given named parameters.
 * @param {string} sqlFileName - The name of the SQL file to execute.
 * @param {Object} params - An object containing named parameters (e.g., { user_id: 1 }).
 * @returns {Promise<Object>} - The result of the query.
 */
async function call(sqlFileName, params = {}) {
  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, sqlFileName);
    let sqlQuery = fs.readFileSync(sqlFilePath, 'utf-8');

    // Replace named placeholders (e.g., ${user_id}) with positional parameters ($1, $2, ...)
    const values = [];
    sqlQuery = sqlQuery.replace(/\$\{(\w+)\}/g, (_, key) => {
      if (!(key in params)) {
        throw new Error(`Missing value for parameter: ${key}`);
      }
      values.push(params[key]);
      return `$${values.length}`; // Replace with $1, $2, etc.
    });

    // Execute the query with the extracted values
    const result = await pgclient.query(sqlQuery, values);
    return result.rows;
  } catch (err) {
    console.error(`Error executing query from file ${sqlFileName}:`, err);
    throw err;
  }
}

module.exports = {
  call
};
