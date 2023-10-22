import React, { useState, useEffect } from 'react';
import Header from '../header';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

function Forapprovebook() {
    const [items, setItems] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    // const [bookToDelete, setBookToDelete] = useState(null);
    const user = localStorage.getItem('email');

    useEffect(() => {
        axios.get('http://localhost:5004/api/forapprove')
            .then((response) => {
                setItems(response.data);
                console.log(items)
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

  return (
    <div>
            <Header />
            <section>
                <div className="grid-containerr">
                    <div className='row'>
                    <h1>บทความที่รอการอนุมัติ</h1>
                    <table className="table table-hover">
                        <thead>
                            <tr className="head" style={{ textAlign: "center" }}>
                                <th
                                    scope="col"
                                    className='col-sm-1'
                                >
                                    ลำดับ
                                </th>
                                <th
                                    scope="col"
                                    className='col-sm-2'
                                >
                                    บทความ
                                </th>
                                <th
                                    scope="col"
                                    className='col-sm-5'
                                >
                                    ตอนของบทความ
                                </th>
                                <th
                                    scope="col"
                                    className='col-sm-1'
                                >
                                    รูปหน้าปกบทความ
                                </th>
                                <th
                                    scope="col"
                                    className='col-sm-1'
                                >
                                    สถานะ
                                </th>
                                <th
                                    scope="col"
                                    className='col-sm-1'
                                >
                                    ลบ
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table-group-divider">
                            {items.map((book, index) => (
                                <tr key={book.book_id}>
                                    <td className='col-sm-1' key={`book${index + 1}`}>{index + 1}</td>
                                    <td className='col-sm-2'>{book.book_name}</td>
                                    {/* <td className='col-sm-4'>{book.book_detail}</td> */}
                                    <td className='col-sm-4'>
                                            {book.article_name.map((article, index) => (
                                                <span key={index}>
                                                    {article}
                                                    {index < book.article_name.length - 1 && ", "} {/* Add a comma if not the last article */}
                                                </span>
                                            ))}
                                        </td>
                                    <td className='col-sm-2'>
                                        <img src={book.book_imagedata || book.book_image} width="100" height="100" />
                                    </td>
                                    <td className='col-sm-1'>
                                            <Button
                                                className="btn btn-success"
                                            >
                                                {book.status_book}
                                            </Button>
                                        </td>
                                    <td className='col-sm-2'>
                                        <Button
                                            className="btn btn-danger amt2"
                                            // onClick={() => deleteBook(book.book_id)}
                                        >
                                            ลบคำขอนี้
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </section>

            {/* Modal ยืนยันการลบ */}
            {/* <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>ยืนยันการลบ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {bookToDelete && (
                        <p>คุณแน่ใจหรือไม่ที่ต้องการลบคำขอนี้: {bookToDelete.book_name}?</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        ยกเลิก
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            deleteBookConfirmed(bookToDelete.book_id);
                            setShowDeleteModal(false);
                        }}
                    >
                        ลบ
                    </Button>
                </Modal.Footer>
            </Modal> */}
        </div>
  )
}

export default Forapprovebook