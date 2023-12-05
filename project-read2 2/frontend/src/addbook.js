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

  // const addBook = async () => {
  //     // Create a FormData object to send the data as a multipart/form-data request
  //     try{
  //     // const data = {
  //     //   book_name: bookName,
  //     //   book_detail: bookDetail,
  //     //   book_image: bookImage ? await convertImageToBase64(bookImage) : null
  //     // };
  //     // console.log(data.book_image)
  //     const formData = new FormData();
  //       formData.append('book_name', bookName);
  //       formData.append('book_detail', bookDetail);
  //       formData.append('book_image', bookImage);
  //       formData.append('book_creator',user);
  //     // Send a POST request to the backend API to add the book
  //     apiClient
  //       .post('api/addbook', formData) // Replace '/api/addbook' with your actual API endpoint
  //       .then((response) => {
  //         // Handle a successful response here (e.g., show a success message)
  //         alert('Book added successfully');
  //         console.log('Book added successfully');
  //         // Optionally, you can clear the input fields and image after adding the book
  //         setBookName('');
  //         setBookDetail('');
  //         setBookImage(null);
  //       })
  //       .catch((error) => {
  //         // Handle errors here (e.g., show an error message)
  //         console.error('Error adding book:', error);
  //       });
  //     }
  //     catch(err)
  //     {
  //       console.log(err);
  //     }
  //   };

  useEffect(() => {
    generateCaptchaCode();
  }, []);

  const generateCaptchaCode = () => {
    // Generate a random code (you can use a library for more complexity)
    const randomCode = Math.random().toString(36).substring(7).toUpperCase();
    // Set the generated code to the state
    setCaptchaCode(randomCode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the entered code matches the generated code
    if (userEnteredCode === captchaCode) {
      // Proceed with the form submission logic
      setShowModal(true);
    } else {
      // Display an error message or take appropriate action
      alert("CAPTCHA code does not match. Please try again.");
    }
  };

  const handleConfirmed = () => {
    // Close the confirmation modal
    setShowModal(false);

    // Now, proceed to add the book
    // Create a FormData object to send the data as a multipart/form-data request
    const formData = new FormData();
    formData.append("book_name", bookName);
    formData.append("book_detail", bookDetail);
    formData.append("book_image", bookImage);
    formData.append("book_creator", user);

    // Send a POST request to the backend API to add the book
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
        console.error("Error adding book:", error);
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
                <label htmlFor="article_detail">เนื้อหาของบทความ</label>
                <textarea
                  type="text"
                  className="form-control"
                  id="article_detail"
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

              <div className="mb-3">
                <label htmlFor="captcha">CAPTCHA</label>
                <div className="d-flex align-items-center">
                  <span className="mr-2">{captchaCode}</span>
                  <input
                    type="text"
                    className="form-control"
                    id="captcha"
                    placeholder="Enter the CAPTCHA code"
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
    </div>
  );
}

export default Addbook;
