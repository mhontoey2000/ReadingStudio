import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./header";
import "./styles/watchedhistory.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useHistory } from "react-router-dom";
import Searchbar from "./searchbar";
import Button from "react-bootstrap/Button";

function Watchedhistory() {
  const user_id = localStorage.getItem("user_id");
  const [watchedArticles, setWatchedArticles] = useState([]);
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredWatchedArticles, setFilteredWatchedArticles] = useState([]);
  const [activeMenu, setActiveMenu] = useState("watched");

  useEffect(() => {
    axios
      .get(`http://localhost:5004/api/watchedhistory?user_id=${user_id}`)
      .then((response) => {
        // Organize watched articles by day
        const articlesByDay = groupByDay(response.data);
        setWatchedArticles(articlesByDay);
        setFilteredWatchedArticles(articlesByDay);
        console.log("sda", articlesByDay);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user_id]);

  const groupByDay = (articles) => {
    return articles.reduce((result, article) => {
      const date = new Date(article.watched_at);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const dayKey =
        date.toDateString() === today.toDateString()
          ? "วันนี้"
          : date.toDateString() === yesterday.toDateString()
          ? "เมื่อวานนี้"
          : date.toLocaleDateString("th-TH", {
              weekday: "long",
              day: "numeric",
              month: "long",
            });

      if (!result[dayKey]) {
        result[dayKey] = [];
      }

      result[dayKey].push(article);

      return result;
    }, {});
  };

  const handleClearHistory = () => {
    // Add logic to clear the watched history
    // For example, you can make another Axios request to your server to handle this
    // Make sure to update the state or perform any necessary actions
    console.log("Clearing history...");
  };

  const handleToPage = (articleId) => {
    history.push({
      pathname: "/Page/bookdetail",
      state: { article_id: articleId },
    });
  };

  useEffect(() => {
    // Filter watched articles based on the search term
    const filteredArticles = watchedArticlesFilter(searchTerm);
    setFilteredWatchedArticles(filteredArticles);
  }, [searchTerm, watchedArticles]);

  const watchedArticlesFilter = (term) => {
    const filteredArticles = Object.entries(watchedArticles).reduce(
      (result, [day, articles]) => {
        const filteredArticles = articles.filter(
          (article) =>
            article.book_name.toLowerCase().includes(term.toLowerCase()) ||
            article.article_name.toLowerCase().includes(term.toLowerCase()) ||
            day.toLowerCase().includes(term.toLowerCase())
        );

        if (filteredArticles.length > 0) {
          result[day] = filteredArticles;
        }

        return result;
      },
      {}
    );

    return filteredArticles;
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <div>
      <Header />

      <div className="boxhistory">
        <div className="menuleft">
          <ul className="list-group list-group-flush">
            <li
              className={`list-group-item te ${
                activeMenu === "watched" ? "active" : ""
              }`}
              onClick={() => handleMenuClick("watched")}
            >
              ประวัติการดู
            </li>
            <li
              className={`list-group-item te ${
                activeMenu === "exam" ? "active" : ""
              }`}
              onClick={() => handleMenuClick("exam")}
            >
              ประวัติการทำข้อสอบ
            </li>
          </ul>
        </div>

        {activeMenu === "watched" && (
          <div className="menumidhistory">
            <h1 className="text-left">ประวัติการดูบทความ</h1>
            <div style={{ alignItems: "center", margin: "20px" }}>
              <Searchbar onSearch={(term) => setSearchTerm(term)} />
            </div>
            {Object.entries(filteredWatchedArticles).map(([day, articles]) => (
              <div style={{ marginLeft: "50px", padding: "10px" }} key={day}>
                <div className="">
                  <h4 style={{ padding: "20px" }}>{day}</h4>
                </div>
                <ul>
                  {articles.map((article, index) => (
                    <li
                      key={article.article_id}
                      className="boxoflist"
                      onClick={() => handleToPage(article.article_id)}
                    >
                      <div className="flex-container">
                        <div className="left-content">
                          <div style={{ display: "flex" }}>
                            <p
                              style={{ fontWeight: "bold", marginRight: "5px" }}
                            >
                              ชื่อบทความ:
                            </p>
                            <p>{article.book_name}</p>
                          </div>
                          <div style={{ display: "flex" }}>
                            <p
                              style={{ fontWeight: "bold", marginRight: "5px" }}
                            >
                              ชื่อตอน:
                            </p>
                            <p>{article.article_name}</p>
                          </div>
                        </div>
                        <div className="text-center right-content">
                          <img
                            className="imgsize"
                            src={
                              article.article_imagedata ||
                              article.article_images
                            }
                            alt="Article"
                          />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {Object.keys(filteredWatchedArticles).length === 0 && (
              <p>ไม่มีรายการบทความที่ค้นหา</p>
            )}
          </div>
        )}

        {activeMenu === "exam" && (
          <div className="menumidhisexam">
            <h1 className="text-left">ประวัติการทำข้อสอบ</h1>
          </div>
        )}

        {activeMenu === "watched" && (
          <div className="menuright">
            <Button
              className="btn btn-danger clrbtn"
              onClick={handleClearHistory}
            >
              ล้างประวัติ
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Watchedhistory;
