import React, { useEffect, useState } from "react";
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { useParams, useHistory } from "react-router-dom";
import "../styles/editall.css";

function Editarticle() {
    const history = useHistory();
    const { articleid } = useParams();

    const [bookName, setBookName] = useState("");
    const [articleName, setArticleName] = useState("");
    const [articleDetail, setArticleDetail] = useState("");
    const [image, setImage] = useState("");
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [audioRef, setAudioRef] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);

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
        setArticleName(article.article_name);
        setArticleDetail(article.article_detail);
        setImage(article.article_imagedata);
        playAudio(article.article_sounddata,article.article_sounds);
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

    const playAudio = async (audioData,audiopath) => {
        if (isPlaying) {
            setIsPlaying(false);
            return;
        }
    
        const blob = new Blob([new Uint8Array(audioData.data)], { type: 'audio/mpeg' });
        const blobUrl = URL.createObjectURL(blob);
        setAudioUrl(blobUrl);
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
        // Add code for uploading audio files or remove unrelated parts
    };


    return (
        <div>
            <Header />

            <section>
                <h1>แก้ไขบท</h1>

                <div className="grid-containerE">
                    <div className="fgE">
                        <form className="form-group">
                            <h2>กรุณากรอกรายละเอียดบทที่ต้องการแก้ไข</h2>
                            <div className="mb-3">
                                <label htmlFor="bookname">ชื่อหนังสือ</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="bookname"
                                    value={bookName}
                                    onChange={e => setBookName(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="articlename">ชื่อบท</label>
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
