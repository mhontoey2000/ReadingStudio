import React, { useState } from 'react';
import "./styles/search.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

function Searchbar(props) {
    const [input, setInput] = useState("");

    const handleInputChange = (e) => {
        const searchTerm = e.target.value;
        setInput(searchTerm);

        // Pass the search term to the parent component (Home) for real-time updates
        props.onSearch(searchTerm);
    }

    return (
        // input-wrapper
        <div className="">
            <div className="search-inner">
                <input
                    placeholder="ค้นหา"
                    value={input}
                    className="form-control1"
                    onChange={handleInputChange}
                />
            </div>
        </div>
    );
}

export default Searchbar;
