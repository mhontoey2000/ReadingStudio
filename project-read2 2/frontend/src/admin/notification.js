import React, { useState, useEffect } from "react";
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import LoadingPage from "../LoadingPage";
import {
  API_BASE_URL,
  apiClient,
  convertSoundToBase64,
  convertImageToBase64,
} from "../config";

const Notification = () => {
  const [showModal, setShowModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("รอตรวจสอบ");
  const [buttonColor, setButtonColor] = useState("");
  const [selectitem, setSelectitem] = useState(null);
  const [report, setReport] = useState([]);
  const [error, setError] = useState("");
  const user = localStorage.getItem("email");
  const [status, setStatus] = useState("");
  const [unpublishReason, setUnpublishReason] = useState("-");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadedBtn, setIsLoadedBtn] = useState(true); // close click btn for loadData....

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = report.slice(startIndex, endIndex);

  const totalPages = Math.ceil(report.length / ITEMS_PER_PAGE);

  useEffect(() => {
    apiClient
      .get(`api/reportnotification`)
      .then((response) => {
        setReport(response.data);
         // open click btn
         setIsLoadedBtn(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleClick = (items) => {
    //console.log(items.report_id);
    //console.log(items.report_status);
    if (items.report_status !== "pending") return;
    const data = {
      report_id: items.report_id,
      report_status: "pending",
    };
    apiClient
      .post("api/updatereport", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const Getth = (value) => {
    if (value === "published") return "เผยแพร่";
    else if (value === "pending") return "กำลังดำเนินการ";
    else if (value === "deny") return "ถูกระงับ";
  };

  const submitStatusChange = (event) => {
    // console.log(status);
    event.preventDefault();
    const data = {
      report_id: selectitem.report_id,
      report_status: status === "published" ? "published" : "deny",
    };
    // console.log(data);

    if (
      status === "published" ||
      (status === "deny" && unpublishReason !== "-")
    ) {
      const data1 = {
        bookId: selectitem.bookid,
        newStatus: status,
        unpublishReason:
          status === "deny" ? unpublishReason : "ได้รับการเผยแพร่แล้ว",
      };
      // console.log(data1);
      apiClient
        .post("api/updateStatus", data1)
        .then((response) => {
          if (response.status === 200) {
          }
        })
        .catch((error) => {
          console.error(error);
        });
      apiClient
        .post("api/updatereport", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
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

  const openStatusModal = (item) => {
    setShowModal(true);
    setSelectitem(item);
  };

  const handleSuccessModalOK = () => {
    setShowSuccessModal(false);
    window.location.reload();
  };

  const handleErrorModalOK = () => {
    setShowErrorModal(false);
    window.location.reload();
  };

  const deleteUser = (id) => {
    fetch(API_BASE_URL + "api/report/" + id, {
      method: "DELETE",
    })
      .then((res) => res)
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          // alert("Delete user successfully");
          window.location.reload();
        } else {
          alert("Delete user failed");
        }
      })
      .catch((err) => {
        // console.log(err);
        setError(err);
      });
  };

  function formatDate(dateString) {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  
  return (
    <div>
      {/* waite... data */}
      <LoadingPage open={isLoadedBtn} />
      <Header />

      <section>
        <h1>แจ้งเตือนการรายงาน</h1>
        <div className="grid-containerr">
          <div className="row">
            <div>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col" className="col-sm-1">
                      ลำดับ
                    </th>
                    <th scope="col" className="col-sm-1">
                      บทความ
                    </th>
                    <th scope="col" className="col-sm-1">
                      ตอน
                    </th>
                    <th scope="col" className="col-sm-3">
                      รายละเอียด
                    </th>
                    <th scope="col" className="col-sm-2">
                      ผู้แจ้ง
                    </th>
                    <th scope="col" className="col-sm-1">
                      เวลา
                    </th>
                    <th scope="col" className="col-sm-1">
                      สถานะ
                    </th>
                    <th scope="col" className="col-sm-1">
                      ดูเนื้อหา
                    </th>
                    <th scope="col" className="col-sm-1">
                      ลบ
                    </th>
                    {/* <th scope="col" className="col-sm-1">จัดการ</th> */}
                  </tr>
                </thead>

                <tbody>
                  {currentItems.map((item, index) => {
                    return (
                      <tr key={item.report_id}>
                        <td className="col-sm-1">{startIndex + index + 1}</td>
                        <td className="col-sm-1">{item.article_id}</td>
                        <td className="col-sm-1">{item.report_articlename}</td>
                        <td className="col-sm-3">{item.report_detail}</td>
                        <td className="col-sm-2">{item.reporter}</td>
                        <td className="col-sm-1">{formatDate(item.date_time)}</td>
                        {/* <td className="col-sm-1">{ Getth(item.report_status)}</td> */}
                        <td className="col-sm-2">
                          <Button
                            className={`btn ${
                              item.report_status === "pending"
                                ? "btn-info"
                                : item.report_status === "creating"
                                ? "btn-secondary"
                                : item.report_status === "finished"
                                ? "btn-secondary"
                                : item.report_status === "deny"
                                ? "btn-danger"
                                : item.report_status === "published"
                                ? "btn-success"
                                : "btn-secondary"
                            }`}
                            style={{ color: "white" }}
                            onClick={() => openStatusModal(item)}
                          >
                            {item.report_status === "pending" &&
                              "กำลังดำเนินการ"}
                            {/* {item.report_status === "creating" && "สร้างยังไม่เสร็จ"} */}
                            {/* {item.report_status === "finished" && "สร้างเสร็จแล้ว"} */}
                            {item.report_status === "deny" && "ถูกระงับ"}
                            {item.report_status === "published" && "เผยแพร่"}
                          </Button>
                        </td>
                        <td className="col-sm-1">
                          <Link
                            to={{
                              pathname: "/Page/bookdetail",
                              state: { section_id: item.section_id },
                            }}
                            className="btn btn-success"
                            onClick={() => handleClick(item)}
                          >
                            ดู
                          </Link>
                        </td>
                        <td className="col-sm-2">
                          <Button
                            className="btn btn-danger amt2"
                            onClick={() => deleteUser(item.report_id)}
                          >
                            ลบ
                          </Button>
                        </td>
                        {/* <td className="col-sm-1">
                                                    <Button onClick={() => openModal(item)}>จัดการ</Button>
                                                </td> */}
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="9" style={{ textAlign: "center" }}>
                      <Button
                        onClick={() =>
                          setCurrentPage((prevPage) =>
                            Math.max(prevPage - 1, 1)
                          )
                        }
                        disabled={currentPage === 1}
                      >
                        ย้อนกลับ
                      </Button>
                      <span style={{ margin: "0 10px" }}>
                        {currentPage} จาก {totalPages}
                      </span>
                      <Button
                        onClick={() =>
                          setCurrentPage((prevPage) =>
                            Math.min(prevPage + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        ถัดไป
                      </Button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
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
                //onSubmit={(e) => submitStatusChange(e, selectitem.article_id,selectitem.section_id)}
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
                      value={selectitem.article_id}
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
                      value={selectitem.report_articlename}
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
                    <option value="default" hidden>
                      {Getth(selectitem.report_status)}
                    </option>
                    <option value="published">เผยแพร่</option>
                    <option value="deny">ระงับการเผยแพร่</option>
                  </select>
                  <label htmlFor="status">เลือกสถานะ:</label>
                </div>

                {status === "deny" && (
                  <div className="mb-3" style={{ marginTop: "5px" }}>
                    <label htmlFor="reasonforunpublish" className="form-label">
                      เหตุผลที่ระงับการเผยแพร่
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
          <p style={{ textAlign: "center" }}>{successMessage}</p>
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
          <p style={{ textAlign: "center" }}>{errorMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleErrorModalOK}>
            ตกลง
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Notification;
