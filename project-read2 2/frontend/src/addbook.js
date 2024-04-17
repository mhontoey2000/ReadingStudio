import React, { useEffect, useState } from "react";
import "./styles/addbook.css";
import Header from "./header";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { useNavigate } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";
import {
  apiClient,
  convertSoundToBase64,
  convertImageToBase64,
} from "./config";
import Modal from "react-bootstrap/Modal";
import ReCAPTCHA from "react-google-recaptcha";

function Addbook() {
  const [bookName, setBookName] = useState("");
  const [bookDetail, setBookDetail] = useState("");
  const [bookImage, setBookImage] = useState(null);
  const user = localStorage.getItem("email");
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [captchaCode, setCaptchaCode] = useState("");
  const [userEnteredCode, setUserEnteredCode] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [captchaBackgroundColor, setCaptchaBackgroundColor] = useState("#")
  const [captchaTextColor, setCaptchaTextColor] = useState("#FFFFFF");

  useEffect(() => {
    generateCaptchaCode();
  }, []);

  const generateCaptchaCode = () => {
    const randomCode = Math.random().toString(36).substring(7).toUpperCase();
    const randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
    const complementaryTextColor = calculateComplementaryColor(randomColor);
    setCaptchaCode(randomCode);
    setCaptchaBackgroundColor(randomColor);
    setCaptchaTextColor(complementaryTextColor);
  };

  const calculateComplementaryColor = (color) => {
    // Function to calculate complementary color
    const hex = color.replace(/^#/, '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    const complementaryR = 255 - r;
    const complementaryG = 255 - g;
    const complementaryB = 255 - b;

    return `rgb(${complementaryR}, ${complementaryG}, ${complementaryB})`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (userEnteredCode === captchaCode) {
      setShowModal(true);
    } else {
      setErrorModal(true);
      generateCaptchaCode();
      setUserEnteredCode("");
    }
  };

  const handleConfirmed = () => {
    setShowModal(false);

    const formData = new FormData();
    formData.append("article_name", bookName);
    formData.append("article_detail", bookDetail);
    formData.append("article_image", bookImage);
    formData.append("article_creator", user);

    // Send a POST request to the backend API to add the article
    apiClient
      .post("api/addbook", formData) // Replace '/api/addbook' with your actual API endpoint
      .then((response) => {
        // Close the confirmation modal
        setShowModal(false);
        // Show the success message modal
        setSuccessModal(true);
      })
      .catch((error) => {
        // Handle errors here (e.g., show an error message)
        console.error("Error adding article:", error);
      });
  };

  const handleImageChange = (event) => {
    // Handle the image selection here and update the bookImage state
    const selectedImage = event.target.files[0];
    setBookImage(selectedImage);
  };

  const cancelBook = () => {
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
        <h1>เพิ่มบทความ</h1>

        <div className="grid-containerr">
          <div className="fg">
            <form className="form-group" onSubmit={handleSubmit}>
              <h2>กรุณากรอกรายละเอียดบทความ</h2>
              <div className="mb-3">
                <label htmlFor="name">ชื่อบทความ</label>
                <input
                  type="text"
                  className="form-control"
                  id="bookname"
                  placeholder="กรุณากรอกชื่อบทความ"
                  required
                  onChange={(event) => {
                    setBookName(event.target.value);
                  }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="bookimage">
                  รูปหน้าปกบทความ{" "}
                  <cite style={{ color: "red" }}>
                    *ขนาดรูปที่แนะนำคือ 500x500
                  </cite>
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="bookimage"
                  accept="image/*"
                  required
                  onChange={handleImageChange}
                />
                <div className="d-flex justify-content-center align-items-center">
                  {bookImage && (
                    <img
                      src={URL.createObjectURL(bookImage)}
                      alt="Uploaded Image"
                      style={{ maxWidth: "100%", maxHeight: "200px" }}
                    />
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="section_detail">เนื้อหาของบทความ</label>
                <textarea
                  type="text"
                  className="form-control"
                  id="section_detail"
                  placeholder="กรุณากรอกเนื้อหา"
                  required
                  onChange={(event) => {
                    setBookDetail(event.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <span style={{ fontStyle: "italic" }}>
                  **ต้องสร้างบทความก่อนจึงจะสามารถสร้างตอนต่างๆของได้
                </span>
              </div>

              <div className="mb-3 d-flex flex-column align-items-center">
                <label htmlFor="captcha" style={{fontWeight:"bold",marginBottom:"10px"}}>CAPTCHA</label>
                <div className="d-flex flex-column align-items-center">
                  <span className="mr-2" 
                    style={{
                      marginBottom:"10px",
                      backgroundColor: captchaBackgroundColor,
                      color: captchaTextColor,
                      fontWeight:"bold",
                      padding: "40px", 
                      borderRadius: "5px",
                      fontSize: "36px"
                      }}>
                        {captchaCode}
                      </span>
                  <input
                    key={captchaCode} 
                    type="text"
                    className="form-control"
                    id="captcha"
                    placeholder="กรุณากรอกรหัส CAPTCHA"
                    required
                    onChange={(event) => {
                      setUserEnteredCode(event.target.value.toUpperCase());
                    }}
                  />
                </div>
              </div>

              <div className="btn-containerr">
                <div className="btn-group me-2">
                  <Button
                    //  type="submit"
                    className="btn1 btn-warning"
                    onClick={cancelBook}
                  >
                    ยกเลิก
                  </Button>
                </div>
                <div className="btn-group me-2">
                  <Button className="btn1 btn-primary" type="submit">
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
          <Modal.Title>ยืนยันการสร้างบทความ</Modal.Title>
        </Modal.Header>
        <Modal.Body>คุณต้องการสร้างบทความใช่ไหม?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleConfirmed}>
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
          <Modal.Title>สำเร็จ</Modal.Title>
        </Modal.Header>
        <Modal.Body>สร้างบทความสำเร็จ</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSuccessModalOK}>
            ตกลง
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={errorModal} onHide={() => setErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ไม่สำเร็จ</Modal.Title>
        </Modal.Header>
        <Modal.Body>รหัสไม่ถูกต้อง กรุณาลองอีกครั้ง</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setErrorModal(false)}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Addbook;
