
const Database = require("better-sqlite3");

const db = new Database("pricing.db");

module.exports = db;