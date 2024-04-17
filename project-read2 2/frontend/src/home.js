import React, { useEffect, useState } from 'react';
import './styles/home.css';
import Header from './header';
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Searchbar from "./searchbar";
import {
    apiClient,
    convertSoundToBase64,
    convertImageToBase64,
  } from "./config"

function Home() {
    const [items, setItems] = useState([]);
    const user = localStorage.getItem('email');
    const [usertype, setUsertype] = useState("");
    const [searchTerm, setSearchTerm] = useState(""); // Add state for search term

    useEffect(() => {
        apiClient.get('api/userdata?user_email=' + user)
          .then((response) => {
            setUsertype(response.data[0].user_type);
          })
          .catch(error => console.error(error));
    }, [user]);

    useEffect(() => {
        // Use the search term to filter items
        apiClient.get('api/article')
          .then((response) => {
            const publishedBooks = response.data.filter((article) => article.status_article === 'published' || article.status_article === 'finished');
            setItems(publishedBooks);
          })
          .catch((error) => {
            console.error(error);
          });
    }, []); 
    
    const incrementBookView = (bookId) => {
        apiClient.post(`/api/article/view/${bookId}`)
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
            <Header/>
        
            <section>
                <h1>บทความ</h1>

                <div style={{padding:"10px"}}>
                  <Searchbar onSearch={(searchTerm) => setSearchTerm(searchTerm)} />
                </div>

                <div className="bc">
                    <div className="row">
                        {filteredItems.length === 0 ? (
                            <div className="col-12 text-center">
                                <p>ไม่มีรายการหนังสือที่คุณค้นหา หรือคุณเขียนชื่อหนังสือผิด.</p>
                            </div>
                        ) : (
                            filteredItems.map((article) => (
                                <div className="col-6 col-md-3" key={article.article_id}>
                                    <div className="grid-item-wrapper" style={{ padding: "10px" }}>
                                        <div className="card cardhover">
                                            {article.article_imagedata || article.article_image ? (
                                                <img className="card-img-top img-fluid simg" src={article.article_imagedata || article.article_image} alt={article.article_name} />
                                            ) : null}
                                            <div className="card-body">
                                                <h4 className="card-title" style={{ fontWeight: "bold" }}>{article.article_name}</h4>
                                                <h5 className="card-text">{article.article_detail}</h5>
                                                <span className="card-text" style={{ fontStyle: "italic",marginTop: "10px" }}>ผู้อัปโหลด: {article.article_creator}</span>
                                                {/* <span className="card-text"><i class="bi bi-eye"></i></span> */}
                                                <div className="text-center" style={{ margin: "10px" }}>
                                                    <Link
                                                        to={{ pathname: "/Page/bookarticle", state: { article_id: article.article_id } }}
                                                        className="btn btn-primary btn-lg"
                                                        onClick={() => incrementBookView(article.article_id)}
                                                    >
                                                        อ่าน
                                                    </Link>
                                                </div>
                                            </div>
                                                <div className="card-footer">
                                                    <span style={{ fontStyle: "italic" }}><i className="bi bi-eye"></i>{article.article_view} ผู้เข้าชม</span>
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

export default Home;
