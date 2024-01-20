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

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = items.slice(startIndex, endIndex);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  useEffect(() => {
    init();
  }, [currentPage]);
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
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="10">
                    ไม่มีรายการบทของบทความที่คุณค้นหา หรือคุณเขียนชื่อบทความผิด.
                  </td>
                </tr>
              ) : (
                currentItems.map((book, index) => (
                  <tr key={book.book_id}>
                    <td className="col-sm-1" key={`book${index + 1}`}>
                    {startIndex + index + 1}
                    </td>
                    <td className="col-sm-2">{book.book_name}</td>
                    <td className="col-sm-2">{book.book_detail}</td>
                    <td className="col-sm-2">
                      {book.article_name.map((article, index) => (
                        <span key={index}>
                          {article}
                          {index < book.article_name.length - 1 && ", "}{" "}
                          {/* Add a comma if not the last article */}
                        </span>
                      ))}
                    </td>
                    <td className="col-sm-2">
                      <img
                        src={book.book_imagedata || book.book_image}
                        width="100"
                        height="100"
                        alt={book.book_name}
                      />
                    </td>
                    <td className="col-sm-2">
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
                    <td className="col-sm-1">
                      <Button
                        className="btn btn-danger"
                        onClick={() => deleteBook(book.book_id)}
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
