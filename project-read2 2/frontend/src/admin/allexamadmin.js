import React, { useState, useEffect } from 'react';
import Header from '../header';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Button from 'react-bootstrap/Button';

const Allexamadmin = () => {

  const [exam, setExam] = useState([]);
  const [error, setError] = useState('');

  return (
    <div>
      
      <Header/>

      <section>
      <div className="grid-containerr">
      <h1 style={{ margin:"auto", padding:"20px"}}>ข้อสอบทั้งหมด</h1>
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
                                    <th>แก้ไข</th>
                                    <th>ลบ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exam.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.report_id}</td>
                                            <td>{item.book_name}</td>
                                            <td>{item.article_name}</td>
                                            <td>{item.report_detail}</td>
                                            <td>{item.reporter}</td>
                                            <td>{item.date_time}</td>
                                            <td><Button className="btn btn-danger" 
                                                        //onClick={() => deleteUser(item.user_id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                        </td>
                                        </tr>
                                    )
                                }
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                </div>
      </section>
    </div>
  )
}

export default Allexamadmin