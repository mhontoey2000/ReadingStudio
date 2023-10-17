import React, { useState, useEffect } from 'react';
import Header from '../header';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';

const Notification = () => {
    const [showModal, setShowModal] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('รอตรวจสอบ');
    const [isLoaded, setIsLoaded] = useState(false);
    const [report, setReport] = useState([]);
    const [error, setError] = useState('');
    const user = localStorage.getItem('email');
    const [bname, setBname] = useState("");
    const [aname, setAname] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:5004/api/report`)
            .then((response) => {
                setReport(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const handleClick = (event, items) => {
        console.log(items.report_id);
        console.log(items.report_status);
        if (items.report_status === 'Checked') return;
        const data = {
            report_id: items.report_id,
            report_status: 'InProgress',
        };
        axios
            .post('http://localhost:5004/api/updatereport', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleDropdownSelect = (status) => {
        setSelectedStatus(status);
        toggleDropdown();
        // Add logic to update the status in the database if needed
    };

    const openModal = (report) => {
        setSelectedReport(report);
        setShowModal(true);
    };

    const deleteUser = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            fetch('http://localhost:5004/api/report/' + id, {
                method: 'DELETE',
            })
                .then(res => res)
                .then(res => {
                    console.log(res);
                    if (res.status === 200) {
                        alert("Delete user successfully");
                        window.location.reload();
                    } else {
                        alert("Delete user failed");
                    }
                })
                .catch(err => {
                    console.log(err);
                    setError(err);
                });
        }
    };

    return (
        <div>
            <Header />

            <section>
                <h1>แจ้งเตือนการรายงาน</h1>
                <div className="grid-containerr">
                    <div className="row">
                        <div className="col-12">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>ชื่อหนังสือ</th>
                                        <th>ชื่อบท</th>
                                        <th>รายละเอียด</th>
                                        <th>ผู้แจ้ง</th>
                                        <th>เวลา</th>
                                        <th>สถานะ</th>
                                        <th>ดู</th>
                                        <th>จัดการ</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {report.map((item) => {
                                        return (
                                            <tr key={item.report_id}>
                                                <td>{item.report_id}</td>
                                                <td>{item.book_id}</td>
                                                <td>{item.report_articlename}</td>
                                                <td>{item.report_detail}</td>
                                                <td>{item.reporter}</td>
                                                <td>{item.date_time}</td>
                                                <td>{item.report_status}</td>
                                                <td>
                                                    <Link
                                                        to={{ pathname: '/Page/bookdetail', state: { article_id: item.article_id } }}
                                                        className="btn btn-success"
                                                        onClick={() => handleClick(item)}
                                                    >
                                                        ดู
                                                    </Link>
                                                  
                                                </td>
                                                <td>
                                                    <Button onClick={() => openModal(item)}>จัดการ</Button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>ข้อมูลรายงาน</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReport && (
                        <div>
                            <p>Report ID: {selectedReport.report_id}</p>
                            <p>Book ID: {selectedReport.book_id}</p>
                            <p>ชื่อบท: {selectedReport.report_articlename}</p>
                            <p>รายละเอียด: {selectedReport.report_detail}</p>
                            <p>ผู้แจ้ง: {selectedReport.reporter}</p>
                            <p>เวลา: {selectedReport.date_time}</p>
                            <p>สถานะ: 
                                <div
                                    onClick={toggleDropdown}
                                    style={{
                                        position: 'relative',
                                        display: 'inline-block',
                                    }}
                                >
                                    <button
                                        style={{
                                            backgroundColor: '#007BFF',
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px 10px',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {selectedStatus} {dropdownOpen ? '▲' : '▼'}
                                    </button>
                                    {dropdownOpen && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '100%',
                                                right: '0',
                                                background: 'white',
                                                border: '1px solid #ccc',
                                                borderRadius: '5px',
                                                boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                                                zIndex: '1',
                                            }}
                                        >
                                            <div
                                                className="dropdown-item"
                                                style={{ color: '#007BFF' }}
                                                onClick={() => handleDropdownSelect('รอตรวจสอบ')}
                                            >
                                                รอตรวจสอบ
                                            </div>
                                            <div
                                                className="dropdown-item"
                                                style={{ color: 'green' }}
                                                onClick={() => handleDropdownSelect('ตรวจสอบแล้ว')}
                                            >
                                                ตรวจสอบแล้ว
                                            </div>
                                            <div
                                                className="dropdown-item"
                                                style={{ color: 'orange' }}
                                                onClick={() => handleDropdownSelect('กำลังดำเนินการ')}
                                            >
                                                กำลังดำเนินการ
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        ปิด
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Notification;
