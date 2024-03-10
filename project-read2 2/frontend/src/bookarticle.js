import React, { useEffect, useState } from "react";
import "./styles/bookarticle.css";
import Header from "./header";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";
import Searchbar from "./searchbar";
import Button from "react-bootstrap/Button";

function Bookarticle({ match }) {
  const [items, setItems] = useState([]);
  const location = useLocation();
  const history = useHistory();
  // const [bookid, setBookID] = useState("");
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
    // if (!location.state || location.state.book_id === undefined) {
    //   // Redirect to the home page if book_id is not defined
    //   history.push('/Page/home');
    //   return;
    // }
    // setBookID(location.state.book_id)
    axios
      .get(`http://localhost:5004/api/getarticleban/${bookid}`)
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [bookid]);

  const incrementArticleView = (bookId) => {
    axios.post(`http://localhost:5004/api/articles/view/${bookId}`)
      .then((response) => {
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Function to filter items based on the search term
  const filteredItems = items.filter((item) => {
    return item.article_name.includes(searchTerm);
  });

  return (
    <div>
      <Header />
      <section>
        <h1>ตอนของบทความ</h1>

        <div style={{ padding: "10px" }}>
          <Searchbar onSearch={(searchTerm) => setSearchTerm(searchTerm)} />
        </div>

        <div className="ac">
          <div className="row">
            {filteredItems.length === 0 ? (
              <div className="col-12 text-center">
                <p>ไม่มีรายการตอนที่คุณค้นหา หรือคุณเขียนชื่อตอนผิด.</p>
              </div>
            ) : (
              filteredItems.map((article) => (
                <div className="col-6 col-md-3" key={article.article_id}>
                  <div
                    className="grid-item-wrapper"
                    style={{ padding: "10px" }}
                  >
                    <div className="card cardhover">
                      {article.article_imagedata || article.article_images ? (
                        <img
                          className="card-img-top img-fluid simg"
                          src={
                            article.article_imagedata ||
                            article.article_images ||
                            "url_to_default_image"
                          }
                        />
                      ) : null}
                      <div className="card-body">
                        <h4
                          className="card-title text-center"
                          style={{ fontWeight: "bold" }}
                        >
                          {article.article_name}
                        </h4>
                        <div className="text-center" style={{ margin: "10px" }}>
                          <Link
                            to={{
                              pathname: "/Page/bookdetail",
                              state: { article_id: article.article_id },
                            }}
                            className="btn btn-primary btn-lg"
                            onClick={() => incrementArticleView(article.article_id)}
                          >
                            อ่าน
                          </Link>
                        </div>
                        <div className="card-footer">
                          <span style={{ fontStyle: "italic" }}>
                            <i className="bi bi-eye"></i>
                            {article.article_view} ผู้เข้าชม
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
export default Bookarticle;
