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


const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();
    const data = { email, password };
    // setErrors(loginvalidation(values));
    if ( email !== '' && password !== '' )
        {
    axios.post('http://localhost:5004/api/login', data)
    .then(response => {
        //console.log("response", response);
        // Handle successful login here
        const token = response.data;
        localStorage.setItem('email', token.email); // Store user data in localStorage
        localStorage.setItem('access_token', token.accessToken); // Store access token in localStorage

        setShowLoginSuccess(true); // Show success message
        setTimeout(() => {
          window.location.href = './home'; // Redirect to home page after 2 seconds
        }, 1000);
    })
    .catch(error => {
        console.error(error);
        // Handle failed login here
        setShowAlert(true);
        setAlertMessage("อีเมล์หรือรหัสผ่านผิด กรุณาตรวจสอบ");
    });
  }};
  

  return (
    <section className="herolog">
     <div className="contentlogin">
      <div className="boxlogin">

      <img className='logologin' src="../picture/logo1.png"/>
      <h2 className='log'>เข้าสู่ระบบ</h2>
          <form className="needs-validation" onClick={handleLogin}>

          {showAlert && 
            <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
              {alertMessage}
            </Alert>
          }
          {showLoginSuccess && 
            <Alert variant="success" onClose={() => setShowLoginSuccess(false)} dismissible>
              กำลังเข้าสู่ระบบ
            </Alert>
          }

              <div className="form">
                <div className="form-group was-validated mb-3">
                  <input 
                    type="email"
                    id="floatingInput"
                    name="email"
                    className="form-control"
                    placeholder="อีเมล์@example.com"
                    required
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    />
                    <div className="invalid-feedback">
                        กรุณาใส่อีเมลล์ email@example.com
                    </div>
                    {/* {errors.email && <span className="text-danger">{errors.email}</span>} */}
                </div>

                <div className="form-group was-validated mb-3">
                  <input 
                    type="password"
                    id="floatingPassword"
                    name="password"
                    className="form-control"
                    placeholder="รหัสผ่าน"
                    required
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    />
                    <div className="invalid-feedback">
                        กรุณาใส่รหัสผ่าน
                    </div>
                    {/* {errors.password && <span className="text-danger">{errors.password}</span>} */}
                </div>

            </div>
            
            <Button className="buttonlog" type="submit">เข้าสู่ระบบ</Button>
            
            {error && <p>{error}</p>}

          </form>
          <p> ยังไม่สมัครสมาชิก? <a href="./register" >สมัครสมาชิก</a> </p>
        </div>
      </div> 

      <footer className="footer">
        <span>ติดต่อผู้พัฒนา rds_contact@gmail.com</span>
      </footer>

    </section>
    
  );
}

export default Login;
