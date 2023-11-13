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
    const [buttonColor, setButtonColor] = useState('');
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

    const handleClick = (items) => {
        console.log(items.report_id);
        console.log(items.report_status);
        if (items.report_status === 'Checked') return;
        const data = {
            report_id: items.report_id,
            report_status: 'InProgress',
        };
        axios.post('http://localhost:5004/api/updatereport', data, {
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

    const handleDropdownSelect = (status, color,selectedid) => {
        setSelectedStatus(status);
        console.log(status);
        toggleDropdown();
        setButtonColor(color);
        if(selectedid === undefined)
        return;
        const data = {
          report_id: selectedid,
          report_status: status ==='ตรวจสอบแล้ว'? 'Checked' :'Banned'
      };
      console.log(data);
      axios.post('http://localhost:5004/api/updatereport', data, {
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
    const Getcolor = (value) =>{
        // if(value === 'InProgress')
        //     return '007BFF';
       if(value === 'Checked')
            return 'green';
        else if(value === 'InProgress') 
            return 'orange';
        else
            return 'red';
        
    }
    const Getth = (value) =>{
      if(value === 'Checked')
         return 'ตรวจสอบแล้ว';
      else if(value === 'InProgress')
         return 'กำลังดำเนินการ';
      else
         return 'ระงับการเผยแพร่';
        
    }
    const openModal = (report) => {
        setSelectedReport(report);
        setShowModal(true);
        handleDropdownSelect(Getth(report.report_status), Getcolor(report.report_status))
        setDropdownOpen(false);
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
                        <div >
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col" className="col-sm-1">ลำดับ</th>
                                        <th scope="col" className="col-sm-1">บทความ</th>
                                        <th scope="col" className="col-sm-1">ตอน</th>
                                        <th scope="col" className="col-sm-3">รายละเอียด</th>
                                        <th scope="col" className="col-sm-2">ผู้แจ้ง</th>
                                        <th scope="col" className="col-sm-1">เวลา</th>
                                        <th scope="col" className="col-sm-1">สถานะ</th>
                                        <th scope="col" className="col-sm-1">ดู</th>
                                        <th scope="col" className="col-sm-1">จัดการ</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {report.map((item) => {
                                        return (
                                            <tr key={item.report_id}>
                                                <td className="col-sm-1">{item.report_id}</td>
                                                <td className="col-sm-1">{item.book_id}</td>
                                                <td className="col-sm-1">{item.report_articlename}</td>
                                                <td className="col-sm-3">{item.report_detail}</td>
                                                <td className="col-sm-2">{item.reporter}</td>
                                                <td className="col-sm-1">{item.date_time}</td>
                                                <td className="col-sm-1">{ Getth(item.report_status)}</td>
                                                <td className="col-sm-1">
                                                    <Link
                                                        to={{ pathname: '/Page/bookdetail', state: { article_id: item.article_id } }}
                                                        className="btn btn-success"
                                                        onClick={() => handleClick(item)}
                                                    >
                                                        ดู
                                                    </Link>
                                                  
                                                </td>
                                                <td className="col-sm-1">
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
                <Button
                  style={{
                    backgroundColor: buttonColor, // ใช้สีจาก state
                    top: '100%',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '150px',
                    height: '40px',
                  }}
                >
                  {selectedStatus} {dropdownOpen ? '▲' : '▼'}
                </Button>
                {dropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: '0',
                      width: '150px',
                      height: '40px',
                      color: 'white',
                      background: 'white',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                      zIndex: '1',
                    }}
                  >
                    {/* <div
                      className="dropdown-item"
                      style={{ background: '#007BFF', color: 'while', padding: '5px 20px', borderRadius: '5px' }}
                      onClick={() => handleDropdownSelect('รอตรวจสอบ', '#007BFF')}
                    >
                      รอตรวจสอบ
                    </div> */}
                    <div
                      className="dropdown-item"
                      style={{ background: 'green', color: 'while', padding: '5px 20px', borderRadius: '5px' }}
                      onClick={() => handleDropdownSelect('ตรวจสอบแล้ว', 'green',selectedReport.report_id)}
                    >
                      ตรวจสอบแล้ว
                    </div>
                    <div
                      className="dropdown-item"
                      style={{ background: 'red', color: 'while', padding: '5px 20px', borderRadius: '5px' }}
                      onClick={() => handleDropdownSelect('ระงับการเผยแพร่', 'red',selectedReport.report_id)}
                    >
                      ระงับการเผยแพร่
                    </div>
                  </div>
                )}
              </div>
            </p>
            <p>&nbsp;</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          ปิด
        </Button>
        {/* <Button variant="danger" onClick={deleteUser(selectedReport.report_id)}>Delete</Button> */}
        <Button variant="danger" onClick={() => deleteUser(selectedReport.report_id)}>ลบ</Button>

      </Modal.Footer>
    </Modal>
        </div>
    )
}
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Button
      type="button"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      style={{
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        maxWidth: '150px',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      {children}
    </Button>
  ));
export default Notification;
