import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Header from '../header';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import "../styles/alladmin.css"

const Allbookadmin = () => {
    const [items, setItems] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5004/api/book')
            .then((response) => {
                setItems(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const deleteBook = (bookId) => {
        const bookToDelete = items.find((book) => book.book_id === bookId);
        setBookToDelete(bookToDelete);
        setShowDeleteModal(true);
    };

    const deleteBookConfirmed = (bookId) => {
        axios.delete(`http://localhost:5004/api/deletebook/${bookId}`)
            .then(() => {
                console.log(`บทความที่มี ID ${bookId} ถูกลบแล้ว.`);
                // Refresh the book list after deletion
                axios.get('http://localhost:5004/api/book')
                    .then((response) => {
                        setItems(response.data);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
            .catch((error) => {
                console.error(`เกิดข้อผิดพลาดในการลบบทความที่มี ID ${bookId}: ${error}`);
            });
    };

    return (
        <div>
            <Header />
            <section>
                <div className="grid-containerr">
                    <h1>บทความทั้งหมด</h1>
                    <table className="table table-hover">
                        <thead>
                            <tr className="head" style={{ textAlign: "center" }}>
                                <th
                                    scope="col"
                                    className='t-size'
                                >
                                    ID
                                </th>
                                <th
                                    scope="col"
                                    className='t-size'
                                >
                                    บทความ
                                </th>
                                <th
                                    scope="col"
                                    className='t-size'
                                >
                                    คำอธิบายบทความ
                                </th>
                                <th
                                    scope="col"
                                    className='t-size'
                                >
                                    รูปหน้าปกบทความ
                                </th>
                                <th
                                    scope="col"
                                    className='t-size'
                                >
                                    แก้ไข
                                </th>
                                <th
                                    scope="col"
                                    className='t-size'
                                >
                                    ลบ
                                </th>
                            </tr>
                        </thead>
                        <tbody className="table-group-divider">
                            {items.map((book) => (
                                <tr key={book.book_id}>
                                    <td>{book.book_id}</td>
                                    <td>{book.book_name}</td>
                                    <td>{book.book_detail}</td>
                                    <td>
                                        <img src={book.book_imagedata || book.book_image} width="100" height="100" />
                                    </td>
                                    <td>
                                        <Link
                                            className="btn btn-warning amt1"
                                            to={{ pathname: `/Page/editbook_${ book.book_id }`, state: { book_id: book.book_id } }}
                                        >
                                            แก้ไข
                                        </Link>
                                    </td>
                                    <td>
                                        <Button
                                            className="btn btn-danger amt2"
                                            onClick={() => deleteBook(book.book_id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Modal ยืนยันการลบ */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>ยืนยันการลบ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {bookToDelete && (
                        <p>คุณแน่ใจหรือไม่ที่ต้องการลบบทความ: {bookToDelete.book_name}?</p>
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
            </Modal>
        </div>
    );

}

export default Allbookadmin;
