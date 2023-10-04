import React, { useEffect, useState } from 'react';
import Header from './header';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import "./styles/addvocab.css"

function Addvocab() {

    const location = useLocation();
    const articleid = location.state.article_id;
    const bookid = location.state.book_id;
    const [isLoaded, setIsLoaded] = useState(false);
    const history = useHistory();
    const [bname, setBname] = useState("");
    const [aname, setAname] = useState("");

    const [Vname, setVname] = useState("");
    const [Vdetail, setVdetail] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:5004/api/articledetail/${articleid}`)
          .then((response) => {
            setAname(response.data[0].article_name);
            setIsLoaded(true);
          })
          .catch((error) => {
            console.error(error);
          });
    }, [articleid]);

    useEffect(() => {
        axios.get(`http://localhost:5004/api/book`)
          .then((response) => {
            console.log(response.data);
            for(let i=0;i<response.data.length;i++)
            {
                if(response.data[i].book_id === bookid){
                    // console.log("working")
                    // console.log(response.data[i].book_name)
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


    const sendVocab = (e) => {
        e.preventDefault()
        const isConfirmed = window.confirm("Are you sure you want to submit this form?");
        if (isConfirmed) {
            axios.post('http://localhost:5004/api/vocabs',{
                articleid,
                Vname,
                Vdetail,
                
            })
            .then((response) => {
                
                console.log(response);
                setTimeout(() => {
                    window.history.back(); // Redirect to home page after 2 seconds
                }, 1000);
            })
            .catch((error) => {
                console.error(error);
            });
        } else {
            // User clicked "Cancel" in the confirmation dialog
            console.log("Form submission cancelled.");
        }
    };

    const cancelVocab = () => {
        history.goBack();
    }

  return (
    <div>

            <Header/>


        <section>
            <h1>เพิ่มคำศัพท์</h1>

            <div className="grid-containerr">
                <div className="fg">
                <form className="form-group">
                    <h2>กรุณากรอกคำศัพท์</h2>

                    <div className="mb-3">
                        <label htmlFor="bookname">ชื่อหนังสือ</label>
                        <input 
                            type="text"
                            className ="form-control"  
                            id="bookname"
                            value={bname}
                            disabled readOnly
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="articlename">ชื่อบท</label>
                        <input 
                            type="text"
                            className ="form-control"  
                            id="articlename"
                            value={aname}
                            disabled readOnly
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="vocabname">คำศัพท์</label>
                        <input 
                            type="text"
                            className ="form-control"  
                            id="vocabname"
                            placeholder="ตัวอย่าง A[อ่านว่า เอ]"
                            onChange={(event) => {setVname(event.target.value)}}
                        />
                    </div>

                    <div className="mb-3">
                            <label htmlFor="vocabdetail">ความหมาย</label>
                            <textarea
                            className="form-control"  
                            id="vocabdetail" 
                            onChange={(event) => {setVdetail(event.target.value)}}
                            placeholder="ตัวอย่าง พยัญชนะตัวที่ 1 ของภาษาอังกฤษ"
                            required
                        />
                    </div>
                    
                    <div className="btn-containerr">
                        <div>
                            <Button 
                            //  type="submit" 
                             className="btn1 btn-warning"
                             onClick={cancelVocab}
                            >
                                ยกเลิก
                            </Button>
                            
                        </div>
                        <div>
                            <Button 
                            //  type="submit" 
                             className="btn1 btn-primary"
                             onClick={sendVocab}
                            >
                                ส่ง
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

export default Addvocab