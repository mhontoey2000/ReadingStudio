import React, { useEffect, useState } from "react";
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Searchbar from "../searchbar";
import "../styles/creator.css";
import LoadingPage from "../LoadingPage";
import {
  apiClient,
  convertSoundToBase64,
  convertImageToBase64,
} from "../config"

function Creator() {
  const user = localStorage.getItem("email");
  const [status, setStatus] = useState("");
  const [isLoadedBtn, setIsLoadedBtn] = useState(true); // close click btn for loadData....

  useEffect(() => {
    apiClient
      .get("api/userdata?user_email=" + user)
      .then((response) => {
        setStatus(response.data[0].approval_status);
         // open click btn
         setIsLoadedBtn(false);
      })
      .catch((error) => console.error(error));
  }, [user]);

  return (
    <div>
      {/* waite... data */}
      <LoadingPage open={isLoadedBtn} />
      <Header />

      <section>
        <h1 className="text-center">เมนูของผู้สร้าง</h1>

        <div className="fgc">
          
            {["approved"].includes(status) && (
              <div className="box-addbook-c">
                <h4 className="text-in-box">เพิ่มบทความ</h4>
              <div className="btn-toolbar d-flex justify-content-center custom-item-box">
                
                  <Button
                    type="button"
                    className="btn btn-primary btn-lg text-truncate mx-2 custom-button"
                    href="./addbook"
                  >
                    <i className="bi bi-file-earmark-plus-fill custom-icon"></i>
                    1.สร้างบทความ
                  </Button>

                  <Button
                    type="button"
                    className="btn btn-primary btn-lg text-truncate mx-2 custom-button"
                    href="./articlecreator"
                  >
                    <i className="bi bi-file-earmark-plus-fill custom-icon"></i>
                    2.สร้างตอนของบทความ
                  </Button>
                
                {/* <Button
                  type="button"
                  className="btn btn-primary btn-lg text-truncate custom-button"
                  href="./sendrequest"
                >
                  <i className="bi bi-file-earmark-plus-fill"></i> 3.เผยแพร่บทความ
                </Button> */}
              </div>
              </div>
            )}

            <div className="box-manage-c">
              <h4 className="text-in-box">จัดการ</h4>
              <div className="btn-toolbar d-flex justify-content-center custom-item-box">
                
                  <Button
                    type="button"
                    className="btn btn-primary btn-lg text-truncate mx-2 custom-button"
                    href="./allbookcreator"
                  >
                    <i className="bi bi-article-fill custom-icon"></i> บทความของฉัน
                  </Button>
                
                  <Button
                    type="button"
                    className="btn btn-primary btn-lg text-truncate mx-2 custom-button"
                    href="./notificationcreator"
                  >
                    <i className="bi bi-envelope-fill custom-icon"></i> แจ้งเตือน
                  </Button>
                
              </div>
              </div>
          
        </div>
      </section>
    </div>
  );
}

export default Creator;
