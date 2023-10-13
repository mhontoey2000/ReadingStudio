import React, { useEffect, useState } from 'react';
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Searchbar from "../searchbar";
import "../styles/creator.css"

function Creator() {

  const user = localStorage.getItem('email');
  const [status, setStatus] = useState("")


  useEffect(() => {
    axios.get('http://localhost:5004/api/userdata?user_email=' + user)
      .then((response) => {
        setStatus(response.data[0].status_u)
        })
      .catch(error => console.error(error));
  }, [user]);

  return (
    <div>
      
      <Header />

      <section>
        <h1>Creator</h1>

          <div className="fgc"> 
            <div className="btn-toolbar d-flex justify-content-center">

            {["active"].includes(status) && (<div>
              <Button
                type="button"
                className="btn btn-primary btn-lg text-truncate mx-2 custom-button"
                href="./addbook"
              >
                <i className="bi bi-file-earmark-plus-fill"></i> สร้างบทความ
              </Button>

              <Button
                type="button"
                className="btn btn-primary btn-lg text-truncate mx-2 custom-button"
                href="./allbookcreator"
              >
                <i className="bi bi-book-fill"></i> บทความของฉัน
              </Button>
              </div>)}

              {/* <Button
                type="button"
                className="btn btn-primary btn-lg text-truncate mx-2 custom-button"
                href="./allarticleadmin"
              >
                <i className="bi bi-book-half"></i> ตอนบทความของฉัน
              </Button> */}

              <Button
                type="button"
                className="btn btn-primary btn-lg text-truncate mx-2 custom-button"
                href="./allexamcreator"
              >
                <i className="bi bi-file-earmark-spreadsheet-fill"></i>{" "}
                ข้อสอบของฉัน
              </Button>

              {/* <Button
                type="button"
                className="btn btn-primary btn-lg text-truncate mx-2 custom-button"
                href="./alluseradmin"
              >
                <i className="bi bi-envelope-fill"></i> ข้อความ
              </Button> */}
            </div>
          </div>

      </section>
    </div>
  )
}

export default Creator;