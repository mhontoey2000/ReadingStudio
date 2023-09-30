import React, { useEffect, useState } from 'react';
import Header from '../header';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { useLocation } from 'react-router-dom';
import { Rss } from 'react-bootstrap-icons';
import "../styles/addexam.css";

function Editexam() {

  const [questions, setQuestions] = useState([
    {
      text: '',
      image: null, // ใช้เก็บข้อมูลรูปภาพ
      options: ['', '', '', ''],
      correctOption: 0,
    },
  ]);

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
    // ตรวจสอบว่าข้อมูลคำถามถูกกรอกครบถ้วน
    if (questions.some((question) => !question.text || !question.options.every((option) => option !== '') || !question.image)) {
      alert('โปรดกรอกข้อมูลคำถามและตัวเลือกให้ครบถ้วน');
      return;
    }
  };

  return (
    
    <div>
      
      <Header/>

      <section>
          <h1>แก้ไขสอบ</h1>

          <div className="grid-container">
            <form className="form-group">
            
                    <div className="mb-3">
                        <label htmlFor="bookname">ชื่อหนังสือ</label>
                        
                            <input 
                                type="text"
                                className ="form-control"  
                                id="bookname"
                                // value={bname}
                                disabled readOnly
                            />
                        
                    </div>

                    <div className="mb-3">
                        <label htmlFor="articlename">ชื่อบท</label>
                        <input 
                            type="text"
                            className ="form-control"  
                            id="articlename"
                            // value={aname}
                            disabled readOnly
                        />
                        {/* {article.article_name} */}
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
                            >
                            </textarea>
                            </div>

                            <div className="mb-3">
                              {/* <div className="input-group"> */}
                                <label 
                                  className="form-label" 
                                  htmlFor={`uploadpic${index}`}
                                  >
                                    รูปสำหรับโจทย์(ถ้าหากมี)
                                  </label>
                                <input
                                  type="file"
                                  className="form-control"
                                  id={`uploadpic${index}`}
                                  accept="image/*"
                                  onChange={(e) => handleImageChange(index, e.target.files[0])}
                                />
                                {questions[index].image && (
                                  <img
                                    src={URL.createObjectURL(questions[index].image)}
                                    alt="Uploaded Image"
                                    style={{ maxWidth: '100%', maxHeight: '200px' }} // Adjust the size as needed
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
                                    onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
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
                                onChange={(e) => handleCorrectOptionChange(index, e.target.value)}
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
                              <Button className="btn btn-warning" onClick={() => removeQuestion(index)}>ลบคำถาม</Button>
                            </div>
                          </div>
                        ))}
                        
                        <div>
                          <Button className="btn btn-primary" onClick={addQuestion}>เพิ่มคำถาม</Button>
                        </div>

                    </div>
                    
                    <Button 
                     type="submit" 
                     className="btn btn-primary"
                     //onClick={sendReport}
                    >
                        ส่ง
                    </Button>
              
            </form>
          

          </div>

      </section>

    </div>

  )
}

export default Editexam