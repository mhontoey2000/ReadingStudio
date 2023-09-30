import React, { useEffect, useState } from 'react';
import './styles/addbook.css';
import Header from './header';
// import "bootstrap/dist/css/bootstrap.min.css";
import { AudioOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Input, Space } from 'antd';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function Addarticle() {

    const location = useLocation();
    const articleid = location.state.article_id;
    const bookid = location.state.book_id;
    const [isLoaded, setIsLoaded] = useState(false);
    const history = useHistory();
    const [bname, setBname] = useState("");


    useEffect(() => {
        axios.get(`http://localhost:5004/api/book`)
          .then((response) => {
            // console.log(response.data);
            for(let i=0;i<response.data.length;i++)
            {
                if(response.data[i].book_id === bookid){
                    // console.log("working")
                    console.log(response.data[i].book_name)
                    setBname(response.data[i].book_name);
                    
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
                                    placeholder="บทที่ X ชื่อ ตัวอย่าง"
                                    required
                                    // onChange={(event) => {
                                    //     setNameC(event.target.value)
                                    // }}
                                    />  
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="article_detail">เนื้อหาของหนังสือ</label>
                                    <textarea 
                                    type="text" 
                                    className="form-control"  
                                    id="article_detail" 
                                    placeholder="กรุณากรอกเนื้อหา"
                                    required
                                    // onChange={(event) => {
                                    //     setArD(event.target.value)
                                    // }}
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
                                    onChange={(event) => {
                                        const selectedImage = event.target.files[0];
                                        if (selectedImage) {
                                            console.log("Selected image:", selectedImage);
                                        }
                                    }}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="sound">เสียงของเนื้อ</label>
                                    <input 
                                        type="file"
                                        className="form-control"
                                        id="sound"
                                        accept="audio/*"
                                        onChange={(event) => {
                                            const selectedSound = event.target.files[0];
                                            if (selectedSound) {
                                                console.log("Selected sound:", selectedSound);
                                            }
                                        }}
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
                                         //onClick={confirmBook}
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