import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Header from './header';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './styles/profile.css';

function Profile() {
  const history = useHistory();
  const user = localStorage.getItem('email'); 
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [usertype, setUsertype] = useState("");
  const [status, setStatus] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5004/api/userdata?user_email=' + user)
      .then((response) => {
        setFirstname(response.data[0].user_name);
        setLastname(response.data[0].user_surname);
        setUsertype(response.data[0].user_type);
        setStatus(response.data[0].approval_status);
        })
      .catch(error => console.error(error));
  }, [user]);

  // handlechange for first name and last name
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'firstname') {
      setFirstname(value);
    } else if (name === 'lastname') {
      setLastname(value);
    }
  }


  const editProfile = (e) => {
    e.preventDefault();
    setShowModal(true);
    }

    const handleSaveChangesConfirmed = () => {
      fetch('http://localhost:5004/api/userdata', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_email: user,
            user_name: firstname,
            user_surname: lastname

        }),
    })
        .then(response => response)
        .then(data => {
            window.location.href = '/Page/profile';
            
        })
        .catch(error => console.error(error));
    
    }

    const cancelReport = () => {
      history.goBack();
  }

    return (
        <>
        <Header/>
    <div className="grid-containerr">
      <div className="fg"> 
        <h2>Profile</h2>
        <form onSubmit={editProfile}>
        
        <div className='row'>
          
          <div className="col-6 mb-3 form-group">
            <label htmlFor="FirstName" className="form-label">ชื่อ</label>
            <input type="text" className="form-control" name="firstname" value={firstname} onChange={handleChange} />
          </div>

          <div className="col-6 mb-3 form-group">
            <label htmlFor="LastName" className="form-label">นามสกุล</label>
            <input type="text" className="form-control" name="lastname" value={lastname} onChange={handleChange} />
          </div>

          <div className="mb-3 form-group">
            <label htmlFor="Email" className="form-label">อีเมลล์</label>
            <input type="email" className="form-control" id="Email" aria-describedby="emailHelp" value={user} disabled readOnly/>
          </div>

          <div className="mb-3 form-group">
            <label className="form-label">ประเภทบัญชี</label>
            <input type="text" className="form-control" value={usertype} disabled readOnly></input>
          </div>

          {["admin", "creator"].includes(usertype) && (
            <div className="mb-3 form-group">
              <label className="form-label">สถานะ</label>
              <input 
               type="text" 
               className="form-control" 
               value={status} 
               disabled 
               readOnly
               style={{
                color: 
                  status === 'approved' ? 'green' :
                  status === 'pending' ? 'orange' : 'red' ,
                  fontWeight: 'bold'
                }}
              />
                <cite>*ถ้า active จะสามารถสร้างหนังสือ ถ้า inactive จะไม่สามารถสร้างหนังสือได้</cite>
            </div>
          )}

        </div>
        <div className="btn-containerr">
            <div className="btn-group me-2">
              <Button
               type="submit"
               className="btn1 btn-primary"
               >
                บันทึก
              </Button>
            </div>

            <div className="btn-group me-2">
              <Button 
               type="submit" 
               className="btn1 btn-warning"
               onClick={cancelReport}
              >
                  ยกเลิก
              </Button>
            </div>
        </div>
        </form>
      </div>
    </div>

    <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Save Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to save the changes?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSaveChangesConfirmed}>
            ตกลง
          </Button>
          <Button variant="warning" style={{ color: "white" }} onClick={() => setShowModal(false)}>
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
}

export default Profile;
