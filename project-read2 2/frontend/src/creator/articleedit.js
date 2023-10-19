import React, { useEffect, useState } from "react";
import "../styles/home.css";
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import { AudioOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Input, Space } from "antd";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Searchbar from "../searchbar";
import Button from "react-bootstrap/Button";

function Articleedit() {
  const [items, setItems] = useState([]);
  const location = useLocation();
  const bookid = location.state.book_id;
  const user = localStorage.getItem("email");
  const [usertype, setUsertype] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  // console.log(bookid)

  useEffect(() => {
    axios
      .get("http://localhost:5004/api/userdata?user_email=" + user)
      .then((response) => {
        setUsertype(response.data[0].user_type);
      })
      .catch((error) => console.error(error));
  }, [user]);

  useEffect(() => {
    axios
      .get(`http://localhost:5004/api/article/${bookid}`)
      .then((response) => {
        setItems(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [bookid]);

  const filteredItems = items.filter((article) => {
    return article.article_name.includes(searchTerm);
  });

  return (
    <div>
      <Header />

      <section>
        <div className="grid-containerr">
          <h1>เลือกตอนของบทความที่ต้องการแก้ไข</h1>

          <div style={{ padding: "10px" }}>
            <Searchbar onSearch={(searchTerm) => setSearchTerm(searchTerm)} />
          </div>

          {/* <div>
            <div className="grid-container">
            {filteredItems.length === 0 ? (
              <p>
                ไม่มีรายการตอนของบทความ
              </p>
            ) : (
              filteredItems.map((article) => (
                <div className="grid-item card" key={article.article_id}>
                <img
                    className="card-img-top img-fluid simg"
                    src={article.article_imagedata || article.article_images || 'url_to_default_image'}
                />
                <h4 className="card-title" style={{ fontWeight:"bold"}}>{article.article_name}</h4>
                <span>{article.book_detail}</span>
                <Link
                    to={{ pathname: '/Page/detailedit', state: { article_id: article.article_id } }}
                    className="buttonE btn-warning"
                >
                    แก้ไข
                </Link>
                </div>
            ))
            )}
            </div>
        </div> */}

          <table className="table table-hover">
            <thead>
              <tr className="head" style={{ textAlign: "center" }}>
                <th scope="col" className="t-size">
                  ลำดับ
                </th>
                <th scope="col" className="t-size">
                  หนังสือ
                </th>
                <th scope="col" className="t-size">
                  คำอธิบายหนังสือ
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
                    <td>{article.article_detail}</td>
                    <td>
                      <img
                        src={article.article_imagedata || article.article_images || 'url_to_default_image'}
                        width="100"
                        height="100"
                        // alt={book.book_name}
                      />
                    </td>
                    <td>
                      <Link
                        className="btn btn-warning amt2"
                        to={{
                          pathname: "/Page/detailedit",
                          state: { article_id: article.article_id },
                        }}
                      >
                        แก้ไข
                      </Link>
                    </td>
                    <td>
                      <Button className="btn btn-danger amt2">
                        {/* onClick={() => deleteBook(book.book_id)} */}
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
    </div>
  );
}

export default Articleedit;