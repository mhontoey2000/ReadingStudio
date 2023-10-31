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

function Sendrequest() {
  const [items, setItems] = useState([]);
  const user = localStorage.getItem("email");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
                  ส่งคำขอ
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
                        <Button variant="info" style={{color:"white"}}>รออนุมัติ</Button>
                      )}
                      {book.status_book === "Creating" && (
                        <Button variant="secondary">สร้างยังไม่เสร็จ</Button>
                      )}
                      {book.status_book === "ban" && (
                        <Button variant="danger">ถูกปฏิเสธ</Button>
                      )}
                      {book.status_book === "published" && (
                        <Button variant="success">เผยแพร่แล้ว</Button>
                      )}
                    </td>
                    <td>
                      <Button className="btn btn-success">เผยแพร่</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Sendrequest;
