import React, { useEffect, useState } from "react";
import "../styles/home.css";
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import { AudioOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Input, Space } from "antd";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Searchbar from "../searchbar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Loading from "../LoadingIndicator";

function Articleedit() {
  const [items, setItems] = useState([]);
  const location = useLocation();
  const bookid = location.state.book_id;
  const user = localStorage.getItem("email");
  const [usertype, setUsertype] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState("");
  const [wordLevels, setWordLevels] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingVisible, setLoadingVisible] = useState(false); // Add a state for loading visibility
  const [screenLoaded, setScreenLoaded] = useState(false);
  const [leveltext, setLeveltext] = useState("");
  const [ selectarticle, setSelectarticle ] = useState(null);
  // console.log("bookid",bookid)

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      axios
        .get("http://localhost:5004/api/userdata?user_email=" + user)
        .then((response) => {
          setUsertype(response.data[0].user_type);
          setLoading(false);
          setScreenLoaded(true);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
          setScreenLoaded(true);
        });
    }, 0);
  }, [user]);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      axios
        .get(`http://localhost:5004/api/article/${bookid}`)
        .then((response) => {
          setItems(response.data);
          setLoading(false);
          setScreenLoaded(true);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
          setScreenLoaded(true);
        });
    }, 0);
  }, [bookid]);

  const filteredItems = items.filter((article) => {
    return article.article_name.includes(searchTerm);
  });

  // Fetch the JSON files for word levels and map words to levels
  useEffect(() => {
    const levelFiles = [
      "level1.json",
      "level2.json",
      "level3.json",
      "level4.json",
      "level5.json",
      "level6.json",
    ];

    const fetchLevelData = async () => {
      for (const file of levelFiles) {
        try {
          const response = await axios.get(`/analysis/${file}`);
          const levelData = response.data;
          // console.log("levelData",levelData)

          levelData.forEach((wordData) => {
            const word = wordData.word;
            if (wordData.p1 !== "0") {
              setWordLevels((prevLevels) => ({ ...prevLevels, [word]: 1 }));
            } else if (wordData.p2 !== "0") {
              setWordLevels((prevLevels) => ({ ...prevLevels, [word]: 2 }));
            } else if (wordData.p3 !== "0") {
              setWordLevels((prevLevels) => ({ ...prevLevels, [word]: 3 }));
            } else if (wordData.p4 !== "0") {
              setWordLevels((prevLevels) => ({ ...prevLevels, [word]: 4 }));
            } else if (wordData.p5 !== "0") {
              setWordLevels((prevLevels) => ({ ...prevLevels, [word]: 5 }));
            } else if (wordData.p6 !== "0") {
              setWordLevels((prevLevels) => ({ ...prevLevels, [word]: 6 }));
            }
          });
        } catch (error) {
          console.error(`Error fetching ${file}:`, error);
        }
      }
    };

    fetchLevelData();
  }, []);

  const analyzeArticleLevel = (articleDetail) => {
    if (articleDetail) {
      const words = articleDetail.split(" "); // Split articleDetail into words
      let maxLevel = 0;

      for (const word of words) {
        if (wordLevels[word]) {
          // Check if the word is in wordLevels
          maxLevel = Math.max(maxLevel, wordLevels[word]); // Update max level
        }
      }

      // Map the numerical level to the desired format (e.g., 1 to "p1", 2 to "p2", etc.)
      const levelMapping = {
        1: "ประถมศึกษาปีที่ 1",
        2: "ประถมศึกษาปีที่ 2",
        3: "ประถมศึกษาปีที่ 3",
        4: "ประถมศึกษาปีที่ 4",
        5: "ประถมศึกษาปีที่ 5",
        6: "ประถมศึกษาปีที่ 6",
      };

      return levelMapping[maxLevel];
    } else {
      // Handle the case when articleDetail is undefined
      return "N/A"; // or any default value you prefer
    }
  };

  const handleAnalyzeClick = (article) => {
    setLoadingVisible(true);
    setSelectarticle(article);

    const result = analyzeArticleLevel(article.article_detail);
    console.log(result);
    if (result === undefined) {
      setAnalysisResult("ไม่สามารถวัดระดับได้");
    } else {
      setAnalysisResult(result);
    }

    setTimeout(() => {
      setLoadingVisible(false); // Hide the loading component
      setScreenLoaded(true); // Mark the screen as loaded
    }, 5000); // Change the timeout value as needed

    setShowModal(true);
  };

  const sendLeveltext = (event, articleId) => {
    event.preventDefault();
  
    const data = {
      articleId: articleId,
      newLevel: leveltext,
    };
    console.log("data",data)
    axios
      .post("http://localhost:5004/api/updateLeveltext", data)
      .then((response) => {
        console.log(response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  
    setShowModal(false);
  };

  return (
    <div>
      <Header />

      <section>
        <div className="grid-containerr">
          <h1>เลือกตอนของบทความที่ต้องการแก้ไข</h1>

          <div style={{ padding: "10px" }}>
            <Searchbar onSearch={(searchTerm) => setSearchTerm(searchTerm)} />
          </div>

          <table className="table table-hover">
            <thead>
              <tr className="head" style={{ textAlign: "center" }}>
                <th scope="col" className="t-size">
                  ลำดับ
                </th>
                <th scope="col" className="t-size">
                  ชื่อตอน
                </th>
                <th scope="col" className="t-size">
                  รูปหน้าปกของตอน
                </th>
                <th scope="col" className="t-size">
                  ระดับบทความ
                </th>
                <th scope="col" className="t-size">
                  วิเคราะห์ระดับบทความ
                </th>
                <th scope="col" className="t-size">
                  แก้ไข
                </th>
                <th scope="col" className="t-size">
                  ลบ
                </th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    ไม่มีรายการบทของหนังสือที่คุณค้นหา
                    หรือคุณเขียนชื่อบทของหนังสือผิด.
                  </td>
                </tr>
              ) : (
                filteredItems.map((article, index) => (
                  <tr key={article.article_id}>
                    <td key={`article${index + 1}`}>{index + 1}</td>
                    <td>{article.article_name}</td>
                    <td>
                      <img
                        src={
                          article.article_imagedata ||
                          article.article_images ||
                          "url_to_default_image"
                        }
                        width="100"
                        height="100"
                      />
                    </td>
                    <td>{article.article_level}</td>
                    <td>
                      <Button
                        className="btn btn-warning amt2"
                        onClick={() => handleAnalyzeClick(article)}
                      >
                        วิเคราะห์
                      </Button>
                    </td>
                    <td>
                      <Link
                        className="btn btn-warning amt2"
                        to={{
                          pathname: `/Page/editarticle_${article.article_id}`,
                          state: { article_id: article.article_id },
                        }}
                      >
                        แก้ไข
                      </Link>
                    </td>
                    <td>
                      <Button className="btn btn-danger amt2">
                        {/* onClick={() => deleteBook(book.book_id)} */}
                        ลบตอน
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>วิเคราะห์ระดับบทความ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingVisible ? (
            <Loading />
          ) : (
            selectarticle && (
            <div>
              <div style={{ margin: "10px" }}>
                <p style={{ textAlign: "center", alignItems: "center" }}>
                  ระดับที่แนะนำคือ:{" "}
                  <span style={{ color: "blue" }}>{analysisResult}</span>
                </p>
              </div>

              <div>
                <form
                  className="form-control form-control-lg"
                  onSubmit={(e) => sendLeveltext(e, selectarticle.article_id)}
                >
                  <div className="mb-3">
                    <label htmlFor="leveltext" className="form-label">
                      ระดับของบทความ:
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      id="leveltext"
                      placeholder="กรุณากรอกระดับของบทความ"
                      required
                      onChange={(event) => {
                        setLeveltext(event.target.value);
                      }}
                    />
                  </div>

                  <div className="d-flex justify-content-between">
                    <Button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => setShowModal(false)}
                    >
                      ยกเลิก
                    </Button>

                    <Button
                      type="submit"
                      className="btn btn-success"
                      // onClick={() => sendLeveltext(article, leveltext)}
                    >
                      ตกลง
                    </Button>
                  </div>
                </form>
              </div>

              <p style={{ color: "red", margin: "10px" }}>
                *ไม่สามารถวัดระดับได้ คือ
                เนื้อหามีระดับที่มากกว่าประถมศึกษาปีที่ 6
              </p>
            </div>
          )
          )}
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            ปิด
          </Button>
        </Modal.Footer> */}
      </Modal>
    </div>
  );
}

export default Articleedit;
