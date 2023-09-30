const express = require('express')
const cors = require('cors')
const multer = require('multer');
const bodyParser = require('body-parser')
const mysql = require('mysql2');
const dotenv = require("dotenv")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { json } = require('react-router-dom');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'datareadingstudio',
    password: ''
});
process.env.ACCESS_TOKEN_SECRET = 'doraemon';
dotenv.config()

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60 * 60 * 24 * 30 });
}
function decodedToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        // Token is invalid or has expired
        resolve(false);
      } else {
        // Token is valid;
        resolve(true);
      }
    });
  });
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Ahoy!' });
});

app.get('/api/key', function (req, res) {
  res.json({ key: process.env.PASS_KEY });
});

app.use(bodyParser.urlencoded({extended:true}))

app.listen(5004, () => {
  console.log('Application is running on port 5004');
});


connection.connect((err) => {
    if (!!err) {
        console.log(err);
    } else {
        console.log('Connected...');
    }
  
  });



//const { request } = require('express')
const router = require('express-promise-router')()


router.get('/tbl',async (req,res,next) => {
    try {
        connect.query('SELECT * FROM book',(err,rows) => {
            if (err){
                res.send(err)
            }
            else{
                res.send(rows)
            }
        }) 
    }
    catch (e) {
        res.send(e)
    }
})

app.get('/api/book', function (req, res) {
 
    connection.query(
        'SELECT * FROM book',
        function(err, results) {
          res.json(results);
        }
      );
  });
// แก้เพิ่ม
  app.post('/api/addbook', (req, res) => {
    const { book_name, book_detail, book_image } = req.body;

    connection.query("SELECT book_id FROM book ORDER BY book_id DESC LIMIT 1", (err, results) => {
      if (err) {
          console.error('Error fetching last book_id:', err);
          res.status(500).json({ error: 'Error fetching last book_id' });
          return;
      }
  
      let lastNumber = 0;
      if (results.length > 0) {
          const lastBookId = results[0].book_id;
          lastNumber = parseInt(lastBookId.replace('book', ''), 10); 
      }
  
      const newNumber = lastNumber + 1;
      const book_id = `book${String(newNumber).padStart(3, '0')}`;

      connection.query("INSERT INTO book (book_id, book_name, book_detail, book_image) VALUES (?, ?, ?, ?)", 
      [book_id, book_name, book_detail, book_image], 
      (err, result) => {
          if (err) {
              console.error('Error adding book:', err);
              res.status(500).json({ error: 'Error adding book' });
          } else {
              console.log('Book added successfully');
              res.status(200).json({ message: 'Book added successfully' });
          }
      });
    });
  });


  app.get('/api/article', function (req, res) {
 
    connection.query(
        'SELECT * FROM article',
        function(err, results) {
          res.json(results);
        }
      );
  });

  app.get('/api/typebook/:id', function (req, res) {
    const article_id = req.parems.id;
  
    connection.query(
      `SELECT aricle_level FROM article WHERE article_id = ?;`,
      [article_id],
      function (err, results) {
        if (err) {
          console.error(err);
          res.status(500).send('Error retrieving article data');
        } else {
          
          const article_level = results[0].article_level;
          res.json(article_level);
        }
      }
    );
  });
  

 app.get('/api/article/:id', function (req, res) {
 const book_id = req.params.id;

  connection.query(
      `SELECT * FROM article WHERE book_id = ?;`,
      [book_id],
      function(err, results) {
        res.json(results);
      }
    );
});

app.get('/api/articledetail/:id', function (req, res) {
  const article_id = req.params.id;
  const searchTerm = req.query.q;
  const sql = `SELECT * FROM articles WHERE article_name LIKE '%${searchTerm}%'`;
   connection.query(
       `SELECT * FROM article WHERE article_id = ?;`,
       [article_id],
       function(err, results) {
         res.json(results);
       }
     );
 });

 app.get('/api/exam', function (req, res) {
   connection.query(
       `SELECT * FROM exam`,
       function(err, results) {
         console.log(res.json(results));
       }
     );
 });


 app.get('/api/user', function (req, res) {
  connection.query(
      `SELECT * FROM user`,
      function(err, results) {
        console.log(res.json(results));
      }
    );
});

// deleting a user by user_id
app.delete('/api/user/:id', function (req, res) {
  const userId = req.params.id;

  connection.query(
    'DELETE FROM user WHERE user_id = ?',
    [userId],
    function (err, results) {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete user' });
      } else {
        res.json({ message: 'User deleted successfully' });
      }
    }
  );
});


app.get('/api/book/search', async (req, res) => {
  const query = req.query.query;

  try {

    const [rows] = await connection.execute(`SELECT * FROM book WHERE CONVERT(book_detail USING utf8) COLLATE utf8_general_ci LIKE '%${query}%'`);
    console.log(rows)
    
    res.send(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  connection.query(
    `SELECT * FROM user WHERE user_email = '${email}'`,
    async (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
      } else if (results.length === 0) {
        res.status(401).send({ message: "Invalid email or password" });
      } else {
        const user = results[0];

        const passwordMatch = await bcrypt.compare(password, user.user_password);

        if (passwordMatch) {
          const accessToken = generateAccessToken({ user_id: user.user_id });
          res.status(200).send({ accessToken: accessToken, email: req.body.email });
        } else {
          res.status(401).send({ message: "Invalid email or password" });
        }


      }
    }
  );
});

app.post('/api/register', (req, res) => {
  const { name, surname, email, password, usertype } = req.body;
  const saltRounds = 10;

  //แก้หน้าสมัครใส่ดักอีเมลซ้ำ
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error hashing password');
      return; // Make sure to return here
    }

    // Step 1: Check if email already exists
    connection.query(
        "SELECT COUNT(*) AS count FROM user WHERE user_email = ?",
        [email],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error checking email');
                return; // Make sure to return here
            }

            if (result[0].count > 0) {
                // Step 2: If email exists, send an error message
                res.status(400).send('This email is already in use');
            } else {
                // Step 3: If email doesn't exist, proceed to insert user data
                connection.query(
                    "INSERT INTO user (user_name, user_surname, user_email, user_password, user_type) VALUES (?, ?, ?, ?, ?)",
                    [name, surname, email, hashedPassword, usertype],
                    (err, result) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Error inserting user data');
                        } else {
                            res.send('User data inserted successfully');
                        }
                    }
                );
            }
        }
    );
});
});


app.get('/api/token_check', async (req, res) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    res.status(401).send("Unauthorized");
    return;
  }
  try {
    const isValidToken = await decodedToken(accessToken);

    if (isValidToken) {
      res.status(200).send("OK");
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});



app.get('/api/userdata', (req, res) => {
  const email = req.query.user_email;
  connection.query("SELECT * FROM user WHERE user_email = ?", [email], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving user data');
    } else {
      res.send(result);
    }
  });
});

app.put('/api/userdata', (req, res) => {
  const name = req.body.user_name;
  const surname = req.body.user_surname;
  const email = req.body.user_email;
  connection.query("UPDATE user SET user_name = ?, user_surname = ? WHERE user_email = ?", [name, surname, email], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error updating user data');
    } else {
      console.log(result);
      res.send('User data updated successfully');
    }
  });
});



app.post('/api/report', (req, res) => {
  const { bookid, articleid, remail, rdetail } = req.body;

  const insertReportQuery = `
    INSERT INTO reports (book_id, article_id, reporter, report_detail)
    VALUES (?, ?, ?, ?)
  `;

  connection.query(insertReportQuery, [bookid, articleid, remail, rdetail], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error inserting report data' });
    } else {
      const reportId = result.insertId;
      
      res.json({ message: 'Report data inserted successfully', report_id: reportId });
    }
  });
});


app.post('/api/vocabs', async (req, res) => {
  const { articleid, Vname, Vdetail } = req.body;

  const insertReportQuery = `
    INSERT INTO vocabs (article_id, vocabs_name, vocabs_detail)
    VALUES (?, ?, ?)
  `;

  connection.query(insertReportQuery, [articleid, Vname, Vdetail], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error inserting vocabs data' });
    } else {
      const vocabsId = result.insertId;
      
      res.json({ message: 'Report data inserted successfully', vocabs_id: vocabsId });
    }
  });
});

app.get('/api/vocabs/:id', function (req, res) {
  const article_id = req.params.id;
 
   connection.query(
       `SELECT * FROM vocabs WHERE article_id = ?;`,
       [article_id],
       function(err, results) {
         res.json(results);
       }
     );
 });

 // deleting vocabs
app.delete('/api/vocabs/:id', function (req, res) {
  const vocabId = req.params.id;

  connection.query(
    'DELETE FROM vocabs WHERE vocabs_id = ?',
    [vocabId],
    function (err, results) {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete vocab' });
      } else {
        res.json({ message: 'Vocab deleted successfully' });
      }
    }
  );
});

app.get('/api/report', function (req, res) {
  connection.query(
      `SELECT * FROM reports`,
      function(err, results) {
        console.log(res.json(results));
      }
    );
});


// app.post('/api/add-data', (req, res) => {
//   const { data1, data2, data3, data4 } = req.body;
//   console.log(req.body);
//   // Define SQL statements to insert data into your tables
//   const sql1 = `INSERT INTO exams (total_questions, name, book_id, article_id) VALUES (?, ?, ?, ?)`;
//   const values1 = [data1, data2, data3, data4];

//   const sql2 = `INSERT INTO questions (exam_id, question_text, question_image, correct_option_id) VALUES (?, ?, ?, ?)`;
//   const values2 = [data4, data1, data2, data3];

//   const sql3 = `INSERT INTO options (question_id, option_text) VALUES (?, ?)`;
//   const values3 = [data1, data2];

//   const sql4 = `INSERT INTO correct_options (question_id, option_id) VALUES (?, ?)`;
//   const values4 = [data1, data2];

//   // Execute SQL queries for each table
//   connection.query(sql1, values1, (err1, result1) => {
//     if (err1) {
//       console.error('Error inserting data into exams table: ' + err1.message);
//       res.status(500).json({ message: 'Error inserting data into exams table' });
//     } else {
//       console.log('Data inserted into exams table successfully');
//       connection.query(sql2, values2, (err2, result2) => {
//         if (err2) {
//           console.error('Error inserting data into questions table: ' + err2.message);
//           res.status(500).json({ message: 'Error inserting data into questions table' });
//         } else {
//           console.log('Data inserted into questions table successfully');
//           connection.query(sql3, values3, (err3, result3) => {
//             if (err3) {
//               console.error('Error inserting data into options table: ' + err3.message);
//               res.status(500).json({ message: 'Error inserting data into options table' });
//             } else {
//               console.log('Data inserted into options table successfully');
//               connection.query(sql4, values4, (err4, result4) => {
//                 if (err4) {
//                   console.error('Error inserting data into correct_options table: ' + err4.message);
//                   res.status(500).json({ message: 'Error inserting data into correct_options table' });
//                 } else {
//                   console.log('Data inserted into correct_options table successfully');
//                   res.status(200).json({ message: 'Data inserted successfully into all tables' });
//                 }
//               });
//             }
//           });
//         }
//       });
//     }
//   });
// });

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + '_' + file.originalname; 
    cb(null, fileName);
  },
});

const upload = multer({ storage });


app.post('/api/add-data', upload.array('questions'), (req, res) => {
  const { book_id, article_id, total_questions } = req.body;
  console.log(req.body);

  const insertExamQuery = `INSERT INTO exams (book_id, article_id, total_questions) VALUES (?, ?, ?)`;
  connection.query(insertExamQuery, [book_id, article_id, total_questions], (err, result) => {
    if (err) {
      console.error('Error inserting exam data: ' + err.message);
      res.status(500).send('Error creating exam');
    } else {
      const examId = result.insertId;
      const questionsData = JSON.parse(req.body.questions);

      const insertQuestionQuery = `INSERT INTO questions (exam_id, question_text) VALUES (?, ?)`;

      questionsData.forEach((question, index) => {
        connection.query(
          insertQuestionQuery,
          [examId, question.question_text],
          (err, questionResult) => {
            if (err) {
              console.error('Error inserting question data: ' + err.message);
              res.status(500).send('Error creating exam');
            } else {
              const questionId = questionResult.insertId;

              const insertOptionQuery = `INSERT INTO options (question_id, option_text) VALUES (?, ?)`;
              question.options.forEach((option) => {
                connection.query(insertOptionQuery, [questionId, option]);
              });

              const insertCorrectOptionQuery = `INSERT INTO correct_options (question_id, option_id) VALUES (?, ?)`;
              connection.query(
                insertCorrectOptionQuery,
                [questionId, question.correct_option_id],
                (err) => {
                  if (err) {
                    console.error(
                      'Error inserting correct option data: ' + err.message
                    );
                    res.status(500).send('Error creating exam');
                  }
                }
              );

              if (req.files && req.files[index]) {
                const image_path = req.files[index].path;
                const insertImageQuery = `INSERT INTO question_images (question_id, image_path) VALUES (?, ?)`;
                connection.query(
                  insertImageQuery,
                  [questionId, image_path],
                  (err) => {
                    if (err) {
                      console.error(
                        'Error inserting image data: ' + err.message
                      );
                      res.status(500).send('Error creating exam');
                    }
                  }
                );
              }
            }
          }
        );
      });

      res.status(200).send('Exam created successfully');
    }
  });
});
