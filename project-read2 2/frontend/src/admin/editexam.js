import React, { useEffect, useState } from 'react';
import Header from '../header';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { useLocation } from 'react-router-dom';
import "../styles/addexam.css";

function Editexam() {
  const location = useLocation();
  const articleid = location.state.article_id;
  const articlename = location.state.article_name;
  const bookname = location.state.book_name;
  const [qitems, setqItems] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    console.log('articlename'+ articlename);
    console.log('bookname'+ bookname);
    console.log('article_id'+ articleid);

    axios
      .get(`http://localhost:5004/api/exam/${articleid}`)
      .then((response) => {
        let tempArr = response.data.slice().reverse();
        setqItems(tempArr);

        // แปลงข้อมูลจาก qitems เป็นรูปแบบของ questions
        const initialQuestions = tempArr.map((item) => ({
          text: item.question_text,
          image: item.question_imagedata, // หรือ item.question_image ขึ้นอยู่กับข้อมูลจริง
          options: item.question_options.map((option) => option.option_text),
          correctOption: item.question_options.findIndex((option) => option.is_correct === 1), // หรือตามวิธีที่คุณจัดการคำตอบที่ถูกต้อง
        }));

        setQuestions(initialQuestions);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [articleid]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        image: null,
        options: ['', '', '', ''],
        correctOption: 0,
      },
    ]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (index, text) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = text;
    setQuestions(updatedQuestions);
  };

  const handleImageUpload = (index, file) => {
    const updatedQuestions = [...questions];
    // updatedQuestions[index].image = file;

    if (file) {
      updatedQuestions[index].imageURL = URL.createObjectURL(file);

    } else {
      updatedQuestions[index].imageURL = updatedQuestions[index].image;
    }

    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (index, optionIndex, optionText) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options[optionIndex] = optionText;
    setQuestions(updatedQuestions);
  };

  const handleCorrectOptionChange = (index, correctOption) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].correctOption = correctOption;
    setQuestions(updatedQuestions);
  };

  const submitExam = () => {
    // ตรวจสอบว่าข้อมูลคำถามถูกกรอกครบถ้วน
    if (questions.some((question) => !question.text || !question.options.every((option) => option !== '') || !question.image)) {
      alert('โปรดกรอกข้อมูลคำถามและตัวเลือกให้ครบถ้วน');
      return;
    }

    // ส่งข้อมูลคำถามไปยัง API ด้วย Axios หรือวิธีการส่งข้อมูลของคุณ
    // ตัวอย่าง: axios.post('URL ของ API', questions)
  };

  return (
    <div>
      <Header />

      <section>
        <h1>แก้ไขสอบ</h1>

        <div className="grid-container">
          <form className="form-group">
            <div className="mb-3">
              <label htmlFor="bookname">ชื่อบทความ</label>
              <input
                type="text"
                className="form-control"
                id="bookname"
                value={bookname}
                disabled readOnly
              />
            </div>

            <div className="mb-3">
              <label htmlFor="articlename">ชื่อตอน</label>
              <input
                type="text"
                className="form-control"
                id="articlename"
                value={articlename}
                disabled readOnly
              />
            </div>

            <div className="question-group-container">
              {questions.map((question, index) => (
                <div key={index} className="question-container">
                  <div className="mb-3">
                    <label className="form-label">คำถามที่ {index + 1}</label>
                    <textarea
                      type="text"
                      className="form-control"
                      placeholder="โจทย์ข้อสอบ"
                      value={question.text}
                      onChange={(e) => handleQuestionChange(index, e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor={`imageUpload${index}`}>
                      อัปโหลดรูปภาพ (ถ้ามี)
                    </label>
                    <input
                      type="file"
                      id={`imageUpload${index}`}
                      accept="image/*"
                      onChange={(e) => handleImageUpload(index, e.target.files[0])}
                    />
                    { (
                      <img
                        src={ question.imageURL != null ? question.imageURL : question.image  }
                        alt="Uploaded Image"
                        style={{ maxWidth: '100%', maxHeight: '200px' }}
                      />
                    )}
                  </div>

                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="mb-3">
                      <label className="form-label" htmlFor={`choice${index}_${optionIndex}`}>
                        ตัวเลือกที่ {optionIndex + 1}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id={`choice${index}_${optionIndex}`}
                        value={option}
                        onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                        required
                      />
                    </div>
                  ))}

                  <div className="mb-3">
                    <label className="form-label" htmlFor={`correctchoice${index}`}>
                      คำตอบที่ถูกต้อง
                    </label>
                    <select
                      id={`correctchoice${index}`}
                      className="form-select"
                      value={question.correctOption}
                      onChange={(e) => handleCorrectOptionChange(index, e.target.value)}
                      required
                    >
                      {question.options.map((option, optionIndex) => (
                        <option key={optionIndex} value={optionIndex}>
                          ตัวเลือกที่ {optionIndex + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Button className="btn btn-warning" onClick={() => removeQuestion(index)}>
                      ลบคำถาม
                    </Button>
                  </div>
                </div>
              ))}

              <div>
                <Button className="btn btn-primary" onClick={addQuestion}>
                  เพิ่มคำถาม
                </Button>
              </div>
            </div>

            <Button
              type="button"
              className="btn btn-primary"
              onClick={submitExam}
            >
              ส่ง
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Editexam;
