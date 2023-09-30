import * as React from 'react'
import { Admin, Resource } from 'react-admin'
import jsonServerProvider from 'ra-data-json-server'
import { UserList } from './users'
import { PostList, PostEdit, PostCreate } from './post'

const dataProvider = jsonServerProvider('http://localhost:5000/api/user');


const Adminpage = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="users" list={UserList}/>
        <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate}/>
    </Admin>
)


export default Adminpage;