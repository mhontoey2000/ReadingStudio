import React, { useEffect, useState, useRef } from "react";
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { useParams, useHistory, Link } from "react-router-dom";
import { useDropzone } from "react-dropzone"; // เพิ่มการนำเข้า Dropzone
import "../styles/editall.css";
import {
  apiClient,
  convertSoundToBase64,
  convertImageToBase64,
} from "../config";

function Editarticle() {
  const history = useHistory();
  const { articleid } = useParams();
  const [bookid, setBookid] = useState(false);
  const textareaRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [qitems, setqItems] = useState([]);

  const [bookName, setBookName] = useState("");
  const [articleId, setArticleID] = useState("");
  const [articleName, setArticleName] = useState("");
  const [articleDetail, setArticleDetail] = useState("");
  const [image, setImage] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioRef, setAudioRef] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioFile, setAudioFile] = useState(null); // เพิ่ม state สำหรับไฟล์เสียงใหม่

  const [Vitems, setVitems] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vocabToDelete, setVocabToDelete] = useState(null);

  const openDeleteModal = (vocabs) => {
    setVocabToDelete(vocabs);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };
  useEffect(() => {
    fetchArticleData();
  }, [articleid]);

  const fetchArticleData = () => {
    // console.log(`http://localhost:5004/api/getarticle/${articleid}`)
    const jsonData = {
      articleid: articleid,
    };
    apiClient
      .post(`api/getarticle`, jsonData)
      .then((response) => {
        setArticleData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const setArticleData = (article_section) => {
    apiClient
      .get(`api/article/${article_section.article_id}`)
      .then((response) => {
        const article = response.data;
        if (article.length > 0) {
          setBookName(article[0].article_name);
        } else {
          console.log("ไม่พบข้อมูลหนังสือสำหรับบทความนี้");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    setArticleID(article_section.section_id);
    setArticleName(article_section.section_name);
    setBookid(article_section.article_id);
    setArticleDetail(article_section.section_detail);
    setImage(article_section.section_imagedata);
    if (
      article_section.section_sounddata &&
      article_section.section_sounddata.type === "Buffer"
    ) {
      const audioBlob = new Blob(
        [new Uint8Array(article_section.section_sounddata.data)],
        { type: "audio/mpeg" }
      ); // กำหนด MIME type ตามรูปแบบของไฟล์เสียงของคุณ
      const blobUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(blobUrl);
      // console.log(article_section.section_sounddata);
    } else {
      setAudioUrl(article_section.section_sounddata);
    }
  };

  useEffect(() => {
    apiClient
      .get(`api/vocabs/${articleid}`)
      .then((response) => {
        let tempArr = response.data.slice().reverse();
        setVitems(tempArr);
        // console.log("tempArr", tempArr);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [articleid]);

  useEffect(() => {
    apiClient
      .get(`api/exam/${articleid}`)
      .then((response) => {
        let tempArr = response.data.slice().reverse();
        setqItems(tempArr);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    handleAudioPlayback();
  }, [isPlaying, audioRef]);

  useEffect(() => {
    // Simulate data retrieval delay
    setTimeout(() => {
      if (articleDetail != "") {
        setIsLoading(false);
      }
    }, 2000); // Adjust the delay time as needed
  }, [articleDetail]);

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      // Adjust the height based on content
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isLoading]);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: "audio/*",
    onDrop: (acceptedFiles) => {
      setAudioFile(acceptedFiles[0]);
      setAudioUrl(URL.createObjectURL(acceptedFiles[0]));
    },
  });

  const handleAudioPlayback = () => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.play();
      } else {
        audioRef.pause();
      }
    }
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setSelectedImageFile(selectedImage);
    setImage(URL.createObjectURL(selectedImage));
  };
  const handleSoundChange = (event) => {
    const selectedSound = event.target.files[0];
    setAudioFile(selectedSound);
    setAudioUrl(URL.createObjectURL(selectedSound));
  };
  const playAudio = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef) {
        audioRef.pause();
      }
    } else {
      setIsPlaying(true);
      if (audioRef) {
        audioRef.play();
      }
    }
  };

  const handleAudioRef = (ref) => {
    setAudioRef(ref);
    if (ref) {
      setDuration(ref.duration);
    }
  };

  const cancelEditArticle = () => {
    // history.replace(`/Page/articleedit_${bookid}`)
    history.replace(`/Page/articleedit_${bookid}`, { article_id: bookid });
  };

  const editArticle = () => {
    const formData = new FormData();
    formData.append("articleId", articleId);
    formData.append("chapter", articleName);
    formData.append("description", articleDetail);
    formData.append("level", articleName);

    if (selectedImageFile) {
      formData.append("image", selectedImageFile);
    }

    if (audioFile) {
      formData.append("sound", audioFile);
    }

    // console.log(formData);
    // for (const pair of formData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }

    apiClient
      .post(`api/updatearticle`, formData)
      .then((response) => {
        // console.log("Article update successful", response.data);

        apiClient
          .post(`api/updatebookstatus`, { bookId: bookid })
          .then((bookResponse) => {
            // console.log("Book status updated to 'published'", bookResponse.data);
            cancelEditArticle();
          })
          .catch((bookError) => {
            console.error("Error updating article status:", bookError);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteVocab = () => {
    if (vocabToDelete) {
      apiClient
        .delete(`api/vocabs/${vocabToDelete.vocabs_id}`)
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

      // Close the delete modal
      setShowDeleteModal(false);
    }
  };

  return (
    <div>
      <Header />

      <section>
        <h1>แก้ไขตอนของบทความ</h1>

        <div className="grid-containerE">
          <div className="fgE">
            <form className="form-group">
              <h2>กรุณากรอกรายละเอียดตอนที่ต้องการแก้ไข</h2>

              <div className="mb-3">
                <label htmlFor="bookname">ชื่อบทความ</label>
                <input
                  type="text"
                  className="form-control"
                  id="bookname"
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
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
                  value={articleName}
                  onChange={(e) => setArticleName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="articledetail">เนื้อหา</label>
                <textarea
                  ref={textareaRef}
                  type="text"
                  className="form-control"
                  id="articledetail"
                  value={articleDetail}
                  style={{
                    width: "100%",
                    height: "auto",
                    overflow: "hidden",
                    resize: "none",
                  }}
                  onChange={(e) => setArticleDetail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="bookimage">
                  รูปในเนื้อหา
                  <cite style={{ color: "red" }}>
                    *ขนาดรูปที่แนะนำคือ 500x500
                  </cite>
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="bookimage"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <p></p>
                <div className="d-flex justify-content-center align-items-center">
                  {image && (
                    <img
                      src={image}
                      alt="Uploaded Image"
                      style={{ maxWidth: "100%", maxHeight: "200px" }}
                    />
                  )}
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="sound">เสียงของเนื้อหา</label>
                <input
                  type="file"
                  className="form-control"
                  id="sound"
                  accept="audio/*"
                  onChange={handleSoundChange}
                />
              </div>
              <div className="d-flex justify-content-center align-items-center">
                {audioUrl && (
                  <div>
                    <audio src={audioUrl} ref={handleAudioRef} controls />
                  </div>
                )}
              </div>
              {/* <div className="mb-3">
                                <label>หรือลากและวางไฟล์เสียงที่นี่</label>
                                <div {...getRootProps()} className="dropzone">
                                    <input {...getInputProps()} />
                                    <p>ลากและวางไฟล์เสียงที่นี่หรือคลิกเพื่อเลือก</p>
                                </div>
                            </div> */}
              <hr className="line1" />
              <div className="VocabBox">
                <div>
                  <div style={{ textAlign: "center" }}>
                    <h3
                      style={{
                        display: "inline-block",
                        borderBottom: "3px solid #000",
                      }}
                    >
                      คำศัพท์
                    </h3>
                  </div>
                  <div className="d-flex flex-wrap justify-content-center">
                    {Array.isArray(Vitems) && Vitems.length > 0 ? (
                      Vitems.map((vocabs, index) => (
                        <div
                          className="v-item col-4 col-md-4"
                          key={vocabs.vocabs_id}
                          style={{
                            backgroundColor: "white",
                            borderRadius: "25px",
                          }}
                        >
                          <div className="vno">
                            <h5 className="v-title">
                              {`${index + 1}. ${vocabs.vocabs_name}`}
                            </h5>
                            <hr></hr>
                            <div>
                              <h5 className="v-text">ความหมาย: </h5>
                              <h5>{vocabs.vocabs_detail}</h5>
                            </div>
                            <Button
                              className="btn btn-danger"
                              onClick={() => openDeleteModal(vocabs)}
                            >
                              ลบ
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-items text-center">
                        ไม่มีคำศัพท์ในตอนของบทความนี้.
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="addV text-center">
                    <Link
                      className="btn btn-warning tc"
                      to={{
                        pathname: "/Page/addvocab",
                        state: { article_id: bookid, section_id: articleid },
                      }}
                    >
                      เพิ่มคำศัพท์
                    </Link>
                  </div>
                </div>
              </div>

              <hr className="line1" />
              <div className="ExamBox d-flex">
                <div className="tfe">
                  <h3>ข้อสอบ:</h3>
                </div>
                {Array.isArray(qitems) && qitems.length > 0 ? (
                  <Link
                    className="btn btn-warning amt1"
                    style={{ marginLeft: "10px" }}
                    to={{
                      pathname: `/Page/editexam`,
                      state: {
                        article_id: bookid,
                        article_name: bookName,
                        section_name: articleName,
                        section_id: articleid,
                      },
                      //   to={{ pathname: `/Page/editbook_${ article.article_id }`, state: { article_id: article.article_id } }}
                    }}
                  >
                    แก้ไขข้อสอบ
                  </Link>
                ) : (
                  <div>
                    <Link
                      className="btn btn-success"
                      style={{ color: "white" }}
                      to={{
                        pathname: "/Page/addexam",
                        state: { article_id: bookid, section_id: articleid },
                      }}
                    >
                      เพิ่มข้อสอบ
                    </Link>
                  </div>
                )}
              </div>

              <hr className="line1" />
              <div className="btn-containerr">
                <div className="btn-group me-2">
                  <Button
                    type="submit"
                    style={{ color: "white" }}
                    className="btn btn-warning"
                    onClick={cancelEditArticle}
                  >
                    ยกเลิก
                  </Button>
                </div>
                <div className="btn-group me-2">
                  <Button
                    // type="submit"
                    className="btn btn-primary"
                    onClick={editArticle}
                  >
                    ยืนยัน
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Modal
        show={showDeleteModal}
        onHide={closeDeleteModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>ยืนยันการลบ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          คุณต้องการลบคำศัพท์{" "}
          {vocabToDelete ? `"${vocabToDelete.vocabs_name}"` : "this vocabulary"}
          ใช่ไหม?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            ยกเลิก
          </Button>
          <Button variant="danger" onClick={deleteVocab}>
            ลบ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Editarticle;
