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

function Allbookcreator() {
  const [items, setItems] = useState([]);
  const user = localStorage.getItem("email");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

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

  const deleteBook = (bookId) => {
    const bookToDelete = items.find((book) => book.book_id === bookId);
    setBookToDelete(bookToDelete);
    setShowDeleteModal(true);
  };

  const deleteBookConfirmed = (bookId) => {
    axios
      .delete(`http://localhost:5004/api/deleteallbookcreator/${bookId}`)
      .then(() => {
        console.log(`บทความ ${bookId} ถูกลบแล้ว.`);
        // Refresh the book list after deletion
        init();
        setShowDeleteModal(false);
      })
      .catch((error) => {
        console.error(
          `เกิดข้อผิดพลาดในการลบบทความที่มี ID ${bookId}: ${error}`
        );
      });
  };
  const filteredItems = items.filter((book) => {
    return book.book_name.includes(searchTerm);
  });

  return (
    <div>
      <Header />
      <section>
        <div className="grid-containerr">
          <h1>บทความทั้งหมดของฉัน</h1>

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
                  บทความ
                </th>
                <th scope="col" className="t-size">
                  รายการตอนของบทความ
                </th>
                <th scope="col" className="t-size">
                  รูปหน้าปกบทความ
                </th>
                <th scope="col" className="t-size">
                  สถานะ
                </th>
                <th scope="col" className="t-size">
                  แก้ไขบทความ
                </th>
                <th scope="col" className="t-size">
                  แก้ไขตอน
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
                      {book.book_imagedata ? (
                        <img
                          src={book.book_imagedata || book.book_image}
                          width="100"
                          height="100"
                          alt={book.book_name}
                        />
                      ) : null}
                    </td>

                    <td>
                      {book.status_book === "pending" && (
                        <Button variant="info" style={{ color: "white" }}>
                          รออนุมัติ
                        </Button>
                      )}
                      {book.status_book === "creating" && (
                        <Button variant="secondary">สร้างยังไม่เสร็จ</Button>
                      )}
                      {book.status_book === "deny" && (
                        <Button variant="danger">ถูกปฏิเสธ</Button>
                      )}
                      {book.status_book === "published" && (
                        <Button variant="success">เผยแพร่แล้ว</Button>
                      )}
                    </td>

                    <td>
                      <Link
                        className="btn btn-warning amt2"
                        to={{
                          pathname: `/Page/editbook_${book.book_id}`,
                          state: { book_id: book.book_id },
                        }}
                      >
                        แก้ไขบทความ
                      </Link>
                    </td>
                    <td>
                      <Link
                        className="btn btn-warning amt2"
                        to={{
                          pathname: `/Page/articleedit_${book.book_id}`,
                          state: { book_id: book.book_id },
                        }}
                      >
                        แก้ไขตอน
                      </Link>
                    </td>
                    <td className="col-sm-1">
                      <Button
                        className="btn btn-danger amt2"
                        onClick={() => deleteBook(book.book_id)}
                      >
                        ลบบทความ
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
      {/* Modal ยืนยันการลบ */}
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
              //setShowDeleteModal(false);
            }}
          >
            ลบ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Allbookcreator;
