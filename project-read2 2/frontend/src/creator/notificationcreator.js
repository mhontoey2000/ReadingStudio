import React, { useState, useEffect } from "react";
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import Searchbar from "../searchbar";
import { Link } from "react-router-dom";
import LoadingPage from "../LoadingPage";
import {
  apiClient,
  convertSoundToBase64,
  convertImageToBase64,
} from "../config"

function formatDate(dateString) {
  const date = new Date(dateString);
  let day = ('0' + date.getDate()).slice(-2);  // ensures two digits
  let month = ('0' + (date.getMonth() + 1)).slice(-2);  // ensures two digits, months are 0-indexed
  let year = date.getFullYear();

  return `${day}/${month}/${year}`;  // returns date in dd/mm/yy format
}

function Notificationcreator() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const user = localStorage.getItem("email");

  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;
  const [isLoadedBtn, setIsLoadedBtn] = useState(true); // close click btn for loadData....

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  useEffect(() => {
    apiClient
      .get("api/notification?user_email=" + user)
      .then((response) => {
        // console.log(response.data);
        setItems(response.data);
        // open click btn
        setIsLoadedBtn(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user]);

  const filteredItems = items.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = item.article_name.toLowerCase().includes(searchLower);
    let sectionMatch = false;
    // Ensure section_name is treated correctly as an array
    if (Array.isArray(item.section_name)) {
      sectionMatch = item.section_name.some(section =>
        section.toLowerCase().includes(searchLower)
      );
    } else if (typeof item.section_name === 'string') {
      sectionMatch = item.section_name.toLowerCase().includes(searchLower);
    }

    return nameMatch || sectionMatch;
  });

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  return (
    <div>
      {/* waite... data */}
      <LoadingPage open={isLoadedBtn} />
      <Header />
      <section>
        <div className="grid-containerr">
          <h1>รายการแจ้งเตือน</h1>

          <div className="row justify-content-md-center">
            <div className="col-md-auto" style={{ padding: "10px" }}>
              <Searchbar onSearch={(searchTerm) => setSearchTerm(searchTerm)} />
            </div>
          </div>

          <div className="row">
            <table className="table table-hover">
              <thead>
                <tr className="head" style={{ textAlign: "center" }}>
                  <th scope="col" className="col-sm-1">
                    ลำดับ
                  </th>
                  <th scope="col" className="col-sm-2">
                    บทความ
                  </th>
                  <th scope="col" className="col-sm-2">
                    ตอนของบทความ
                  </th>
                  <th scope="col" className="col-sm-2">
                    รูปหน้าปกบทความ
                  </th>
                  <th scope="col" className="col-sm-1">
                    สถานะ
                  </th>
                  <th scope="col" className="col-sm-3">
                    คอมเมนต์
                  </th>
                  <th scope="col" className="col-sm-1">
                    ดูเนื้อหา
                  </th>
                  <th scope="col" className="col-sm-1">
                    เวลา
                  </th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="10">ไม่มีรายการสถานะของบทความ.</td>
                  </tr>
                ) : (
                  currentItems.map((items, index) => (
                    <tr key={items.request_id}>
                      <td className="col-sm-1" key={`article${index + 1}`}>
                        {startIndex + index + 1}
                      </td>
                      <td className="col-sm-2">{items.article_name}</td>
                      <td className="col-sm-2">{items.section_name}</td>
                      <td className="col-sm-1">
                        <img
                          src={items.section_imagedata || items.article_image}
                          width="100"
                          height="100"
                          alt={items.section_name}
                        />
                      </td>
                      <td className="col-sm-1">
                        {items.status === "pending" && (
                          <span
                            style={{ color: "#FFC436", fontWeight: "bold" }}
                          >
                            รออนุมัติ
                          </span>
                        )}
                        {items.status === "creating" && (
                          <span
                            style={{ color: "#192655", fontWeight: "bold" }}
                          >
                            สร้างยังไม่เสร็จ
                          </span>
                        )}
                        {items.status === "finished" && (
                          <span
                            style={{ color: "#3876BF", fontWeight: "bold" }}
                          >
                            สร้างเสร็จแล้ว
                          </span>
                        )}
                        {items.status === "deny" && (
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            ถูกระงับ
                          </span>
                        )}
                        {items.status === "published" && (
                          <span style={{ color: "green", fontWeight: "bold" }}>
                            เผยแพร่แล้ว
                          </span>
                        )}
                      </td>
                      <td className="col-sm-2">{items.request_comment}</td>
                      <td className="col-sm-1">
                        <Link
                          to={{
                            pathname: "/Page/bookdetail",
                            state: { section_id: items.section_id },
                          }}
                          className="btn btn-success"
                        >
                          ดู
                        </Link>
                      </td>
                      <td className="col-sm-2">{formatDate(items.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                      ย้อนกลับ
                    </Button>
                    <span style={{ margin: "0 10px" }}>
                      {currentPage} จาก {totalPages}
                    </span>
                    <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                      ถัดไป
                    </Button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Notificationcreator;
