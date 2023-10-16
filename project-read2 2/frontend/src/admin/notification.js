import React, { useState, useEffect } from 'react';
import Header from '../header';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Notification = () => {

    // const location = useLocation();
    // const articleid = location.state.article_id;
    // const bookid = location.state.book_id;
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
        
    const deleteUser = (id) => {
        if(window.confirm("Are you sure you want to delete this user?")){
        fetch('http://localhost:5004/api/report/' + id, {
            method: 'DELETE',
        })
            .then(res => res)
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    alert("Delete user successfully");
                    window.location.reload();
                }
                else {
                    alert("Delete user failed");
                }
            })
            .catch(err => {
                console.log(err);
                setError(err);
            });
        }
    }
    
  return (
    <div>
        
            <Header/>


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
                                                <Link  to={{ pathname: '/Page/bookdetail', state: { article_id: item.article_id } }}  className="btn btn-success" >
                                                    ดู
                                                </Link>
                                            </td>
                                            <td><Button className="btn btn-danger" 
                                                onClick={() => deleteUser(item.user_id)}>
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

export default Notification