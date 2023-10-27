import React, { useState, useEffect } from "react";
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";

function Forapprovebook() {
  const [items, setItems] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectitem, setSelectitem] = useState(null);
  const [status, setStatus] = useState("");
  const [unpublishReason, setUnpublishReason] = useState("-");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const user = localStorage.getItem("email");

  useEffect(() => {
    axios
      .get("http://localhost:5004/api/forapprove")
      .then((response) => {
        setItems(response.data);
        console.log("items",items);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const openStatusModal = (item) => {
    setShowModal(true);
    setSelectitem(item);
  };

  const submitStatusChange = (event) => {
    event.preventDefault();
  
    if (status === "published" || (status === "deny" && unpublishReason !== "-")) {
      const data = {
        bookId: selectitem.book_id,
        articleId: selectitem.article_id,
        newStatus: status,
        unpublishReason: status === "deny" ? unpublishReason : "-", 
      };
  
      axios
        .post("http://localhost:5004/api/updateStatus", data)
        .then((response) => {
          if (response.status === 200) {
            setShowModal(false);
            setSuccessMessage("อัพเดทสถานะเรียบร้อย!");
            setShowSuccessModal(true);
          }
        })
        .catch((error) => {
          console.error(error);
          setShowModal(false);
          setErrorMessage("ไม่สามมารถอัพเดทสถานะได้");
          setShowErrorModal(true);
        });
    } else if (status === "deny") {
        setErrorMessage("กรุณากรอกเหตุผลที่ปฎิเสธ");
        setShowErrorModal(true);
    }
  };

  const handleSuccessModalOK = () => {
    setShowSuccessModal(false);
    window.location.reload();
  };

  const handleErrorModalOK = () => {
    setShowErrorModal(false);
    window.location.reload();
  };

  return (
    <div>
      <Header />
      <section>
        <div className="grid-containerr">
          <div className="row">
            <h1>บทความที่รอการอนุมัติ</h1>
            <table className="table table-hover">
              <thead>
                <tr className="head" style={{ textAlign: "center" }}>
                  <th scope="col" className="col-sm-1">
                    ลำดับ
                  </th>
                  <th scope="col" className="col-sm-2">
                    บทความ
                  </th>
                  <th scope="col" className="col-sm-2">
                    ตอนของบทความ
                  </th>
                  <th scope="col" className="col-sm-3">
                    รูปหน้าปกตอน
                  </th>
                  <th scope="col" className="col-sm-2">
                    สถานะ
                  </th>
                  <th scope="col" className="col-sm-2">
                    ดูเนื้อหา
                  </th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {items.map((item, index) => (
                  <tr key={`${item.book_id}-${item.article_id}`}>
                    <td className="col-sm-1" key={`book${index + 1}`}>
                      {index + 1}
                    </td>
                    <td className="col-sm-2">{item.book_name}</td>
                    <td className="col-sm-2">{item.article_name}</td>
                    <td className="col-sm-3">
                      <img
                        src={item.article_imagedata || "url_to_default_image"}
                        width="100"
                        height="100"
                        alt={item.article_name}
                      />
                    </td>
                    <td className="col-sm-2">
                      <Button
                        className="btn btn-success"
                        onClick={() => openStatusModal(item)}
                      >
                        {item.status_article}
                      </Button>
                    </td>
                    <td className="col-sm-2">
                      <Button className="btn btn-primary">ดู</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ทำการยืนยัน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectitem && (
            <div className="table-approve">
              <form
               className="form-control"
               //onSubmit={(e) => submitStatusChange(e, selectitem.book_id,selectitem.article_id)}
               onSubmit={submitStatusChange}
              >
                <p style={{ textAlign: "center", margin: "10px" }}>
                  คุณต้องการเปลี่ยนสถานะของ
                </p>
                <div className="mb-3 row">
                  <label htmlFor="bookname" className="col-sm-2 col-form-label">
                    บทความ:
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext"
                      disabled
                      id="bookname"
                      value={selectitem.book_name}
                    />
                  </div>
                </div>

                <div className="mb-3 row">
                  <label
                    htmlFor="articlename"
                    className="col-sm-2 col-form-label"
                  >
                    ตอน:
                  </label>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      readOnly
                      className="form-control-plaintext"
                      disabled
                      id="articlename"
                      value={selectitem.article_name}
                    />
                  </div>
                </div>

                <div className="form-floating">
                  <select
                    className="form-select mb-3"
                    id="status"
                    required
                    onChange={(event) => {
                      setStatus(event.target.value);
                    }}
                  >
                    <option value="default"  hidden>
                      {selectitem.status_article}
                    </option>
                    <option value="published">อนุมัติ</option>
                    <option value="deny">ปฎิเสธ</option>
                  </select>
                  <label htmlFor="status">เลือกสถานะ:</label>
                </div>

                {status === "deny" && (
                  <div className="mb-3" style={{ marginTop: "5px" }}>
                    <label htmlFor="reasonforunpublish" className="form-label">
                      เหตุผลที่ปฎิเสธ
                    </label>
                    <textarea
                      className="form-control"
                      id="reasonforunpublish"
                      rows="3"
                      required
                      onChange={(event) => {
                        setUnpublishReason(event.target.value);
                      }}
                    ></textarea>
                  </div>
                )}

                <div
                  className="d-flex justify-content-between"
                  style={{ margin: "10px 0px" }}
                >
                  <Button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => setShowModal(false)}
                  >
                    ยกเลิก
                  </Button>

                  <Button type="submit" className="btn btn-success">
                    ตกลง
                  </Button>
                </div>
              </form>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>สำเร็จ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{textAlign:"center"}}>{successMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleSuccessModalOK}>
            ตกลง
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ไม่สำเร็จ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{textAlign:"center"}}>{errorMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleErrorModalOK}>
            ตกลง
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default Forapprovebook;