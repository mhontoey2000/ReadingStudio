import React, { useState, useEffect } from 'react';
import "./styles/header.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {  Button, Card, Row, Col, Container, Nav, Navbar, Jumbotron, Modal} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Pass } from 'react-bootstrap-icons';



function Header() {

  const user = localStorage.getItem('email');
  const [firstname, setFirstname] = React.useState('');
  const [surname, setSurname] = React.useState('');
  const [isSticky, setIsSticky] = useState(false);
  const [usertype, setUsertype] = useState("");
  const [userstatus, setStatus] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchData = () => {
    fetch('http://localhost:5004/api/userdata?user_email=' + user, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setFirstname(data[0].user_name);
        setSurname(data[0].user_surname);
        setStatus(data[0].approval_status);
        setUsertype(data[0].user_type);
      })
      .catch(error => console.error(error));
  }
  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, [user]);

  const logout = (e) => {
    e.preventDefault();
    setShowModal(true); // Show the confirmation modal
  }

  const handleLogoutConfirmed = () => {
    localStorage.clear();
    window.location.href = '/Page/login';
  }

  const handleScroll = () => {
    // Check the scroll position to determine if the header should be sticky
    if (window.scrollY > 50) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    // Add scroll event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
    return (
    <>
      {[false].map((expand) => (
        <Navbar 
          key={expand} 
          bg="light" 
          expand={expand} 
          className={`mb-3Nbar ${isSticky ? "sticky-header" : ""}`}
          //mb-3Nbar
          >
          <Container fluid>
            <Navbar.Brand href="home">
              <img className='logohome' src="../picture/logo2.png"/>
            </Navbar.Brand>
            <div className="align-items-center ms-2"> {/* Wrap the text in a div */}
              <p className="welcometext">ยินดีต้อนรับ,คุณ {firstname}</p>
            </div>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title 
                      id={`offcanvasNavbarLabel-expand-${expand}`}>
                    <img 
                      className='logohome' 
                      src="../picture/RS_logo.png" 
                      style={{height:"25px",width:"30px",marginRight:"20px"}}
                      />
                        Reading Studio
                    </Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body>
                    <Nav >
                        <Nav.Link href="./home" className="list_item">
                          <i className="bi bi-house"></i>
                            หน้าหลัก
                          </Nav.Link>
                        <Nav.Link href="./profile" className="list_item">
                          <i className="bi bi-person"></i>
                            โปรไฟล์
                          </Nav.Link>
                          {usertype === "admin" && (<Nav.Link href="./adminpage" className="list_item">
                          <i className="bi bi-person-workspace"></i>
                            เมนูแอดมิน
                          </Nav.Link>)}
                          {usertype === "creator" && userstatus === "approved" && (<Nav.Link href="./creator" className="list_item">
                          <i className="bi bi-person-workspace"></i>
                            เมนูผู้สร้าง
                          </Nav.Link>)}
                        <Nav.Link href="./watchedhistory" className="list_item">
                          <i className="bi bi-clock-history"></i>
                            ประวัติการดู
                          </Nav.Link>
                        <Nav.Link href="./logout" onClick={logout } className="list_item">
                          <i className="bi bi-box-arrow-right"></i>
                            ล็อกเอาท์
                          </Nav.Link>
                    </Nav>
                </Offcanvas.Body>
            </Navbar.Offcanvas>
       </Container>     
  </Navbar>
))}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ทำการยืนยัน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          คุณต้องการล็อกเอาท์ใช่หรือไม่?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" style={{color:"white"}} onClick={handleLogoutConfirmed}>
            ล็อกเอาท์
          </Button>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            ยกเลิก
          </Button>
          
        </Modal.Footer>
      </Modal>
  
</> 
  );
}
export default Header;