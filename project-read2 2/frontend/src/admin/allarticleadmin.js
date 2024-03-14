import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import Header from '../header';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import "../styles/alladmin.css"
import {
    apiClient,
    convertSoundToBase64,
    convertImageToBase64,
  } from "../config";

const Allarticleadmin = () => {
    const [articles, setArticles] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);

    useEffect(() => {
        apiClient.get('api/article')
            .then((response) => {
                setArticles(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const deleteArticle = (articleId) => {
        const articleToDelete = articles.find((article) => article.article_id === articleId);
        setArticleToDelete(articleToDelete);
        setShowDeleteModal(true);
    };

    const deleteArticleConfirmed = (articleId) => {
        apiClient.delete(`api/deletearticle/${articleId}`)
            .then(() => {
                console.log(`ตอนที่มี ID ${articleId} ถูกลบแล้ว.`);
                // Refresh the article list after deletion
                apiClient.get('api/article')
                    .then((response) => {
                        setArticles(response.data);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
            .catch((error) => {
                console.error(`เกิดข้อผิดพลาดในการลบตอนที่มี ID ${articleId}: ${error}`);
            });
    };

    return (
        <div>
            <Header />
            <section>
                <div className="grid-containerr">
                    <h1>ตอนทั้งหมด</h1>
                    <table className="table table-hover">
                        <thead>
                            <tr className="head" style={{ textAlign: "center" }}>
                                <th scope="col" className='t-size'>ID</th>
                                <th scope="col" className='t-size'>ชื่อตอน</th>
                                <th scope="col" className='t-size'>รูปหน้าปกตอน</th>
                                <th scope="col" className='t-size'>แก้ไข</th>
                                <th scope="col" className='t-size'>ลบ</th>
                            </tr>
                        </thead>
                        <tbody className="table-group-divider">
                            {articles.map((article) => (
                                <tr key={article.article_id}>
                                    <td>{article.article_id}</td>
                                    <td>{article.article_name}</td>
                                    <td>
                                        <img src={article.article_imagedata || article.article_images} 
                                        alt="article_image" width="120" height="100" />
                                    </td>
                                    <td>
                                        <Link 
                                            className="btn btn-warning amt1"
                                            to={{ pathname: `/Page/editarticle_${article.article_id}`, state: { article_id: article.article_id } }}
                                        >
                                            แก้ไข
                                        </Link>
                                    </td>
                                    <td>
                                        <Button
                                            className="btn btn-danger amt2"
                                            onClick={() => deleteArticle(article.article_id)}
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
                    {articleToDelete && (
                        <p>คุณแน่ใจหรือไม่ที่ต้องการลบตอน: {articleToDelete.article_name}?</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        ยกเลิก
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            deleteArticleConfirmed(articleToDelete.article_id);
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

export default Allarticleadmin;
