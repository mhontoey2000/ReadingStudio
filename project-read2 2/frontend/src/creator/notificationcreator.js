import React, { useState, useEffect } from "react";
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import Searchbar from "../searchbar";

function Notificationcreator() {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
  const user = localStorage.getItem('email');

  useEffect(() => {
    axios.get('http://localhost:5004/api/notification?user_email=' + user)
      .then((response) => {
        console.log(response)
        setItems(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const filteredItems = items.filter((items) => {
    return items.book_name.includes(searchTerm);
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
                                <th scope="col" className='t-size'>ตอนของบทความ</th>
                                <th scope="col" className='t-size'>รูปหน้าปกบทความ</th>
                                <th scope="col" className='t-size'>สถานะ</th>
                                <th scope="col" className='t-size'>คอมเมนต์</th>
                                <th scope="col" className='t-size'>เวลา</th>
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
                                filteredItems.map((items, index) => (
                                    <tr key={items.book_id}>
                                        <td key={`book${index + 1}`}>{index + 1}</td>
                                        <td>{items.book_name}</td>
                                        <td>{items.article_name}</td>
                                        <td>
                                            <img src={items.article_imagedata || items.article_image} width="100" height="100" alt={items.article_name} />
                                        </td>
                                        
                                        <td>
                                            <Button>{items.status_book}</Button>
                                        </td>
                                        <td>{items.request_comment}</td>
                                        <td>{items.created_at}</td>
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

export default Notificationcreator