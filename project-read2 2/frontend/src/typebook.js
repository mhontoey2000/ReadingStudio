import React, { useEffect, useState } from 'react';
import './styles/home.css';
import Header from './header';
import "bootstrap/dist/css/bootstrap.min.css";
import { AudioOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Input, Space } from 'antd';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Searchbar from './searchbar';



function Typebook() {

    const [items, setItems] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const location = useLocation();
    const articleLevel = location.state.article_level;

    useEffect(() => {
        axios.get(`http://localhost:5004/api/typebook/${articleLevel}`)
          .then((response) => {
            setItems(response.data);
            // setIsLoaded(true);
          })
          .catch((error) => {
            console.error(error);
          });
      }, [articleLevel]);

      const search = async (query) => {
        try {
          const response = await axios.get(`http://localhost:5004/api/book/search?query=${query}`);
          setSearchResults(response.data);
        } catch (error) {
          console.error(error);
        }
      };


    return (
    <div className="home">

            <Header/>


                <section >
                    <h1>เด็กระดับเล็ก</h1>

                    <div className="searchbar">
                      <Searchbar/>
                    </div>

                    <div>
                        <div className="grid-container">
                        
                        {items.map((article) => (
                            <div className="grid-item card" key={article.article_id}>
                                <img className="card-img-top img-fluid" src={article.article_images}/>
                                <h4 className="card-title" style={{margin:"10px"}}>{article.article_name}</h4>
                                <span className="card-text">{article.book_detail}</span>
                                <div>
                                  <Link to={{ pathname: "/Page/bookdetail", state: { article_id: article.article_id } }} className="button btn-primary">อ่าน</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    </div>
                </section>
            </div>
        );
    }
export default Typebook;
