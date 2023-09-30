import React, { useState } from 'react'
import "./styles/search.css";
import { Search } from 'react-bootstrap-icons';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';

function Searchbar() {

    const [ value, setValue ] = useState("");
    const [items, setItems] = useState([]);

    const onChange = (event) => {
        setValue(event.target.value);
    }

    const onSearch = (SearchTerm) => {
        setValue(SearchTerm);
        //our api to fetch the search result
        console.log("search", SearchTerm);
    }

  return (
    <div className="searchbar-container">

        <div className="search-inner">
            <input 
                type="text" 
                value={value} 
                className="form-control me-2" 
                placeholder="ค้นหา"
                onChange={onChange} 
            />
            <Button onClick={()=>onSearch(value)} className="btn btn-primary">Search</Button>
        </div>

        <div className="dropdown">
            {items.filter(items => {
                const searchTerm = value.toLowerCase();
                const article_name = items.article_name.toLowerCase();

                return (searchTerm && article_name.startsWith(searchTerm) 
                && article_name !== searchTerm);
            }).slice(0,5)
            .map((article) => (
                <div
                    onClick={() => onSearch(items.article_name)} 
                    className="dropdown-row"
                    key={article.article_id}
                    >
                        {items.article_name}
                </div> ))}
        </div>
    </div>
  )
}

export default Searchbar