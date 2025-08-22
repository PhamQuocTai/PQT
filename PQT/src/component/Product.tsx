import { 
    Create, 
    Datagrid, 
    DeleteButton, 
    Edit, 
    List, 
    NumberField, 
    NumberInput, 
    ReferenceInput, 
    SelectInput, 
    SimpleForm, 
    TextField, 
    TextInput, 
    useRecordContext,
    ImageInput,
    ImageField
} from "react-admin";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import React from 'react';
import { Button } from '@mui/material';

// Nút Edit tùy chỉnh
const CustomEditButton = () => {
    const record = useRecordContext();
    const navigate = useNavigate();

    const handleEdit = (event: React.MouseEvent) => {
        event.stopPropagation();
        navigate(`/products/${record.productId}/edit`);
    };

    return (
        <Button onClick={handleEdit} variant="contained" color="primary">
            Edit
        </Button>
    );
};

// Field hiển thị ảnh với link cập nhật
const CustomImageField = ({ source }: { source: string }) => {
    const record = useRecordContext();

    if (!record || !record[source]) {
        return <span>No Image</span>;
    }

    return (
        <RouterLink 
            to={`/products/${record.productId}/update-image`}
            onClick={(event) => event.stopPropagation()}
        >
            <img 
                src={record[source]} 
                alt="Product" 
                style={{ width: "100px", height: "auto", cursor: "pointer" }} 
            />
        </RouterLink>
    );
};

// Bộ lọc tìm kiếm
const postFilters = [
    <TextInput key="search" source="search" label="Search" alwaysOn />,
    <ReferenceInput key="categoryId" source="categoryId" reference="categories" label="Category">
        <SelectInput optionText="name" />
    </ReferenceInput>
];

export const ProductList = () => (
    <List filters={postFilters}>
        <Datagrid rowClick="edit">
            <TextField source="productId" label="Product ID" />
            <TextField source="productName" label="Product Name" />
            <TextField source="category.categoryName" label="Category Name" />
            <CustomImageField source="image" />
            <TextField source="description" label="Description" />
            <NumberField source="quantity" label="Quantity" />
            <NumberField source="price" label="Price" />
            <NumberField source="discount" label="Discount" />
            <NumberField source="specialPrice" label="Special Price" />
            <CustomEditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const ProductCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="productName" />
            <TextInput source="description" multiline rows={4} fullWidth />
            <NumberInput source="quantity" label="Quantity" />
            <NumberInput source="price" label="Price" />
            <NumberInput source="discount" label="Discount" />
            <NumberInput source="specialPrice" label="Special Price" />
            <ReferenceInput source="categoryId" reference="categories">
                <SelectInput optionText="name" />
            </ReferenceInput>

            {/* Upload ảnh với accept kiểu object */}
            <ImageInput 
                source="image" 
                label="Upload Image" 
                accept={{ 'image/*': [] }}
            >
                <ImageField source="src" title="title" />
            </ImageInput>
        </SimpleForm>
    </Create>
);

export const ProductEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="productId" disabled />
            <ReferenceInput source="categoryId" reference="categories" label="Category">
                <SelectInput optionText="categoryName" />
            </ReferenceInput>
            <TextInput source="productName" />
            <TextInput source="description" multiline rows={4} fullWidth />
            <NumberInput source="quantity" />
            <NumberInput source="price" />
            <NumberInput source="discount" />
            <NumberInput source="specialPrice" />

            {/* Cập nhật ảnh cũng phải đổi accept */}
            <ImageInput 
                source="image" 
                label="Update Image" 
                accept={{ 'image/*': [] }}
            >
                <ImageField source="src" title="title" />
            </ImageInput>
        </SimpleForm>
    </Edit>
);
