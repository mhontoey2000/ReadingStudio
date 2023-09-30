const express = require('express');
const cors = require('cors');
const app = express();
const mysql = require('mysql');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "datareadingstudio"
})

app.get('/account1', (req, res) => {
  db.query("SELECT * FROM account", (err, result) => {
    if(err){
        console.log(err);
    } else {
        res.send(result);
    }
  });
});

app.post('/account', (req, res) => {
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const password = req.body.password;
    const creator = req.body.creator;
    const learner = req.body.learner;

    db.query("INSERT INTO user (user_name, user_surname, user_email, user_password, user_type) VALUES(?,?,?,?,?,?)", 
    [name, surname, email, password,'admin'],
    (err, result) => {
        if(err){
            console.log(err)
        } else {
            res.send("Values inserted");
        }
    }
    );
})

app.get('/getbook', (req, res) => {
    try{
        db.query('select * from book',(err,rows) => {
            if(err){
                res.send(err)
            }
            else{
                res.send(rows)
            }
        })
    }
    catch(e){
        res.send(e)
    }
})

// app.listen(3000, function () {
//   console.log('CORS-enabled web server listening on port 3000')
// })