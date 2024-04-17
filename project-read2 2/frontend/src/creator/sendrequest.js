import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "../header";
import Button from "react-bootstrap/Button";
import axios from "axios";
import "../styles/allbookcreator.css";
import Searchbar from "../searchbar";
import Modal from "react-bootstrap/Modal";
import {
  apiClient,
  convertSoundToBase64,
  convertImageToBase64,
} from "../config"

function Sendrequest() {
  const [items, setItems] = useState([]);
  const user = localStorage.getItem("email");
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);

  const sendPublishRequest = (bookId) => {
    setSelectedBookId(bookId);
    setShowConfirmationModal(true);
  };

  useEffect(() => {
    init();
  }, []);
  function init() {
    apiClient
      .get("api/allbookarticlecreator?user_email=" + user)
      .then((response) => {
        // console.log(response.data);
        setItems(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const confirmPublish = () => {
    setShowConfirmationModal(false);
    apiClient
      .post(`api/updateStatusBook/${selectedBookId}`, {
        status_book: "pending",
      })
      .then((response) => {
        setShowSuccessModal(true);
      })
      .catch((error) => {
        console.error("Error updating status_book:", error);
      });
  };

  const filteredItems = items.filter((article) => {
    return article.article_name.includes(searchTerm);
  });

  return (
    <div>
      <Header />
      <section>
        <div className="grid-containerr">
          <h1>เลือกบทความที่ต้องการเผยแพร่</h1>

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
                  ชื่อบทความ
                </th>
                <th scope="col" className="t-size">
                  รายการตอน
                </th>
                <th scope="col" className="t-size">
                  รูปหน้าปกบทความ
                </th>
                <th scope="col" className="t-size">
                  สถานะ
                </th>
                <th scope="col" className="t-size">
                  ส่งคำขอเผยแพร่
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
                      {article.article_name.map((article_section, index) => (
                        <span key={index}>
                          {article_section}
                          {index < article.article_name.length - 1 && ", "}{" "}
                          {/* Add a comma if not the last article_section */}
                        </span>
                      ))}
                    </td>
                    <td>
                      {article.article_imagedata ? (
                        <img
                          src={article.article_imagedata || article.article_image}
                          width="100"
                          height="100"
                          alt={article.article_name}
                        />
                      ) : null}
                    </td>
                    <td>
                      {article.status_article === "pending" && (
                        <span style={{ color: "#FFC436", fontWeight: "bold" }}>
                          รออนุมัติ
                        </span>
                      )}
                      {article.status_article === "creating" && (
                        <span style={{ color: "#192655", fontWeight: "bold" }}>
                          สร้างยังไม่เสร็จ
                        </span>
                      )}
                      {article.status_article === "finished" && (
                        <span style={{ color: "#3876BF", fontWeight: "bold" }}>
                          สร้างเสร็จแล้ว
                        </span>
                      )}
                      {article.status_article === "deny" && (
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          ถูกปฏิเสธ
                        </span>
                      )}
                      {article.status_article === "published" && (
                        <span style={{ color: "green", fontWeight: "bold" }}>
                          เผยแพร่แล้ว
                        </span>
                      )}
                    </td>
                    <td>
                      {article.status_article === "finished" ? (
                        <Button
                          className="btn btn-success"
                          onClick={() => sendPublishRequest(article.article_id)}
                        >
                          ส่งคำขอ
                        </Button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>ยืนยันการส่งคำขอ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>คุณแน่ใจหรือไม่ที่ต้องการส่งคำขอเผยแพร่บทความนี้?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="warning"
            style={{ color: "white" }}
            onClick={() => setShowConfirmationModal(false)}
          >
            ยกเลิก
          </Button>
          <Button variant="primary" onClick={confirmPublish}>
            ยืนยัน
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ส่งคำขอสำเร็จ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>บทความนี้ได้ถูกส่งคำขอเพื่อเผยแพร่แล้ว!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Sendrequest;
