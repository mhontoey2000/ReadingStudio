import React, { useEffect, useState } from "react";
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { useParams, useHistory } from "react-router-dom";
import { useDropzone } from 'react-dropzone'; // เพิ่มการนำเข้า Dropzone
import "../styles/editall.css";

function Editarticle() {
    const history = useHistory();
    const { articleid } = useParams();

    const [bookName, setBookName] = useState("");
    const [articleId, setArticleID] = useState("");
    const [articleName, setArticleName] = useState("");
    const [articleDetail, setArticleDetail] = useState("");
    const [image, setImage] = useState("");
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [audioRef, setAudioRef] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [audioFile, setAudioFile] = useState(null); // เพิ่ม state สำหรับไฟล์เสียงใหม่

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: 'audio/*',
        onDrop: (acceptedFiles) => {
            setAudioFile(acceptedFiles[0]);
            setAudioUrl(URL.createObjectURL(acceptedFiles[0]));
        },
    });

    useEffect(() => {
        fetchArticleData();
    }, [articleid]);

    useEffect(() => {
        handleAudioPlayback();
    }, [isPlaying, audioRef]);

    const fetchArticleData = () => {
        axios.get(`http://localhost:5004/api/article`)
            .then((response) => {
                const article = response.data.find(item => item.article_id === articleid);
                if (article) {
                    setArticleData(article);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const setArticleData = (article) => {
        setBookName(article.book_name);
        setArticleID(article.article_id);
        setArticleName(article.article_name);
        setArticleDetail(article.article_detail);
        setImage(article.article_imagedata);
        console.log(article.article_sounddata);
        setAudioUrl(article.article_sounddata);
    };

    const handleAudioPlayback = () => {
        if (audioRef) {
            if (isPlaying) {
                audioRef.play();
            } else {
                audioRef.pause();
            }
        }
    };

    const handleImageChange = (event) => {
        const selectedImage = event.target.files[0];
        setSelectedImageFile(selectedImage);
        setImage(URL.createObjectURL(selectedImage));
    };

    const playAudio = () => {
        if (isPlaying) {
            setIsPlaying(false);
            if (audioRef) {
                audioRef.pause();
            }
        } else {
            setIsPlaying(true);
            if (audioRef) {
                audioRef.play();
            }
        }
    };

    const handleAudioRef = (ref) => {
        setAudioRef(ref);
        if (ref) {
            setDuration(ref.duration);
        }
    };

    const cancelEditArticle = () => {
        history.push('/Page/allarticleadmin');
    };

    const editArticle = () => {
        const formData = new FormData();
        formData.append("articleId", articleId);
        formData.append("chapter", articleName);
        formData.append("description", articleDetail);
        formData.append("level", articleName);

        if (selectedImageFile) {
            formData.append("image", selectedImageFile);
        }

        if (audioFile) {
            formData.append("sound", audioFile);
        }

        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        axios.post(`http://localhost:5004/api/updatearticle`, formData)
            .then((response) => {
                console.log('Article update successful', response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div>
            <Header />

            <section>
                <h1>แก้ไขตอนของบทความ</h1>

                <div className="grid-containerE">
                    <div className="fgE">
                        <form className="form-group">
                            <h2>กรุณากรอกรายละเอียดตอนที่ต้องการแก้ไข</h2>
                            <div className="mb-3">
                                <label htmlFor="bookname">ชื่อบทความ</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="bookname"
                                    value={bookName}
                                    onChange={e => setBookName(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="articlename">ชื่อตอน</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="articlename"
                                    value={articleName}
                                    onChange={e => setArticleName(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="articledetail">เนื้อหา</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="articledetail"
                                    value={articleDetail}
                                    onChange={e => setArticleDetail(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="bookimage">
                                    รูปในเนื้อหา
                                </label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="bookimage"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                <p></p>
                                <div className='d-flex justify-content-center align-items-center'>
                                    {image && (
                                        <img
                                            src={image}
                                            alt="Uploaded Image"
                                            style={{ maxWidth: '100%', maxHeight: '200px' }}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className='d-flex justify-content-center align-items-center'>
                                {audioUrl && (
                                    <div>
                                        <audio
                                            src={audioUrl}
                                            ref={handleAudioRef}
                                            controls
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label>หรือลากและวางไฟล์เสียงที่นี่</label>
                                <div {...getRootProps()} className="dropzone">
                                    <input {...getInputProps()} />
                                    <p>ลากและวางไฟล์เสียงที่นี่หรือคลิกเพื่อเลือก</p>
                                </div>
                            </div>
                            <div className="btn-containerr">
                                <div className="btn-group me-2">
                                    <Button
                                        type="submit"
                                        className="btnE btn-warning"
                                        onClick={cancelEditArticle}
                                    >
                                        ยกเลิก
                                    </Button>
                                </div>
                                <div className="btn-group me-2">
                                    <Button
                                        type="submit"
                                        className="btnE btn-primary"
                                        onClick={editArticle}
                                    >
                                        ยืนยัน
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Editarticle;
