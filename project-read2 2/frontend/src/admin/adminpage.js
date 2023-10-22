import React from "react";
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Searchbar from "../searchbar";
import "../styles/adminpage.css"

function Adminpage() {
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
                <i className="bi bi-bell-fill"></i> แจ้งเตือน
              </Button>

              <Button
                type="button"
                className="btn btn-primary btn-lg text-truncate mx-2 custom-button"
                href="./allbookadmin"
              >
                <i className="bi bi-book-fill"></i> จัดการบทความ
              </Button>

              {/* <Button
                type="button"
                className="btn btn-primary btn-lg text-truncate mx-2 custom-button"
                href="./allarticleadmin"
              >
                <i className="bi bi-book-fill"></i> จัดการตอนของบทความ
              </Button> */}

              <Button
                type="button"
                className="btn btn-primary btn-lg text-truncate mx-2 custom-button"
                href="./allexamadmin"
              >
                <i className="bi bi-file-earmark-spreadsheet-fill"></i>{" "}
                จัดการข้อสอบ
              </Button>

              <Button
                type="button"
                className="btn btn-primary btn-lg text-truncate mx-2 custom-button"
                href="./alluseradmin"
              >
                <i className="bi bi-file-person-fill"></i> จัดการบัญชี
              </Button>

              <Button
                type="button"
                className="btn btn-primary btn-lg text-truncate mx-2 custom-button"
                href="./forapprovebook"
              >
                <i className="bi bi-file-person-fill"></i> คำขออนุมัติบทความ
              </Button>
            </div>
          </div>

      </section>
    </div>
  );
}

export default Adminpage;
