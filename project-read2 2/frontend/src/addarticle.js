import React, { useEffect, useState } from "react";
import "./styles/addbook.css";
import Header from "./header";
// import "bootstrap/dist/css/bootstrap.min.css";
import { AudioOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Input, Space } from "antd";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

import {
  apiClient,
  convertSoundToBase64,
  convertImageToBase64,
} from "./config";

function Addarticle() {
  const { bookid } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const history = useHistory();
  const [bname, setBname] = useState("");
  const [chapter, setChapter] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [imageFile, setimageFile] = useState(null);
  const [soundFile, setsoundFile] = useState(null);

  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedSound, setUploadedSound] = useState(null);

  const handleImageUpload = (event) => {
    const aimageFile = event.target.files[0];
    setimageFile(aimageFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
    };
    reader.readAsDataURL(aimageFile);
  };
  const handleSoundUpload = (event) => {
    const asoundFile = event.target.files[0];
    setsoundFile(asoundFile);

    setUploadedSound(asoundFile);
  };

  useEffect(() => {
    apiClient
      .get(`api/book`)
      .then((response) => {
        // console.log(response.data);
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].book_id === bookid) {
            // console.log("working")
            console.log(response.data[i].book_name);
            setBname(response.data[i].book_name);
            break;
          }
          // console.log(response.data[i].book_id)
        }
        // console.log(bookid)
      })
      .catch((error) => {
        console.error(error);
      });
  }, [bookid]);

  const handleSubmit = (e) => {
    // Show the confirmation modal
    setShowModal(true);
    e.preventDefault();
  };

  async function confirmArticle(event) {
    setShowModal(false);

    try {
      // const data = {
      //     book_id: bookid,
      //     chapter: chapter,
      //     level: chapter,
      //     description: description,
      //     image: imageFile ? await convertImageToBase64(imageFile) : null ,
      //     sound: soundFile ? await convertSoundToBase64(soundFile) : null,
      //     };

      // // axios.post("http://localhost:5004/api/addarticle", data, {
      // apiClient.post('api/addarticle', data, {
      //     headers: {
      //         "Content-Type": "application/json"
      //     }
      // }).then((response) =>
      // {
      //     console.log(response.data);
      // }).catch((error) =>
      // {
      //     console.error(error);
      // });
      const data = new FormData();
      data.append("book_id", bookid);
      data.append("chapter", chapter);
      data.append("level", chapter);
      data.append("description", description);
      data.append("image", imageFile);
      data.append("sound", soundFile);
      console.log(bookid);
      apiClient
        .post("api/addarticle", data)
        .then((response) => {
          console.log(response.data);

          // Close the confirmation modal
          setShowModal(false);
          // Show the success message modal
          setSuccessModal(true);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      alert(error);
      console.error(error);
    }
  }

  const cancelArticle = () => {
    history.goBack();
  };

  const handleSuccessModalOK = () => {
    setSuccessModal(false);
    //window.location.reload();
    history.goBack();
  };

  return (
    <div className="addbook">
      <Header />

      <section>
        <h1>เพิ่มตอนบทความ</h1>

        <div className="grid-containerr">
          <div className="fg">
            <form className="form-group mb-3" onSubmit={handleSubmit}>
              <h2>กรุณากรอกรายละเอียดตอนของบทความ</h2>
              <div className="mb-3">
                <label htmlFor="name">ชื่อบทความ</label>
                <input
                  type="text"
                  className="form-control"
                  id="bookname"
                  value={bname}
                  disabled
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label htmlFor="chapter">ตอนของบทความ</label>
                <input
                  type="text"
                  className="form-control"
                  id="chapter"
                  value={chapter}
                  placeholder="บทที่ X ชื่อ ตัวอย่าง"
                  required
                  onChange={(event) => {
                    setChapter(event.target.value);
                  }}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="article_detail">เนื้อหาของบทความ</label>
                <textarea
                  type="text"
                  className="form-control"
                  id="article_detail"
                  placeholder="กรุณากรอกเนื้อหา"
                  value={description}
                  required
                  onChange={(event) => {
                    setDescription(event.target.value);
                  }}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="uploadpic">รูปภาพของเนื้อหา</label>
                <input
                  type="file"
                  className="form-control"
                  id="uploadpic"
                  placeholder="กรุณาอัปโหลดรูปภาพ"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {uploadedImage && (
                  <div className="uploaded-image-container">
                    <img src={uploadedImage} alt="Uploaded Image" style={{ maxWidth: '100%', maxHeight: '200px' }}/>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="sound">เสียงของเนื้อหา</label>
                <input
                  type="file"
                  className="form-control"
                  id="sound"
                  accept="audio/*"
                  onChange={handleSoundUpload}
                />
                {uploadedSound && (
                <div className="uploaded-sound-container">
                  <audio controls>
                    <source src={URL.createObjectURL(uploadedSound)} type="audio/mp3" controls/>
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
              </div>
              <div className="btn-containerr">
                <div className="btn-group me-2">
                  <Button
                    //  type="submit"
                    className="btn1 btn-warning"
                    onClick={cancelArticle}
                  >
                    ยกเลิก
                  </Button>
                </div>
                <div className="btn-group me-2">
                  <Button
                    type="submit"
                    className="btn1 btn-primary"
                    //onClick={confirmBook}
                  >
                    ยืนยัน
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ทำการยืนยัน</Modal.Title>
        </Modal.Header>
        <Modal.Body>คุณต้องการสร้างตอนของบทความใช่ไหม?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={confirmArticle}>
            ตกลง
          </Button>
          <Button
            variant="warning"
            style={{ color: "white" }}
            onClick={() => setShowModal(false)}
          >
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={successModal} onHide={() => setSuccessModal(false)}>
        <Modal.Header closeButton onClick={handleSuccessModalOK}>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Book added successfully</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSuccessModalOK}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Addarticle;
