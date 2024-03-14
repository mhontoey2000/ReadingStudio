import React, { useEffect, useState } from 'react';
import Header from './header';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { useLocation } from 'react-router-dom';
import { Rss } from 'react-bootstrap-icons';
import { useHistory } from 'react-router-dom';
import "./styles/reportbook.css"
import Modal from 'react-bootstrap/Modal';
import {
  apiClient,
  convertSoundToBase64,
  convertImageToBase64,
} from "./config"

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
    const [showModal, setShowModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [showSuccessReportedModal, setShowSuccessReportedModal] = useState(false);
  

    // const user = JSON.parse(localStorage.getItem('email')); 
    const user = localStorage.getItem('email');

    useEffect(() => {
      apiClient.get('api/userdata?user_email=' + user)
          .then((response) => {
            setRemail(response.data[0].user_email)
            })
          .catch(error => console.error(error));
      }, [user]);

    useEffect(() => {
      apiClient.get(`api/articledetail/${articleid}`)
          .then((response) => {
            setAname(response.data[0].article_name);
            setIsLoaded(true);
          })
          .catch((error) => {
            console.error(error);
          });
    }, [articleid]);

    useEffect(() => {
      apiClient.get(`api/book`)
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
    
        setShowModal(true); // Show the confirmation modal
      };
    
      const handleConfirmed = () => {
        setShowModal(false); // Close the modal
        // Proceed with sending the report
        apiClient.post('api/report', {
          bookid,
          articleid,
          remail,
          rdetail,
        })
        .then((response) => {
          console.log(response);
          // Check if the status code is 400 (Bad Request)
          if (response.status === 400) {
            console.log("Error");
            setShowSuccessReportedModal(true);
          } else {
            // If not 400, assume success and open the success modal
            console.log("Success");
            setSuccessModal(true);
          }
        })

        .catch((error) => {
            console.log("Error1");
            console.error(error);
            setShowSuccessReportedModal(true);
        });
      };
    

    const cancelReport = () => {
        history.goBack();
    }

    const handleSuccessModalOK = () => {
        setSuccessModal(false);
        //window.location.reload();
        history.goBack();
      }

    const handleSuccessReportedModalOK = () => {
        setShowSuccessReportedModal(false);
        //window.location.reload();
        history.goBack();
      }
  return (

    <div>
            <Header/>
        <section>
            <h1>รายงานหนังสือ</h1>

            <div className="grid-containerr">
            <div className="fg"> 
                <form className="form-group" onSubmit={sendReport}>
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
                        >
                            ส่ง
                        </Button>
                      </div>
                     
                    </div>

                </form>
            </div>
            </div>
        </section>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ยืนยัน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          คุณต้องรายงานบทความใช่ไหม?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleConfirmed}>
            ตกลง
          </Button>
          <Button variant="warning" style={{ color: "white" }} onClick={() => setShowModal(false)}>
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Modal>     
    
      <Modal show={successModal} onHide={() => setSuccessModal(false)}>
        <Modal.Header closeButton onClick={handleSuccessModalOK}>
          {/* <Modal.Title>Success</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>รายงานเนื้อหาเรียบร้อย</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleSuccessModalOK}
          >
            ตกลง
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSuccessReportedModal} onHide={() => setShowSuccessReportedModal(false)}>
        <Modal.Header closeButton onClick={handleSuccessReportedModalOK}>
          {/* <Modal.Title>Success</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>คุณเคยรายงานเนื้อหานี้ไปแล้ว</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleSuccessReportedModalOK}
          >
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  )
}

export default Reportbook