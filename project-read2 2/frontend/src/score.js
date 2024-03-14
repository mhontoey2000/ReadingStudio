import React, { useEffect, useState } from "react";
import "./styles/score.css";
import Header from "./header";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Searchbar from "./searchbar";
import {
  apiClient,
  convertSoundToBase64,
  convertImageToBase64,
} from "./config"

function Score() {
  const user = localStorage.getItem("email");
  // const [usertype, setUsertype] = useState("");
  const location = useLocation();
  const history = useHistory();
  const [qitems, setqItems] = useState([]);
  const { submittedAnswers, examDetails, articleid } = location.state;
  const [score, setScore] = useState(0);

  useEffect(() => {
    let calculatedScore = 0;

    for (let i = 0; i < examDetails.length; i++) {
      const correctOption = examDetails[i].question_options.find(
        (option) => option.is_correct === 1
      );
      if (correctOption && submittedAnswers[i] === correctOption.option_id) {
        calculatedScore++;
      }
    }

    setScore(calculatedScore);
  }, [submittedAnswers, examDetails]);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5004/api/userdata?user_email=" + user)
  //     .then((response) => {
  //       setUsertype(response.data[0].user_type);
  //     })
  //     .catch((error) => console.error(error));
  // }, [user]);

  useEffect(() => {
    apiClient
      .get(`api/exam/${articleid}`)
      .then((response) => {
        let tempArr = response.data;
        setqItems(tempArr);
        //console.log("tempArr", tempArr);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const GoBack = () => {
    history.goBack();
  };

  return (
    <div>
      <Header />

      <section>
        <h1>สรุปคะแนน</h1>
        <div className="container mt-4">
          <div>
            <div className="resultscore">
              คะแนนที่คุณทำได้: {score}/{qitems.length}
            </div>

            {Array.isArray(qitems) && qitems.length > 0 ? (
              qitems.map((question, index) => (
                <div className="card mb-3" key={question.question_id}>
                  <div className="card-body" key={`vocabs_${index}`}>
                    <h5 className="card-title">{`${index + 1}. ${
                      question.question_text
                    }`}</h5>
                    {question.question_image && (
                      <img
                        src={question.question_imagedata}
                        className="img-fluid mx-auto d-block"
                        alt={`Image for question ${index + 1}`}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "300px",
                          objectFit: "contain",
                        }}
                      />
                    )}
                    <div>
                      {question.question_options.map((option, optionIndex) => {
                        const isChecked =
                          option.option_id === submittedAnswers[index];
                        const isCorrect = option.is_correct === 1;

                        return (
                          <div className="" key={`option_${optionIndex}`}>
                            <div
                              
                              className={`option-container ${
                                isChecked && !isCorrect ? "red-background" : ""
                              } ${isCorrect ? "green-background" : ""}`}
                            >
                              <input
                                type="radio"
                                className="q-options"
                                value={option.option_id}
                                name={`radioOption_${index}`}
                                id={`option_${optionIndex}`}
                                defaultChecked={isChecked}
                                disabled
                              />
                              <label
                                className=""
                                htmlFor={`option_${optionIndex}`}
                              >
                                {option.option_text}
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-items">ไม่มีชุดข้อสอบในตอนของบทความนี้.</div>
            )}
          </div>
        </div>
        <div className="addV" style={{ textAlign: "center" }}>
          <div className="btn-group me-2">
            <Button type="submit" className="btn btn-success" onClick={GoBack}>
              ตกลง
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Score;
