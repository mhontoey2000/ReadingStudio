import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./header";
import "./styles/watchedhistory.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Watchedhistory() {
  const user_id = localStorage.getItem("user_id");
  const [firstname, setFirstname] = useState(null);
  const [watchedArticles, setWatchedArticles] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5004/api/watchedhistory?user_id=${user_id}`)
      .then((response) => {
        setWatchedArticles(response.data);
        console.log("data",response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user_id]);

  return (
    <div>
      <Header />
      <h1 className="text-center h1">ประวัติการดูบทความ</h1>
      <ul>
        {watchedArticles.map((article, index) => (
          <li key={article.article_id}>
            {/* Display relevant information about the watched article */}
            <p key={`item${index + 1}`}>ลำดับ: {index + 1}</p>
            <p>ชื่อบทความ: {article.book_name}</p>
            <p>ชื่อตอน: {article.article_name}</p>
            <p>Watched At: {article.watched_at}</p>{" "}
            {/* Updated from article.watched_date */}
            {/* You can include more details as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Watchedhistory;
