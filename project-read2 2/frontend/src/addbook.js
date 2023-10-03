import React, { useEffect, useState } from 'react';
import './styles/addbook.css';
import Header from './header';
// import "bootstrap/dist/css/bootstrap.min.css";
import { AudioOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Input, Space } from 'antd';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { apiClient as helper } from './config';


function Addbook() {

    
    const [bookName, setBookName] = useState('');
    const [bookDetail, setBookDetail] = useState('');
    const [bookImage, setBookImage] = useState(null);
    const history = useHistory();

    const addBook = async () => {
        // Create a FormData object to send the data as a multipart/form-data request
       
        const data = {
          book_name: bookName,
          book_detail: bookDetail,
          book_image: bookImage ? await helper.convertImageToBase64(bookImage) : null
        };

        // Send a POST request to the backend API to add the book
        helper
          .post('api/addbook', data) // Replace '/api/addbook' with your actual API endpoint
          .then((response) => {
            // Handle a successful response here (e.g., show a success message)
            alert('Book added successfully');
            console.log('Book added successfully');
            // Optionally, you can clear the input fields and image after adding the book
            setBookName('');
            setBookDetail('');
            setBookImage(null);
          })
          .catch((error) => {
            // Handle errors here (e.g., show an error message)
            console.error('Error adding book:', error);
          });
      };
    
      const handleImageChange = (event) => {
        // Handle the image selection here and update the bookImage state
        const selectedImage = event.target.files[0];
        setBookImage(selectedImage);
      };

    const cancelBook = () => {
        history.goBack();
    }


  return (
    <div className="addbook">

            <Header/>


        <section>
            <h1>เพิ่มหนังสือ</h1> 

                <div className="grid-containerr">
                      <div className="fg"> 
                      <form className="form-group">
                          <h2>กรุณากรอกรายละเอียดหนังสือ</h2>
                                <div className="mb-3">
                                    <label htmlFor="name">ชื่อหนังสือ</label>
                                    <input 
                                      type="text"
                                      className ="form-control"  
                                      id="bookname" 
                                      placeholder="กรุณากรอกชื่อหนังสือ"
                                      required
                                      onChange={(event) => {
                                        setBookName(event.target.value)
                                      }}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label 
                                    className="form-label" 
                                    htmlFor="bookimage"
                                    >
                                        รูปหน้าปกหนังสือ
                                    </label>
                                    <input
                                      type="file"
                                      className="form-control"
                                      id="bookimage"
                                      accept="image/*"
                                      onChange={handleImageChange}
                                    />
                                    {bookImage && (
                                      <img
                                        src={URL.createObjectURL(bookImage)}
                                        alt="Uploaded Image"
                                        style={{ maxWidth: '100%', maxHeight: '200px' }}
                                      />
                                    )}
                                  </div>

                                <div className="mb-3">
                                    <label htmlFor="article_detail">เนื้อหาของหนังสือ</label>
                                    <textarea 
                                    type="text" 
                                    className="form-control"  
                                    id="article_detail" 
                                    placeholder="กรุณากรอกเนื้อหา"
                                    required
                                    onChange={(event) => {
                                        setBookDetail(event.target.value)
                                    }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <span style={{ fontStyle: "italic" }}>**ต้องสร้างหนังสือก่อนจึงจะสามารถสร้างบทต่างๆของหนังสือได้</span>
                                </div>

                                 <div className="btn-containerr">
                                    <div className="btn-group me-2">
                                        <Button 
                                         type="submit" 
                                         className="btn1 btn-warning"
                                         onClick={cancelBook}
                                        >
                                            ยกเลิก
                                        </Button>
                                    </div>
                                    <div className="btn-group me-2">
                                        <Button 
                                         type="submit" 
                                         className="btn1 btn-primary"
                                         onClick={addBook}
                                        >
                                            ยืนยัน
                                        </Button>
                                    </div>
                                    
                                    </div>

                        </form>
            </div>
        </div>


    </section>        
    
    </div>
  )
}

export default Addbook