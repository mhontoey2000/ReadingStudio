import React, { useEffect, useState } from "react";
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import "../styles/addexam.css";

function Editexam() {
  const location = useLocation();
  const history = useHistory();
  const articleid = location.state.article_id;
  const articlename = location.state.article_name;
  const bookname = location.state.book_name;
  const bookid = location.state.book_id;
  const [qitems, setqItems] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [tempArrCount, setTempArrCount] = useState(0);
  const [exam_id, setExamid] = useState(-1);
  const [showModal, setShowModal] = useState(false);

  // Function to show the success modal
  const showSuccessModal = () => {
    setShowModal(true);
  };

  // Function to hide the success modal
  const hideSuccessModal = () => {
    setShowModal(false);
    history.goBack();
  };

  useEffect(() => {
    console.log("articlename" + articlename);
    console.log("bookname" + bookname);
    console.log("article_id" + articleid);

    axios
      .get(`http://localhost:5004/api/exam/${articleid}`)
      .then((response) => {
        let tempArr = response.data.slice();
        setqItems(tempArr);
        const tempArrCount = tempArr.length;
        setTempArrCount(tempArrCount);
        console.log("จำนวนรายการใน tempArr: " + tempArrCount);

        // แปลงข้อมูลจาก qitems เป็นรูปแบบของ questions
        const initialQuestions = tempArr.map((item) => ({
          exam_id: item.exam_id,
          id: item.question_id,
          text: item.question_text,
          image: item.question_imagedata, // หรือ item.question_image ขึ้นอยู่กับข้อมูลจริง
          imagetemp: item.question_imagedata, // หรือ item.question_image ขึ้นอยู่กับข้อมูลจริง
          options: item.question_options.map((option) => option.option_text),
          correctOption: item.question_options.findIndex(
            (option) => option.is_correct === 1
          ), // หรือตามวิธีที่คุณจัดการคำตอบที่ถูกต้อง
        }));
        setExamid(tempArr[0].exam_id);
        console.log("exam_id : " + exam_id);

        setExamid(initialQuestions[0].exam_id);
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
        id: -1,
        text: "",
        image: null,
        options: ["", "", "", ""],
        correctOption: 0,
      },
    ]);
  };

  const removeQuestion = (index, questionid) => {
    console.log("คุณแน่ใจหรือไม่ที่ต้องการลบคำถามนี้ : " + questionid);

    const confirmDelete = window.confirm(
      "คุณแน่ใจหรือไม่ที่ต้องการลบคำถามนี้?"
    );
    if (confirmDelete) {
      const updatedQuestions = [...questions];
      updatedQuestions.splice(index, 1);
      removeQuestionFromServer(questionid);
      setQuestions(updatedQuestions);
    }
  };
  const removeQuestionFromServer = (questionId) => {
    // สร้างคำขอ HTTP DELETE โดยระบุ URL ของ API และ ID ของคำถามที่ต้องการลบ
    if (questionId !== -1) {
      axios
        .delete(`http://localhost:5004/api/deleteeditexam/${questionId}`)
        .then((response) => {
          console.log("ลบข้อมูลในเซิร์ฟเวอร์เรียบร้อย");
          // ทำอย่างอื่น ๆ ที่คุณต้องการหลังจากการลบ
        })
        .catch((error) => {
          console.error("เกิดข้อผิดพลาดในการลบข้อมูลในเซิร์ฟเวอร์", error);
        });
    }
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
      updatedQuestions[index].image = file;
      updatedQuestions[index].imageURL = URL.createObjectURL(file);
    } else {
      updatedQuestions[index].image = null;
      updatedQuestions[index].imageURL = updatedQuestions[index].imagetemp;
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

  const submitEditQuestion = (question) => {
    const formData = new FormData();
    formData.append("exam_id", exam_id);
    formData.append("question_id", question.id);
    formData.append("book_id", bookid);
    formData.append("article_id", articleid);
    formData.append("total_questions", questions.length);
    formData.append("questionstext", question.text);
    if (question.image != null)
      formData.append("questionsImage", question.image); // หรือตามวิธีที่คุณจัดการรูปภาพ
    formData.append(`questionsoptions`, JSON.stringify(question.options));
    formData.append(`questionscorrectOption`, question.correctOption);

    axios
      .post(`http://localhost:5004/api/editexam/`, formData)
      .then((response) => {
        console.error("บันทึกข้อมูลเรียบร้อย");
      })
      .catch((error) => {
        console.error(error);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      });
  };
  const submitAddQuestion = async (question) => {
    try {
      const data = new FormData();
      data.append("exam_id", exam_id);
      data.append("book_id", bookid);
      data.append("article_id", articleid);
      data.append("total_questions", questions.length);
      data.append(`questionstext`, question.text);
      data.append(`questionsImage`, question.image);
      data.append(`questionsoptions`, JSON.stringify(question.options));
      data.append(`questionscorrectOption`, question.correctOption);

      const response = await axios.post(
        "http://localhost:5004/api/add-data",
        data
      );
      if (response.status === 200) {
        console.log(response.data);
      } else {
        console.error("ไม่สามารถบันทึกข้อมูลได้");
        alert("ไม่สามารถบันทึกข้อมูลได้");
      }
    } catch (error) {
      // Handle errors here (e.g., show an error message)
      console.error("Error adding book:", error);
      alert(error);
    }
  };
  const submitExam = () => {
    if (
      questions.some(
        (question) =>
          !question.text || !question.options.every((option) => option !== "")
      )
    ) {
      alert("โปรดกรอกข้อมูลคำถามและตัวเลือกให้ครบถ้วน");
      return;
    }
    // ส่งข้อมูลแต่ละข้อไปยังเซิร์ฟเวอร์
    questions.forEach((question, index) => {
      console.log(
        (tempArrCount - 1 >= index
          ? "submitEditQuestion"
          : "submitAddQuestion") +
          " : Questopn : " +
          index +
          ": asdas" +
          question.text
      );
      if (tempArrCount - 1 >= index) submitEditQuestion(question);
      else submitAddQuestion(question);
    });
    //alert("Success");
    showSuccessModal();
    //history.goBack();
  };

  return (
    <div>
      <Header />

      <section>
        <h1>แก้ไขสอบ</h1>

        <div className="grid-container">
          <div className="fgFE">
            <h2>กรุณากรอกข้อมูลของข้อสอบ</h2>
            <form className="form-group">
              <div className="mb-3">
                <label htmlFor="bookname">ชื่อบทความ</label>
                <input
                  type="text"
                  className="form-control"
                  id="bookname"
                  value={bookname}
                  disabled
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label htmlFor="articlename">ชื่อตอน</label>
                <input
                  type="text"
                  className="form-control"
                  id="articlename"
                  value={articlename}
                  disabled
                  readOnly
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
                      <label
                        className="form-label"
                        htmlFor={`imageUpload${index}`}
                      >
                        อัปโหลดรูปภาพ (ถ้ามี)<cite style={{color:"red"}}>*ขนาดรูปที่แนะนำคือ 300x300</cite>
                      </label>
                      <input
                        type="file"
                        id={`imageUpload${index}`}
                        accept="image/*"
                        onChange={(e) =>
                          handleImageUpload(index, e.target.files[0])
                        }
                      />
                      {
                        <div className="d-flex justify-content-center align-items-center">
                        <img
                          src={
                            question.imageURL != null
                              ? question.imageURL
                              : question.image
                          }
                          alt="Uploaded Image"
                          style={{ maxWidth: "100%", maxHeight: "200px" }}
                        />
                        </div>
                      }
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
                            handleOptionChange(
                              index,
                              optionIndex,
                              e.target.value
                            )
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
                        {question.options.map((option, optionIndex) => (
                          <option key={optionIndex} value={optionIndex}>
                            ตัวเลือกที่ {optionIndex + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Button
                        className="btn btn-warning"
                        style={{ color: "white" }}
                        onClick={() => removeQuestion(index, question.id)}
                      >
                        ลบคำถาม
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: "center", margin: "20px" }}>
                <Button className="btn btn-primary" onClick={addQuestion}>
                  เพิ่มคำถาม
                </Button>
              </div>

              <div
                className="d-flex justify-content-between"
                style={{ margin: "20px" }}
              >
                <Button type="button" className="btn btn-danger btn-lg">
                  ยกเลิก
                </Button>

                <Button
                  type="button"
                  className="btn btn-success btn-lg"
                  onClick={submitExam}
                >
                  บันทึก
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Modal show={showModal} onHide={hideSuccessModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>สำเร็จ!</Modal.Title>
        </Modal.Header>
        <Modal.Body>ได้ทำการบันทึกการแก้ไขข้อสอบแล้ว</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={hideSuccessModal}>
            ตกลง
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Editexam;
