import React, { useState, useEffect } from 'react';
import "./styles/header.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {  Button, Card, Row, Col, Container, Nav, Navbar, Jumbotron} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Pass } from 'react-bootstrap-icons';



function Header() {

  const user = localStorage.getItem('email');
  const [firstname, setFirstname] = React.useState('');
  const [surname, setSurname] = React.useState('');
  const [isSticky, setIsSticky] = useState(false);
  const [usertype, setUsertype] = useState("")

  React.useEffect(() => {
    fetch('http://localhost:5004/api/userdata?user_email=' + user, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        // console.log(data)
        setFirstname(data[0].user_name);
        setSurname(data[0].user_surname);
        setUsertype(data[0].user_type);
      })
      .catch(error => console.error(error));
  }, [user]);


  const logout = (e) => {
    e.preventDefault();
    const confirmation = window.confirm("Are you sure you want to logout?");
    if (confirmation) {
      localStorage.clear();
      window.location.href = '/Page/login';
    }
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
              <p className="welcometext">ยินดีต้อนรับ,คุณ {firstname} {surname}</p>
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
                            Home
                          </Nav.Link>
                        <Nav.Link href="./profile" className="list_item">
                          <i className="bi bi-person"></i>
                            Profile
                          </Nav.Link>
                          {usertype === "admin" && (<Nav.Link href="./adminpage" className="list_item">
                          <i className="bi bi-person-workspace"></i>
                            Admin
                          </Nav.Link>)}
                          {usertype === "creator" && (<Nav.Link href="./creator" className="list_item">
                          <i className="bi bi-person-workspace"></i>
                            Creator
                          </Nav.Link>)}
                        <Nav.Link href="./logout" onClick={logout } className="list_item">
                          <i className="bi bi-box-arrow-right"></i>
                            Logout
                          </Nav.Link>
                    </Nav>
                </Offcanvas.Body>
            </Navbar.Offcanvas>
       </Container>     
  </Navbar>
))}
  
</> 
  );
}
export default Header;