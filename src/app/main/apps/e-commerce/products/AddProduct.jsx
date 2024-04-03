import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import FileUpload from 'react-material-file-upload';

import AWS from 'aws-sdk';
import { Link, useParams } from 'react-router-dom';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const S3_BUCKET = "datcarts-images"
const REGION = "ap-south-1"
AWS.config.update({
  accessKeyId:"AKIA6A2H6QBEFD2QWZIB",
  secretAccessKey: "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",
  region: REGION,
  signatureVersion: 'v4',
});


export default function FullScreenDialog(props) {
  const routeParams = useParams();
  const s3 = new AWS.S3();
  const [open, setOpen] = useState(false);
 
  const [logo, setLogo] = useState('');
  const [productDetails, setProductDetails] = useState({
    productName: '',
    category: '',
    price: '',
    stock: '',
    quantity: '',
    description: '',
    tags: [], 
    barcodeId:''
  });
  
  const [fieldValidity, setFieldValidity] = useState({
    productName: true,
    barcodeId:true,
    category: true,
    price: true,
    stock: true,
    quantity: true,
    description: true,
    tags: true,
  });


  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

const handleTagChange = (event, value) => {
  setTags(value);
};

const handleInputKeyDown = (event) => {
  if (event.key === 'Enter' && inputValue.trim() !== '') {
    setTags([...tags, inputValue.trim()]);
    setInputValue('');
  }
};

const handleTagDelete = (tag) => {
  const tagIndex = tags.indexOf(tag);
  if (tagIndex !== -1) {
    const updatedTags = [...tags];
    updatedTags.splice(tagIndex, 1);
    setTags(updatedTags);
  }
};


  const handleFileChange = async(e) => {
    
   

   const params = { 
    Bucket: S3_BUCKET, 
    Key: `${Date.now()}.${e[0].name}`, 
    Body: e[0]
  };
  try{
 
    const { Location } = await s3.upload(params).promise();
    setLogo(Location); // Update the logo state with the uploaded image URL
    
  }catch(err){
    console.log(err)
  }
  
  };
  

  const handleClose = () => {
    props.onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevProductDetails) => ({
      ...prevProductDetails,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Perform form validation
    let isValid = true;
    const updatedFieldValidity = { ...fieldValidity };
    const tagsArray = tags.map((tag) => tag); 

    for (const field in productDetails) {
      if (!productDetails[field]) {
        updatedFieldValidity[field] = false;
        isValid = false;
      }
    }

    setFieldValidity(updatedFieldValidity);

    if (isValid) {
      // Perform actions with the product details (e.g., save to database)
      let productData;
      const { storeId } = routeParams;
      let productImage = logo;
      if(!props.updated){
 

productData = { ...productDetails, productImage, storeId, tags: tagsArray };
      }else{
        productData = { ...productDetails, productImage, tags: tagsArray };      }
    
     
      props.submit(productData);
      handleClose();
    }
  };

  useEffect(() => {
    if (props.updated && props.data) {
      setProductDetails((prevProductDetails) => ({
        ...prevProductDetails,
        productName: props.data.productName || '',
        barcodeId: props.data.barcodeId || '',
        category: props.data.category || '',
        price: props.data.price || '',
        stock: props.data.stock || '',
        quantity: props.data.quantity || '', // Set the quantity field from props.data
        description: props.data.description || '', // Set the description field from props.data
      }));
  
      if (props.data.tags) {
        setTags(props.data.tags); // Update the tags state with props.data.tags
      }
  
      if (props.data.productImage) {
        setLogo(props.data.productImage);
      }
    }
  }, [props.updated, props.data]);
  

  return (
    <div>
      <Dialog
        fullScreen
        open={props.open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {props.button} Product
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              {props.button}
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm">
          <Stack spacing={1} justifyContent="space-between" sx={{ my: 3 }}>
            <Typography variant="h4">PRODUCT DETAILS</Typography>

            <TextField
              fullWidth
              type="text"
              label="Product Name"
              variant="outlined"
              name="productName"
              value={productDetails.productName}
              onChange={handleChange}
              required
              error={!fieldValidity.productName}
              helperText={!fieldValidity.productName && 'Product Name is required'}
            />

            <TextField
              fullWidth
              type="text"
              label="Category"
              variant="outlined"
              name="category"
              value={productDetails.category}
              onChange={handleChange}
              required
              error={!fieldValidity.category}
              helperText={!fieldValidity.category && 'Category is required'}
            />

            <TextField
              fullWidth
              type="number"
              label="Price"
              variant="outlined"
              name="price"
              value={productDetails.price}
              onChange={handleChange}
              required
              error={!fieldValidity.price}
              helperText={!fieldValidity.price && 'Price is required'}
            />

            <TextField
              fullWidth
              type="number"
              label="Stock"
              variant="outlined"
              name="stock"
              value={productDetails.stock}
              onChange={handleChange}
              required
              error={!fieldValidity.stock}
              helperText={!fieldValidity.stock && 'Stock is required'}
            />

<TextField
  fullWidth
  type="number"
  label="Quantity"
  variant="outlined"
  name="quantity"
  value={productDetails.quantity}
  onChange={handleChange}
  required
  error={!fieldValidity.quantity}
  helperText={!fieldValidity.quantity && 'Quantity is required'}
/>

<TextField
  fullWidth
  type="text"
  label="Description"
  variant="outlined"
  name="description"
  value={productDetails.description}
  onChange={handleChange}
  required
  error={!fieldValidity.description}
  helperText={!fieldValidity.description && 'Description is required'}
/>

<TextField
              fullWidth
              type="text"
              label="Barcode Id"
              variant="outlined"
              name="barcodeId"
              value={productDetails.barcodeId}
              onChange={handleChange}
              required
              error={!fieldValidity.barcodeId}
              helperText={!fieldValidity.barcodeId && 'Barcode Id is required'}
            />

<TextField
        label="Tags"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        variant="outlined"
        fullWidth
      />
      <div style={{ marginTop: '1rem' }}>
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            onDelete={() => handleTagDelete(tag)}
            style={{ margin: '0.5rem' }}
          />
        ))}
      </div>

{
  logo?(<><img src={logo} alt="Logo"  style={{ width: '200px', height: 'auto' }} />

  </>):(<>no image selected</>)
}


<FileUpload accept="image/*" onChange={handleFileChange} />
          </Stack>
        </Container>
      </Dialog>
    </div>
  );
}
