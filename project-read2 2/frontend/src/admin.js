import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect } from 'react';
import axios from 'axios';

function Admin() {

    useEffect(() => {
      axios.get('http://localhost:5000/api/admin')
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);

  return (
    <div>admin</div>
  )
}

export default Admin;