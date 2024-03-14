import React, { useEffect, useState } from "react";
import "./styles/bookdetail.css";
import Header from "./header";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Searchbar from "./searchbar";
import formatTime from "./formattime";
import {
  apiClient,
  convertSoundToBase64,
  convertImageToBase64,
} from "./config"

function Bookdetail(match) {
  const [items, setItems] = useState([]);
  const location = useLocation();
  const [historyRecorded, setHistoryRecorded] = useState(false); 
  const articleid = location.state.article_id;
  const user = localStorage.getItem("email");
  const userId = localStorage.getItem("user_id");
  const [Vitems, setVitems] = useState([]);
  const [bookid, setBookid] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioRef, setAudioRef] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [usertype, setUsertype] = useState("");
  const [remail, setRemail] = useState("");
  const [qitems, setqItems] = useState([]);
  const [visibleDiv, setVisibleDiv] = useState("เนื้อหา");
  const [highlighted, setHighlighted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const [highlightedArticleDetail, setHighlightedArticleDetail] = useState([]);
  
  const history = useHistory();
  const [submittedAnswers, setSubmittedAnswers] = useState([]);

  const handleAnswerChange = (questionIndex, selectedOptionId) => {
    // Clone the submittedAnswers array to avoid mutating the state directly
    const newSubmittedAnswers = [...submittedAnswers];

    // Update the answer for the specified question
    newSubmittedAnswers[questionIndex] = selectedOptionId;

    // Update the state with the new answers
    setSubmittedAnswers(newSubmittedAnswers);
  };

  const getUnansweredQuestions = () => {
    const unansweredQuestions = qitems.filter(
      (question, index) => !submittedAnswers[index]
    );
    return unansweredQuestions;
  };

  const handleShowModal = () => {
    const unanswered = getUnansweredQuestions();
    setUnansweredQuestions(unanswered);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleExamSubmit = () => {
    const unansweredQuestions = qitems.filter(
      (question, index) => !submittedAnswers[index]
    );

    if (unansweredQuestions.length > 0) {
      handleShowModal(); // Show the modal

    }else {
      console.log('4');
      
      // สร้าง FormData object
      const formData = new FormData();
      formData.append('submittedAnswers', submittedAnswers);
      // formData.append('examDetails', JSON.stringify(qitems)); // แปลง qitems เป็น JSON string
      formData.append('bookid', bookid);
      formData.append('articleid', articleid);
      formData.append('userId', userId );
    
      // ทำการ HTTP POST ด้วย FormData
      apiClient.post(`api/examhistory`, formData)
        .then((response) => {
          // setHistoryRecorded(true);
    
          // All questions have been answered, navigate to the score page
          history.push({
            pathname: "/Page/score",
            state: {
              submittedAnswers: submittedAnswers,
              examDetails: qitems,
              articleid: articleid,
            },
          });
        })
        .catch((error) => {
          console.error("Error recording history:", error);
        });
    }
    
  };
  const handleButtonClick = (divToShow) => {
    setVisibleDiv(divToShow);
  };

  useEffect(() => {
    apiClient
      .get("api/userdata?user_email=" + user)
      .then((response) => {
        setRemail(response.data[0].user_email);
        setUsertype(response.data[0].user_type);
      })
      .catch((error) => console.error(error));
  }, [user]);

  useEffect(() => {
    apiClient
      .get(`api/vocabs/${articleid}`)
      .then((response) => {
        let tempArr = response.data.slice().reverse();
        setVitems(tempArr);
        console.log("tempArr", tempArr);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [articleid]);

  useEffect(() => {
    apiClient
      .get(`api/articledetail/${articleid}?user_id=${userId}`)
      .then((response) => {
        setItems(response.data);
        setIsLoaded(true);
        const fetchedBookId = response.data[0].book_id;
        setBookid(fetchedBookId);
  
        const audioData = response.data[0].article_sounddata;
  
        if (audioData) {
          const audioBlob = new Blob([new Uint8Array(audioData.data)], {
            type: "audio/mpeg",
          });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(audioUrl);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [articleid, userId]);
  
  useEffect(() => {
    if (isLoaded) {
      apiClient
        .post(`api/articledetail/${articleid}/record-history`, {
          user_id: userId,
          book_id: bookid,
        })
        .then((response) => {
          setHistoryRecorded(true);
        })
        .catch((error) => {
          console.error("Error recording history:", error);
        });
    }
  }, [isLoaded, articleid, userId, bookid]);

  useEffect(() => {
    apiClient
      .get(`api/exam/${articleid}`)
      .then((response) => {
        let tempArr = response.data;
        setqItems(tempArr);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const deleteVocab = (vocabId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vocabulary item?"
    );

    if (confirmed) {
      apiClient
        .delete(`api/vocabs/${vocabId}`)
        .then((response) => {
          apiClient
            .get(`api/vocabs/${articleid}`)
            .then((response) => {
              setVitems(response.data.slice().reverse());
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const playAudio = async (url) => {
    if (audioUrl === url) {
      // Toggle play/pause for the same audio
      toggleAudio();
    } else {
      setAudioUrl(url);
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleAudioRef = (ref) => {
    setAudioRef(ref);
  };

  const handleTimeUpdate = () => {
    if (audioRef) {
      setCurrentTime(audioRef.currentTime);
      setDuration(audioRef.duration);
      setAudioProgress((audioRef.currentTime / audioRef.duration) * 100);
    }
  };

  const handleSeek = (event) => {
    const seekTime = parseFloat(event.target.value);
    setCurrentTime(seekTime);
    audioRef.currentTime = seekTime;
  };

  const toggleAudio = () => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.pause();
      } else {
        audioRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.play();
      } else {
        audioRef.pause();
      }
    }
  }, [isPlaying, audioRef]);

  useEffect(() => {
    if (items.length > 0) {
      const articleDetail = items[0].article_detail;
      const vocabs = Vitems.map((vocab) => vocab.vocabs_name);

      // Replace vocabulary words with highlighting
      const highlightedDetail = articleDetail.replace(
        new RegExp(`(${vocabs.join("|")})`, "g"),
        '<span class="highlighted">$1</span>'
      );

      setHighlightedArticleDetail(
        <div
          className="parsed-article"
          dangerouslySetInnerHTML={{ __html: highlightedDetail }}
        />
      );
    }
  }, [items, Vitems]);

  return (
    <div>
      <Header />

      <section>
        <h1>เนื้อหา</h1>

        <div className="searchbar">
          <Searchbar />
        </div>

        <div className="book">
          <div
            className="d-flex justify-content-center"
            style={{ margin: "20px" }}
          >
            <div className="btn-toolbar">
              <div className="btn-group me-2 me-auto">
                <Button
                  type="button"
                  className={`btn primary-button btn-lg ${
                    visibleDiv === "เนื้อหา" ? "active" : ""
                  }`}
                  onClick={() => handleButtonClick("เนื้อหา")}
                >
                  เนื้อหา
                </Button>
                <Button
                  type="button"
                  className={`btn primary-button btn-lg ${
                    visibleDiv === "คำศัพท์" ? "active" : ""
                  }`}
                  onClick={() => handleButtonClick("คำศัพท์")}
                >
                  คำศัพท์
                </Button>
                <Button
                  type="button"
                  className={`btn primary-button btn-lg ${
                    visibleDiv === "ข้อสอบ" ? "active" : ""
                  }`}
                  onClick={() => handleButtonClick("ข้อสอบ")}
                >
                  ข้อสอบ
                </Button>
              </div>
            </div>
          </div>

          <div
            className="grid-containerdetail"
            id="myDIV1"
            style={{ display: visibleDiv === "เนื้อหา" ? "block" : "none" }}
          >
            {items.map((article) => (
              <div className="grid-item badt" key={article.article_id}>
                <h2 className="articlename text-center">
                  {article.article_name}
                </h2>

                <div className="text-center">
                  <img
                    className="bigimg"
                    src={article.article_imagedata || article.article_images}
                    alt="Article"
                  />
                </div>

                <div style={{ padding: "20px", textAlign: "center" }}>
                  <div>
                    {audioUrl && (
                      <div>
                        <audio
                          src={audioUrl}
                          ref={handleAudioRef}
                          onEnded={handlePause}
                          onPause={handlePause}
                          onTimeUpdate={handleTimeUpdate}
                          controls
                        />
                      </div>
                    )}
                  </div>

                  <div style={{ margin: "10px" }}>
                    <h5 className="leveltext " style={{ textAlign: "center" }}>
                      บทความฝึกอ่านสำหรับ:{" "}
                      <span style={{ color: "green" }}>
                        {article.article_level}
                      </span>
                    </h5>
                    
                    {Vitems.length > 0 && (
                    <Button
                      className="btn btn-success btn-lg"
                      style={{ color: "white" }}
                      onClick={() => setHighlighted(!highlighted)}
                    >
                      {highlighted ? "ซ่อน" : "แสดงคำศัพท์"}
                    </Button>
                    )}
                    </div>

                  <div className="detailtext parsed-article">
                    {highlighted
                      ? highlightedArticleDetail
                      : items.length > 0 && items[0].article_detail}
                  </div>

                  <div className="text-start">
                    <Link
                      className="reporttext btn btn-warning"
                      style={{ color: "white" }}
                      to={{
                        pathname: "/Page/reportbook",
                        state: { book_id: bookid, article_id: articleid },
                      }}
                    >
                      รายงานเนื้อหา
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="grid-containervocab"
            id="myDIV2"
            style={{ display: visibleDiv === "คำศัพท์" ? "block" : "none" }}
          >
            <div className="d-flex flex-wrap justify-content-center">
              {Array.isArray(Vitems) && Vitems.length > 0 ? (
                Vitems.map((vocabs, index) => (
                  <div
                    className="v-item col-4 col-md-4 bvcd"
                    key={vocabs.vocabs_id}
                    style={{ backgroundColor: "white", borderRadius: "25px" }}
                  >
                    <div className="vno" key={`vocabs_${index}`}>
                      <h5 className="v-title">{`${index + 1}. ${
                        vocabs.vocabs_name
                      }`}</h5>
                      <hr></hr>
                      <div>
                        <h5 className="v-text">ความหมาย: </h5>
                        <h5>{vocabs.vocabs_detail}</h5>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-items text-center">
                  ไม่มีคำศัพท์ในตอนของบทความนี้.
                </div>
              )}
            </div>
            <div></div>
          </div>

          <div
            className="container mt-4"
            id="myDIV3"
            style={{ display: visibleDiv === "ข้อสอบ" ? "block" : "none" }}
          >
            <div>
              {Array.isArray(qitems) && qitems.length > 0 ? (
                qitems.map((question, index) => (
                  <div
                    className="card mb-3"
                    style={{ backgroundColor: "white" }}
                    key={question.question_id}
                    id={`question_${index}`}
                  >
                    <div className="card-body">
                      <div className="vno" key={`vocabs_${index}`}>
                        <h5 className="card-title">{`${index + 1}. ${
                          question.question_text
                        }`}</h5>
                        {question.question_image && (
                          <img
                            src={question.question_imagedata}
                            alt={`Image for question ${index + 1}`}
                            className="img-fluid mx-auto d-block"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "300px",
                              objectFit: "contain",
                            }}
                          />
                        )}
                        <div>
                          {question.question_options.map((option) => (
                            <div
                              key={`option_${option.option_id}`}
                              className="form-check"
                              style={{ margin: "10px" }}
                            >
                              <input
                                type="radio"
                                className="form-check-input"
                                value={option.option_id}
                                name={`radioOption_${index}`}
                                id={`option_${option.option_id}`}
                                onChange={() =>
                                  handleAnswerChange(index, option.option_id)
                                }
                              />
                              <label
                                htmlFor={`option_${option.option_id}`}
                                className="form-check-label"
                              >
                                {option.option_text}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-items bb">
                  ไม่มีชุดข้อสอบในตอนของบทความนี้.
                </div>
              )}
            </div>
            {Array.isArray(qitems) && qitems.length > 0 && (
              <div className="addV text-center">
                <Button
                  className="btn btn-success tc"
                  onClick={handleExamSubmit}
                >
                  ส่งคำตอบ
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>คำถามที่ยังไม่ได้ตอบ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>กรุณาตอบคำถามเหล่านี้ก่อนที่คุณจะส่งคำตอบ:</p>
          <ul>
            {unansweredQuestions.map((question, index) => (
              <li key={index}>
                ข้อ {`${index + 1}. ${question.question_text}`}
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Bookdetail;
