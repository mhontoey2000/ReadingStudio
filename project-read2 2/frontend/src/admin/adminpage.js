import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Searchbar from "../searchbar";
import "../styles/adminpage.css"
import {
  apiClient,
  convertSoundToBase64,
  convertImageToBase64,
} from "../config";

function Adminpage() {

  const [notificationCount, setNotificationCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    // Fetch the count of new notifications from your backend
    apiClient.get("api/notificationCount")
      .then((response) => {
        setNotificationCount(response.data.count);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []); 

  useEffect(() => {
    apiClient.get("api/userCount")
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
        <h1>เมนูของแอดมิน</h1>

          <div className="fga"> 

            <div className="box-addbook">
              <h4 className="text-in-box">เพิ่มบทความ</h4>

              <div className="btn-toolbar d-flex justify-content-center custom-item-box">
              <Button
                type="button"
                className="btn btn-primary btn-lg text-truncate mx-2 custom-button"
                href="./addbook"
              >
                <i className="bi bi-file-earmark-plus-fill custom-icon"></i> 1.สร้างบทความ
              </Button>

              <Button
                type="button"
                className="btn btn-primary btn-lg text-truncate mx-2 custom-button"
                href="./toaddarticleadmin"
              >
                  <i className="bi bi-file-earmark-plus-fill custom-icon"></i> 2.สร้างตอนของบทความ
              </Button>
              </div>

            </div>

            <div className="box-manage">
              <h4 className="text-in-box">จัดการ</h4>
              <div className="btn-toolbar d-flex justify-content-center custom-item-box">

                <Button
                  type="button"
                  className="btn btn-primary btn-lg mx-2 custom-button"
                  href="./notification"
                >
                  <i className="bi bi-bell-fill custom-icon"></i> ตรวจสอบแจ้งเตือน{" "}
                  {notificationCount > 0 && (
                    <span className="badge badge-danger">{notificationCount}</span>
                  )}
                </Button>

                <Button
                  type="button"
                  className="btn btn-primary btn-lg mx-2 custom-button"
                  href="./allbookadmin"
                >
                  <i className="bi bi-article-fill custom-icon"></i> จัดการบทความ
                </Button>

                <Button
                  type="button"
                  className="btn btn-primary btn-lg mx-2 custom-button"
                  href="./alluseradmin"
                >
                  <i className="bi bi-file-person-fill custom-icon"></i> จัดการบัญชี{" "}
                  {userCount > 0 && (
                    <span className="badge badge-danger">{userCount}</span>
                  )}
                </Button>

                <Button
                  type="button"
                  className="btn btn-primary btn-lg mx-2 custom-button"
                  href="./forapprovebook"
                >
                  <i className="bi bi-file-person-fill custom-icon"></i> กลั่นกรองบทความ
                </Button>
              </div>
            </div>
          </div>

      </section>
    </div>
  );
}

export default Adminpage;
