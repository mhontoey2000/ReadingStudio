import React, { useEffect, useState } from 'react';
import './styles/bookdetail.css';
import Header from './header';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { AudioOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Searchbar from './searchbar';
import formatTime from './formattime';


function Bookdetail(match) {
  const [items, setItems] = useState([]);
  const location = useLocation();
  const articleid = location.state.article_id;
  const user = localStorage.getItem('email');
  // console.log(articleid)
  const [Vitems, setVitems] = useState([]);
  const [bookid, setBookid] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioRef, setAudioRef] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [usertype, setUsertype] = useState("")
  const [remail, setRemail] = useState("");

  const [visibleDiv, setVisibleDiv] = useState('เนื้อหา');

  const handleButtonClick = (divToShow) => {
    setVisibleDiv(divToShow);
  };

  useEffect(() => {
    axios.get('http://localhost:5004/api/userdata?user_email=' + user)
      .then((response) => {
        //console.log(response.data[0]);
        setRemail(response.data[0].user_email)
        setUsertype(response.data[0].user_type)
        })
      .catch(error => console.error(error));
  }, [user]);
  

  useEffect(() => {
    axios.get(`http://localhost:5004/api/vocabs/${articleid}`)
      .then((response) => {
        let tempArr = []
        for(let i = response.data.length-1; i>=0; i--){
          tempArr[i] = response.data[i]
        }
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
      })
      .catch((error) => {
        console.error(error);
      });
  }, [articleid]);


   // Function to delete a vocab
   const deleteVocab = (vocabId) => {
    const confirmed = window.confirm("Are you sure you want to delete this vocabulary item?");
    
    if (confirmed) {
        axios
            .delete(`http://localhost:5004/api/vocabs/${vocabId}`)
            .then((response) => {
                // Refresh the list of vocabs after deletion
                axios.get(`http://localhost:5004/api/vocabs/${articleid}`)
                    .then((response) => {
                        setVitems(response.data.reverse()); // Reverse the order if needed
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
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    setAudioUrl(url);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleAudioRef = (ref) => {
    setAudioRef(ref);
  };

  const handleTimeUpdate = () => {
    if (audioRef){
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
                <Searchbar/>
              </div>

              <div className="book">
                <div className="d-flex justify-content-center" style={{ margin:"20px" }}>
                <div className="btn-toolbar">
                  <div className="btn-group me-2 me-auto" >
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

                <div className="grid-container" id="myDIV1"  style={{ display: visibleDiv === 'เนื้อหา' ? 'block' : 'none' }}>
                  {items.map((article) => (
                    <div className="grid-item" key={article.article_id}>
                      <h2 style={{ fontWeight:"bold"}}>{article.article_name}</h2>
                      <div>
                        <h5 className="leveltext">{article.article_level}</h5>
                      </div>
                      <div>
                        <img src={article.article_images} />
                      </div>

                      <div style={{padding:"20px"}}>
                          <div>
                            {audioUrl && (
                                <div>
                                  <audio
                                    src={audioUrl}
                                    ref={handleAudioRef}
                                    onEnded={handlePause}
                                    onPause={handlePause}
                                    onTimeUpdate={handleTimeUpdate}
                                  />
                                </div>
                              )}

                              <div className='d-flex justify-content-center align-items-center'>
                                <p style={{paddingRight:"10px"}}>{formatTime(currentTime)}</p>
                                <div className="progress-container">
                                  <progress className="progress-bar" max="100" value={audioProgress}></progress>
                                </div>
                                <p style={{paddingLeft:"10px"}}>{formatTime(duration)}</p>
                              </div>

                              <div>
                                <Button className="play-button" 
                                  type="range"
                                  min="0"
                                  max={duration}
                                  value={currentTime}
                                  step="0.1"
                                  onClick={() => playAudio(article.article_sounds)}>
                                    {isPlaying ? 'Pause' : 'Play'}
                                </Button>
                              </div> 

                          </div>
                      
                          <p className='detailtext'>{article.article_detail}</p>
                          
                          <div className="text-start">
                              <Link 
                                className="reporttext"
                                to={{ pathname: '/Page/reportbook', state: { book_id: bookid,article_id: articleid } }}
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
                          {Array.isArray(Vitems) && Vitems.map((vocabs, index) => (
                            <div className="v-item" key={vocabs.vocabs_id}>
                              <div className="vno" key={`vocabs_${index}`}>
                                <h5 className="v-title">{`${index + 1}. ${vocabs.vocabs_name}`}</h5>
                                <h5 className="v-text">{vocabs.vocabs_detail}</h5>
                              
                                {["admin", "creater"].includes(usertype) && (
                                  <Button
                                    className="btn btn-danger"
                                    onClick={() => deleteVocab(vocabs.vocabs_id)}
                                  >
                                    Delete
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                          </div>
                            <div >
                              {["admin", "creater"].includes(usertype) && (
                      
                                
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
                          <div>This is ข้อสอบ.</div>
                          {["admin", "creater"].includes(usertype) && (
                          <div className="addV">
                            <Link 
                            className="btn btn-warning tc"
                            to={{ pathname: "/Page/addexam", state: { book_id: bookid,article_id: articleid } }}
                            >
                              เพิ่มข้อสอบ
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