import React from "react";
import "./styles/register.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useHistory } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Alert from "react-bootstrap/Alert";
import {
  apiClient,
  convertSoundToBase64,
  convertImageToBase64,
} from "./config";

function Register() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usertype, setUsertype] = useState("");
  const history = useHistory();
  const [idcard, setIdCardImage] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // alert show error
  const [alertMessage, setAlertMessage] = useState(""); // message alert
  const handleImageChange = (event) => {
    // Handle the image selection here and update the bookImage state
    const selectedImage = event.target.files[0];
    setIdCardImage(selectedImage);
  };

  const addAccount = (e) => {
    // console.log("addAccount function called");
    e.preventDefault();
    if (usertype === "creator" && idcard === null) {
      setShowContactModal(true);
    } else if (
      name !== "" &&
      surname !== "" &&
      email !== "" &&
      password !== "" &&
      usertype !== ""
    ) {
      const formData = new FormData();
      // formData.append('article_name', bookName);
      // formData.append('article_detail', bookDetail);
      formData.append("name", name);
      formData.append("surname", surname);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("usertype", usertype);
      formData.append("idcard", idcard);

      apiClient
        .post("api/register", formData)
        .then((response) => {
          // console.log(response);
          setTimeout(() => {
            window.location.href = "./login"; // Redirect to home page after 1 seconds
          }, 1000);
        })
        .catch((error) => {
          const patchError = error.response.data;

          // log alert Error
          console.error(patchError);

          // alert Error Email ซ้ำกัน (ONLY) ถ้าไม่ใช่ email ก็จะไม่เตือน
          if (patchError.statusCode === "email-already") {
            setShowAlert(false);
            setEmailAlert("flex");
          } else {
            setShowAlert(true);
            setEmailAlert("none");
            setAlertMessage(patchError);
          }
        });
    }
  };

  // email alert...
  const setEmailAlert = (displayValue) => {
    const errorMessageDiv = document.getElementById("errorMessage");
    errorMessageDiv.innerHTML = "อีเมลนี้ถูกใช้งานแล้ว";
    errorMessageDiv.style.color = "red";
    // errorMessageDiv.style.display = "flex"; // กำหนดให้เป็น flex container
    errorMessageDiv.style.display = displayValue; // กำหนดให้เป็น flex container
    errorMessageDiv.style.justifyContent = "flex-start"; // จัดวางเนื้อหาชิดซ้าย
    errorMessageDiv.style.alignItems = "flex-start"; // จัดวางเนื้อหาชิดบน
  };

  return (
    <section className="heroreg">
      <div className="contentreg">
        <div className="boxreg">
          <h2>สมัครสมาชิก</h2>

          {showAlert && (
            <Alert
              variant="danger"
              onClose={() => setShowAlert(false)}
              dismissible
            >
              {alertMessage}
            </Alert>
          )}

          <div className="form">
            <form className="form-group was-validated mb-3">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="กรุณากรอกชื่อ"
                  required
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="surname"
                  placeholder="กรุณากรอกนามสกุล"
                  required
                  onChange={(event) => {
                    setSurname(event.target.value);
                  }}
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  placeholder="กรุณากรอกอีเมลล์"
                  required
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
                {/* แก้เพิ่ม */}
                <div id="errorMessage" className="error-message"></div>
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="กรุณากรอกรหัสผ่าน"
                  required
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />
              </div>

              <div className="form-floating">
                <select
                  id="floatingSelect"
                  className="form-select"
                  required
                  onChange={(event) => {
                    setUsertype(event.target.value);
                  }}
                >
                  <option defaultValue></option>
                  <option value="creator">ผู้สร้างบทเรียน</option>
                  <option value="learner">ผู้เรียน</option>
                </select>
                <label htmlFor="floatingSelect">เลือกประเภทบัญชี</label>
              </div>

              {usertype === "creator" && (
                <div className="mb-3">
                  <label className="form-label" htmlFor="idcard">
                    อัพโหลดหลักฐานยืนยันตัวตน เช่น บัตรประชาชน บัตรข้าราชการ
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="idcard"
                    required
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {idcard && (
                    <img
                      src={URL.createObjectURL(idcard)}
                      alt="Uploaded Image"
                      style={{ maxWidth: "300px", maxHeight: "200px" }}
                    />
                  )}
                </div>
              )}

              <p>
                {" "}
                มีสมาชิกอยู่แล้ว? <a href="./login">เข้าสู่ระบบ</a>
              </p>

              <div>
                <Button
                  className="buttonreg"
                  type="submit"
                  onClick={addAccount}
                >
                  ยืนยัน
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Modal show={showContactModal} onHide={() => setShowContactModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>คำแนะนำ</Modal.Title>
        </Modal.Header>
        <Modal.Body>กรุณาอัพโหลดหลักฐานยืนยันตัวตน</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowContactModal(false)}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>

      <footer className="footer">
        <span>ติดต่อผู้พัฒนา readingstudio101@gmail.com</span>
      </footer>
    </section>
  );
}
export default Register;
