import React, { useEffect, useState } from "react";
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { useLocation } from "react-router-dom";
import { Rss } from "react-bootstrap-icons";
import "../styles/editall.css";
import { useHistory } from 'react-router-dom';

function Editbook() {

    const history = useHistory();
    const location = useLocation();
    const bookid = location.state.book_id;
    const [bname, setBname] = useState("");
    const [bdetail, setBdetail] = useState("");
    const [bimg, setBimg] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:5004/api/book`)
          .then((response) => {
            console.log("response",response.data);
            for(let i=0;i<response.data.length;i++)
            {
                if(response.data[i].book_id === bookid){
                    // console.log("working")
                    console.log("setBname",response.data[i].book_name)
                    setBname(response.data[i].book_name);
                    
                }
                // console.log(response.data[i].book_id)
            }
            console.log(bookid)
            
          })
          .catch((error) => {
            console.error(error);
          });
    }, [bookid]);

    const cancelEditBook = () => {
        history.goBack();
    }


  return (
    <div>
      <Header />

      <section>
        <h1>แก้ไขหนังสือ</h1>

        <div className="grid-containerE">
          <div className="fgE">
            <form className="form-group">
              <h2>กรุณากรอกรายละเอียดหนังสือที่ต้องการแก้ไข</h2>
              <div className="mb-3">
                <label htmlFor="bookname">ชื่อหนังสือ</label>

                <input
                  type="text"
                  className="form-control"
                  id="bookname"
                  value={bname}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="articledetail">เนื้อหา</label>
                <input
                  type="text"
                  className="form-control"
                  id="articledetail"
                />
              </div>


              <div className="btn-containerr">
                <div className="btn-group me-2">
                  <Button
                    type="submit"
                    className="btnE btn-warning"
                    onClick={cancelEditBook}
                  >
                    ยกเลิก
                  </Button>
                </div>
                <div className="btn-group me-2">
                  <Button
                    type="submit"
                    className="btnE btn-primary"
                    //onClick={addBook}
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

export default Editbook;
