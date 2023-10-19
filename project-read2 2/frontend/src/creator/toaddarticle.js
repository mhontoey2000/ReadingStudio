import React, { useEffect, useState } from "react";
import "../styles/home.css";
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Searchbar from "../searchbar";
import Button from "react-bootstrap/Button";

function Toaddarticle() {
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
          // console.log(response.data);
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
        <h1>เพิ่มตอนของบทความ</h1>

        <div style={{ padding: "10px" }}>
          <Searchbar onSearch={(searchTerm) => setSearchTerm(searchTerm)} />
        </div>

        {["admin", "creator"].includes(usertype) && (
          <div>
            <div className="btnad d-grid d-md-flex justify-content-md-end">
              <div className="center-h6">
                <h6 style={{ color: "red" }}>**หากต้องการเพิ่มตอนกรุณากดปุ่มเพิ่มตอน</h6>
              </div>
              <div key={bookid}>
                <Link
                  type="button"
                  to={{
                    pathname: `/Page/addarticle_${bookid}`,
                    state: { book_id: bookid },
                  }}
                  className="btn btn-success btnt"
                >
                  เพิ่มตอน
                </Link>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="grid-container">
            {filteredItems.length === 0 ? (
              <p>
                ไม่มีรายการตอนของบทความ
                กรุณาเพิ่มตอนของบทความ.
              </p>
            ) : (
              filteredItems.map((article) => (
                <div className="grid-item card" key={article.article_id}>
                  <img
                    className="card-img-top img-fluid simg"
                    src={
                      article.article_imagedata ||
                      article.article_images ||
                      "url_to_default_image"
                    }
                  />
                  <h4 className="card-title" style={{ fontWeight: "bold" }}>
                    {article.article_name}
                  </h4>
                  <span>{article.book_detail}</span>
                  <Link
                    to={{
                      pathname: "/Page/bookdetail",
                      state: { article_id: article.article_id },
                    }}
                    className="buttonh btn-primary"
                  >
                    อ่าน
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Toaddarticle