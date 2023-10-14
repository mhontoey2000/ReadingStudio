import React, { useEffect, useState } from "react";
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router-dom";
import "../styles/editall.css";
import { useHistory } from 'react-router-dom';

function Editarticle() {
    const history = useHistory();
    const { articleid } = useParams();
    const [bookName, setBookName] = useState("");
    const [articleName, setArticleName] = useState("");
    const [articleDetail, setArticleDetail] = useState("");
    const [image, setImage] = useState("");
    const [selectedImageFile, setSelectedImageFile] = useState(null);

    const [sounds, setSounds] = useState("");
    const [vocabs, setVocabs] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio] = useState(new Audio());
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const playAudio = () => {
        if (audio.paused) {
            audio.play();
            setIsPlaying(true);
        } else {
            audio.pause();
            setIsPlaying(false);
        }
    };

    const updateAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("timeupdate", updateAudioData);

    const handleImageChange = (event) => {
        const selectedImage = event.target.files[0];
        setSelectedImageFile(selectedImage); 
        setImage(URL.createObjectURL(selectedImage)); 
    };

    const handleSoundUpload = (event) => {
        const soundFile = event.target.files[0];
        setSounds(soundFile);
        audio.src = URL.createObjectURL(soundFile);
    }

    useEffect(() => {
        axios.get(`http://localhost:5004/api/article`)
            .then((response) => {
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].article_id === articleid) {
                        setBookName(response.data[i].book_name);
                        setArticleName(response.data[i].article_name);
                        setArticleDetail(response.data[i].article_detail);
                        setImage(response.data[i].article_imagedata);
                        setSounds(response.data[i].article_sounddata);
                        setVocabs(response.data[i].vocabs);
                        audio.src = response.data[i].article_sounddata;
                        break;
                    }
                }
            })
            .catch((error) => {
                console.error(error);
            });

        return () => {
            audio.removeEventListener("timeupdate", updateAudioData);
            audio.pause();
        };
    }, [articleid]);

    const cancelEditArticle = () => {
        history.push('/Page/allarticleadmin');
    }

    const editArticle = () => {
        const formData = new FormData();
        formData.append('article_id', articleid);
        formData.append('book_name', bookName);
        formData.append('article_name', articleName);
        formData.append('article_detail', articleDetail);
        formData.append('image', selectedImageFile);
        formData.append('sounds', sounds);
        formData.append('vocabs', vocabs);

        axios.post('http://localhost:5004/api/updatearticle', formData)
            .then((response) => {
                history.push('/Page/allarticleadmin');
            })
            .catch((error) => {
                console.error(error);
            });
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
                                {image && (
                                    <img
                                        src={image}
                                        alt="Uploaded Image"
                                        style={{ maxWidth: '100%', maxHeight: '200px' }}
                                    />
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="sound">เสียงของเนื้อหา</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="sound"
                                    accept="audio/*"
                                    onChange={handleSoundUpload}
                                />
                            </div>
                            <div>
                                <Button className="play-button" onClick={playAudio}>
                                    {isPlaying ? 'Pause' : 'Play'}
                                </Button>
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
