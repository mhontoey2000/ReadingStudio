import React, { useEffect, useState } from "react";
import Header from "./header";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import axios from "axios";
import "./styles/addexam.css";
import { useLocation } from "react-router-dom";
import { useHistory } from 'react-router-dom';

function Addexam() {
  const location = useLocation();
  const articleid = location.state.article_id;
  const bookid = location.state.book_id;
  const [isLoaded, setIsLoaded] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0); // Initialize with the desired default value
  const history = useHistory();
  const [bname, setBname] = useState("");
  const [aname, setAname] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5004/api/articledetail/${articleid}`)
      .then((response) => {
        setAname(response.data[0].article_name);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [articleid]);

  useEffect(() => {
    axios
      .get(`http://localhost:5004/api/book`)
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

  const submitExam = () => {
    if (
      questions.some(
        (question) =>
          !question.text || !question.options.every((option) => option !== "")
      )
    ) {
      alert("Please fill in all question details.");
      return;
    }

    // Create an array to hold the question data
    const questionsData = questions.map((question) => {
      const formData = new FormData();
      formData.append("question_text", question.text);
      if (question.image) {
        formData.append("question_image", question.image);
      }
      formData.append("options", JSON.stringify(question.options));
      formData.append("correct_option_id", question.correctOption);
      return formData;
    });

    // Send a POST request to your /api/add-data endpoint with the data
    const formData = new FormData();
    formData.append("book_id", bookid);
    formData.append("article_id", articleid);
    formData.append("total_questions", totalQuestions);
    console.log("book_id", bookid);
    console.log("article_id", articleid);
    console.log("total_questions", totalQuestions);
    questionsData.forEach((questionData, index) => {
      formData.append(`questions[${index}]`, questionData);
      console.log(`questions[${index}]`, questionData);
    });

    axios
      .post("http://localhost:5004/api/add-data", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Exam created successfully");
        setQuestions([
          {
            text: "",
            image: null,
            options: ["", "", "", ""],
            correctOption: 0,
          },
        ]);
      })
      .catch((error) => {
        alert("Error creating exam");
        console.error(error);
      });
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
              <label className="form-label">ชื่อหนังสือ</label>
              <input
                type="text"
                className="form-control"
                value={bname}
                disabled
                readOnly
              />
            </div>
            <div className="col mb-3">
              <label className="form-label">ชื่อบท</label>
              <input
                type="text"
                className="form-control"
                value={aname}
                disabled
                readOnly
              />
            </div>
          </div>
          <div className="col mb-3">
            <label className="form-label">จำนวนคำถามทั้งหมด</label>
            <input
              type="number"
              className="form-control"
              value={totalQuestions}
              onChange={(e) => setTotalQuestions(e.target.value)}
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
                    onChange={(e) =>
                      handleQuestionChange(index, e.target.value)
                    }
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  {/* <div className="input-group"> */}
                  <label className="form-label" htmlFor={`uploadpic${index}`}>
                    รูปสำหรับโจทย์(ถ้าหากมี)
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
                type="submit"
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
    </div>
  );
}

export default Addexam;
