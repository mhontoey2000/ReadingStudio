import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "../header";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Searchbar from "../searchbar";
import "../styles/alladmin.css";
import LoadingPage from "../LoadingPage";
import {
  apiClient,
  convertSoundToBase64,
  convertImageToBase64,
} from "../config";

const Allbookadmin = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [statusUser, setStatusUser] = useState("");
  const user = localStorage.getItem("email");
  const [isLoadedBtn, setIsLoadedBtn] = useState(true); // close click btn for loadData....

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    init();
  }, [currentPage, searchTerm]);

  function init() {
    //console.log(user);
    apiClient
      .get("api/userdata?user_email=" + user)
      .then((userresponse) => {
        //console.log("User :" + userresponse.data[0].user_type);

        apiClient
          .get("api/allbookarticleadmin")
          .then((response) => {
            //console.log(response);
            const filteredData = response.data.filter((item) => {
              setStatusUser(userresponse.data[0].user_type);
              return canEditChapter(
                userresponse.data[0].user_type,
                item.article_creator
              );
            });
            setItems(filteredData);
            //console.log(items);
            // open click btn
         setIsLoadedBtn(false);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => console.error(error));
  }
  function canEditChapter(usertype, bookcreator) {
    //console.log(usertype);
    return usertype === "admin" || user.includes(bookcreator);
  }
  function canUserEditChapter(bookcreator) {
    return user.includes(bookcreator);
  }

  const deleteBook = (bookId) => {
    const bookToDelete = items.find((article) => article.article_id === bookId);
    setBookToDelete(bookToDelete);
    setShowDeleteModal(true);
  };

  const deleteBookConfirmed = (bookId) => {
    apiClient
      .delete(`api/deletebook/${bookId}`)
      .then(() => {
        //console.log(`บทความที่มี ID ${bookId} ถูกลบแล้ว.`);
        // Refresh the article list after deletion
        init();
      })
      .catch((error) => {
        console.error(
          `เกิดข้อผิดพลาดในการลบบทความที่มี ID ${bookId}: ${error}`
        );
      });
  };

  const filteredItems = items.filter((article) => {
    // Convert search term to lower case for case-insensitive comparison
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
    // Check if the article name contains the search term
    const nameMatches = article.article_name.toLowerCase().includes(lowerCaseSearchTerm);
  
    // Check if any section name contains the search term
    // Ensure article.section_name is valid and an array before applying the some() function
    const sectionMatches = article.section_name && Array.isArray(article.section_name) && article.section_name.some(section =>
      section.toLowerCase().includes(lowerCaseSearchTerm)
    );
  
    // Return true if either nameMatches or sectionMatches is true
    return nameMatches || sectionMatches;
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
          <div className="row">
            <h1>บทความทั้งหมด</h1>

            <div style={{ padding: "10px" }}>
            <Searchbar onSearch={(searchTerm) => setSearchTerm(searchTerm)} />
          </div>

          <div className="text-center" style={{margin:"10px"}}>
            <cite style={{color:"#192655",fontWeight:"bold"}}>สร้างยังไม่เสร็จ</cite>
            <cite style={{color:"red",marginLeft:"10px"}}>หมายถึงบทความของคุณยังไม่สร้างตอนของบทความนั้น</cite>
          </div>
            
            <table className="table table-hover">
              <thead>
                <tr className="head" style={{ textAlign: "center" }}>
                  <th scope="col" className="col-sm-1">
                    ลำดับ
                  </th>
                  <th scope="col" className="col-sm-2">
                    บทความ
                  </th>
                  <th scope="col" className="col-sm-3">
                    รายการตอนของบทความ
                  </th>
                  <th scope="col" className="col-sm-1">
                    รูปหน้าปกบทความ
                  </th>
                  <th scope="col" className="col-sm-1">
                    สถานะ
                  </th>
                  <th scope="col" className="col-sm-1">
                    แก้ไขบทความ
                  </th>
                  <th scope="col" className="col-sm-2">
                    แก้ไขตอน
                  </th>
                  <th scope="col" className="col-sm-1">
                    ลบ
                  </th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center">
                    ไม่มีรายการของบทความที่คุณค้นหา
                    หรือคุณเขียนชื่อของบทความผิด.
                  </td>
                </tr>
              ) : (
                currentItems.map((article, index) => (
                  <tr key={article.article_id}>
                    <td className="col-sm-1" key={`article${index}`}>
                    {startIndex + index + 1}
                    </td>
                    <td className="col-sm-2">{article.article_name}</td>
                    {/* <td className='col-sm-4'>{article.article_detail}</td> */}
                    <td className="col-sm-3">
                      {article.section_name.map((article_section, index) => (
                        <span key={index}>
                          {article_section}
                          {index < article.section_name.length - 1 && ", "}{" "}
                          {/* Add a comma if not the last article_section */}
                        </span>
                      ))}
                    </td>
                    <td className="col-sm-1">
                      <img
                        src={article.article_imagedata || article.article_image}
                        width="100"
                        height="100"
                      />
                    </td>
                    <td className="col-sm-2">
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
                    <td className="col-sm-1">
                      {canUserEditChapter(article.article_creator) && (
                        <Link
                          className="btn btn-warning amt1"
                          to={{
                            pathname: `/Page/editbook_${article.article_id}`,
                            state: { article_id: article.article_id },
                          }}
                        >
                          แก้ไขบทความ
                        </Link>
                      )}
                    </td>
                    <td className="col-sm-1">
                      {canUserEditChapter(article.article_creator) && (
                        <Link
                          className="btn btn-warning amt1"
                          to={{
                            pathname: `/Page/articleedit_${article.article_id}`,
                            state: { article_id: article.article_id },
                          }}
                        >
                          แก้ไขตอน
                        </Link>
                      )}
                    </td>
                    <td className="col-sm-1">
                      {canUserEditChapter(article.article_creator) && (
                        <Button
                          className="btn btn-danger amt2"
                          onClick={() => deleteBook(article.article_id)}
                        >
                          ลบบทความ
                        </Button>
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
        </div>
      </section>

      {/* Modal ยืนยันการลบ */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ยืนยันการลบ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookToDelete && (
            <p>คุณแน่ใจหรือไม่ที่ต้องการลบบทความ: {bookToDelete.article_name}?</p>
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
    </div>
  );
};

export default Allbookadmin;
