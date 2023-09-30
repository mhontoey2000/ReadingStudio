import React, { useEffect, useState } from 'react';
import Header from './header';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { useLocation } from 'react-router-dom';
import { Rss } from 'react-bootstrap-icons';
import { useHistory } from 'react-router-dom';
import "./styles/reportbook.css"

function Reportbook() {

    const location = useLocation();
    const articleid = location.state.article_id;
    const bookid = location.state.book_id;
    const [isLoaded, setIsLoaded] = useState(false);
    const history = useHistory();
    const [bname, setBname] = useState("");
    const [aname, setAname] = useState("");
    const [remail, setRemail] = useState("");
    const [rdetail, setRdetail] = useState("");

    // const user = JSON.parse(localStorage.getItem('email')); 
    const user = localStorage.getItem('email');

    useEffect(() => {
        axios.get('http://localhost:5004/api/userdata?user_email=' + user)
          .then((response) => {
            setRemail(response.data[0].user_email)
            })
          .catch(error => console.error(error));
      }, [user]);


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

    const sendReport = (e) => {
        e.preventDefault();

        if (!rdetail.trim()) {
            alert("กรุณาระบุสิ่งที่ต้องการรายงาน");
            return;
        }
        
        const confirmed = window.confirm("Are you sure you want to send this report?");
        
        if (confirmed) {
            console.log(bookid, articleid, remail, rdetail);
            axios.post('http://localhost:5004/api/report', {
                bookid,
                articleid,
                remail,
                rdetail,
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
        }
    }

    const cancelReport = () => {
        history.goBack();
    }

  return (
    <div>

            <Header/>


        <section>
            <h1>รายงานหนังสือ</h1>

            <div className="grid-containerr">
            <div className="fg"> 
                <form className="form-group">
                <h2>กรุณากรอกรายละเอียดที่ต้องการรายงาน</h2>
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
                        <label htmlFor="email">emailผู้รายงาน</label>
                        <input 
                            type="text"
                            className ="form-control"  
                            id="email"
                            value={remail}
                            disabled readOnly
                        />
                    </div>

                    <div className="mb-3">
                            <label htmlFor="reportdetail">ระบุสิ่งที่ต้องการรายงาน</label>
                            <textarea
                            className="form-control"  
                            id="reportdetail" 
                            onChange={(event) => {setRdetail(event.target.value)}}
                            placeholder="กรุณากรอกข้อความ"
                            required
                        />
                    </div>
                    
                    <div className="btn-containerr">
                       <div className="btn-group me-2">
                        <Button 
                         type="submit" 
                         className="btn1 btn-warning"
                         onClick={cancelReport}
                        >
                            ยกเลิก
                        </Button>
                      </div>
                      <div className="btn-group me-2">
                        <Button 
                         type="submit" 
                         className="btn1 btn-primary"
                         onClick={sendReport}
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

export default Reportbook