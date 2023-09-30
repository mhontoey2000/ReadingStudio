import React, { useEffect, useState } from 'react';
// import './home.css';
import Header from './header';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { AudioOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Searchbar from "./searchbar";


function ExamPage() {
  const [examData, setExamData] = useState([]);
  const location = useLocation();

  useEffect(() => {
    axios.get('http://localhost:5004/api/exam')
      .then((response) => {
        setExamData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="home">

      <header className="home-header">
        <Header />
      </header>

      <section>
        <h1>แบบทดสอบ</h1>

        <div className="searchbar">
          <Searchbar/>
        </div>

        <div>
          <div className="grid-container">

            {examData.map((exam) => (
            <div className="grid-item card" key={exam.exam_id} >
                <h3 className="card-title" style={{margin:"10px"}}>{exam.exam_question}</h3>
                <img className="card-img-top img-fluid" src={exam.exam_images} alt={exam.exam_question} />
                <div>
                  <Button>{JSON.parse(exam.exam_choice).choice1}</Button>
                  <Button>{JSON.parse(exam.exam_choice).choice2}</Button>
                  <Button>{JSON.parse(exam.exam_choice).choice3}</Button>
                  <Button>{JSON.parse(exam.exam_choice).choice4}</Button>
                </div>
            </div>
            ))}
        </div>
        </div>
      </section>
    </div>
  );
}

export default ExamPage;