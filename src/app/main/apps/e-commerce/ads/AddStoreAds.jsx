import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import Slide from '@mui/material/Slide';
import Chip from '@mui/material/Chip';
import FileUpload from 'react-material-file-upload';

import AWS from 'aws-sdk';
import { useParams } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const S3_BUCKET = 'datcarts-images';
const REGION = 'ap-south-1';
AWS.config.update({
  accessKeyId: "AKIA6A2H6QBEFD2QWZIB",
  secretAccessKey: "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",
  region: REGION,
  signatureVersion: 'v4',
});

export default function AddStoreAds(props) {
  const routeParams = useParams();
  const { storeId } = routeParams;
  const s3 = new AWS.S3();
  const [open, setOpen] = useState(false);

  const [logo, setLogo] = useState('');
  const [productDetails, setProductDetails] = useState({
    title: '',
    tags: [],
    adType: '',
   
  });

  const [fieldValidity, setFieldValidity] = useState({
    title: true,
    tags: true,
    adType: true,
    regionId:true,
  });

  const [selectedLayout, setSelectedLayout] = useState(null);
  const [layouts, setLayouts] = useState([]); // State to store the list of layouts
  const [regionIds, setRegionIds] = useState([]); // State to store the list of region IDs

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

  const handleFileChange = async (e) => {
    const params = {
      Bucket: S3_BUCKET,
      Key: `${Date.now()}.${e[0].name}`,
      Body: e[0],
    };

    try {
      const { Location } = await s3.upload(params).promise();
      setLogo(Location); // Update the logo state with the uploaded image URL
    } catch (err) {
      console.log(err);
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
  
    for (const field in productDetails) {
      if (!productDetails[field] && field !== 'productId') {
        updatedFieldValidity[field] = false;
        isValid = false;
      } else {
        updatedFieldValidity[field] = true;
      }
    }
  
  
  
    setFieldValidity(updatedFieldValidity);

    if (isValid) {
      // Perform actions with the product details (e.g., save to database)
      const productData = { ...productDetails, storeId, tags, imageUrl: logo };
      props.submit(productData);
      handleClose();
    }
  };
  
  
   // Step 2: Fetch the list of layouts when the component mounts
   useEffect(() => {
    // Make an API call to fetch the list of layouts and update the layouts state
    // You should replace the placeholder with your actual API call
    axios.get('https://apis.datcarts.com/layout/'+storeId)
     
      .then((data) => {
        setLayouts(data.data.data.layouts);
      })
      .catch((error) => {
        console.error('Error fetching layouts:', error);
      });
  }, []); // Empty dependency array to fetch layouts once when the component mounts

  // Step 3: Fetch the list of region IDs when a layout is selected
  useEffect(() => {
    if (selectedLayout) {
      // Make an API call to fetch the list of region IDs for the selected layout
      // You should replace the placeholder with your actual API call
      axios.get('https://apis.datcarts.com/layout/getRegionByLayout/'+selectedLayout)
        .then((data) => {
          setRegionIds(data.data.data.regionIds);
        })
        .catch((error) => {
          console.error('Error fetching region IDs:', error);
        });
    }
  }, [selectedLayout]); // Trigger this effect when selectedLayout changes


  useEffect(() => {
    if (props.updated && props.data) {
      setProductDetails((prevProductDetails) => ({
        ...prevProductDetails,
        title: props.data.title || '',
        adType: props.data.adType || '',
        layoutId: props.data.layoutId || '',
        regionId: props.data.regionId || '',
        productId: props.data.productId || '',
        imageUrl: props.data.imageUrl || '',
      }));
  
      if (props.data.tags) {
        setTags(props.data.tags); // Update the tags state with props.data.tags
      }
  
      if (props.data.imageUrl) {
        setLogo(props.data.imageUrl);
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
              {props.button} Ad
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              {props.button}
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm">
          <Stack spacing={1} justifyContent="space-between" sx={{ my: 3 }}>
            <Typography variant="h4">AD DETAILS</Typography>

            <TextField
              fullWidth
              type="text"
              label="Title"
              variant="outlined"
              name="title"
              value={productDetails.title}
              onChange={handleChange}
              required
              error={!fieldValidity.title}
              helperText={!fieldValidity.title && 'Title is required'}
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
  {tags.map((tag, index) => (
    <Chip
      key={index} // Use the index as the key
      label={tag}
      onDelete={() => handleTagDelete(tag)}
      style={{ margin: '0.5rem' }}
    />
  ))}
</div>


            <TextField
  select
  fullWidth
  label="Ad Type"
  variant="outlined"
  name="adType"
  value={productDetails.adType}
  onChange={handleChange}
  required
  error={!fieldValidity.adType}
  helperText={!fieldValidity.adType && 'Ad Type is required'}
>
  <MenuItem value="carousel">Carousel</MenuItem>
  <MenuItem value="grid">Grid</MenuItem>
</TextField>



           
<TextField
        select
        fullWidth
        label="Layout"
        variant="outlined"
        name="layoutId"
        value={selectedLayout || '' || productDetails.adType}
        onChange={(e) =>{ setSelectedLayout(e.target.value)
        handleChange(e)
        }}
      >
        <MenuItem value="">Select a layout</MenuItem>
        {layouts.map((layout) => (
          <MenuItem key={layout._id} value={layout.layoutId}>
            {layout.layoutName} ({layout.layoutId})
          </MenuItem>
        ))}
      </TextField>


      <TextField
        select
        fullWidth
        label="Region Id"
        variant="outlined"
        name="regionId"
        value={productDetails.regionId}
        onChange={handleChange}
        required
        error={!fieldValidity.regionId}
        helperText={!fieldValidity.regionId && 'Region Id is required'}
      >
        <MenuItem value="">Select a region</MenuItem>
        {regionIds.map((regionId) => (
          <MenuItem key={regionId} value={regionId}>
            {regionId}
          </MenuItem>
        ))}
      </TextField>

            {logo ? (
              <img
                src={logo}
                alt="Product Logo"
                style={{ maxWidth: '100%', marginTop: '1rem' }}
              />
            ) : (<>no image selected</>)}
             
              <FileUpload
                accept=".jpg,.jpeg,.png"
                multiple={false}
                maxFileSize={5000000}
                textButton="Upload Product Logo"
                onError={(errMsg) => console.log(errMsg)}
                onChange={(fileList) => handleFileChange(fileList)}
              />
          
          </Stack>
        </Container>
      </Dialog>
    </div>
  );
}
