import React, { useEffect, useState } from 'react';
import './styles/home.css';
import Header from './header';
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Searchbar from "./searchbar";

function Home() {

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
                    <h1>หนังสือ</h1>
                    
                      <Searchbar/>


                    {["admin", "creater"].includes(usertype) && (<div>
                    <div className="btnad d-grid d-md-flex justify-content-md-end">
                        <Button 
                          type="button" 
                          className="btn btn-success btnt"
                          href="./addbook"
                          >
                              เพิ่มหนังสือ
                          </Button>
                    </div>
                    </div>)}

                   
                        <div className="grid-container">
                        
                        {items.map((book) => (
                            <div className="grid-item card" key={book.book_id}>
                                <img className="card-img-top img-fluid simg" src={book.book_image}/>
                                <h4 className="card-title" style={{ fontWeight:"bold"}}>{book.book_name}</h4>
                                <span className="card-text" >{book.book_detail}</span>
                                <div>
                                  <div>
                                  <Link 
                                   to={{ pathname: "/Page/bookarticle", state: { book_id: book.book_id } }} 
                                   className="buttonh btn-primary"
                                   >
                                    อ่าน
                                  </Link>
                                  </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                </section>
            </div>
        );
    }
export default Home;