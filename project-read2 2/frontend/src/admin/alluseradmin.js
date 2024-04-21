import React, { useState, useEffect } from "react";
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import LoadingPage from "../LoadingPage";
import {
  apiClient,
  convertSoundToBase64,
  convertImageToBase64,
} from "../config";

const Alluseradmin = () => {
  const [user, setUser] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // State for Modal visibility
  const [selectedUser, setSelectedUser] = useState(null); // State to hold the selected user's data
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isLoadedBtn, setIsLoadedBtn] = useState(true); // close click btn for loadData....
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImage, setCurrentImage] = useState("");


  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  useEffect(() => {
    setFilteredUsers(isFiltering ? filterUsersByLastLogin() : user); // Update filtered users when isFiltering changes
  }, [isFiltering, user]);

  const fetchUsers = () => {
    apiClient
      .get("api/user")
      .then((response) => {
        setUser(response.data);
        if (!isFiltering) {
          setFilteredUsers(response.data);
        }
        // open click btn
        setIsLoadedBtn(false);
      })
      .catch((error) => {
        setError(error);
      });
  };
  const approvalStatus = (status) => {
    if (!selectedUser) return;
    const email = selectedUser.user_email;
    //console.log(email);

    const data = { status, email };

    apiClient
      .post(`api/updateuser/${selectedUser.user_id}`, data)
      .then((response) => {
        //console.log(`User with ID ${selectedUser.user_id} has been ${status}.`);
        // Refresh the user list after deletion
        fetchUsers();
      })
      .catch((error) => {
        console.error(
          `Error deleting user with ID ${selectedUser.user_id}: ${error}`
        );
      });

    setShowModal(false);
    setSelectedUser(null);
  };

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  const handleDeleteConfirmation = () => {
    // Close the delete confirmation modal
    handleCloseDeleteConfirmation();

    // Proceed with the delete operation
    apiClient
      .delete(`api/user/${selectedUser.user_id}`)
      .then((response) => {
        // Refresh the user list after deletion
        fetchUsers();
      })
      .catch((error) => {
        console.error(
          `Error deleting user with ID ${selectedUser.user_id}: ${error}`
        );
      });

    // Reset selectedUser and close the main modal
    setShowModal(false);
    setSelectedUser(null);
  };
  const deleteUser = () => {
    if (!selectedUser) return;
    setShowModal(false);
    setShowDeleteConfirmation(true);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  const formatLastLogin = (timestamp) => {
    const now = new Date();
    const lastLoginDate = new Date(timestamp);

    const timeDifference = now - lastLoginDate;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} วันที่แล้ว`;
    } else if (hours > 0) {
      return `${hours} ชั่วโมงที่แล้ว`;
    } else if (minutes > 0) {
      return `${minutes} นาทีที่แล้ว`;
    } else {
      return "เมื่อสักครู่";
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(user.length / ITEMS_PER_PAGE);

  const filterUsersByLastLogin = () => {
    const now = new Date();
    const ninetyDaysAgo = new Date(now);
    ninetyDaysAgo.setDate(now.getDate() - 90);

    return user.filter((item) => {
      const lastLoginDate = new Date(item.last_login);
      return lastLoginDate <= ninetyDaysAgo;
    });
  };

  const handleFilter90DaysAgo = () => {
    setCurrentPage(1);
    setIsFiltering(!isFiltering); // Toggle filtering state
  };

  const handleImageClick = (imageUrl) => {
    setCurrentImage(imageUrl);
    setShowImageModal(true);
  };

  
  return (
    <div>
      {/* waite... data */}
      <LoadingPage open={isLoadedBtn} />
      <Header />
      <section>
        <div className="grid-containerr">
          <div className="row">
            <div className="col-12">
              <h1 className="text-center">บัญชีผู้ใช้ทั้งหมด</h1>
              <Button
                onClick={
                  isFiltering
                    ? () => setIsFiltering(false)
                    : handleFilter90DaysAgo
                }
                style={{ marginBottom: "10px" }}
              >
                {isFiltering ? "ย้อนกลับ" : "บัญชีที่ไม่มีการเคลื่อนไหว"}
              </Button>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col" className="col-sm-1">
                      ลำดับ
                    </th>
                    <th scope="col" className="col-sm-2">
                      ชื่อ
                    </th>
                    <th scope="col" className="col-sm-2">
                      นามสกุล
                    </th>
                    <th scope="col" className="col-sm-2">
                      อีเมล์
                    </th>
                    <th scope="col" className="col-sm-1">
                      ประเภทบัญชี
                    </th>
                    <th scope="col" className="col-sm-1">
                      สถานะ
                    </th>
                    <th scope="col" className="col-sm-2">
                      การเข้าสู่ระบบ
                    </th>
                    <th scope="col" className="col-sm-1">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((item, index) => (
                    <tr key={item.user_id}>
                      <td className="col-sm-1" key={`item${index + 1}`}>
                        {startIndex + index + 1}
                      </td>
                      <td className="col-sm-2">{item.user_name}</td>
                      <td className="col-sm-2">{item.user_surname}</td>
                      <td className="col-sm-2">{item.user_email}</td>
                      <td className="col-sm-1">{item.user_type}</td>
                      {/* <td>{item.approval_status}</td> */}
                      <td
                        style={{
                          backgroundColor:
                            item.approval_status === "approved"
                              ? "#72d572"
                              : item.approval_status === "pending"
                              ? "#ffb74d"
                              : "#f36c60",
                          fontWeight: "bold",
                        }}
                        className="col-sm-1"
                      >
                        {item.approval_status === "pending"
                          ? "รออนุมัติ"
                          : item.approval_status === "rejected"
                          ? "ถูกปฏิเสธ"
                          : item.approval_status === "approved"
                          ? "อนุมัติ"
                          : item.approval_status}
                      </td>
                      <td className="col-sm-2">
                        {formatLastLogin(item.last_login)}
                      </td>
                      <td className="col-sm-1">
                        <Button
                          className="btn btn-warning"
                          onClick={() => handleEditClick(item)}
                        >
                          จัดการ
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center" }}>
                      <Button
                        onClick={() =>
                          setCurrentPage((prevPage) =>
                            Math.max(prevPage - 1, 1)
                          )
                        }
                        disabled={currentPage === 1}
                        className="btn btn-primary"
                      >
                        ย้อนกลับ
                      </Button>
                      <span style={{ margin: "0 10px" }}>
                        {`${currentPage} จาก ${Math.ceil(
                          filteredUsers.length / ITEMS_PER_PAGE
                        )}`}
                      </span>
                      <Button
                        onClick={() =>
                          setCurrentPage((prevPage) =>
                            Math.min(prevPage + 1, totalPages)
                          )
                        }
                        disabled={
                          currentPage === totalPages ||
                          filteredUsers.length === 0 ||
                          filteredUsers.length < ITEMS_PER_PAGE
                        }
                        className="btn btn-primary"
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

      {/* Modal component */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>จัดการบัญชี</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div className="table-approve">
              <div className="mb-3">
                <strong>ชื่อ:</strong> {selectedUser && selectedUser.user_name}
              </div>
              <div className="mb-3">
                <strong>นามสกุล:</strong>{" "}
                {selectedUser && selectedUser.user_surname}
              </div>
              <div className="mb-3">
                <strong>อีเมล์:</strong>{" "}
                {selectedUser && selectedUser.user_email}
              </div>
              {/* <p>
                <strong>สถานะ:</strong>{" "}
                <span
                  style={{
                    color:
                      selectedUser.approval_status === "approved"
                        ? "green" 
                        : selectedUser.approval_status === "pending"
                        ? "orange" 
                        : selectedUser.approval_status === "rejected"
                        ? "red" 
                        : "inherit",
                      fontWeight: "bold", 
                  }}
                >
                  {selectedUser.approval_status === "pending"
                    ? "รออนุมัติ"
                    : selectedUser.approval_status === "rejected"
                    ? "ถูกปฏิเสธ"
                    : selectedUser.approval_status === "approved"
                    ? "อนุมัติ"
                    : selectedUser.approval_status}
                </span>
              </p> */}
              {selectedUser.user_idcard ? (
                <>
                 <style>
                    {`
                        .custom-border:hover {
                          border: 3px solid #0b5ed7;
                      }
                    `}
                </style>
                <img
                  src={selectedUser && selectedUser.user_idcard}
                  alt="รูปภาพ"
                  width="300"
                  height="200"
                  className="custom-border"
                  onClick={() => handleImageClick(selectedUser.user_idcard)}
                  style={{ cursor: 'pointer', transition: 'border ease-in-out' }}
                />
                </>
              ) : null}
              <div
                className="d-flex align-items-center"
                style={{ marginTop: "20px" }}
              >
                <p className="mr-3" style={{ marginRight: "10px" }}>
                  สถานะของบัญชี
                </p>
                <Button
                  variant="btn btn-outline-success"
                  style={{ marginRight: "10px" }}
                  onClick={() => approvalStatus("approved")}
                >
                  อนุมัติบัญชี
                </Button>
                <Button
                  variant="btn btn-outline-danger"
                  onClick={() => approvalStatus("rejected")}
                >
                  ปฏิเสธบัญชี
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-between w-100">
            <Button variant="btn btn-danger" onClick={deleteUser}>
              ลบบัญชี
            </Button>
            <Button
              variant="btn btn-primary"
              onClick={() => setShowModal(false)}
            >
              ยกเลิก
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteConfirmation}
        onHide={handleCloseDeleteConfirmation}
      >
        <Modal.Header closeButton>
          <Modal.Title>ยืนยันการลบบัญชี</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>คุณแน่ใจหรือไม่ที่ต้องการลบบัญชีนี้?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="btn btn-danger" onClick={handleDeleteConfirmation}>
            ลบบัญชี
          </Button>
          <Button
            variant="btn btn-primary"
            onClick={handleCloseDeleteConfirmation}
          >
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="lg" centered>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center">
          <img src={currentImage} alt="Full Size" style={{ maxWidth: '100%', maxHeight: '100vh' }} />
        </Modal.Body>
      </Modal>
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="lg" centered>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center">
          <img src={currentImage} alt="Full Size" style={{ maxWidth: '100%', maxHeight: '100vh' }} />
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default Alluseradmin;
