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

                    <div className="row">
                    <table className="table table-hover">
                        <thead>
                            <tr className="head" style={{ textAlign: "center"}}>
                                <th scope="col" className='col-sm-1'>ลำดับ</th>
                                <th scope="col" className='col-sm-2'>บทความ</th>
                                <th scope="col" className='col-sm-2'>ตอนของบทความ</th>
                                <th scope="col" className='col-sm-2'>รูปหน้าปกบทความ</th>
                                <th scope="col" className='col-sm-1'>สถานะ</th>
                                <th scope="col" className='col-sm-3'>คอมเมนต์</th>
                                <th scope="col" className='col-sm-1'>เวลา</th>
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
                                    <tr key={items.request_id}>
                                        <td className="col-sm-1" key={`book${index + 1}`}>{index + 1}</td>
                                        <td className="col-sm-2">{items.book_name}</td>
                                        <td className="col-sm-2">{items.article_name}</td>
                                        <td className="col-sm-2">
                                            <img src={items.article_imagedata || items.article_image} width="100" height="100" alt={items.article_name} />
                                        </td>
                                        <td className="col-sm-1">
                                            <Button>{items.status_book}</Button>
                                        </td>
                                        <td className="col-sm-3">{items.request_comment}</td>
                                        <td className="col-sm-1">{items.created_at}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    </div>
                </div>
            </section>
        </div>
  )
}

export default Notificationcreator