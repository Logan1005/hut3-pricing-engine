const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const db = new Database("pricing.db");

/* Turns on foreign key constraints */
db.pragma("foreign_keys = ON");

const schemaPath = path.join(__dirname, "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");

db.exec(schema);

module.exports = db;