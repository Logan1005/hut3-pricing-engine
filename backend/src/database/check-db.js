'This file checks if the database is connected and if the tables exist.'
'If the database is not connected or the tables do not exist, this file will log an error.'
'If the database is connected and the tables exist, this file will log the names of the tables.'

const db = require("./db");

const tables = db
    .prepare(`
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
        ORDER BY name
    `)
    .all();

console.log(tables);
