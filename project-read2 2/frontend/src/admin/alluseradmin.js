import React, { useState, useEffect } from 'react';
import Header from '../header';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const Alluseradmin = () => {
    const [user, setUser] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get('http://localhost:5004/api/user')
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                setError(error);
            });
    }

    const deleteUser = (userId) => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        
        if (confirmed) {
            axios.delete(`http://localhost:5004/api/user/${userId}`)
                .then(response => {
                    console.log(`User with ID ${userId} has been deleted.`);
                    // Refresh the user list after deletion
                    fetchUsers();
                })
                .catch(error => {
                    console.error(`Error deleting user with ID ${userId}: ${error}`);
                });
        }
    }

    return (
        <div>
            
            <Header />

            <section>
            <div className="grid-containerr">
                <div className="row">
                    <div className="col-12">
                        <h1 className="text-center">บัญชีผู้ใช้ทั้งหมด</h1>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Username</th>
                                    <th>Usersurname</th>
                                    <th>UserEmail</th>
                                    <th>UserType</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {user.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.user_id}</td>
                                            <td>{item.user_name}</td>
                                            <td>{item.user_surname}</td>
                                            <td>{item.user_email}</td>
                                            <td>{item.user_type}</td>
                                            <td>
                                                <Button
                                                 className="btn btn-danger" 
                                                 onClick={() => deleteUser(item.user_id)}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                }
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            </section>
        </div>
    );
}

export default Alluseradmin;