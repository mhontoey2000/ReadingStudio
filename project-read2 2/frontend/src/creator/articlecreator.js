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
import LoadingPage from "../LoadingPage";
import {
  apiClient,
  convertSoundToBase64,
  convertImageToBase64,
} from "../config";

function Articlecreator() {
  const [items, setItems] = useState([]);
  const user = localStorage.getItem("email");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [isLoadedBtn, setIsLoadedBtn] = useState(true); // close click btn for loadData....

  useEffect(() => {
    init();
  }, [currentPage]);
  function init() {
    apiClient
      .get("api/allbookarticlecreator?user_email=" + user)
      .then((response) => {
        // console.log(response.data);
        setItems(response.data);
        // open click btn
        setIsLoadedBtn(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const filteredItems = items.filter((article) => {
    return article.article_name.includes(searchTerm);
  });

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  const deleteBook = (bookId) => {
    const bookToDelete = items.find((article) => article.article_id === bookId);
    setBookToDelete(bookToDelete);
    setShowDeleteModal(true);
  };

  const deleteBookConfirmed = (bookId) => {
    apiClient
      .delete(`api/deletebook/${bookId}`)
      .then(() => {
        // console.log(`บทความที่มี ID ${bookId} ถูกลบแล้ว.`);
        // Refresh the article list after deletion
        setShowSuccessModal(true);
        init();
      })
      .catch((error) => {
        console.error(
          `เกิดข้อผิดพลาดในการลบบทความที่มี ID ${bookId}: ${error}`
        );
      });
  };

  return (
    <div>
      {/* waite... data */}
      <LoadingPage open={isLoadedBtn} />
      <Header />
      <section>
        <div className="grid-containerr">
          <h1>เลือกบทความที่ต้องการเพิ่มตอน</h1>

          <div style={{ padding: "10px" }}>
            <Searchbar onSearch={(searchTerm) => setSearchTerm(searchTerm)} />
          </div>

          <table className="table table-hover">
            <thead>
              <tr className="head" style={{ textAlign: "center" }}>
                <th scope="col" className="col-sm-1">
                  ลำดับ
                </th>
                <th scope="col" className="col-sm-2">
                  ชื่อบทความ
                </th>
                <th scope="col" className="col-sm-2">
                  คำอธิบายบทความ
                </th>
                <th scope="col" className="col-sm-2">
                  รายการตอน
                </th>
                <th scope="col" className="col-sm-2">
                  รูปหน้าปกบทความ
                </th>
                <th scope="col" className="col-sm-2">
                  เพิ่มตอน
                </th>
                <th scope="col" className="col-sm-1">
                  ลบ
                </th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="10">
                    ไม่มีรายการบทของบทความที่คุณค้นหา หรือคุณเขียนชื่อบทความผิด.
                  </td>
                </tr>
              ) : (
                currentItems.map((article, index) => (
                  <tr key={article.article_id}>
                    <td className="col-sm-1" key={`article${index + 1}`}>
                      {startIndex + index + 1}
                    </td>
                    <td className="col-sm-2">{article.article_name}</td>
                    <td className="col-sm-2">{article.article_detail}</td>
                    <td className="col-sm-2">
                      {article.section_name.map((article_section, index) => (
                        <span key={index}>
                          {article_section}
                          {index < article.section_name.length - 1 && ", "}{" "}
                          {/* Add a comma if not the last article_section */}
                        </span>
                      ))}
                    </td>
                    <td className="col-sm-2">
                      <img
                        src={article.article_imagedata || article.article_image}
                        width="100"
                        height="100"
                        alt={article.article_name}
                      />
                    </td>
                    <td className="col-sm-2">
                      <Link
                        className="btn btn-success"
                        to={{
                          pathname: "/Page/toaddarticle",
                          state: { article_id: article.article_id },
                        }}
                      >
                        เพิ่มตอน
                      </Link>
                    </td>
                    <td className="col-sm-1">
                      <Button
                        className="btn btn-danger"
                        onClick={() => deleteBook(article.article_id)}
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
          {bookToDelete && (
            <p>
              คุณแน่ใจหรือไม่ที่ต้องการลบบทความ: {bookToDelete.article_name}?
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
              deleteBookConfirmed(bookToDelete.article_id);
              setShowDeleteModal(false);
            }}
          >
            ลบ
          </Button>
        </Modal.Footer>
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

export default Articlecreator;
