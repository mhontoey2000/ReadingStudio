import React, { useEffect, useState } from "react";
import Header from "./header";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import "./styles/addexam.css";
import { Await, useLocation } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import { apiClient , convertSoundToBase64,convertImageToBase64 } from './config';



function Addexam() {
  const location = useLocation();
  const articleid = location.state.article_id;
  const bookid = location.state.book_id;
  const [isLoaded, setIsLoaded] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0); // Initialize with the desired default value
  const history = useHistory();
  const [bname, setBname] = useState("");
  const [aname, setAname] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    apiClient.get(`api/articledetail/${articleid}`)
      .then((response) => {
        setAname(response.data[0].article_name);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [articleid]);

  useEffect(() => {
    apiClient.get(`api/book`)
      .then((response) => {
        //console.log(response.data);
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].book_id === bookid) {
            // console.log("working")
            // console.log(response.data[i].book_name)
            setBname(response.data[i].book_name);
          }
          // console.log(response.data[i].book_id)
        }
        // console.log(bookid)
      })
      .catch((error) => {
        console.error(error);
      });
  }, [bookid]);

  const [questions, setQuestions] = useState([
    {
      text: "",
      image: null, // ใช้เก็บข้อมูลรูปภาพ
      options: ["", "", "", ""],
      correctOption: 0,
    },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        image: null,
        options: ["", "", "", ""],
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

  const handleImageChange = (index, image) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].image = image;
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

// แก้การส่งหน้าสร้างข้อสอบ
const submitExam = async () => {
  if (
    questions.some(
      (question) =>
        !question.text || !question.options.every((option) => option !== "")
    )
  ) {
    alert("Please fill in all question details.");
    return;
  }

  try {
    let exam_id = '-1';
    for (let index = 0; index < questions.length; index++) {
      const question = questions[index];

      const data = new FormData();
      data.append('exam_id', exam_id);
      data.append('book_id', bookid);
      data.append('article_id', articleid);
      data.append('total_questions', questions.length);
      data.append(`questionstext`, question.text);
      data.append(`questionsImage`, question.image);
      data.append(`questionsoptions`, JSON.stringify(question.options));
      data.append(`questionscorrectOption`, question.correctOption);

      // Send POST request
      const response = await apiClient.post("api/add-data", data);
        console.log(index);
        console.log(response.data);
        exam_id = response.data.toString();
        console.log('exam_id :' + exam_id);
        if (index === questions.length - 1) {
          setQuestions([
            {
              text: "",
              image: null,
              options: ["", "", "", ""],
              correctOption: 0,
            },
          ]);
          setShowModal(true);
        }
    }
    cancelExam();
  } catch (error) {
    // Handle errors here (e.g., show an error message)
    console.error('Error adding book:', error);
    alert(error);
  }
};

const handleCloseModal = () => {
  // Close the modal
  setShowModal(false);
};
 
  const cancelExam = () => {
    history.goBack();
}


  return (
    <div>
      <Header />

      <section>
        <h1 style={{ margin: "10px", paddingBottom: "10px" }}>เพิ่มข้อสอบ</h1>
        <div className="grid-containerr">
          <div className="fgFE">
            <h2>กรุณากรอกข้อมูลของข้อสอบ</h2>
          <div className="row">
            <div className="col mb-3">
              <label className="form-label">ชื่อบทความ</label>
              <input
                type="text"
                className="form-control"
                value={bname}
                disabled
                readOnly
              />
            </div>
            <div className="col mb-3">
              <label className="form-label">ชื่อตอน</label>
              <input
                type="text"
                className="form-control"
                value={aname}
                disabled
                readOnly
              />
            </div>
          </div>
          {/* <div className="col mb-3">
            <label className="form-label">จำนวนคำถามทั้งหมด</label>
            <input
              type="number"
              className="form-control"
              value={totalQuestions}
              onChange={(e) => setTotalQuestions(e.target.value)}
            />
          </div> */}

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
                    onChange={(e) =>
                      handleQuestionChange(index, e.target.value)
                    }
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  {/* <div className="input-group"> */}
                  <label className="form-label" htmlFor={`uploadpic${index}`}>
                    รูปสำหรับโจทย์(ถ้าหากมี)<cite style={{color:"red"}}>*ขนาดรูปที่แนะนำคือ 300x300</cite>
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id={`uploadpic${index}`}
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(index, e.target.files[0])
                    }
                  />
                  {questions[index].image && (
                    <img
                      src={URL.createObjectURL(questions[index].image)}
                      alt="Uploaded Image"
                      style={{ maxWidth: "100%", maxHeight: "200px" }} // Adjust the size as needed
                    />
                  )}
                </div>

                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="mb-3">
                    <label
                      className="form-label"
                      htmlFor={`choice${index}_${optionIndex}`}
                    >
                      ตัวเลือกที่ {optionIndex + 1}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id={`choice${index}_${optionIndex}`}
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, optionIndex, e.target.value)
                      }
                      required
                    />
                  </div>
                ))}

                <div className="mb-3">
                  <label
                    className="form-label"
                    htmlFor={`correctchoice${index}`}
                  >
                    คำตอบที่ถูกต้อง
                  </label>
                  <select
                    id={`correctchoice${index}`}
                    className="form-select"
                    value={question.correctOption}
                    onChange={(e) =>
                      handleCorrectOptionChange(index, e.target.value)
                    }
                    required
                  >
                    {/* <option defaultValue>กรุณาเลือก</option> มันไม่ยอมเป็นกรุณาเลือก */}
                    {question.options.map((option, optionIndex) => (
                      <option key={optionIndex} value={optionIndex}>
                        ตัวเลือกที่ {optionIndex + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Button
                    className="btn1 btn-danger dq"
                    onClick={() => removeQuestion(index)}
                  >
                    ลบคำถาม
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="addQ">
            <Button 
             className="btn btn-primary" 
             onClick={addQuestion}
             >
              เพิ่มคำถาม
            </Button>
          </div>

          <div className="btn-containerr">
            <div className="btn-group me-2">
              <Button
                // type="submit"
                className="btn1 btn-warning"
                onClick={cancelExam}
              >
                ยกเลิก
              </Button>
            </div>
            <div>
              <Button 
               className="btn1 btn-success" 
               onClick={submitExam}
              >
                สร้างข้อสอบ
              </Button>
            </div>
          </div>
        </div>
        </div>
      </section>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>สำเร็จ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>สร้างชุดข้อสอบสำเร็จ</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            ตกลง
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default Addexam;
