import React, { useState } from 'react';
import "./styles/login.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import { useHistory } from 'react-router-dom';
import { moment } from 'moment';
import { useEffect } from 'react';
import loginvalidation from './loginvalidation';
import {
  apiClient,
  convertSoundToBase64,
  convertImageToBase64,
} from "./config"

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();
    setEmailError(''); // Reset email error message
    setPasswordError(''); // Reset password error message
    setShowAlert(false);

    if (!email.trim()) {
      setEmailError('กรุณาใส่อีเมลล์');
      return;
    }

    if (!password.trim()) {
      setPasswordError('กรุณาใส่รหัสผ่าน');
      return;
    }

    
    // setErrors(loginvalidation(values));
    if ( email !== '' && password !== '' ){
        const data = { email, password };
        
        apiClient.post('api/login', data)
    .then(response => {
        //console.log("response", response);
        // Handle successful login here
        const token = response.data;
        console.log('data', response.data);
        localStorage.setItem('email', token.email); // Store user data in localStorage
        localStorage.setItem('access_token', token.accessToken); // Store access token in localStorage
        localStorage.setItem('user_id', token.user_id);

        setShowLoginSuccess(true); // Show success message
        setTimeout(() => {
          window.location.href = './home'; // Redirect to home page after 2 seconds
        }, 1000);
    })
    .catch(error => {
        console.error(error);
        // Handle failed login here
        setShowAlert(true);
        if(error.response)
          setAlertMessage(error.response.data.message);
        else
          setAlertMessage(error.message);
    });
  }};
  

  return (
    <section className="herolog">
     <div className="contentlogin">
      <div className="boxlogin">

      <img className='logologin' src="../picture/logo1.png"/>
      <h2 className='log'>เข้าสู่ระบบ</h2>
          <form className="needs-validation" onSubmit={handleLogin}>

          {showAlert && (
              <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                {alertMessage}
              </Alert>
            )}

              <div className="form">
                <div className="form-group was-validated mb-3">
                  <input 
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="อีเมล์@example.com"
                    value={email}
                    required
                    onChange={(e) => 
                      setEmail(e.target.value)
                    }
                    />
                    <div className="invalid-feedback">
                      {emailError}
                    </div>
                </div>

                <div className="form-group was-validated mb-3">
                  <input 
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="รหัสผ่าน"
                    value={password}
                    required
                    onChange={(e) => 
                      setPassword(e.target.value)
                    }
                    />
                    <div className="invalid-feedback">
                      {passwordError}
                    </div>
                </div>

            </div>
            
            <Button className="buttonlog" type="submit">เข้าสู่ระบบ</Button>

          </form>
          <p> ยังไม่สมัครสมาชิก? <a href="./register" >สมัครสมาชิก</a> </p>
        </div>
      </div> 

      <footer className="footer">
        <span>ติดต่อผู้พัฒนา readingstudio101@gmail.com</span>
      </footer>

    </section>
    
  );
}

export default Login;
