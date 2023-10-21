import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../header';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../styles/analysis.css';

function Analysislevel() {
  return (
    <div>
      <Header/>
      <section>
        <h1>วิเคราะห์ระดับบทความ</h1>
        <div className="grid-container">

        </div>
      </section>
    </div>
  )
}

export default Analysislevel