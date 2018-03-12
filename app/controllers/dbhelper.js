var mysql = require('mysql');

var pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "freelancer",
  multipleStatements: true,
  connectionLimit:100,
  queueLimit:10
});

module.exports = pool;
