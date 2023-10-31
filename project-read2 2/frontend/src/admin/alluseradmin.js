import React, { useState, useEffect } from "react";
import Header from "../header";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";

const Alluseradmin = () => {
  const [user, setUser] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // State for Modal visibility
  const [selectedUser, setSelectedUser] = useState(null); // State to hold the selected user's data

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://localhost:5004/api/user")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        setError(error);
      });
  };
  const approvalStatus = (status) => {
    if (!selectedUser) return;
    const email = selectedUser.user_email;
    console.log(email);

    const data = { status, email };

    axios
      .post(
        `http://localhost:5004/api/updateuser/${selectedUser.user_id}`,
        data
      )
      .then((response) => {
        console.log(`User with ID ${selectedUser.user_id} has been ${status}.`);
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
  const deleteUser = () => {
    if (!selectedUser) return;
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`http://localhost:5004/api/user/${selectedUser.user_id}`)
        .then((response) => {
          console.log(`User with ID ${selectedUser.user_id} has been deleted.`);
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
    }
  };
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  return (
    <div>
      <Header />
      <section>
        <div className="grid-containerr">
          <div className="row">
            <div className="col-12">
              <h1 className="text-center">บัญชีผู้ใช้ทั้งหมด</h1>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>ลำดับ</th>
                    <th>ชื่อ</th>
                    <th>นามสกุล</th>
                    <th>อีเมล์</th>
                    <th>ประเภทบัญชี</th>
                    <th>สถานะ</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {user.map((item, index) => (
                    <tr key={item.user_id}>
                      <td key={`item${index + 1}`}>{index + 1}</td>
                      <td>{item.user_name}</td>
                      <td>{item.user_surname}</td>
                      <td>{item.user_email}</td>
                      <td>{item.user_type}</td>
                      {/* <td>{item.approval_status}</td> */}
                      <td
                        style={{
                          backgroundColor:
                            item.approval_status === "approved"
                              ? "#72d572"
                              : item.approval_status === "pending"
                              ? "#ffb74d"
                              : "#f36c60",
                        }}
                      >
                        {item.approval_status === "pending"
                          ? "รออนุมัติ"
                          : item.approval_status === "rejected"
                          ? "ถูกปฏิเสธ"
                          : item.approval_status === "approved"
                          ? "อนุมัติ"
                          : item.approval_status}
                      </td>

                      <td>
                        <Button
                          className="btn btn-danger"
                          onClick={() => handleEditClick(item)}
                        >
                          จัดการ
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
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
            <div>
              <p>
                <strong>ชื่อ:</strong> {selectedUser && selectedUser.user_name}
              </p>
              <p>
                <strong>นามสกุล:</strong>{" "}
                {selectedUser && selectedUser.user_surname}
              </p>
              <p>
                <strong>อีเมล์:</strong>{" "}
                {selectedUser && selectedUser.user_email}
              </p>
              <p>
                <strong>สถานะ:</strong>{" "}
                {selectedUser && selectedUser.approval_status}
              </p>
              {selectedUser.user_idcard ? (
                <img
                  src={selectedUser && selectedUser.user_idcard}
                  alt="รูปภาพ"
                  width="300"
                  height="200"
                />
              ) : null}
              <p>
                <Button
                  variant="primary"
                  onClick={() => approvalStatus("approved")}
                >
                  อนุมัติ
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => approvalStatus("rejected")}
                >
                  ปฏิเสธ
                </Button>
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            ยกเลิก
          </Button>
          <Button variant="danger" onClick={deleteUser}>
            ลบ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Alluseradmin;
