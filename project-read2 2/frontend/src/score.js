import React, { useEffect, useState } from 'react';
import './styles/home.css';
import Header from './header';
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Searchbar from "./searchbar";

function Score() {

    const [items, setItems] = useState([]);
    const user = localStorage.getItem('email');
    const [usertype, setUsertype] = useState("")


    useEffect(() => {
      axios.get('http://localhost:5004/api/userdata?user_email=' + user)
        .then((response) => {
          setUsertype(response.data[0].user_type)
          })
        .catch(error => console.error(error));
    }, [user]);

    useEffect(() => {
        axios.get('http://localhost:5004/api/book')
          .then((response) => {
            setItems(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      }, []);


    return (
    <div>
            <Header/>
        
                <section >
                    <h1>สรุปคะแนน</h1>
                   
                      <div className="grid-container">
                        <from>
                                <div>
                                  <div>
                                     คะแนนที่คุณทำได้
                                  </div>
                                </div>
                        </from>
                    
                    </div>
                    <div className="addV" style={{ textAlign: 'center' }}>
                      <Link
                        style={{ background: 'red', marginRight: '50px', width: '100px' }} // Ajusta el ancho según tu preferencia
                        className="btn btn-warning tc"
                        to={{ pathname: "/Page/home", state: {} }}
                      >
                        ปิด
                      </Link>

                      <Link
                        style={{ background: '', marginLeft: '50px', width: '100px' }} // Ajusta el ancho según tu preferencia
                        className="btn btn-warning tc"
                        to={{ pathname: "/Page/bookdetail", state: {} }}
                      >
                        ย้อนกลับ
                      </Link>
                    </div>


                </section>
            </div>
        );
    }
export default Score;
