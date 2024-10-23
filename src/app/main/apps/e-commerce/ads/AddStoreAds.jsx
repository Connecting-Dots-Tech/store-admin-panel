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
import { toast } from 'react-toastify';
import axios from 'axios';
import Slide from '@mui/material/Slide';
import Chip from '@mui/material/Chip';
import FileUpload from 'react-material-file-upload';
import LinearProgress from '@mui/material/LinearProgress'; 
import Autocomplete from '@mui/lab/Autocomplete'; 
import AWS from 'aws-sdk';
import { useParams } from 'react-router-dom';
import { FormControl, InputLabel, OutlinedInput, Select } from '@mui/material';
import { Box } from '@mui/system';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const S3_BUCKET = 'datcarts-ad-images';
const REGION = 'us-east-1';
AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
  region: REGION,
  signatureVersion: 'v4',
});

export default function AddStoreAds(props) {
  const routeParams = useParams();
  const storeId  =  localStorage.getItem('storeId');
  const s3 = new AWS.S3();
  const [open, setOpen] = useState(false);

  const [progressImage, setProgressImage] = useState(0);
  const [progressPopup, setProgressPopup] = useState(0);
  const [progressCarousel, setProgressCarousel] = useState(0);
  
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingPopup, setIsUploadingPopup] = useState(false);
  const [isUploadingCarousel, setIsUploadingCarousel] = useState(false);
  
const [image,setImage] = useState('');
const [carousel,setCarousel] = useState('');
const [popup,setPopup] = useState('');
const [selectedRegions, setSelectedRegions] = useState([]);

  const [adDetails, setAdDetails] = useState({
    title: 'ad title',
    tags: [],
    adType: 'grid',
    layoutId: '',
    regionId: '',
    carouselUrl: '',
    popupUrl:'',
    imageUrl: '',
    validFrom: '',
    validTo: '',
    terms: 'terms and conditions',
    category: 'general',
    type: 'single',
    description: 'general description',
  });

  const [fieldValidity, setFieldValidity] = useState({
    title: true,
    tags: true,
    adType: true,
    carouselUrl: true,
    popupUrl: true,
    imageUrl: true,
    validFrom: true,
    validTo: true,
    terms: true,
    category: true,
    type: true,
    description: true,
  });

  const [selectedLayout, setSelectedLayout] = useState(null);
  const [layouts, setLayouts] = useState([]);
  const [regionIds, setRegionIds] = useState([]);

  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [productSuggestions, setProductSuggestions] = useState([]); 
  const [selectedProducts, setSelectedProducts] = useState([]); 
  const [selectedProductIds, setSelectedProductIds] = useState([]); 

  const formatDateTimeLocal = (date) => {
    console.log(date)
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);
    console.log(istDate.toISOString().slice(0, 16))
    return istDate.toISOString().slice(0, 16);
  };

  useEffect(() => {

    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    nextMonth.setHours(0, 0, 0, 0); 
    
    setAdDetails(prevDetails => ({
      ...prevDetails,
      validFrom: formatDateTimeLocal(now), 
      validTo: nextMonth.toISOString().split('T')[0] + 'T00:00', 
    }));
  
  }, []);
  
  
  
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

const handleFileChange = async (e, title) => {
  const params = {
    Bucket: S3_BUCKET,
    Key: `${Date.now()}.${e[0].name}`,
    Body: e[0],
  };

  // Start uploading and track progress based on the type
  if (title === 'imageUrl') setIsUploadingImage(true);
  if (title === 'popupUrl') setIsUploadingPopup(true);
  if (title === 'carouselUrl') setIsUploadingCarousel(true);

  try {
    const upload = s3.upload(params);

    upload.on('httpUploadProgress', (progress) => {
      const percent = Math.round((progress.loaded / progress.total) * 100);
      // Update progress for the correct file type
      switch (title) {
        case 'imageUrl':
          setProgressImage(percent);
          break;
        case 'popupUrl':
          setProgressPopup(percent);
          break;
        case 'carouselUrl':
          setProgressCarousel(percent);
          break;
        default:
          break;
      }
    });

    const { Location } = await upload.promise(); // Await the promise to finish the upload

    // Update the correct field based on the title
    if (title === "carouselUrl") setCarousel(Location);
    if (title === "popupUrl") setPopup(Location);
    if (title === "imageUrl") setImage(Location);

    setAdDetails((prevDetails) => ({
      ...prevDetails,
      [title]: Location, // Dynamically update the correct field
    }));
  } catch (err) {
    console.log("Error during upload:", err);
    toast.error("Error during upload");
  } finally {
    // Stop uploading and reset progress when upload completes
    if (title === 'imageUrl') {
      setIsUploadingImage(false);
      setProgressImage(0);
    }
    if (title === 'popupUrl') {
      setIsUploadingPopup(false);
      setProgressPopup(0);
    }
    if (title === 'carouselUrl') {
      setIsUploadingCarousel(false);
      setProgressCarousel(0);
    }
  }
};




  const handleClose = () => {
    props.onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(e.target)
    setAdDetails((prevAdDetails) => ({
      ...prevAdDetails,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Validate form fields
    console.log(adDetails)
    const newFieldValidity = {
      ...fieldValidity,
      title: !!adDetails.title,
      validFrom: !!adDetails.validFrom,
      validTo: !!adDetails.validTo,
      terms: !!adDetails.terms,
      category: !!adDetails.category,
      type: !!adDetails.type,
      description: !!adDetails.description,
    };
    console.log(newFieldValidity)

    setFieldValidity(newFieldValidity);

    const isValid = Object.values(newFieldValidity).every(Boolean);
 if(!image && !carousel && !popup ){
 
  console.log("Please upload an ad image");
  toast.error("Please upload an ad image")
  return false;
 }

    if (isValid) {
      console.log('Form Submitted', adDetails);
      const adData = { ...adDetails, storeId, tags, imageUrl: image,layoutId:selectedLayout,regionId:selectedRegions, carouselUrl: carousel, popupUrl: popup,productIds:selectedProductIds};
      props.submit(adData);
      handleClose();
    }else{
      console.log("Not Valid")
      toast.error("Field data missing")
    }
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_PRODUCTION_KEY}/layout/${storeId}`)
      .then((response) => {
        const fetchedLayouts = response.data.data.layouts;
        setLayouts(fetchedLayouts);

    
        if (fetchedLayouts.length > 0) {
          const firstLayoutId = fetchedLayouts[0].layoutId;
          setSelectedLayout(firstLayoutId);
          
          return axios.get(`${process.env.REACT_APP_PRODUCTION_KEY}/layout/getRegionByStoreId/${firstLayoutId}/${storeId}`);
        }
      })
      .then((regionResponse) => {
        if (regionResponse) {
          setRegionIds(regionResponse.data.data.regionIds);
        }
      })
      .catch((error) => {
        console.error('Error fetching layouts or region IDs:', error);
        toast.error("Error fetching layouts or region IDs")
      });
  }, [selectedLayout,storeId]);


  useEffect(() => {

    const now = new Date();

 
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    nextMonth.setHours(0, 0, 0, 0); 
  
    // const formatDateTimeLocal = (date) => {
    //   return date.toISOString().slice(0, 16); 
    // };

    if (props.updated && props.data) {
      setAdDetails((prevAdDetails) => ({
        ...prevAdDetails,
        title: props.data.title || 'title',
        adType: props.data.adType || '',
        layoutId: props.data.layoutId || '',
        productId: props.data.productId || '',
        imageUrl: props.data.imageUrl || '',
        validFrom: props.data.validFrom
        ? formatDateTimeLocal(new Date(props.data.validFrom))
        : formatDateTimeLocal(now),
      validTo: props.data.validTo
        ? formatDateTimeLocal(new Date(props.data.validTo))
        : formatDateTimeLocal(nextMonth),
      //  validFrom: props.data.validFrom
      //   ? formatDateTimeLocal(new Date(props.data.validFrom))
      //   : formatDateTimeLocal(now), 
      // validTo: props.data.validTo
      //   ? formatDateTimeLocal(new Date(props.data.validTo)) 
      //   : nextMonth.toISOString().split('T')[0] + 'T00:00',
        terms: props.data.terms || 'terms and conditions',
        category: props.data.category || 'general',
        type: props.data.type || '',
        description: props.data.description || 'general description',
      }));
      setSelectedRegions(props.data.regionId || [])

      if (props.data.tags) {
        setTags(props.data.tags); // Update the tags state with props.data.tags
      }

      if (props.data.imageUrl) {
        setImage(props.data.imageUrl);
      }

      if (props.data.carouselUrl) {
        setCarousel(props.data.carouselUrl);
      }
      if(props.data.popupUrl){
        setPopup(props.data.popupUrl);
      }
    }
  }, [props.updated, props.data]);


  const fetchProductSuggestions = async (query) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_PRODUCTION_KEY}/products/search-products-admin/${storeId}/${query}`);
      console.log(response.data.data.products)
      setProductSuggestions(response.data.data.products); // Assuming response contains product list
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error("Error fetching products");
    }
  };
  const handleProductSearch = (event, value) => {
    if (value) {
      fetchProductSuggestions(value);
    }
  };
  const handleProductSelection = (event, newValue) => {
    console.log(newValue)
    const uniqueProducts = newValue.filter(
      (product) => !selectedProducts.some((selected) => selected._id === product._id)
    );
    
    setSelectedProducts((prevSelected) => [
      ...prevSelected,
      ...uniqueProducts,
    ]);
    setSelectedProductIds((prevIds) => [
      ...prevIds,
      ...uniqueProducts.map(product => product._id),
    ]);
    console.log(selectedProductIds)
  };



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
              value={adDetails.title}
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
                  key={index}
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
              value={adDetails.adType}
              onChange={handleChange}
              required
              error={!fieldValidity.adType}
              helperText={!fieldValidity.adType && 'Ad Type is required'}
            >
              <MenuItem value="carousel">Carousel</MenuItem>
              <MenuItem value="grid">Grid</MenuItem>
              <MenuItem value="popup">Popup</MenuItem>
            </TextField>

            <TextField
      select
      fullWidth
      label=""
      variant="outlined"
      name="layoutId"
      value={selectedLayout} // Set value to the selected layout
      onChange={handleChange} // Handle changes
    >
      {/* Display a placeholder if no layouts are available */}
      {layouts.length === 0 ? (
        <MenuItem disabled value="">
          No layouts available
        </MenuItem>
      ) : (
        <MenuItem key={layouts[0].layoutId} value={layouts[0].layoutId} disabled>
          {layouts[0].layoutName} {/* Show the first layout */}
        </MenuItem>
      )}
      {layouts.slice(1).map((layout, index) => (
        <MenuItem key={index} value={layout.layoutId}>
          {layout.layoutName}
        </MenuItem>
      ))}
    </TextField>

    <FormControl fullWidth variant="outlined">
  <InputLabel id="region-select-label">Region ID</InputLabel>
  <Select
    labelId="region-select-label"
    id="region-select"
    multiple
    value={selectedRegions}
    onChange={(e) => setSelectedRegions(e.target.value)}
    input={<OutlinedInput label="Region ID" />}
    renderValue={(selected) => (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, padding: '8px' }}>
        {selected.map((value) => (
          <Chip key={value} label={value} sx={{ margin: '2px' }} />
        ))}
      </Box>
    )}
    MenuProps={{
      PaperProps: {
        style: {
          maxHeight: 48 * 4.5 + 8, // Adjust the height of the dropdown
        },
      },
    }}
  >
    {regionIds.map((regionId, index) => (
      <MenuItem key={index} value={regionId}>
        {regionId}
      </MenuItem>
    ))}
  </Select>
</FormControl>


            {/* File Upload for imageUrl */}
            <FileUpload
              value={adDetails.imageUrl ? [adDetails.imageUrl] : []}
              onChange={(file) => handleFileChange(file, 'imageUrl')}
              title="Upload Image"
            />
            {image && (
    <div>
      <h4>Ad Preview:</h4>
      <img src={image} alt="Ad Preview" style={{ width: '100%', maxHeight: '100px', objectFit: 'contain' }} />
    </div>
  )}

{isUploadingImage && (
  <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
    <LinearProgress
      variant="determinate"
      value={progressImage}
      style={{ flexGrow: 1, marginRight: '10px' }}
    />
    <Typography variant="body2" color="textSecondary">
      {`${progressImage}%`}
    </Typography>
  </div>
)}






            {/* File Upload for carousel */}
            <FileUpload
              value={adDetails.carouselUrl ? [adDetails.carouselUrl] : []}
              onChange={(file) => handleFileChange(file, 'carouselUrl')}
              title="Upload carousel"
            />

{carousel && (
    <div>
      <h4>Carousel Preview:</h4>
      <img src={carousel} alt="carousel Preview" style={{ width: '100%', maxHeight: '100px', objectFit: 'contain' }} />
    </div>
  )}




{isUploadingCarousel && (
  <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
    <LinearProgress
      variant="determinate"
      value={progressCarousel}
      style={{ flexGrow: 1, marginRight: '10px' }}
    />
    <Typography variant="body2" color="textSecondary">
      {`${progressCarousel}%`}
    </Typography>
  </div>
)}

  {/* File Upload for popup */}
  <FileUpload
              value={adDetails.popupUrl ? [adDetails.popupUrl] : []}
              onChange={(file) => handleFileChange(file, 'popupUrl')}
              title="Upload popup"
            />

{isUploadingPopup && (
  <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
    <LinearProgress
      variant="determinate"
      value={progressPopup}
      style={{ flexGrow: 1, marginRight: '10px' }}
    />
    <Typography variant="body2" color="textSecondary">
      {`${progressPopup}%`}
    </Typography>
  </div>
)}

{popup && (
    <div>
      <h4>popup Preview:</h4>
      <img src={popup} alt="carousel Preview" style={{ width: '100%', maxHeight: '100px', objectFit: 'contain' }} />
    </div>
  )}


          <TextField
  fullWidth
  type="datetime-local"
  label="Valid From"
  variant="outlined"
  name="validFrom"
  value={adDetails.validFrom}
  onChange={handleChange}
  error={!fieldValidity.validFrom}
  helperText={!fieldValidity.validFrom && 'Valid From date is required'}
  InputLabelProps={{ shrink: true }}
/>

<TextField
  fullWidth
  type="datetime-local"
  label="Valid To"
  variant="outlined"
  name="validTo"
  value={adDetails.validTo}
  onChange={handleChange}
  error={!fieldValidity.validTo}
  helperText={!fieldValidity.validTo && 'Valid To date is required'}
  InputLabelProps={{ shrink: true }}
/>
            <TextField
              fullWidth
              type="text"
              label="Terms"
              variant="outlined"
              name="terms"
              value={adDetails.terms}
              onChange={handleChange}
              error={!fieldValidity.terms}
              helperText={!fieldValidity.terms && 'Terms are required'}
            />

            <TextField
              fullWidth
              type="text"
              label="Category"
              variant="outlined"
              name="category"
              value={adDetails.category}
              onChange={handleChange}
              error={!fieldValidity.category}
              helperText={!fieldValidity.category && 'Category is required'}
            />



            <TextField
            select
              fullWidth
              type="text"
              label="Type"
              variant="outlined"
              name="type"
              value={adDetails.type}
              onChange={handleChange}
              error={!fieldValidity.type}
              helperText={!fieldValidity.type && 'Type is required'}
              >
              <MenuItem value="multi">Multi Ad</MenuItem>
              <MenuItem value="single">Single Ad</MenuItem>
            
            </TextField>

            <TextField
              fullWidth
              type="text"
              label="Description"
              variant="outlined"
              name="description"
              value={adDetails.description}
              onChange={handleChange}
              error={!fieldValidity.description}
              helperText={!fieldValidity.description && 'Description is required'}
            />


<Autocomplete
            multiple
            options={productSuggestions} // The list of products to choose from
            getOptionLabel={(option) => option.productName } // Assuming products have a 'name' field
            onInputChange={handleProductSearch} // Called when the user types in the search box
            onChange={handleProductSelection} // Called when products are selected
            value={selectedProducts} // The currently selected products
            renderInput={(params) => <TextField {...params} label="Products" placeholder="Search products" />}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip key={option._id} label={option.productName } {...getTagProps({ index })} />
              ))
            }
          />
            {/* <FileUpload
              value={logo ? [logo] : []}
              onChange={handleFileChange}
              title="Upload Image"
            /> */}
          </Stack>
        </Container>
      </Dialog>
    </div>
  );
}
