import React, { useEffect, useState } from "react";
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Searchbar from "../searchbar";
import "../styles/creator.css";

function Creator() {
  const user = localStorage.getItem("email");
  const [status, setStatus] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5004/api/userdata?user_email=" + user)
      .then((response) => {
        setStatus(response.data[0].approval_status);
      })
      .catch((error) => console.error(error));
  }, [user]);

  return (
    <div>
      <Header />
      <section>
        <h1 className="text-center">Creator</h1>
        <div className="fgc">
          <div className="d-flex justify-content-center">
            {" "}
            {/* Center-align the buttons */}
            {["approved"].includes(status) && (
              <div className="d-flex">
                {" "}
                {/* Wrap buttons in a d-flex container */}
                <div className="mx-2">
                  <Button
                    type="button"
                    className="btn btn-primary btn-lg text-truncate custom-button"
                    href="./addbook"
                  >
                    <i className="bi bi-file-earmark-plus-fill"></i>{" "}
                    1.สร้างบทความ
                  </Button>
                </div>
                <div className="mx-2">
                  <Button
                    type="button"
                    className="btn btn-primary btn-lg text-truncate custom-button"
                    href="./articlecreator"
                  >
                    <i className="bi bi-file-earmark-plus-fill"></i>{" "}
                    2.สร้างตอนของบทความ
                  </Button>
                </div>
                {/* <Button
                  type="button"
                  className="btn btn-primary btn-lg text-truncate custom-button"
                  href="./sendrequest"
                >
                  <i className="bi bi-file-earmark-plus-fill"></i> 3.เผยแพร่บทความ
                </Button> */}
              </div>
            )}
            <div className="mx-2">
              <Button
                type="button"
                className="btn btn-primary btn-lg text-truncate custom-button"
                href="./allbookcreator"
              >
                <i className="bi bi-book-fill"></i> บทความของฉัน
              </Button>
            </div>
            <div className="mx-2">
              <Button
                type="button"
                className="btn btn-primary btn-lg text-truncate custom-button"
                href="./notificationcreator"
              >
                <i className="bi bi-envelope-fill"></i> แจ้งเตือน
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Creator;
