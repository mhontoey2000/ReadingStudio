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

function Articlecreator() {
  const [items, setItems] = useState([]);
  const user = localStorage.getItem("email");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    init();
  }, []);
  function init() {
    axios
      .get("http://localhost:5004/api/allbookarticlecreator?user_email=" + user)
      .then((response) => {
        console.log(response.data);
        setItems(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const filteredItems = items.filter((book) => {
    return book.book_name.includes(searchTerm);
  });

  const deleteBook = (bookId) => {
    const bookToDelete = items.find((book) => book.book_id === bookId);
    setBookToDelete(bookToDelete);
    setShowDeleteModal(true);
  };

  const deleteBookConfirmed = (bookId) => {
    axios
      .delete(`http://localhost:5004/api/deletebook/${bookId}`)
      .then(() => {
        console.log(`บทความที่มี ID ${bookId} ถูกลบแล้ว.`);
        // Refresh the book list after deletion
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
                <th scope="col" className="t-size">
                  ลำดับ
                </th>
                <th scope="col" className="t-size">
                  ชื่อบทความ
                </th>
                <th scope="col" className="t-size">
                  คำอธิบายบทความ
                </th>
                <th scope="col" className="t-size">
                  รายการตอน
                </th>
                <th scope="col" className="t-size">
                  รูปหน้าปกบทความ
                </th>
                <th scope="col" className="t-size">
                  เพิ่มตอน
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
                filteredItems.map((book, index) => (
                  <tr key={book.book_id}>
                    <td key={`book${index + 1}`}>{index + 1}</td>
                    <td>{book.book_name}</td>
                    <td>{book.book_detail}</td>
                    <td>
                      {book.article_name.map((article, index) => (
                        <span key={index}>
                          {article}
                          {index < book.article_name.length - 1 && ", "}{" "}
                          {/* Add a comma if not the last article */}
                        </span>
                      ))}
                    </td>
                    <td>
                      <img
                        src={book.book_imagedata || book.book_image}
                        width="100"
                        height="100"
                        alt={book.book_name}
                      />
                    </td>
                    <td>
                      <Link
                        className="btn btn-success"
                        to={{
                          pathname: "/Page/toaddarticle",
                          state: { book_id: book.book_id },
                        }}
                      >
                        เพิ่มตอน
                      </Link>
                    </td>
                    <td>
                      <Button
                        className="btn btn-danger"
                        onClick={() => deleteBook(book.book_id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ยืนยันการลบ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookToDelete && (
            <p>คุณแน่ใจหรือไม่ที่ต้องการลบบทความ: {bookToDelete.book_name}?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            ยกเลิก
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deleteBookConfirmed(bookToDelete.book_id);
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
