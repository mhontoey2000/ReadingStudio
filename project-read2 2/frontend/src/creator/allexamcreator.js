import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Header from '../header';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import "../styles/allbookcreator.css"

function Allexamcreator() {
    const [items, setItems] = useState([]);
    const user = localStorage.getItem('email'); 

    useEffect(() => {
        axios.get('http://localhost:5004/api/allexamcreator?user_email=' + user)
          .then((response) => {
            console.log(response)
            setItems(response.data);
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
            <h1>ข้อสอบทั้งหมดของฉัน</h1>
            <table className="table table-hover">
                <thead>
                    <tr className="head" style={{ textAlign: "center"}}>
                        <th 
                         scope="col" 
                         className='t-size'
                         >
                            ลำดับ
                        </th>
                        <th 
                         scope="col" 
                         className='t-size'
                         >
                            หนังสือ
                        </th>
                        <th 
                         scope="col" 
                         className='t-size'
                         >
                            ตอน
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
                    {items.map((book) => (
                        <tr key={book.book_id}>
                            <td>{book.book_id}</td>
                            <td>{book.book_name}</td>
                            <td>{book.article_name}</td>
                            <td>
                                <img src={book.book_imagedata || book.book_image} width="100" height="100" />
                            </td>
                            <td>
                                {/* <a href={'/admin/book/edit/' + book.book_id} className="btn btn-primary">Edit</a> */}
                                <Link 
                                 className="btn btn-warning amt1"
                                 to={{ pathname: '/Page/articleedit', 
                                 state: { book_id: book.book_id } }}
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
  )
}

export default Allexamcreator