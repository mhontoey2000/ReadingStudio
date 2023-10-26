import React, { useEffect, useState, useRef } from "react";
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { useParams, useHistory, Link } from "react-router-dom";
import { useDropzone } from "react-dropzone"; // เพิ่มการนำเข้า Dropzone
import "../styles/editall.css";

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

  useEffect(() => {
    axios.get(`http://localhost:5004/api/exam/${articleid}`)
      .then((response) => {
        let tempArr = response.data.slice().reverse();
        setqItems(tempArr);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:5004/api/vocabs/${articleid}`)
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

  useEffect(() => {
    fetchArticleData();
  }, [articleid]);

  useEffect(() => {
    handleAudioPlayback();
  }, [isPlaying, audioRef]);

  const fetchArticleData = () => {
    axios
      .get(`http://localhost:5004/api/article`)
      .then((response) => {
        const article = response.data.find(
          (item) => item.article_id === articleid
        );
        if (article) {
          setArticleData(article);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const setArticleData = (article) => {
    axios
      .get(`http://localhost:5004/api/book/${article.book_id}`)
      .then((response) => {
        const book = response.data;
        if (book.length > 0) {
          setBookName(book[0].book_name);
        } else {
          console.log("ไม่พบข้อมูลหนังสือสำหรับบทความนี้");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    setArticleID(article.article_id);
    setArticleName(article.article_name);
    setBookid(article.book_id);
    setArticleDetail(article.article_detail);
    setImage(article.article_imagedata);
    if (
      article.article_sounddata &&
      article.article_sounddata.type === "Buffer"
    ) {
      const audioBlob = new Blob(
        [new Uint8Array(article.article_sounddata.data)],
        { type: "audio/mpeg" }
      ); // กำหนด MIME type ตามรูปแบบของไฟล์เสียงของคุณ
      const blobUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(blobUrl);
      console.log(article.article_sounddata);
    } else {
      setAudioUrl(article.article_sounddata);
    }
  };

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
    history.replace(`/Page/articleedit_${bookid}`, { book_id: bookid});

    
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

    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    axios
      .post(`http://localhost:5004/api/updatearticle`, formData)
      .then((response) => {
        console.log("Article update successful", response.data);
        cancelEditArticle();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteVocab = (vocabId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vocabulary item?"
    );

    if (confirmed) {
      axios
        .delete(`http://localhost:5004/api/vocabs/${vocabId}`)
        .then((response) => {
          axios
            .get(`http://localhost:5004/api/vocabs/${articleid}`)
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
              <hr className="line1"/>
              <div className="VocabBox">
                <div>
                  <div  style={{ textAlign: "center" }}>
                    <h3 style={{ display: "inline-block", borderBottom: "3px solid #000" }}>คำศัพท์</h3>
                  </div>
                  <div className="d-flex flex-row mb-3">
                    {Array.isArray(Vitems) && Vitems.length > 0 ? (
                      Vitems.map((vocabs, index) => (
                        
                          <div className="v-item" key={vocabs.vocabs_id}>
                            <div className="vno" key={`vocabs_${index}`}>
                              <h5 className="v-title">
                                {`${index + 1}. ${vocabs.vocabs_name }`}</h5>
                              <h5 className="v-text">{vocabs.vocabs_detail}</h5>

                              <Button
                                className="btn btn-danger"
                                onClick={() => deleteVocab(vocabs.vocabs_id)}
                              >
                                ลบ
                              </Button>
                            </div>
                          </div>
                      ))
                    ) : (
                      <div className="no-items">
                        ไม่มีคำศัพท์ในตอนของบทความนี้.
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="addV">
                    <Link
                      className="btn btn-warning tc"
                      to={{
                        pathname: "/Page/addvocab",
                        state: { book_id: bookid, article_id: articleid },
                      }}
                    >
                      เพิ่มคำศัพท์
                    </Link>
                  </div>
                </div>
              </div>

              <hr className="line1"/>
              <div className="ExamBox d-flex">
                <div className="tfe">
                    <h3>ข้อสอบ:</h3>
                </div>
                {Array.isArray(qitems) && qitems.length > 0 ? (
                        
                        <Link
                            className="btn btn-warning amt1"
                            style={{marginLeft:"10px"}}
                            to={{
                            pathname: `/Page/editexam`,
                            state: { book_name: bookName, article_name : articleName, article_id: articleid }
                            //   to={{ pathname: `/Page/editbook_${ book.book_id }`, state: { book_id: book.book_id } }}
                            }}
                        >
                            แก้ไขข้อสอบ
                        </Link>
                    ) : (
                        <div>
                            <Link
                                className="btn btn-warning tc"
                                to={{ pathname: "/Page/addexam", state: { book_id: bookid, article_id: articleid } }}
                            >
                                เพิ่มข้อสอบ
                            </Link>
                        </div>
                      )}
              </div>
            
              <hr className="line1"/>
              <div className="btn-containerr">
                <div className="btn-group me-2">
                  <Button
                    type="submit"
                    className="btnE btn-warning"
                    onClick={cancelEditArticle}
                  >
                    ยกเลิก
                  </Button>
                </div>
                <div className="btn-group me-2">
                  <Button
                    // type="submit"
                    className="btnE btn-primary"
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
    </div>
  );
}

export default Editarticle;
