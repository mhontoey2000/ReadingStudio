import React, { useEffect, useState } from 'react';
import './styles/home.css';
import Header from './header';
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Searchbar from "./searchbar";

function Home() {
    const [items, setItems] = useState([]);
    const user = localStorage.getItem('email');
    const [usertype, setUsertype] = useState("");
    const [searchTerm, setSearchTerm] = useState(""); // Add state for search term

    useEffect(() => {
        axios.get('http://localhost:5004/api/userdata?user_email=' + user)
          .then((response) => {
            setUsertype(response.data[0].user_type);
          })
          .catch(error => console.error(error));
    }, [user]);

    useEffect(() => {
        // Use the search term to filter items
        axios.get('http://localhost:5004/api/book')
          .then((response) => {
            const publishedBooks = response.data.filter((book) => book.status_book === 'published' || book.status_book === 'finished');
            setItems(publishedBooks);
          })
          .catch((error) => {
            console.error(error);
          });
    }, []); 

    // Function to filter items based on the search term
    const filteredItems = items.filter((item) => {
        return item.book_name.includes(searchTerm);
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
                            filteredItems.map((book) => (
                                <div className="col-6 col-md-3" key={book.book_id}>
                                    <div className="grid-item-wrapper" style={{ padding: "10px" }}>
                                        <div className="card cardhover">
                                            {book.book_imagedata || book.book_image ? (
                                                <img className="card-img-top img-fluid simg" src={book.book_imagedata || book.book_image} alt={book.book_name} />
                                            ) : null}
                                            <div className="card-body">
                                                <h4 className="card-title" style={{ fontWeight: "bold" }}>{book.book_name}</h4>
                                                <span className="card-text">{book.book_detail}</span>
                                                <div className="text-center" style={{ margin: "10px" }}>
                                                    <Link
                                                        to={{ pathname: "/Page/bookarticle", state: { book_id: book.book_id } }}
                                                        className="btn btn-primary btn-lg"
                                                    >
                                                        อ่าน
                                                    </Link>
                                                </div>
                                            </div>
                                                <div className="card-footer">
                                                    <span style={{ fontStyle: "italic" }}>ผู้อัปโหลด: {book.book_creator}</span>
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
