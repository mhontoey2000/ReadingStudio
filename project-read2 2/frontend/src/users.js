import * as React from 'react'
import { Datagrid, EmailField, List, TextField, EditButton } from 'react-admin';

export const UserList = props => (
    <List {...props}>
      <Datagrid>
        <TextField source="user_id" />
        <TextField source="user_name" />
        <TextField source="user_surname" />
        <EmailField source="user_email" />
        <TextField source="user_password" />
        <TextField source="admin_value" />
        <TextField source="user_type" />
        <EditButton basePath="http://localhost:5000/api/user" />
      </Datagrid>
    </List>
  );