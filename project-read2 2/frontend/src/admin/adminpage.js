import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Searchbar from "../searchbar";
import "../styles/adminpage.css"

function Adminpage() {

  const [notificationCount, setNotificationCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    // Fetch the count of new notifications from your backend
    axios.get("http://localhost:5004/api/notificationCount")
      .then((response) => {
        setNotificationCount(response.data.count);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []); 

  useEffect(() => {
    axios.get("http://localhost:5004/api/userCount")
        .then((response) => {
          setUserCount(response.data.count);
        })
        .catch((error) => {
          console.error(error);
        });
  }, []); 

  return (
    <div>
      <Header />

      <section>
        <h1>ADMIN</h1>

          <div className="fga"> 
            <div className="btn-toolbar d-flex justify-content-center">
              
            <Button
                type="button"
                className="btn btn-primary btn-lg text-truncate mx-2 custom-button"
                href="./addbook"
              >
                <i className="bi bi-file-earmark-plus-fill"></i> 1.สร้างบทความ
              </Button>

              <Button
                type="button"
                className="btn btn-primary btn-lg text-truncate mx-2 custom-button"
                href="./toaddarticleadmin"
              >
                <i className="bi bi-file-earmark-plus-fill"></i> 2.สร้างตอนของบทความ
              </Button>

              <Button
                type="button"
                className="btn btn-primary btn-lg text-truncate mx-2 custom-button"
                href="./notification"
              >
                <i className="bi bi-bell-fill"></i> ตรวจสอบแจ้งเตือน{" "}
                {notificationCount > 0 && (
                  <span className="badge badge-danger">{notificationCount}</span>
                )}
              </Button>

              <Button
                type="button"
                className="btn btn-primary btn-lg text-truncate mx-2 custom-button"
                href="./allbookadmin"
              >
                <i className="bi bi-book-fill"></i> จัดการบทความ
              </Button>

              <Button
                type="button"
                className="btn btn-primary btn-lg text-truncate mx-2 custom-button"
                href="./alluseradmin"
              >
                <i className="bi bi-file-person-fill"></i> จัดการบัญชี{" "}
                {userCount > 0 && (
                  <span className="badge badge-danger">{userCount}</span>
                )}
              </Button>

              <Button
                type="button"
                className="btn btn-primary btn-lg text-truncate mx-2 custom-button"
                href="./forapprovebook"
              >
                <i className="bi bi-file-person-fill"></i> กลั่นกรองบทความ
              </Button>
            </div>
          </div>

      </section>
    </div>
  );
}

export default Adminpage;
