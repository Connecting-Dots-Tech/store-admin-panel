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
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { Link, useParams } from 'react-router-dom';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});




export default function FullScreenDialog(props) {
  const routeParams = useParams();
  const s3 = new AWS.S3();
  const [open, setOpen] = useState(false);
 
  const [logo, setLogo] = useState('');
 
  const [deviceDetails, setDeviceDetails] = useState({
    deviceName: '',
    deviceID: '',
    appVersion: '',
    details: '',

   
  });
  
  const [fieldValidity, setFieldValidity] = useState({
    deviceName: true,
    deviceID: true,
    appVersion: true,
    details: true
  });



  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };





const [status, setStatus] = React.useState('Active');

const handleStatusChange = (event) => {
  setStatus(event.target.value);
};
  const handleClose = () => {
    props.onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeviceDetails((prevDeviceDetails) => ({
      ...prevDeviceDetails,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Perform form validation
    let isValid = true;
    const updatedFieldValidity = { ...fieldValidity };


    for (const field in deviceDetails) {
      if (!deviceDetails[field]) {
        updatedFieldValidity[field] = false;
        isValid = false;
      }
    }

    setFieldValidity(updatedFieldValidity);

    if (isValid) {
      // Perform actions with the product details (e.g., save to database)
      let productData;
      const { storeId } = routeParams;
     
      if(!props.updated){
 

productData = { ...deviceDetails, storeId,status };
      }else{
        productData = { ...deviceDetails,status};      }
    
     
      props.submit(productData);
      handleClose();
    }
  };

  useEffect(() => {
    if (props.updated && props.data) {
      setDeviceDetails((prevDeviceDetails) => ({
        ...prevDeviceDetails,
        deviceName: props.data.deviceName || '',
        deviceID: props.data.deviceID || '',
        appVersion: props.data.appVersion || '',
        details: props.data.details || '',
      }));

     
  setStatus(props.data.status)
 
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
              {props.button} Device
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              {props.button}
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm">
          <Stack spacing={1} justifyContent="space-between" sx={{ my: 3 }}>
            <Typography variant="h4">DEVICE DETAILS</Typography>

            <TextField
              fullWidth
              type="text"
              label="device Name"
              variant="outlined"
              name="deviceName"
              value={deviceDetails.deviceName}
              onChange={handleChange}
              required
              error={!fieldValidity.deviceName}
              helperText={!fieldValidity.deviceName && 'Device Name is required'}
            />

            <TextField
              fullWidth
              type="text"
              label="deviceID"
              variant="outlined"
              name="deviceID"
              value={deviceDetails.deviceID}
              onChange={handleChange}
              required
              error={!fieldValidity.deviceID}
              helperText={!fieldValidity.deviceID && 'deviceID is required'}
            />

            <TextField
              fullWidth
              type="text"
              label="app Version"
              variant="outlined"
              name="appVersion"
              value={deviceDetails.appVersion}
              onChange={handleChange}
           
              error={!fieldValidity.appVersion}
              helperText={!fieldValidity.appVersion && 'app Version is required'}
            />

            <TextField
              fullWidth
              type="text"
              label="details"
              variant="outlined"
              name="details"
              value={deviceDetails.details}
              onChange={handleChange}
              required
              error={!fieldValidity.details}
              helperText={!fieldValidity.details && 'details is required'}
            />



<FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={status}
          label="Age"
          onChange={handleStatusChange}
        >
          <MenuItem value={"Active"}>Active</MenuItem>
          <MenuItem value={"nactive"}>Inactive</MenuItem>
        </Select>
      </FormControl>

          </Stack>
        </Container>
      </Dialog>
    </div>
  );
}
