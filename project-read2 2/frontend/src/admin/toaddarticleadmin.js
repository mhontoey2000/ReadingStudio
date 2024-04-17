import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "../header";
import Button from "react-bootstrap/Button";
import axios from "axios";
import "../styles/allbookcreator.css";
import Searchbar from "../searchbar";
import {
  apiClient,
  convertSoundToBase64,
  convertImageToBase64,
} from "../config";

function Articlecreator() {
  const [items, setItems] = useState([]);
  const user = localStorage.getItem("email");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    apiClient
      .get(`api/allbookadmin`)
      .then((response) => {
        // console.log(response);
        setItems(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const filteredItems = items.filter((book) => {
    return book.book_name.includes(searchTerm);
  });

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

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
                  รูปหน้าปกบทความ
                </th>
                <th scope="col" className="t-size">
                  เพิ่มตอน
                </th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    ไม่มีรายการบทของหนังสือที่คุณค้นหา
                    หรือคุณเขียนชื่อบทของหนังสือผิด.
                  </td>
                </tr>
              ) : (
                currentItems.map((book, index) => (
                  <tr key={book.book_id}>
                    <td key={`book${index + 1}`}>{startIndex + index + 1}</td>
                    <td>{book.book_name}</td>
                    <td>{book.book_detail}</td>
                    <td>
                      <img
                        src={book.book_imagedata || book.book_image}
                        width="100"
                        height="100"
                        alt={book.book_name}
                      />
                    </td>
                    <td>
                      {user === book.book_creator ? (
                        <Link
                          className="btn btn-success amt3"
                          to={{
                            pathname: "/Page/toaddarticle",
                            state: { book_id: book.book_id },
                          }}
                        >
                          เพิ่มตอน
                        </Link>
                      ) : (
                        <span></span>
                      )}
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
    </div>
  );
}

export default Articlecreator;
