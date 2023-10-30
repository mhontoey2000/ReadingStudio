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
    const [statusUser, setStatusUser] = useState("");
    const user = localStorage.getItem('email');
    useEffect(() => {
        init();
    }, []);
    
    function init () {
        console.log(user)
        axios.get('http://localhost:5004/api/userdata?user_email=' + user)
            .then(userresponse => {
            console.log('User :'+userresponse.data[0].user_type)

            axios.get('http://localhost:5004/api/allbookarticleadmin')
                .then((response) => {
                    console.log(response)
                    const filteredData = response.data.filter(item => {
                        setStatusUser(userresponse.data[0].user_type);
                        return canEditChapter(userresponse.data[0].user_type ,item.book_creator);
                    });
                    setItems(filteredData);
                    console.log(items)
                })
                .catch((error) => {
                    console.error(error);
                });
            })
            .catch(error => console.error(error));
    }
    function canEditChapter(usertype,bookcreator) {
        console.log(usertype)
        return usertype === "admin" || user.includes(bookcreator);
    }
    function canUserEditChapter(bookcreator) {
        return user.includes(bookcreator);
    }

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
                init();
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
                    <div className='row'>
                    <h1>บทความทั้งหมด</h1>
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
                                    รายการตอนของบทความ
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

                                    แก้ไขบทความ
                                </th>
                                <th
                                    scope="col"
                                    className='col-sm-1'
                                >
                                    แก้ไขตอน
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
                                    <td className='col-sm-1' key={`book${index}`}>{index}</td>
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
                                    <td className='col-sm-1'>
                                        <img src={book.book_imagedata || book.book_image} width="100" height="100" />
                                    </td>
                                    <td className='col-sm-1'>
                                            <Button
                                                className="btn btn-success"
                                            >
                                                {book.status_book}
                                            </Button>
                                        </td>
                                   <td className='col-sm-1'>
                                        {canUserEditChapter(book.book_creator) && <Link
                                            className="btn btn-warning amt1"
                                            to={{ pathname: `/Page/editbook_${ book.book_id }`, state: { book_id: book.book_id } }}
                                        >
                                            แก้ไขบทความ
                                        </Link>}
                                    </td>
                                     <td className='col-sm-1'>
                                        {canUserEditChapter(book.book_creator) && <Link
                                            className="btn btn-warning amt1"
                                            to={{ pathname: `/Page/articleedit_${book.book_id}`, state: { book_id: book.book_id } }}
                                        >
                                            แก้ไขตอน
                                        </Link>}
                                    </td>
                                     <td className='col-sm-1'>
                                        {canUserEditChapter(book.book_creator) &&<Button
                                            className="btn btn-danger amt2"
                                            onClick={() => deleteBook(book.book_id)}
                                        >
                                            ลบบทความ
                                        </Button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
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
