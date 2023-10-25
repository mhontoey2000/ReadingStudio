import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Header from '../header';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import "../styles/allbookcreator.css"
import Searchbar from "../searchbar";

function Allbookcreator() {
    const [items, setItems] = useState([]);
    const user = localStorage.getItem('email');
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axios.get('http://localhost:5004/api/allbookarticlecreator?user_email=' + user)
          .then((response) => {
            console.log(response.data)
            setItems(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      }, []);

    const filteredItems = items.filter((book) => {
        return book.book_name.includes(searchTerm);
    });

    return (
        <div>
            <Header />
            <section>
                <div className="grid-containerr">
                    <h1>บทความทั้งหมดของฉัน</h1>

                    <div style={{ padding: "10px" }}>
                        <Searchbar onSearch={(searchTerm) => setSearchTerm(searchTerm)} />
                    </div>

                    <table className="table table-hover">
                        <thead>
                            <tr className="head" style={{ textAlign: "center"}}>
                                <th scope="col" className='t-size'>ลำดับ</th>
                                <th scope="col" className='t-size'>บทความ</th>
                                <th scope="col" className='t-size'>รายการตอนของบทความ</th>
                                <th scope="col" className='t-size'>รูปหน้าปกบทความ</th>
                                <th scope="col" className='t-size'>สถานะ</th>
                                <th scope="col" className='t-size'>แก้ไขบทความ</th>
                                <th scope="col" className='t-size'>แก้ไขตอน</th>
                                <th scope="col" className='t-size'>ลบ</th>
                            </tr>
                        </thead>
                        <tbody className="table-group-divider">
                            {filteredItems.length === 0 ? (
                                <tr>
                                <td colSpan="6">
                                  ไม่มีรายการบทของหนังสือที่คุณค้นหา หรือคุณเขียนชื่อบทของหนังสือผิด.
                                </td>
                              </tr>
                            ) : (
                                filteredItems.map((book, index) => (
                                    <tr key={book.book_id}>
                                        <td key={`book${index + 1}`}>{index + 1}</td>
                                        <td>{book.book_name}</td>
                                        <td>
                                            {book.article_name.map((article, index) => (
                                                <span key={index}>
                                                    {article}
                                                    {index < book.article_name.length - 1 && ", "} {/* Add a comma if not the last article */}
                                                </span>
                                            ))}
                                        </td>
                                        <td>
                                            <img src={book.book_imagedata || book.book_image} width="100" height="100" alt={book.book_name} />
                                        </td>
                                        
                                        <td>
                                            <Button>{book.status_book}</Button>
                                        </td>
                                        
                                        <td>
                                            <Link
                                                className="btn btn-warning amt1"
                                                to={{ pathname: `/Page/editbook_${ book.book_id }`, state: { book_id: book.book_id } }}
                                            >
                                                แก้ไขบทความ
                                            </Link>
                                        </td>
                                        <td>
                                            <Link
                                                className="btn btn-warning amt1"
                                                to={{ pathname: `/Page/articleedit_${ book.book_id }`, state: { book_id: book.book_id } }}
                                            >
                                                แก้ไขตอน
                                            </Link>
                                        </td>
                                        <td>
                                            <Button className="btn btn-danger amt2">{/* onClick={() => deleteBook(book.book_id)} */}
                                                ลบบทความ
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

export default Allbookcreator;
