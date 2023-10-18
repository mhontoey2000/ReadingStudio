import React, { useState, useEffect } from 'react';
import Header from '../header';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

const Alluseradmin = () => {
    const [user, setUser] = useState([]);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false); // State for Modal visibility
    const [selectedUser, setSelectedUser] = useState(null); // State to hold the selected user's data

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get('http://localhost:5004/api/user')
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                setError(error);
            });
    }
    const approvalStatus = (status) => {
        if (!selectedUser) return;
        const email = selectedUser.user_email;
        console.log(email);

        const data = { status, email };

        axios.post(`http://localhost:5004/api/updateuser/${selectedUser.user_id}`,data)
            .then(response => {
                console.log(`User with ID ${selectedUser.user_id} has been ${status}.`);
                // Refresh the user list after deletion
                fetchUsers();
            })
            .catch(error => {
                console.error(`Error deleting user with ID ${selectedUser.user_id}: ${error}`);
            });

        setShowModal(false);
        setSelectedUser(null);
    }
    const deleteUser = () => {
        if (!selectedUser) return;
        if (window.confirm("Are you sure you want to delete this user?")) {
                axios.delete(`http://localhost:5004/api/user/${selectedUser.user_id}`)
                    .then(response => {
                        console.log(`User with ID ${selectedUser.user_id} has been deleted.`);
                        // Refresh the user list after deletion
                        fetchUsers();
                    })
                    .catch(error => {
                        console.error(`Error deleting user with ID ${selectedUser.user_id}: ${error}`);
                    });

                setShowModal(false);
                setSelectedUser(null);
        }
    }
    const handleEditClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    }

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
                                        <th>Id</th>
                                        <th>Username</th>
                                        <th>Usersurname</th>
                                        <th>UserEmail</th>
                                        <th>UserType</th>
                                        <th>Status</th>
                                        <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user.map((item) => (
                                        <tr key={item.user_id}>
                                            <td>{item.user_id}</td>
                                            <td>{item.user_name}</td>
                                            <td>{item.user_surname}</td>
                                            <td>{item.user_email}</td>
                                            <td>{item.user_type}</td>
                                            {/* <td>{item.approval_status}</td> */}
                                            <td style={{ backgroundColor: item.approval_status === 'approved' ? '#72d572' :  item.approval_status === 'pending' ? '#ffb74d':'#f36c60' }}>{item.approval_status}</td>
    
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
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the following user?
                    <p><strong>Name:</strong> {selectedUser && selectedUser.user_name}</p>
                    <p><strong>Surname:</strong> {selectedUser && selectedUser.user_surname}</p>
                    <p><strong>Email:</strong> {selectedUser && selectedUser.user_email}</p>
                    <p><strong>Stauts:</strong> {selectedUser && selectedUser.approval_status}</p>
                    <img src={selectedUser && selectedUser.user_idcard} alt="รูปภาพ"  width="300" height="200" />
                    <p>
                    <Button variant="primary" onClick={() => approvalStatus('approved')}>อนุมัติ</Button>
                    <Button variant="secondary" onClick={() => approvalStatus('rejected')}>ปฏิเสธ</Button>
                    </p>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={deleteUser}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Alluseradmin;
