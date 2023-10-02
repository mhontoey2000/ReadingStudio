import React, { useEffect, useState } from 'react';
import './styles/addbook.css';
import Header from './header';
// import "bootstrap/dist/css/bootstrap.min.css";
import { AudioOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Input, Space } from 'antd';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import { apiClient } from './config';

function Addarticle() {

    const { bookid } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const history = useHistory();
    const [bname, setBname] = useState("");
    const [chapter, setChapter] = useState("");
    const [description, setDescription] = useState("");
    let imageFile = null;
    let soundFile = null;
    
    function handleImageUpload(event) {
      imageFile = event.target.files[0];
    }
    
    function handleSoundUpload(event) {
      soundFile = event.target.files[0];
    }
    

    useEffect(() => {
        apiClient.get(`api/book`)
          .then((response) => {
            // console.log(response.data);
            for(let i=0;i<response.data.length;i++)
            {
                if(response.data[i].book_id === bookid){
                    // console.log("working")
                    console.log(response.data[i].book_name)
                    setBname(response.data[i].book_name);
                    break;
                }
                // console.log(response.data[i].book_id)
            }
            // console.log(bookid)
            
          })
          .catch((error) => {
            console.error(error);
          });
    }, [bookid]);

    const cancelArticle = () => {
        history.goBack();
    }
    async function convertSoundToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]); // เฉพาะส่วนข้อมูล Base64
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }
    async function convertImageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]); // เฉพาะส่วนข้อมูล Base64
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
        });
    }
    async function confirmBook(event) {
        event.preventDefault();
        try
        {
            const data = {
                book_id: bookid,
                chapter: chapter,
                level: chapter,
                description: description,
                image: imageFile ? await convertImageToBase64(imageFile) : null ,
                sound: soundFile ? await convertSoundToBase64(soundFile) : null,
                };
                
            // axios.post("http://localhost:5004/api/addarticle", data, {
            apiClient.post('api/addarticle', data, {
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((response) => 
            {
                console.log(response.data);
            }).catch((error) => 
            {
                console.error(error);
            });
                
        }
           catch(error){
             alert(error);
             console.error(error);
        }
    }
       

  return (

    <div className="addbook">

            <Header/>


        <section>
            <h1>เพิ่มบทหนังสือ</h1> 


                <div className="grid-containerr">
                    <div className="fg"> 
                        <form className="form-group mb-3">
                            <h2>กรุณากรอกรายละเอียดบทของหนังสือ</h2>
                                <div className="mb-3">
                                    <label htmlFor="name">ชื่อหนังสือ</label>
                                    <input 
                                    type="text"
                                    className ="form-control"  
                                    id="bookname" 
                                    value={bname}
                                    disabled readOnly
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="chapter">บทของหนังสือ</label>
                                    <input 
                                    type="text" 
                                    className="form-control"  
                                    id="chapter" 
                                    value={chapter}
                                    placeholder="บทที่ X ชื่อ ตัวอย่าง"
                                    required
                                    onChange={(event) => {
                                        setChapter(event.target.value)
                                    }}
                                    />  
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="article_detail">เนื้อหาของหนังสือ</label>
                                    <textarea 
                                    type="text" 
                                    className="form-control"  
                                    id="article_detail" 
                                    placeholder="กรุณากรอกเนื้อหา"
                                    value={description}
                                    required
                                    onChange={(event) => {
                                        setDescription(event.target.value)
                                    }}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="uploadpic">รูปภาพของเนื้อหา</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="uploadpic"
                                        placeholder="กรุณาอัปโหลดรูปภาพ"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="sound">เสียงของเนื้อ</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="sound"
                                        accept="audio/*"
                                        onChange={handleSoundUpload}
                                    />
                                    {/* {selectedSound && (
                                        <div>
                                        <Button onClick={playSound}>เล่นเสียง</Button>
                                        </div>
                                    )} */}
                                </div>
                                 <div className="btn-containerr">
                                    <div className="btn-group me-2">
                                        <Button 
                                         type="submit" 
                                         className="btn1 btn-warning"
                                         onClick={cancelArticle}
                                        >
                                            ยกเลิก
                                        </Button>
                                    </div>
                                    <div className="btn-group me-2">
                                        <Button 
                                         type="submit" 
                                         className="btn1 btn-primary"
                                         onClick={confirmBook}
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

  )
}

export default Addarticle