import React, { useState, useEffect } from 'react';
import Header from '../header';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { useLocation } from 'react-router-dom';

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
    const [table, setTable] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5004/api/report`)
          .then((response) => {
            setReport(response.data);
            console.log(response.data)
            setIsLoaded(true)
          })
          .catch((error) => {
            console.error(error);
          });
      }, []);

      useEffect(() => {
        if(!isLoaded) return
        axios.get(`http://localhost:5004/api/book`)
              .then((book_res) => {
                let tempBname = []
                for( let j = 0; j < report.length; j++){
                    for(let k = 0; k < book_res.data.length; k++){
                        console.log("ค่าของ J: ",j + "\nค่าของ K:  ",k)
                        console.log("report book_id: ",report[j].book_id + "\n response book_id:  ",book_res.data[k].book_id)
                        if(report[j].book_id === book_res.data[k].book_id){ 
                            console.log("RUUNNING...")
                            tempBname[j] = book_res.data[k].book_name
                            break
                        }
                    }
                }
                setBname(tempBname)
              })
              .catch((error) => {
                console.error(error);
              });
      }, [isLoaded, report])
    
      useEffect(() => {
        if(!isLoaded) return
        axios.get(`http://localhost:5004/api/article`)
              .then((article_res) => {
                let tempAname = []
                for( let j = 0; j < report.length; j++){
                    for(let k = 0; k < article_res.data.length; k++){
                        console.log("ค่าของ J: ",j + "\nค่าของ K:  ",k)
                        console.log("report article_id: ",report[j].article_id + "\nresponse article_id:  ",article_res.data[k].article_id)
                        if(report[j].article_id === article_res.data[k].article_id){ 
                            console.log("RUUNNING...")
                            tempAname[j] = article_res.data[k].article_name
                            break
                        }
                    }
                }
                setAname(tempAname)
              })
              .catch((error) => {
                console.error(error);
              });
      }, [isLoaded, report])
        
      const deleteReport = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
          axios.post(`http://localhost:5004/api/del_report/${id}`)
            .then((res) => {
              console.log(res);
              if (res.status === 200) {
                alert("Delete user successfully");
                window.location.reload();
              } else {
                alert("Delete user failed");
              }
            })
            .catch((err) => {
              console.log(err);
              setError(err);
            });
        }
      };

    useEffect(() => {
        let tempArr = [];
        if((report && aname && bname) === null) return;
        for(let i = 0; i < report.length; i++){
            let tempConst = {
                report_id: report[i].report_id,
                book_name: bname[i],
                article_name: aname[i],
                report_detail: report[i].report_detail,
                reporter: report[i].reporter,
                date_time: report[i].date_time,
            }
            console.log("--------", tempConst)
            tempArr.push(tempConst)
        }
        setTable(tempArr)
      }, [bname, aname])
    
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
                                    <th>ลบ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {table.map((item) => {
                                    return (
                                        <tr key={item.report_id}>
                                            <td>{item.report_id}</td>
                                            <td>{item.book_name}</td>
                                            <td>{item.article_name}</td>
                                            <td>{item.report_detail}</td>
                                            <td>{item.reporter}</td>
                                            <td>{item.date_time}</td>
                                            <td><Button className="btn btn-danger" 
                                                        onClick={() => deleteReport(item.report_id)}
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

export default Notification