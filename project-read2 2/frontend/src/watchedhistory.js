import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./header";
import "./styles/watchedhistory.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useHistory } from "react-router-dom";
import Searchbar from "./searchbar";
import Button from "react-bootstrap/Button";
import {
  apiClient,
  convertSoundToBase64,
  convertImageToBase64,
} from "./config"

function Watchedhistory() {
  const user_id = localStorage.getItem("user_id");
  const [watchedArticles, setWatchedArticles] = useState([]);
  const [examHistory, setExamHistory] = useState([]); // เพิ่ม state สำหรับประวัติการทำข้อสอบ
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredWatchedArticles, setFilteredWatchedArticles] = useState([]);
  const [filteredExamHistory, setFilteredExamHistory] = useState([]); // เพิ่ม state สำหรับประวัติการทำข้อสอบ
  const [activeMenu, setActiveMenu] = useState("watched");

  const [examScores, setExamScores] = useState(0);
  const [examDetails, setExamDetails] = useState([]);
  const totalQuestions = examDetails.length;

  const calculateExamScore = (exam, examDetailsMap) => {
    const examDetails = examDetailsMap[exam.article_id];

    if (!examDetails || examDetails.length === 0) {
      console.log("No exam details for exam:", exam);
      return 0; // Return 0 if exam details are not available
    }

    let calculatedScore = 0;
    const submittedAnswersArray = exam.submittedAnswers.split(",").map(Number);

    for (let i = 0; i < examDetails.length; i++) {
      const correctOption = examDetails[i].question_options.find(
        (option) => option.is_correct === 1
      );

      if (
        correctOption &&
        submittedAnswersArray[i] === correctOption.option_id
      ) {
        calculatedScore++;
      }
    }

    //console.log('calculatedScore for exam:', exam, 'is', calculatedScore);
    return calculatedScore;
  };

  useEffect(() => {
    // ดึงข้อมูลประวัติการทำข้อสอบ
    apiClient
      .get(`api/examhistory?user_id=${user_id}`)
      .then((response) => {
        const examsByDay = groupByDay(response.data);
        setExamHistory(examsByDay);
        setFilteredExamHistory(examsByDay);

        // Extracting unique article IDs from the exams
        const uniqueArticleIds = [
          ...new Set(response.data.map((exam) => exam.article_id)),
        ];

        // Fetch all exam details
        const fetchExamDetails = uniqueArticleIds.map((articleId) =>
        apiClient.get(`api/exam/${articleId}`)
        );

        // Wait for all exam detail requests to complete
        Promise.all(fetchExamDetails)
          .then((examDetailsResponses) => {
            //console.log('examDetailsResponses', examDetailsResponses);

            const examDetailsMap = {};

            // Create a map of article_id to exam details for quick access
            examDetailsResponses.forEach((examDetailsResponse, index) => {
              const articleId = uniqueArticleIds[index];
              examDetailsMap[articleId] = examDetailsResponse.data;
            });

            //console.log('examDetailsMap', examDetailsMap);

            // Update the state with exam details
            setExamDetails(examDetailsMap);

            // Now you can run the calculateExamScore function for each exam
            const scores = response.data.map((exam) =>
              calculateExamScore(exam, examDetailsMap)
            );
            //console.log('scores', scores);

            setExamScores(scores);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });

    // ดึงข้อมูลประวัติการดู
    apiClient
      .get(`api/watchedhistory?user_id=${user_id}`)
      .then((response) => {
        const articlesByDay = groupByDay(response.data);
        setWatchedArticles(articlesByDay);
        setFilteredWatchedArticles(articlesByDay);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user_id]);

  const groupByDay = (articles) => {
    return articles.reduce((result, article) => {
      const date = new Date(article.watched_at);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const dayKey =
        date.toDateString() === today.toDateString()
          ? "วันนี้"
          : date.toDateString() === yesterday.toDateString()
          ? "เมื่อวานนี้"
          : date.toLocaleDateString("th-TH", {
              weekday: "long",
              day: "numeric",
              month: "long",
            });

      if (!result[dayKey]) {
        result[dayKey] = [];
      }

      result[dayKey].push(article);

      return result;
    }, {});
  };

  const handleClearHistory = () => {
    // Add logic to clear the watched history
    // For example, you can make another Axios request to your server to handle this
    // Make sure to update the state or perform any necessary actions
    console.log("Clearing history...");
  };

  const handleToPage = (articleId) => {
    history.push({
      pathname: "/Page/bookdetail",
      state: { article_id: articleId },
    });
  };
  const handleToPageExam = (exam) => {
    apiClient
      .get(`api/exam/${exam.article_id}`)
      .then((response) => {
        let tempArr = response.data;
        history.push({
          pathname: "/Page/score",
          state: {
            submittedAnswers: exam.submittedAnswers.split(",").map(Number),
            examDetails: tempArr,
            articleid: exam.article_id,
          },
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    // Filter watched articles based on the search term
    const filteredArticles = watchedArticlesFilter(searchTerm);
    setFilteredWatchedArticles(filteredArticles);
  }, [searchTerm, watchedArticles]);

  const watchedArticlesFilter = (term) => {
    const filteredArticles = Object.entries(watchedArticles).reduce(
      (result, [day, articles]) => {
        const filteredArticles = articles.filter(
          (article) =>
            article.book_name.toLowerCase().includes(term.toLowerCase()) ||
            article.article_name.toLowerCase().includes(term.toLowerCase()) ||
            day.toLowerCase().includes(term.toLowerCase())
        );

        if (filteredArticles.length > 0) {
          result[day] = filteredArticles;
        }

        return result;
      },
      {}
    );

    return filteredArticles;
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <div>
      <Header />

      <div className="boxhistory">
        <div className="menuleft">
          <ul className="list-group list-group-flush">
            <li
              className={`list-group-item te ${
                activeMenu === "watched" ? "active" : ""
              }`}
              onClick={() => handleMenuClick("watched")}
            >
              ประวัติการดู
            </li>
            <li
              className={`list-group-item te ${
                activeMenu === "exam" ? "active" : ""
              }`}
              onClick={() => handleMenuClick("exam")}
            >
              ประวัติการทำข้อสอบ
            </li>
          </ul>
        </div>

        {activeMenu === "watched" && (
          <div className="menumidhistory">
            <h1 className="text-left">ประวัติการดูบทความ</h1>
            <div style={{ alignItems: "center", margin: "20px" }}>
              <Searchbar onSearch={(term) => setSearchTerm(term)} />
            </div>
            {Object.entries(filteredWatchedArticles).map(([day, articles]) => (
              <div style={{ marginLeft: "50px", padding: "10px" }} key={day}>
                <div className="">
                  <h4 style={{ padding: "20px" }}>{day}</h4>
                </div>
                <ul>
                  {articles.map((article, index) => (
                    <li
                      key={`${article.article_id}-${index}`}
                      className="boxoflist"
                      onClick={() => handleToPage(article.article_id)}
                    >
                      <div className="flex-container">
                        <div className="left-content">
                          <div style={{ display: "flex" }}>
                            <p
                              style={{ fontWeight: "bold", marginRight: "5px" }}
                            >
                              ชื่อบทความ:
                            </p>
                            <p>{article.book_name}</p>
                          </div>
                          <div style={{ display: "flex" }}>
                            <p
                              style={{ fontWeight: "bold", marginRight: "5px" }}
                            >
                              ชื่อตอน:
                            </p>
                            <p>{article.article_name}</p>
                          </div>
                        </div>
                        <div className="text-center right-content">
                          <img
                            className="imgsize"
                            src={
                              article.article_imagedata ||
                              article.article_images
                            }
                            alt="Article"
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {Object.keys(filteredWatchedArticles).length === 0 && (
              <p>ไม่มีรายการบทความที่ค้นหา</p>
            )}
          </div>
        )}

        {activeMenu === "exam" && (
          <div className="menumidhistory">
            <h1 className="text-left">ประวัติการทำข้อสอบ</h1>
            <div style={{ alignItems: "center", margin: "20px" }}>
              <Searchbar onSearch={(term) => setSearchTerm(term)} />
            </div>
            {Object.entries(filteredExamHistory).map(([day, exams]) => (
              <div style={{ marginLeft: "50px", padding: "10px" }} key={day}>
                <div className="">
                  <h4 style={{ padding: "20px" }}>{day}</h4>
                </div>
                <ul>
                  {exams.map((exam, index) => {
                    const totalQuestions =
                      examDetails[exam.article_id]?.length || 0;
                    const scoreText = `${examScores[index]}/${totalQuestions}`;

                    return (
                      <li
                        key={`${exam.article_id}-${index}`}
                        className="boxoflist"
                        onClick={() => handleToPageExam(exam)}
                      >
                        <div className="flex-container">
                          <div className="left-content">
                            <div style={{ display: "flex" }}>
                              <p
                                style={{
                                  fontWeight: "bold",
                                  marginRight: "5px",
                                }}
                              >
                                ชื่อบทความ:
                              </p>
                              <p>{exam.book_name}</p>
                            </div>
                            <div style={{ display: "flex" }}>
                              <p
                                style={{
                                  fontWeight: "bold",
                                  marginRight: "5px",
                                }}
                              >
                                ชื่อข้อสอบ:
                              </p>
                              <p>{exam.article_name}</p>
                            </div>
                            <div style={{ display: "flex" }}>
                              <p
                                style={{
                                  fontWeight: "bold",
                                  marginRight: "5px",
                                }}
                              >
                                คะแนนที่คุณทำได้:
                              </p>
                              <p 
                                style={{
                                  fontWeight: "bold",
                                  marginRight: "5px",
                                }}
                              >{scoreText}</p>
                            </div>
                            {/* (ตามความเหมาะสมในโค้ดของคุณ) */}
                          </div>
                          <div className="text-center right-content">
                            <img
                              className="imgsize"
                              src={
                                exam.article_imagedata || exam.article_images
                              }
                              alt="Exam"
                            />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            {Object.keys(filteredExamHistory).length === 0 && (
              <p>ไม่มีรายการข้อสอบที่ค้นหา</p>
            )}
          </div>
        )}
        {/* {activeMenu === "watched" && (
          <div className="menuright">
            <Button
              className="btn btn-danger clrbtn"
              onClick={handleClearHistory}
            >
              ล้างประวัติ
            </Button>
          </div>
        )} */}
      </div>
    </div>
  );
}

export default Watchedhistory;
