import React, { useEffect, useState } from 'react';
import './styles/bookdetail.css';
import Header from './header';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Searchbar from './searchbar';
import formatTime from './formattime';

function Bookdetail(match) {
  const [items, setItems] = useState([]);
  const location = useLocation();
  const articleid = location.state.article_id;
  const user = localStorage.getItem('email');
  const [Vitems, setVitems] = useState([]);
  const [bookid, setBookid] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioRef, setAudioRef] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [usertype, setUsertype] = useState("");
  const [remail, setRemail] = useState("");
  const [qitems, setqItems] = useState([]);
  const [visibleDiv, setVisibleDiv] = useState('เนื้อหา');

  const handleButtonClick = (divToShow) => {
    setVisibleDiv(divToShow);
  };

  useEffect(() => {
    axios.get('http://localhost:5004/api/userdata?user_email=' + user)
      .then((response) => {
        setRemail(response.data[0].user_email);
        setUsertype(response.data[0].user_type);
      })
      .catch(error => console.error(error));
  }, [user]);

  useEffect(() => {
    axios.get(`http://localhost:5004/api/vocabs/${articleid}`)
      .then((response) => {
        let tempArr = response.data.slice().reverse();
        setVitems(tempArr);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [articleid]);

  useEffect(() => {
    axios.get(`http://localhost:5004/api/articledetail/${articleid}`)
    .then((response) => {
      setItems(response.data);
      setIsLoaded(true);
      setBookid(response.data[0].book_id);

      const audioData = response.data[0].article_sounddata;

      if (audioData) {
        const audioBlob = new Blob([new Uint8Array(audioData.data)], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }, [articleid]);

  useEffect(() => {
    axios.get(`http://localhost:5004/api/exam/${articleid}`)
      .then((response) => {
        let tempArr = response.data.slice().reverse();
        setqItems(tempArr);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const deleteVocab = (vocabId) => {
    const confirmed = window.confirm("Are you sure you want to delete this vocabulary item?");

    if (confirmed) {
      axios
        .delete(`http://localhost:5004/api/vocabs/${vocabId}`)
        .then((response) => {
          axios.get(`http://localhost:5004/api/vocabs/${articleid}`)
            .then((response) => {
              setVitems(response.data.slice().reverse());
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const playAudio = async (url) => {
    if (audioUrl === url) {
      // Toggle play/pause for the same audio
      toggleAudio();
    } else {
      setAudioUrl(url);
      setIsPlaying(true);
    }
  };
  

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleAudioRef = (ref) => {
    setAudioRef(ref);
  };

  const handleTimeUpdate = () => {
    if (audioRef) {
      setCurrentTime(audioRef.currentTime);
      setDuration(audioRef.duration);
      setAudioProgress((audioRef.currentTime / audioRef.duration) * 100);
    }
  };

  const handleSeek = (event) => {
    const seekTime = parseFloat(event.target.value);
    setCurrentTime(seekTime);
    audioRef.currentTime = seekTime;
  };

  const toggleAudio = () => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.pause();
      } else {
        audioRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.play();
      } else {
        audioRef.pause();
      }
    }
  }, [isPlaying, audioRef]);

  return (
    <div>
      <Header />

      <section>
        <h1>เนื้อหา</h1>

        <div className="searchbar">
          <Searchbar />
        </div>

        <div className="book">
          <div className="d-flex justify-content-center" style={{ margin: "20px" }}>
            <div className="btn-toolbar">
              <div className="btn-group me-2 me-auto">
                <Button
                  type="button"
                  className={`btn primary-button ${visibleDiv === 'เนื้อหา' ? 'active' : ''}`}
                  onClick={() => handleButtonClick('เนื้อหา')}
                >
                  เนื้อหา
                </Button>
                <Button
                  type="button"
                  className={`btn primary-button ${visibleDiv === 'คำศัพท์' ? 'active' : ''}`}
                  onClick={() => handleButtonClick('คำศัพท์')}
                >
                  คำศัพท์
                </Button>
                <Button
                  type="button"
                  className={`btn primary-button ${visibleDiv === 'ข้อสอบ' ? 'active' : ''}`}
                  onClick={() => handleButtonClick('ข้อสอบ')}
                >
                  ข้อสอบ
                </Button>
              </div>
            </div>
          </div>

          <div className="grid-container" id="myDIV1" style={{ display: visibleDiv === 'เนื้อหา' ? 'block' : 'none' }}>
            {items.map((article) => (
              <div className="grid-item" key={article.article_id}>
                <h2 style={{ fontWeight: "bold" }}>{article.article_name}</h2>
                <div>
                  <h5 className="leveltext">{article.article_level}</h5>
                </div>
                <div>
                  <img src={article.article_imagedata || article.article_images} alt="Article" 
                  style={{ maxWidth: '100%', maxHeight: '300px' }}/>
                </div>

                <div style={{ padding: "20px" }}>
                  <div>
                    {audioUrl && (
                      <div>
                        <audio
                          src={audioUrl}
                          ref={handleAudioRef}
                          onEnded={handlePause}
                          onPause={handlePause}
                          onTimeUpdate={handleTimeUpdate}
                          controls
                        />
                      </div>
                    )}
                  </div>

                  <p className='detailtext'>{article.article_detail}</p>

                  <div className="text-start">
                    <Link
                      className="reporttext"
                      to={{ pathname: '/Page/reportbook', state: { book_id: bookid, article_id: articleid } }}
                    >
                      รายงานเนื้อหา
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid-container" id="myDIV2" style={{ display: visibleDiv === 'คำศัพท์' ? 'block' : 'none' }}>
            <div>
              {Array.isArray(Vitems) && Vitems.length > 0 ? (
                Vitems.map((vocabs, index) => (
                <div className="v-item" key={vocabs.vocabs_id}>
                  <div className="vno" key={`vocabs_${index}`}>
                    <h5 className="v-title">{`${index + 1}. ${vocabs.vocabs_name}`}</h5>
                    <h5 className="v-text">{vocabs.vocabs_detail}</h5>

                    {["admin", "creator"].includes(usertype) && (
                      <Button
                        className="btn btn-danger"
                        onClick={() => deleteVocab(vocabs.vocabs_id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              )) 
              ) : (
                <div className="no-items">ไม่มีคำศัพท์ในตอนของบทความนี้.</div>
              )}
            </div>
            <div>
              {["admin", "creator"].includes(usertype) && (
                <div className="addV">
                  <Link
                    className="btn btn-warning tc"
                    to={{ pathname: "/Page/addvocab", state: { book_id: bookid, article_id: articleid } }}
                  >
                    เพิ่มคำศัพท์
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="grid-container" id="myDIV3" style={{ display: visibleDiv === 'ข้อสอบ' ? 'block' : 'none' }}>
            <div>
              {["admin", "creator"].includes(usertype) && (
                 <div className="addV">
                 {Array.isArray(qitems) && qitems.length > 0 && (
                   <Link
                     className="btn btn-warning tc"
                     to={{ pathname: "/Page/addexam", state: { book_id: bookid, article_id: articleid } }}
                   >
                     เพิ่มข้อสอบ
                   </Link>
                 )}
               </div>
              )}
              {Array.isArray(qitems) && Vitems.length > 0 ? (
                qitems.map((question, index) => (
                <div className="v-item" key={question.question_id}>
                  <div className="vno" key={`vocabs_${index}`}>
                    <h5 className="v-title">{`${index + 1}. ${question.question_text}`}</h5>
                    {question.question_image && (
                      <img
                        src={question.question_imagedata}
                        alt={`Image for question ${index + 1}`}
                        style={{ maxWidth: '100%', maxHeight: '200px' }}
                      />
                    )}
                    <div>
                      {question.question_options.map((option, optionIndex) => (
                        <div key={`option_${optionIndex}`} className="option-container">
                          <input
                            type="radio"
                            className="v-text"
                            value={option.option_id}
                            name={`radioOption_${index}`}
                            id={`option_${optionIndex}`}
                          />
                          <label htmlFor={`option_${optionIndex}`}>{option.option_text}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))) : (
                <div className="no-items">ไม่มีชุดข้อสอบในตอนของบทความนี้.</div>
              )}
            </div>
            {["admin", "creator"].includes(usertype) && (
              <div className="addV" style={{ textAlign: 'center' }}>
                <Link
                  style={{ background: 'red' }}
                  className="btn btn-warning tc"
                  to={{ pathname: "/Page/score", state: { book_id: bookid, article_id: articleid } }}
                >
                  ส่งคำตอบ
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Bookdetail;
