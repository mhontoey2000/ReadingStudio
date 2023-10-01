import React, { useEffect, useState } from 'react';
import './styles/home.css';
import Header from './header';
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Searchbar from "./searchbar";

function Exam() {

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
                    <h1>ทำแบบทดสอบ</h1>
                   
                        <div className="grid-container">
                        <from>ชื่อข้อสอบ</from>
                        

                                <div>
                                  <div>
                                     
                                  </div>
                                </div>
                
                    </div>
                    
                </section>
            </div>
        );
    }
export default Exam;
