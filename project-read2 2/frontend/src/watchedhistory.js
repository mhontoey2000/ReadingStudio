import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./header";
import "./styles/watchedhistory.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useHistory } from "react-router-dom";

function Watchedhistory() {
  const user_id = localStorage.getItem("user_id");
  const [watchedArticles, setWatchedArticles] = useState([]);
  const history = useHistory();

  useEffect(() => {
    axios
      .get(`http://localhost:5004/api/watchedhistory?user_id=${user_id}`)
      .then((response) => {
        // Organize watched articles by day
        const articlesByDay = groupByDay(response.data);
        setWatchedArticles(articlesByDay);
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

  const handleToPage = (articleId) => {
    history.push({
      pathname: "/Page/bookdetail",
      state: { article_id: articleId },
    });
  };

  return (
    <div>
      <Header />

      <div className="boxhistory">
        <h1 className="text-left">ประวัติการดูบทความ</h1>
        {Object.entries(watchedArticles).map(([day, articles]) => (
          <div style={{ marginLeft: "50px", padding: "10px" }} key={day}>
            <div className="">
              <h4 style={{ padding: "20px" }}>{day}</h4>
            </div>
            <ul>
              {articles.map((article, index) => (
                <li key={article.article_id} className="boxoflist"  onClick={() => handleToPage(article.article_id)}>
                  <div className="flex-container">
                    <div className="left-content">
                      {/* <p key={`item${index + 1}`}>ลำดับ: {index + 1}</p> */}
                      <div style={{display:"flex"}}>
                        <p style={{fontWeight:"bold",marginRight:"5px"}}>ชื่อบทความ:</p>
                        <p>{article.book_name}</p>
                      </div>
                      <div style={{display:"flex"}}>
                        <p style={{fontWeight:"bold",marginRight:"5px"}}>ชื่อตอน:</p>
                        <p>{article.article_name}</p>
                      </div>
                    </div>
                    <div className="text-center right-content">
                      <img
                        className="imgsize"
                        src={
                          article.article_imagedata || article.article_images
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
      </div>
    </div>
  );
}

export default Watchedhistory;
