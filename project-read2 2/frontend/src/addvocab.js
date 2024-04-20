import React, { useEffect, useState } from "react";
import Header from "./header";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import "./styles/addvocab.css";
import Modal from "react-bootstrap/Modal";
import {
  apiClient,
  convertSoundToBase64,
  convertImageToBase64,
} from "./config";

function Addvocab() {
  const location = useLocation();
  const articleid = location.state.section_id;
  const bookid = location.state.article_id;
  const [isLoaded, setIsLoaded] = useState(false);
  const history = useHistory();
  const [bname, setBname] = useState("");
  const [aname, setAname] = useState("");

  const [Vname, setVname] = useState("");
  const [Vdetail, setVdetail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [Vitems, setVitems] = useState([]);

  useEffect(() => {
    apiClient
      .get(`api/articledetail/${articleid}`)
      .then((response) => {
        setAname(response.data[0].section_name);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [articleid]);

  useEffect(() => {
    apiClient
      .get(`api/article/${bookid}`)
      .then((response) => {
        const result = response.data;
        if (result) {
          setBname(result[0].article_name);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [bookid]);

  const sendVocab = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleConfirmed = () => {
    setShowModal(false);
    apiClient
      .post("api/vocabs", {
        articleid,
        Vname,
        Vdetail,
      })
      .then((response) => {
        // console.log(response);

        const newVocabItem = {
          vocabs_id: response.data.vocabs_id,
          vocabs_name: Vname,
          vocabs_detail: Vdetail,
        };

        setVitems([newVocabItem, ...Vitems]);

        setSuccessModal(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSuccessModalOK = () => {
    setSuccessModal(false);
    history.goBack(); // Redirect to the previous page
  };

  const cancelVocab = () => {
    history.goBack();
  };

  return (
    <div>
      <Header />
      <section>
        <h1>เพิ่มคำศัพท์</h1>

        <div className="grid-containerr">
          <div className="fg">
            <form className="form-group">
              <h2>กรุณากรอกคำศัพท์</h2>

              <div className="mb-3">
                <label htmlFor="bookname">ชื่อบทความ</label>
                <input
                  type="text"
                  className="form-control"
                  id="bookname"
                  value={bname}
                  disabled
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label htmlFor="articlename">ชื่อตอน</label>
                <input
                  type="text"
                  className="form-control"
                  id="articlename"
                  value={aname}
                  disabled
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label htmlFor="vocabname">คำศัพท์</label>
                <input
                  type="text"
                  className="form-control"
                  id="vocabname"
                  placeholder="ตัวอย่าง A[อ่านว่า เอ]"
                  onChange={(event) => {
                    setVname(event.target.value);
                  }}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="vocabdetail">ความหมาย</label>
                <textarea
                  className="form-control"
                  id="vocabdetail"
                  onChange={(event) => {
                    setVdetail(event.target.value);
                  }}
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
                    เพิ่ม
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
        <Modal.Body>คุณต้องเพิ่มคำศัพท์ใช่ไหม?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleConfirmed}>
            ตกลง
          </Button>
          <Button
            variant="warning"
            style={{ color: "white" }}
            onClick={() => setShowModal(false)}
          >
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={successModal} onHide={() => setSuccessModal(false)}>
        <Modal.Header closeButton onClick={handleSuccessModalOK}>
          {/* <Modal.Title>Success</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>เพิ่มคำศัพท์เรียบร้อย</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSuccessModalOK}>
            ตกลง
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Addvocab;
