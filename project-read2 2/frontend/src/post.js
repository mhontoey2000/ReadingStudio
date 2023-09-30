import * as React from 'react'
import { 
    List, Datagrid, TextField, 
    ReferenceField, EditButton, 
    Edit, SimpleForm, ReferenceInput,
    SelectInput, TextInput, Create, Filter 
} from 'react-admin'

const PostTitle = ({ record }) => {
    return <span>Post {record ? `"${record.title}"` : ""}</span>;
}

const PostFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn/>
        <ReferenceInput label="user" source="user_id" reference="users" allowEmpty>
            <SelectInput optionText="name"/>
        </ReferenceInput>
    </Filter>
)

export const PostList = props => (
    <List filters={<PostFilter/>}{...props}>
        <Datagrid>
            <TextField source="id" />
            <ReferenceField source="userid" reference="user" >
                <TextField source="user_type"/>
            </ReferenceField>
            
            <TextField source="title" />
            <TextField source="body" />
            <EditButton/>
        </Datagrid>
    </List>
);


export const PostEdit = props => (
    <Edit title={<PostTitle/>} {...props}>
        <SimpleForm>
            <TextInput disabled source="id"/>
            <ReferenceInput source="user_id" reference="users" >
                <SelectInput optionText="name"/>
            </ReferenceInput>
            <TextInput source="title" />
            <TextInput multiline source="body" />
        </SimpleForm>
    </Edit>
);

export const PostCreate = props => (
    <Create {...props}>
        <SimpleForm>
            <ReferenceInput source="user_id" reference="users" >
                <SelectInput optionText="name"/>
            </ReferenceInput>
            <TextInput source="title" />
            <TextInput multiline source="body" />
        </SimpleForm>
    </Create>
);