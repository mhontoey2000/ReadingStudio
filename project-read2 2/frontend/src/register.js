import React from 'react';
import './styles/register.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';



function Register() {

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [usertype, setUsertype] = useState("");
    const [key, setKey] = useState("");
    const [code, setCode] = useState("");
    const history = useHistory();

    const addAccount = (e) => {
        
        console.log("addAccount function called");
        e.preventDefault();
        if(usertype === "creater"){
            axios.get('http://localhost:5004/api/key',{
                key
            })
            .then((response) => {
                setCode(response.data.key);
                if(code !== key){
                    alert('กรุณาติดต่อผู้พัฒนา rds_contact@gmail.com เพื่อขอคีย์');
                    setUsertype("");
                    document.getElementById('floatingSelect').value = ""
                    return  
                }
              })
              .catch((error) => {
                console.error(error);
                
              });}

        if (name !== '' && surname !== '' && email !== '' && password !== '' && usertype !== '')
        {
        axios.post('http://localhost:5004/api/register',{
            name,
            surname,
            email,
            password,
            usertype,
            
        })
        .then((response) => {
            
            console.log(response);
            setTimeout(() => {
                window.location.href = './login'; // Redirect to home page after 2 seconds
              }, 1000);
          })
          .catch((error) => {
            console.error(error);
            
            // แก้เพิ่ม

            const errorMessageDiv = document.getElementById('errorMessage');
            errorMessageDiv.innerHTML = "อีเมลนี้ถูกใช้งานแล้ว";
            errorMessageDiv.style.color = 'red';
            errorMessageDiv.style.display = 'flex'; // กำหนดให้เป็น flex container
            errorMessageDiv.style.justifyContent = 'flex-start'; // จัดวางเนื้อหาชิดซ้าย
            errorMessageDiv.style.alignItems = 'flex-start'; // จัดวางเนื้อหาชิดบน
          });
          
    }
}
    
    return (
        <section className="heroreg">
            <div className="contentreg">
                <div className="boxreg">

                <h2>สมัครสมาชิก</h2>
                
                    <div className="form">
                        <form className="form-group was-validated mb-3">

                            <div className="mb-3">
                                <input 
                                type="text"
                                className ="form-control"  
                                id="name" 
                                placeholder="กรุณากรอกชื่อ"
                                required
                                onChange={(event) => {
                                    setName(event.target.value)
                                }}
                                />
                            </div>

                            <div className="mb-3">
                                <input 
                                type="text" 
                                className="form-control"  
                                id="surname" 
                                placeholder="กรุณากรอกนามสกุล"
                                required
                                onChange={(event) => {
                                    setSurname(event.target.value)
                                }}
                                /> 
                            </div>

                            <div className="mb-3">
                                <input 
                                type="text" 
                                className="form-control"  
                                id="email" 
                                placeholder="กรุณากรอกอีเมลล์"
                                required
                                onChange={(event) => {
                                    setEmail(event.target.value)
                                }}
                                />
                                {/* แก้เพิ่ม */}
                                <div id="errorMessage" class="error-message"></div>
                            </div>

                
                            <div className="mb-3">
                                <input 
                                type="password" 
                                className="form-control"  
                                id="password" 
                                placeholder="กรุณากรอกรหัส"
                                required
                                onChange={(event) => {
                                    setPassword(event.target.value)
                                }}
                                />
                            </div>

                            <div className="form-floating">
                                    <select 
                                        id="floatingSelect"
                                        className="form-select"
                                        required
                                        onChange={(event) => {setUsertype(event.target.value)}}
                                    >
                                        <option defaultValue></option>
                                        <option value="creater">ผู้สร้างบทเรียน</option>
                                        <option value="learner">ผู้เรียน</option>
                                    </select>
                                    <label htmlFor="floatingSelect">เลือกประเภทบัญชี</label>
                            </div>
                            
                                {usertype === "creater" && (
                                    <div className="mb-3 hide-required">
                                    <input
                                        type="text"
                                        className="form-control hide-required"
                                        id="key"
                                        placeholder="กรุณากรอกคีย์"
                                        onChange={(event) => {
                                            setKey(event.target.value);
                                        }}
                                    />
                                    </div>
                                )}
                                
                            
                            <p> มีสมาชิกอยู่แล้ว? <a href="./login">เข้าสู่ระบบ</a></p>
                            
                            <div>
                                <Button 
                                 className="buttonreg" type="submit" 
                                 onClick={addAccount}
                                >
                                    ยืนยัน
                                </Button>
                            </div>
                            
                        </form>
                    </div>
                    

                </div>
            </div>
            
            <footer className="footer">
                <span>ติดต่อผู้พัฒนา rds_contact@gmail.com</span>
            </footer>
    </section>
    );
}
export default Register;