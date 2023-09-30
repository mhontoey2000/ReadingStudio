var express = require('express')
var cors = require('cors')
var app = express()

// get the client
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'datareadingstudio'
});


app.use(cors())

app.get('/api/article', function (req, res, next) {
    const page = parseInt(req.query.page); //แสดงจำนวนหน้า
    const per_page = parseInt(req.query.page); //หน้านั้นมีกี่record
    const sort_column = req.query.sort_column;
    const sort_direction = req.query.sort_direction;
    const search = req.query.search;


    const start_idx = (page - 1) * per_page;
    var params = [];
    var sql = 'SELECT * FROM article';
    if(search){
        sql += ' WHERE article_name LIKE ?'
        params.push('%'+search+'%')
    }
    if(sort_column){
        sql += ' ORDER BY '+sort_column+' '+sort_column;
    }
    sql += ' LIMIT ?, ?'
    params.push(start_idx)
    params.push(per_page)
    connection.execute(sql, params,
        function(err, results, fields) {
        console.log(results); // results contains rows returned by server
        res.json({results: results})
        //console.log(fields); // fields contains extra meta data about results, if available
    
        // If you execute same statement again, it will be picked from a LRU cache
        // which will save query preparation time and give better performance
        }
  );
  
})

app.listen(5000, function () {
  console.log('CORS-enabled web server listening on port 5000')
})