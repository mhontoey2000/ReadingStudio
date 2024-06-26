import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "../header";
import Button from "react-bootstrap/Button";
import axios from "axios";
import "../styles/allbookcreator.css";
import Searchbar from "../searchbar";
import LoadingPage from "../LoadingPage";
import {
  apiClient,
  convertSoundToBase64,
  convertImageToBase64,
} from "../config";

const Allexamadmin = () => {

    const [items, setItems] = useState([]);
    const user = localStorage.getItem("email");
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoadedBtn, setIsLoadedBtn] = useState(true); // close click btn for loadData....
  
    useEffect(() => {
      apiClient
        .get("api/allexamadmin")
        .then((response) => {
          // console.log(response);
          setItems(response.data);
          // open click btn
        setIsLoadedBtn(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);
  
    const filteredItems = items.filter((article) => {
      return article.article_name.includes(searchTerm);
    });

  return (
    <div>
      {/* waite... data */}
      <LoadingPage open={isLoadedBtn} />
      <Header />
      <section>
        <div className="grid-containerr">
          <h1>ข้อสอบทั้งหมดของฉัน</h1>

          <div className="row justify-content-md-center">
          <div className="col-md-auto" style={{ padding: "10px" }}>
            <Searchbar onSearch={(searchTerm) => setSearchTerm(searchTerm)} />
          </div>
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
                  ตอน
                </th>
                <th scope="col" className="t-size">
                  รูปหน้าปกหนังสือ
                </th>
                <th scope="col" className="t-size">
                  แก้ไข
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
                filteredItems.map((article, index) => (
                  <tr key={article.article_id}>
                        <td key={`article${index + 1}`}>{index + 1}</td>
                        <td>{article.article_name}</td>
                        <td>{article.section_name}</td>
                        <td>
                        <img
                            src={article.section_imagedata || article.article_image}
                            width="100"
                            height="100"
                        />
                        </td>
                    <td>
                      {/* <a href={'/admin/article/edit/' + article.article_id} className="btn btn-primary">Edit</a> */}
                      <Link
                        className="btn btn-warning amt1"
                        to={{
                          pathname: `/Page/editexam_${ article.article_id }`,
                          state: { article_id: article.article_id },
                        //   to={{ pathname: `/Page/editbook_${ article.article_id }`, state: { article_id: article.article_id } }}
                        }}
                      >
                        แก้ไขข้อสอบ
                      </Link>
                    </td>
                    <td>
                      <Button
                        className="btn btn-danger amt2"
                        //onClick={() => deleteBook(article.article_id)}
                      >
                        ลบข้อสอบ
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Allexamadmin