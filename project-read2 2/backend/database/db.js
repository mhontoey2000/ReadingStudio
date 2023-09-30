const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'datareadingstudio'
});

connection.connect((err) => {
    if (!!err) {
        console.log(err);
    } else {
        console.log('Connected...');
    }
  
  });

  module.exports = connection