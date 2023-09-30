import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Header from '../header';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import "../styles/alladmin.css"

const Allarticleadmin = () => {
    const [book, setBook] = useState([]);
    const [error, setError] = useState('');
    const [items, setItems] = useState([]);
    
      useEffect(() => {
        axios.get('http://localhost:5004/api/article')
          .then((response) => {
            setItems(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      }, []);

      useEffect(() => {
        axios.get('http://localhost:5004/api/book')
          .then((response) => {
            setBook(response.data);
            console.log(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      }, []);
      

    return (
        <div>
            <Header />
            <section>
            <div className="grid-containerr">
            <h1>บททั้งหมด</h1>
            
            <table className="table table-hover">
                <thead>
                    <tr className="head" style={{ textAlign: "center"}}>
                        <th 
                         scope="col" 
                         className='t-size'
                         >
                            ID
                        </th>
                        <th 
                         scope="col" 
                         className='t-size'
                         >
                            ชื่อหนังสือ
                        </th>
                        <th 
                         scope="col" 
                         className='t-size'
                         >
                            ชื่อบท
                        </th>
                        <th
                         scope="col" 
                         className='t-size'
                         >
                            รูปหน้าปกหนังสือ
                        </th>
                        <th 
                         scope="col" 
                         className='t-size'
                         >
                            แก้ไข
                        </th>
                        <th
                         scope="col" 
                         className='t-size'
                         >
                            ลบ
                        </th>

                    </tr>
                </thead>
                <tbody className="table-group-divider">
                    {items.map((article) => (
                        <tr key={article.article_id}>
                            <td>{article.article_id}</td>
                            <td></td>
                            <td>{article.article_name}</td>
                            <td>
                                <img src={article.article_images} alt="book_image" width="100" height="100" />
                            </td>
                            <td>
                                {/* <a href={'/admin/book/edit/' + book.book_id} className="btn btn-primary">Edit</a> */}
                                <Link 
                                 className="btn btn-warning amt1"
                                 to={{ pathname: '/Page/editarticle', 
                                 state: {  } }}
                                >
                                 แก้ไข
                                 </Link>
                            </td>
                            <td>
                                <Button
                                 className="btn btn-danger amt2" 
                                 //onClick={() => deleteBook(book.book_id)}
                                 >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
            </div>
            </section>
        </div>
    );

}

export default Allarticleadmin;