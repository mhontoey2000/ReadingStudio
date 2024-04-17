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
} from "../config";

function Allbookcreator() {
  const [items, setItems] = useState([]);
  const user = localStorage.getItem("email");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

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

  const deleteBook = (bookId) => {
    const bookToDelete = items.find((book) => book.book_id === bookId);
    setBookToDelete(bookToDelete);
    setShowDeleteModal(true);
  };

  const deleteBookConfirmed = (bookId) => {
    apiClient
      .delete(`api/deleteallbookcreator/${bookId}`)
      .then(() => {
        // console.log(`บทความ ${bookId} ถูกลบแล้ว.`);
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

          <div className="text-center" style={{ margin: "10px" }}>
            <cite style={{ color: "#192655", fontWeight: "bold" }}>
              สร้างยังไม่เสร็จ
            </cite>
            <cite style={{ color: "red", marginLeft: "10px" }}>
              หมายถึงบทความของคุณยังไม่สร้างตอนของบทความนั้น
            </cite>
          </div>
          <table className="table table-hover">
            <thead>
              <tr className="head" style={{ textAlign: "center" }}>
                <th scope="col" className="col-sm-1">
                  ลำดับ
                </th>
                <th scope="col" className="col-sm-1">
                  บทความ
                </th>
                <th scope="col" className="col-sm-2">
                  รายการตอนของบทความ
                </th>
                <th scope="col" className="col-sm-1">
                  รูปหน้าปกบทความ
                </th>
                <th scope="col" className="col-sm-2">
                  สถานะ
                </th>
                <th scope="col" className="col-sm-2">
                  แก้ไขบทความ
                </th>
                <th scope="col" className="col-sm-2">
                  แก้ไขตอน
                </th>
                <th scope="col" className="col-sm-2">
                  ลบ
                </th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="10">
                    ไม่มีรายการบทความที่คุณค้นหา หรือคุณเขียนชื่อบทความผิด.
                  </td>
                </tr>
              ) : (
                currentItems.map((book, index) => (
                  <tr key={book.book_id}>
                    <td className="col-sm-1" key={`book${index + 1}`}>
                    {startIndex + index + 1}
                    </td>
                    <td className="col-sm-2">{book.book_name}</td>
                    <td className="col-sm-2">
                      {book.article_name.map((article, index) => (
                        <span key={index}>
                          {article}
                          {index < book.article_name.length - 1 && ", "}{" "}
                          {/* Add a comma if not the last article */}
                        </span>
                      ))}
                    </td>
                    <td className="col-sm-1">
                      {book.book_imagedata ? (
                        <img
                          src={book.book_imagedata || book.book_image}
                          width="100"
                          height="100"
                          alt={book.book_name}
                        />
                      ) : null}
                    </td>

                    <td className="col-sm-2">
                      {book.status_book === "pending" && (
                        <span style={{ color: "#FFC436", fontWeight: "bold" }}>
                          รออนุมัติ
                        </span>
                      )}
                      {book.status_book === "creating" && (
                        <span style={{ color: "#192655", fontWeight: "bold" }}>
                          สร้างยังไม่เสร็จ
                        </span>
                      )}
                      {book.status_book === "finished" && (
                        <span style={{ color: "#3876BF", fontWeight: "bold" }}>
                          สร้างเสร็จแล้ว
                        </span>
                      )}
                      {book.status_book === "deny" && (
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          ถูกปฏิเสธ
                        </span>
                      )}
                      {book.status_book === "published" && (
                        <span style={{ color: "green", fontWeight: "bold" }}>
                          เผยแพร่แล้ว
                        </span>
                      )}
                    </td>

                    <td className="col-sm-2">
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
                    <td className="col-sm-2">
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
                    <td className="col-sm-2">
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
