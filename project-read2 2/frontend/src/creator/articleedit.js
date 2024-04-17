import React, { useEffect, useState } from "react";
import "../styles/home.css";
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Searchbar from "../searchbar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Loading from "../LoadingIndicator";
import {
  apiClient,
  convertSoundToBase64,
  convertImageToBase64,
} from "../config"

function Articleedit() {
  const [items, setItems] = useState([]);
  const location = useLocation();
  const bookid = location.state.article_id;
  const user = localStorage.getItem("email");
  const [usertype, setUsertype] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState("");
  const [wordLevels, setWordLevels] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [screenLoaded, setScreenLoaded] = useState(false);
  const [leveltext, setLeveltext] = useState("");
  const [selectarticle, setSelectarticle] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const levels = [
    "ประถมศึกษาปีที่ 1",
    "ประถมศึกษาปีที่ 2",
    "ประถมศึกษาปีที่ 3",
    "ประถมศึกษาปีที่ 4",
    "ประถมศึกษาปีที่ 5",
    "ประถมศึกษาปีที่ 6",
    "ไม่ระบุระดับ",
  ];

  useEffect(() => {
    setLoading(true);

    // โหลดข้อมูลผู้ใช้เมื่อมีความจำเป็น
    apiClient
      .get("api/userdata?user_email=" + user)
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


    fetchLevelData();
  }, [user]);

  
    // โหลดระดับคำศัพท์ (level files) ในระหว่างโหลดข้อมูลของผู้ใช้และข้อมูลบทความ
    const levelFiles = [
      "level1.json",
      "level2.json",
      "level3.json",
      "level4.json",
      "level5.json",
      "level6.json",
    ];

    const fetchLevelData = async () => {
      const newWordLevels = {};
    
      for (const file of levelFiles) {
        try {
          const response = await axios.get(`/analysis/${file}`);
          const levelData = response.data;
    
          levelData.forEach((wordData) => {
            const word = wordData.word;
            if (wordData.p1 !== "0") {
              newWordLevels[word] = 1;
            } else if (wordData.p2 !== "0") {
              newWordLevels[word] = 2;
            } else if (wordData.p3 !== "0") {
              newWordLevels[word] = 3;
            } else if (wordData.p4 !== "0") {
              newWordLevels[word] = 4;
            } else if (wordData.p5 !== "0") {
              newWordLevels[word] = 5;
            } else if (wordData.p6 !== "0") {
              newWordLevels[word] = 6;
            }
          });
        } catch (error) {
          console.error(`Error fetching ${file}:`, error);
        }
      }
    
      setWordLevels(newWordLevels);
    };

  useEffect(() => {
    setLoading(true);

    // โหลดข้อมูลบทความเมื่อมีความจำเป็นเท่าที่จำเป็น (ในตัวอย่างนี้เมื่อ bookid เปลี่ยน)
    if (bookid) {
      apiClient
        .get(`api/article_section/${bookid}`)
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
    }
  }, [bookid, currentPage]);

  const filteredItems = items.filter((article_section) => {
    return article_section.section_name.includes(searchTerm);
  });

  const analyzeArticleLevel = (articleDetail) => {
    if (articleDetail) {
      const words = articleDetail.split(" ");
      let maxLevel = 0;

      for (const word of words) {
        if (wordLevels[word]) {
          maxLevel = Math.max(maxLevel, wordLevels[word]);
        }
      }

      const levelMapping = {
        1: "ประถมศึกษาปีที่ 1",
        2: "ประถมศึกษาปีที่ 2",
        3: "ประถมศึกษาปีที่ 3",
        4: "ประถมศึกษาปีที่ 4",
        5: "ประถมศึกษาปีที่ 5",
        6: "ประถมศึกษาปีที่ 6",
      };

      return levelMapping[maxLevel] || "N/A";
    } else {
      return "N/A";
    }
  };

  const handleAnalyzeClick = (article_section) => {
    setLoadingVisible(true);
    setSelectarticle(article_section);

    const result = analyzeArticleLevel(article_section.section_detail);
    if (result === "N/A") {
      setAnalysisResult("ไม่สามารถวัดระดับได้");
    } else {
      setAnalysisResult(result);
    }

    setTimeout(() => {
      setLoadingVisible(false);
      setScreenLoaded(true);
    }, 3000);

    setShowModal(true);
  };

  const sendLeveltext = (event, articleId) => {
    event.preventDefault();

    const data = {
      articleId: articleId,
      newLevel: leveltext,
    };

    apiClient
      .post("api/updateLeveltext", data)
      .then((response) => {
        // console.log(response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });

    setShowModal(false);
  };

  const deleteArticle = (articleId) => {
    const articleToDelete = items.find(
      (article_section) => article_section.section_id === articleId
    );
    setArticleToDelete(articleToDelete);
    setShowDeleteModal(true);
  };

  const deleteArticleConfirmed = (articleId) => {
    apiClient
      .delete(`api/deletearticle/${articleId}`)
      .then(() => {
        //console.log(`ตอนที่มี ID ${articleId} ถูกลบแล้ว.`);
        apiClient
          .get(`api/article_section/${bookid}`)
          .then((response) => {
            setItems(response.data);
            setShowSuccessModal(true);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(
          `เกิดข้อผิดพลาดในการลบตอนที่มี ID ${articleId}: ${error}`
        );
      });
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

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
                <th scope="col" className="col-sm-1">
                  ลำดับ
                </th>
                <th scope="col" className="col-sm-3">
                  ชื่อตอน
                </th>
                <th scope="col" className="col-sm-2">
                  รูปหน้าปกของตอน
                </th>
                <th scope="col" className="col-sm-2">
                  ระดับบทความ
                </th>
                <th scope="col" className="col-sm-2">
                  วิเคราะห์ระดับบทความ
                </th>
                <th scope="col" className="col-sm-1">
                  แก้ไข
                </th>
                <th scope="col" className="col-sm-1">
                  ลบ
                </th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center">
                    ไม่มีรายการตอนของบทความที่คุณค้นหา
                    หรือคุณเขียนชื่อตอนของบทความผิด.
                  </td>
                </tr>
              ) : (
                currentItems.map((article_section, index) => (
                  <tr key={article_section.section_id}>
                    <td className="col-sm-1" key={`article_section${index + 1}`}>{startIndex + index + 1}</td>
                    <td className="col-sm-3">{article_section.section_name}</td>
                    <td className="col-sm-2">
                      {article_section.section_imagedata ? (
                        <img
                          src={article_section.section_imagedata}
                          width="100"
                          height="100"
                          alt={article_section.section_name}
                        />
                      ) : null}
                    </td>
                    <td className="col-sm-2">{article_section.section_level}</td>
                    <td className="col-sm-2">
                      <Button
                        className="btn btn-success amt2"
                        onClick={() => handleAnalyzeClick(article_section)}
                      >
                        วิเคราะห์
                      </Button>
                    </td>
                    <td className="col-sm-1">
                      <Link
                        className="btn btn-warning amt2"
                        to={{
                          pathname: `/Page/editarticle_${article_section.section_id}`,
                          state: { section_id: article_section.section_id },
                        }}
                      >
                        แก้ไข
                      </Link>
                    </td>
                    <td className="col-sm-1">
                      <Button
                        className="btn btn-danger amt2"
                        onClick={() => deleteArticle(article_section.section_id)}
                      >
                        ลบ
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  <Button
                    onClick={() =>
                      setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    ย้อนกลับ
                  </Button>
                  <span style={{ margin: "0 10px" }}>
                    {currentPage} จาก {totalPages}
                  </span>
                  <Button
                    onClick={() =>
                      setCurrentPage((prevPage) =>
                        Math.min(prevPage + 1, totalPages)
                      )
                    }
                    disabled={currentPage === totalPages}
                  >
                    ถัดไป
                  </Button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ยืนยันการลบ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {articleToDelete && (
            <p>
              คุณแน่ใจหรือไม่ที่ต้องการลบตอน: {articleToDelete.section_name}?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            ยกเลิก
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deleteArticleConfirmed(articleToDelete.section_id);
              setShowDeleteModal(false);
            }}
          >
            ลบ
          </Button>
        </Modal.Footer>
      </Modal>

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
                    onSubmit={(e) => sendLeveltext(e, selectarticle.section_id)}
                  >
                    <div className="mb-3">
                      <label htmlFor="leveltext" className="form-label">
                        ระดับของบทความ:
                      </label>

                      {/* <input
                        type="text"
                        id="leveltext"
                        className="form-control"
                        value={leveltext}
                        onChange={(event) => setLeveltext(event.target.value)}
                        placeholder="กรุณากรอกระดับของบทความ"
                      /> */}
                      <select
                        id="leveltext"
                        className="form-control"
                        value={leveltext}
                        onChange={(event) => setLeveltext(event.target.value)}
                      >
                        <option value="" disabled>กรุณาเลือกระดับของบทความ</option>
                          {levels.map((level, index) => (
                            <option key={index} value={level}>{level}</option>
                          ))}
                      </select>
                    </div>

                    <div className="d-flex justify-content-between">
                      <Button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => setShowModal(false)}
                      >
                        ยกเลิก
                      </Button>

                      <Button type="submit" className="btn btn-success">
                        ตกลง
                      </Button>
                    </div>
                  </form>
                </div>

                <cite style={{ color: "red", margin: "10px" }}>
                  *ไม่สามารถวัดระดับได้ คือ
                  เนื้อหามีระดับที่มากกว่าประถมศึกษาปีที่ 6
                </cite>
              </div>
            )
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ลบสำเร็จ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>บทความถูกลบสำเร็จ</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            ตกลง
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Articleedit;
