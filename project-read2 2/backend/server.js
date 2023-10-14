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
const helper = require('./upload');
const sendMail = require('./sendmail');

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
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
// app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json({limit: '1000mb'}));
app.use(express.urlencoded({extended: true ,limit: '1000mb'}));
app.use(bodyParser.raw({ type: 'image/*', limit: '160MB' }));

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


//หน้า exams

app.get('/api/exam/:id', function (req, res) {
  console.log('article_id'+req.params.id);
  const article_id = req.params.id;
  connection.query(`SELECT * FROM exams WHERE exams.article_id = ?;`,[article_id], function(err, results) {
    if (err) {
      // จัดการข้อผิดพลาดที่เกิดขึ้น
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    console.log(results);
  });
  const query = `SELECT exams.*, questions.*, options.*
  FROM exams
  LEFT JOIN questions ON exams.exam_id = questions.exam_id
  LEFT JOIN options ON questions.question_id = options.question_id
  WHERE exams.article_id = ?;`;

connection.query(query,[article_id], function(err, results) {
  if (err) {
    // จัดการข้อผิดพลาดที่เกิดขึ้น
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
  // console.log(results);
  const groupedData = {};

  // ลูปผ่านข้อมูลที่คุณได้รับ
  results.forEach((item) => {
    const {
      question_id,
      question_text,
      question_image,
      question_imagedata,
      qusetopn_options,
    } = item;
    let base64Image = null;
    if(!groupedData[question_id]){
      if(question_imagedata){
         base64Image = `data:image/jpeg;base64,${Buffer.from(question_imagedata).toString('base64')}`;
      }
    }
    // ถ้ายังไม่มีข้อมูลสำหรับคำถามนี้ใน groupedData
    if (!groupedData[question_id]) {
      groupedData[question_id] = {
        question_id,
        question_text,
        question_image,
        question_imagedata: base64Image,
        question_options: [],
      };
    }

    // เพิ่มตัวเลือกของคำถามนี้เข้าไปใน question_options
    let option = {
      option_id: item.option_id,
      option_text: item.option_text,
      is_correct: item.is_correct,
    };
   
    groupedData[question_id].question_options.push(option);
  });
 
  // แปลง Object ใน groupedData เป็น Array
  const result = Object.values(groupedData);
  // console.log(result.question_options[0]);
  console.log(result);
  res.json(result);
  result.forEach(r =>{
    console.log(r);
  })
  });
});

//close หน้า exam 




//แก้เพิ่มย้ายบรรทัด ให้เรียก เก็บรูปในดาต้า
// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../frontend/public/picture'); 
  },
  filename: (req, file, cb) => {
    const fileName =  'temp'+Date.now() + path.extname(file.originalname); 
    cb(null, fileName);
  },
});

const upload = multer({ storage:storage });

//หน้าหนังสือ
app.get('/api/book', function (req, res) {
 
  connection.query(
      'SELECT * FROM book',
      function(err, results) {
        const bookdata = results.map((book) => {
          const img = helper.convertBlobToBase64(book.book_imagedata);
          return {
            ...book,
            book_imagedata: img,
          };
        });
        // console.log(results);
        console.log(bookdata);
        res.json(bookdata);
        // res.json(results);
      }
    );
});
app.delete('/api/deletebook/:bookId', function (req, res) {
  const bookid = req.params.bookId;
  console.log('removed book : '+ bookid);

  connection.query(
      'DELETE FROM book WHERE book_id = ?',[bookid],
      function(err, results) {
        if (err) {s
          console.error('Error removed book:', err);
          res.status(500).json({ error: 'Error removed book' });
      } else {
          console.log('removed book successfully');
          res.status(200).json({ message: 'removed book successfully' });
      }
      }
    );
});
// แก้เพิ่ม
  app.post('/api/addbook',upload.single('book_image'),  (req, res) => {
    const { book_name, book_detail } = req.body;
    console.log(book_name);
    console.log(book_detail);
    const fs = require('fs');

    const filePath = req.file ? req.file.path : null;
    console.log(filePath);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return res.status(500).send('Error reading file');
      }

    const binaryData = data;
    
    // fs.unlink(filePath, (err) => {
    //   if (err) {
    //     console.error('Error deleting file:', err);
    //   }
    //   console.log('File deleted');
    // });

    let fileName = '../frontend/public/picture/'+Date.now() + '_image.jpg'; // ตำแหน่งของไฟล์ที่คุณต้องการบันทึก
    pathimage = fileName.replace('../frontend/public', '');
    fs.writeFile(fileName, binaryData, (err) => {
      if (err) {
        console.error('Error saving file:', err);
      }
      
      console.log('File saved:', fileName);
    });
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
      console.log(book_id);

      connection.query("INSERT INTO book (book_id, book_name, book_detail, book_image, book_imagedata) VALUES (?, ?, ?, ?,?)", 
      [book_id, book_name, book_detail,pathimage,binaryData], 
      (err, result) => {
          if (err) {s
              console.error('Error adding book:', err);
              res.status(500).json({ error: 'Error adding book' });
          } else {
              console.log('Book added successfully');
              res.status(200).json({ message: 'Book added successfully' });
          }
      });
    });
});

  });


  app.get('/api/article', function (req, res) {
 
    connection.query(
        'SELECT * FROM article',
        function(err, results) {
          const articledata = results.map((article) => {
            const img = helper.convertBlobToBase64(article.article_imagedata);
            return {
              ...article,
              article_imagedata: img,
            };
          });
          console.log(articledata);
          res.json(articledata);
          // res.json(results);
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
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
  
        const articlesWithImages = results.map((article) => {
          const img = helper.convertBlobToBase64(article.article_imagedata);
          return {
            ...article,
            article_imagedata: img,
          };
        });
        console.log(articlesWithImages);
        res.json(articlesWithImages);
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
        const articlesWithImages = results.map((article) => {
          const img = helper.convertBlobToBase64(article.article_imagedata);
          return {
            ...article,
            article_imagedata: img,
          };
        });
        console.log(articlesWithImages);
        res.json(articlesWithImages);
        //  res.json(results);
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
        const user =  results.map((item)=>{
            const img = helper.convertBlobToBase64(item.user_idcard);
            return{
              ...item,
              user_idcard: img,
            };
        });
        console.log(res.json(user));
      }
    );
});
app.post('/api/updateuser/:id',async function (req, res) {
  const userId = req.params.id;
  const { status, email } = req.body;

  
  console.log(status);
  console.log(email);
  if(status === 'rejected'||status ==='approved')
  {
  await sendMail(email,'การลงทะเบียนเข้าใช้งานเป็นผู้สร้างสำหรับ Reading Studio',status ==='approved' ?
  'บัญชีของคุณได้รับการอนุมัติให้เข้าใช้งานเป็นผู้สร้างแล้ว สามารถเข้าสู่ระบบเพื่อใช้งาน' : 'บัญชีของคุณไม่ได้รับการอนุมัติให้เข้าใช้งานเป็นผู้สร้าง กรุณาลงทะเบียนใหม่อีกครั้ง');
  }
  connection.query(
    'UPDATE user SET approval_status = ? WHERE user_id = ?',
    [status, userId],
    function (err, results) {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update user' });
      } else {
        res.json({ message: 'User updated successfully' });
      }
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
        res.status(401).send({ message: "อีเมล์หรือรหัสผ่านผิด กรุณาตรวจสอบ" });
      } else {
        if(results.length > 0){
          const user = results[0];
          const passwordMatch = await bcrypt.compare(password, user.user_password);

          if (passwordMatch) {
            if(user.approval_status === 'approved'){
              const accessToken = generateAccessToken({ user_id: user.user_id });
              res.status(200).send({ accessToken: accessToken, email: req.body.email });
            }else {
              res.status(401).send({ message: "อีเมลยังไม่ได้รับการอนุมัติ" });
            }
          } else {
            res.status(401).send({ message: "อีเมล์หรือรหัสผ่านผิด กรุณาตรวจสอบ" });
          }
        }

      }
    }
  );
});

app.post('/api/register',upload.single('idcard'),async (req, res) => {
  const { name, surname, email, password, usertype } = req.body;
  const saltRounds = 10;
  const imageFile = req.file ? req.file : null;
  let imagepath = null;
  let imageByte = null;
  let approval = 'pending'; 
  if(usertype === 'learner')
    approval = 'approved'
  console.log(name);
  console.log(surname);
  console.log(email);
  console.log(password);
  console.log(req.file);
  if(imageFile)
  {
    imageByte = await helper.readFileAsync(imageFile.path);
    console.log(imageFile,imageFile.path ,imageByte);
    let img = helper.generateUniqueFileName('picture');
    imagepath = img.pathimage;
    await helper.writeFileAsync(img.fileName ,imageByte);
    fs.unlinkSync(imageFile.path);
  }
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
                    "INSERT INTO user (user_name, user_surname, user_email, user_password, user_type, user_idcard , approval_status) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    [name, surname, email, hashedPassword, usertype,imageByte,approval],
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

app.post('/api/del_report/:id', (req, res) => {
  const report_id = req.params.id;
  connection.query(
    `DELETE FROM reports WHERE report_id = ?;`,
    [report_id],
    function(err, results) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
      } else {
        res.status(200).json({ message: 'Report deleted successfully' });
      }
    }
  );
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

const fs = require('fs');
const path = require('path');
// app.use(bodyParser.json({ limit: '100mb' })); // ตั้งค่า limit สูงขึ้นถ้าข้อมูลที่คุณรับมีขนาดใหญ่
app.post('/api/add-data',upload.single('questionsImage'),async (req, res) => {

  // ตรวจสอบข้อมูลอื่น ๆ ที่ถูกส่งมาจาก FormData
  const book_id = req.body.book_id;
  const article_id = req.body.article_id;
  const total_questions = req.body.total_questions;
  const questionstext = req.body.questionstext;
  const options = JSON.parse(req.body.questionsoptions);questionstext
  const correctOption = req.body.questionscorrectOption;
  const imageFile = req.file ? req.file : null; // ไฟล์รูปภาพ
  console.log(book_id);
  console.log(article_id);
  console.log(total_questions);
  console.log(questionstext);
  console.log(options);
  console.log(correctOption);
  console.log(req.file);
  let imagepath = null;
  let imageByte = null;
  if(imageFile)
  {
    imageByte = await helper.readFileAsync(imageFile.path);
    console.log(imageFile,imageFile.path ,imageByte);
    let img = helper.generateUniqueFileName('picture');
    imagepath = img.pathimage;
    await helper.writeFileAsync(img.fileName ,imageByte);
    console.log(imageByte);
  }
  const insertExamQuery = `INSERT INTO exams (book_id, article_id, total_questions) VALUES (?, ?, ?)`;
  connection.query(insertExamQuery, [book_id, article_id, total_questions], (err, result) => {
    if (err) {
      console.error('Error inserting exam data: ' + err.message);
      res.status(500).send('Error creating exam Insert Id');
    }
    else {
      console.log('total_question '+ total_questions);
      const examId = result.insertId;
      const insertQuestionQuery = `INSERT INTO questions (exam_id, question_text,question_image,question_imagedata) VALUES (?, ?, ?, ?)`;
        connection.query( insertQuestionQuery, [examId, questionstext,imagepath,imageByte], (err, questionResult) => {
          if (err) {
            console.error('Error inserting question data: ' + err.message);
            res.status(500).send('Error creating exam INSERT Question');
          } 
          else {
            const questionId = questionResult.insertId;
            const insertOptionQuery = `INSERT INTO options (question_id, option_text,is_correct) VALUES (?, ? , ?)`;
            options.forEach((option, index) => {
              console.log('total_question '+option);
              let correct = 0;
              if( correctOption.toString() === index.toString())
                correct = 1;
              connection.query(insertOptionQuery, [questionId, option,correct]);
            });
          }
        }
      );
      // ทำอะไรกับข้อมูลอื่น ๆ ของคำถาม
      res.status(200).send('Exam created successfully');
    }
  });
});

// สร้างเส้นทางสำหรับรับไฟล์ภาพและเสียง
app.post('/api/addarticle', upload.fields([{ name: 'image', maxCount: 1 },  { name: 'sound', maxCount: 1 }]),async (req, res) => {
  // ในที่นี้คุณสามารถเข้าถึงไฟล์ภาพและเสียงที่ถูกอัปโหลดผ่าน `req.files`

  const book_id = req.body.book_id;
  const chapter = req.body.chapter;
  const level = req.body.level;
  const description = req.body.description;
  // const imageFile = req.files.image ? req.files.image[0] : null; // ไฟล์รูปภาพ
  // const soundFile = req.files.sound ? req.files.sound[0] : null; // ไฟล์เสียง
  const imageFile = req.files['image'] ?  req.files['image'][0] : null; // ข้อมูลรูปภาพในรูปแบบ Buffer
  const soundFile = req.files['sound'] ?  req.files['sound'][0] : null; // ข้อมูลเสียงในรูปแบบ Buffer

  console.log(book_id, chapter, level, description, imageFile, soundFile);
  // console.log(book_id, chapter, level, description, imageBuffer, soundBuffer);

  let imagepath = null;
  let soundpath = null;

  let imageByte = null;
  let soundByte = null;
  
  if(imageFile)
  {
    imageByte = await helper.readFileAsync(imageFile.path);
    console.log(imageFile,imageFile.path ,imageByte);
    let img = helper.generateUniqueFileName('picture');
    imagepath = img.pathimage;
    await helper.writeFileAsync(img.fileName ,imageByte);
    fs.unlinkSync(imageFile.path);
  }
  if(soundFile)
  {
    soundByte = await helper.readFileAsync(soundFile.path);
    console.log(soundFile,soundFile.path, soundByte);
    let sod = helper.generateUniqueFileName('sound');
    soundpath = sod.pathimage;
    await helper.writeFileAsync(sod.fileName,soundByte);
    fs.unlinkSync(soundFile.path);
  }
  connection.query("SELECT article_id FROM article ORDER BY article_id DESC LIMIT 1", (err, results) => {
    if (err) {
        console.error('Error fetching last article_id:', err);
        res.status(500).json({ error: 'Error fetching last article_id' });
        return;
    }
    let lastNumber = 0;
    if (results.length > 0) {
        const lastBookId = results[0].article_id;
        if(lastBookId.toString().startsWith('XOL'))
          lastNumber = parseInt(lastBookId.replace('XOL', ''), 10); 
    }
    const newNumber = lastNumber + 1;
    const newarticleid = `XOL${String(newNumber).padStart(3, '0')}`;
    console.log('articleid : ' + newarticleid);

    const insertOptionQuery = `INSERT INTO article (article_id ,book_id, article_name ,article_level ,article_detail  ,article_images ,article_sounds,article_imagedata ,article_sounddata) VALUES (?,?,?,?,?,?,?,?,?)`;
    connection.query(insertOptionQuery, [newarticleid,book_id, chapter,level, description , imagepath , soundpath,imageByte,soundByte], (err, results) => {
      if (err) {
        console.error('Error inserting exam data: ' + err.message);
        res.status(500).send('Error creating exam Insert Id');
      }else{
        res.status(200).send('creating exam Insert Id');
      }
    });
  });
});