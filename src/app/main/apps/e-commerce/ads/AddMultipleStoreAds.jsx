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

export default function AddMultipleStoreAds(props) {
  const routeParams = useParams();
  const { storeId } = routeParams;
  const s3 = new AWS.S3();
  const [open, setOpen] = useState(false);

  const [progressImage, setProgressImage] = useState(0);
  const [progressPopup, setProgressPopup] = useState(0);
  const [progressCarousel, setProgressCarousel] = useState(0);
  
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingPopup, setIsUploadingPopup] = useState(false);
  const [isUploadingCarousel, setIsUploadingCarousel] = useState(false);
  
  const [images, setImages] = useState([]); 

  const [image,setImage] = useState('');
  const [carousel,setCarousel] = useState('');
  const [popup,setPopup] = useState('');
  const [selectedRegions, setSelectedRegions] = useState([]);

  const [adDetails, setAdDetails] = useState({
    title: 'multi upload',
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
  const [layouts, setLayouts] = useState([]); // State to store the list of layouts
  const [regionIds, setRegionIds] = useState([]); // State to store the list of region IDs

  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');


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
    const files = e; // e will now contain an array of files
    const uploadPromises = files.map(async (file) => {
      const params = {
        Bucket: S3_BUCKET,
        Key: `${Date.now()}-${file.name}`, // Ensure unique keys for each file
        Body: file,
      };
  
      // Track progress for each file
      if (title === 'imageUrl') setIsUploadingImage(true);
      if (title === 'popupUrl') setIsUploadingPopup(true);
      if (title === 'carouselUrl') setIsUploadingCarousel(true);
  
      try {
        const upload = s3.upload(params);
        upload.on('httpUploadProgress', (progress) => {
          const percent = Math.round((progress.loaded / progress.total) * 100);
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
  
        const { Location } = await upload.promise();
        if (title === "imageUrl") {
          setImages(prevImages => [...prevImages, Location]); // Add to images array
        }
        setAdDetails((prevDetails) => ({
          ...prevDetails,
          [title]: Location, 
        }));
      } catch (err) {
        console.log("Error during upload:", err);
        toast.error("Error during upload");
      } finally {
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
    });
  
    // Wait for all uploads to finish
    await Promise.all(uploadPromises);
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
    if (images.length === 0) {
      console.log("Please upload at least one ad image");
      toast.error("Please upload at least one ad image");
      return false;
    }


    if (isValid) {

      const adDataArray = images.map((image) => ({
        ...adDetails,
        storeId,
        tags,
        imageUrl: image, // Each image for each submission
        layoutId: selectedLayout,
        regionId: selectedRegions,
        carouselUrl: carousel
      }));
  
      console.log(adDataArray)
      props.submit(adDataArray);
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
              {props.button} Multiple Ad
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

            {/* <TextField
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
            </div> */}

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

          


  <FileUpload
  value={images.length ? images : []} // Display uploaded images
  onChange={(files) => handleFileChange(files, 'imageUrl')}
  title="Upload Images" // Change the title to indicate multiple uploads
/>
{images.length > 0 && (
  <div>
    <h4>Ad Previews:</h4>
    {images.map((image, index) => (
      <img key={index} src={image} alt={`Ad Preview ${index + 1}`} style={{ width: '100%', maxHeight: '100px', objectFit: 'contain' }} />
    ))}
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
 
          </Stack>
        </Container>
      </Dialog>
    </div>
  );
}
