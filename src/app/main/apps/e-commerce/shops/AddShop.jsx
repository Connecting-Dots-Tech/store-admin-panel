import * as React from 'react';
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
import Slide from '@mui/material/Slide';
import FileUpload from 'react-material-file-upload';
import AWS from 'aws-sdk';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const S3_BUCKET = "datcarts-images"
const REGION = "ap-south-1"
AWS.config.update({
  accessKeyId: "AKIA6A2H6QBEFD2QWZIB",
  secretAccessKey: "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",
  region: REGION,
  signatureVersion: 'v4',
});


export default function FullScreenDialog(props) {


 
    const s3 = new AWS.S3();
  const [open, setOpen] = React.useState(false);
  const [files, setFiles] = React.useState();
  const [logo,setLogo] = React.useState('')
  const [storeDetails, setStoreDetails] = React.useState({
    storeName: '',
    address: '',
    contactName: '',
    contactPhone: '',
    city: '',
    district: '',
  });
  const [fieldValidity, setFieldValidity] = React.useState({
    storeName: true,
    address: true,
    contactName: true,
    contactPhone: true,
    city: true,
    district: true,
  });

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
  // setImageUrl(Location);
  };
  

  



  const handleClose = () => {
    props.onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreDetails((prevStoreDetails) => ({
      ...prevStoreDetails,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Perform form validation
    let isValid = true;
    const updatedFieldValidity = { ...fieldValidity };

      // Validate contactPhone
      if (!/^\d{10}$/.test(storeDetails.contactPhone)) {
        updatedFieldValidity.contactPhone = false;
        isValid = false;
      }
  
      // Validate contactName, district, and storeName lengths
      const maxCharacterLimit = 20;
      if (storeDetails.contactName.length > maxCharacterLimit) {
        updatedFieldValidity.contactName = false;
        isValid = false;
      }
      if (storeDetails.district.length > maxCharacterLimit) {
        updatedFieldValidity.district = false;
        isValid = false;
      }
      if (storeDetails.storeName.length > maxCharacterLimit) {
        updatedFieldValidity.storeName = false;
        isValid = false;
      }

      
    for (const field in storeDetails) {
      if (!storeDetails[field]) {
        updatedFieldValidity[field] = false;
        isValid = false;
      }
    }

    setFieldValidity(updatedFieldValidity);

    if (isValid) {
 
      const storeData = { ...storeDetails, logo };
      props.submit(storeData)
      handleClose();
    }
  };


  React.useEffect(() => {
    if (props.updated && props.data) {
  
      setStoreDetails((prevStoreDetails) => ({
        ...prevStoreDetails,
        storeName: props.data.storeName || '',
        address: props.data.address || '',
        contactName: props.data.contactName || '',
        contactPhone: props.data.contactPhone || '',
        city: props.data.city || '',
        district: props.data.district || '',
      }));

      if (props.data.logo) {
        setLogo(props.data.logo);
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
              {props.button} Store
            </Typography>
            <Button autoFocus color="inherit" onClick={handleSubmit}>
              {props.button}
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm">
          <Stack spacing={1} justifyContent="space-between" sx={{ my: 3 }}>
            <Typography variant="h4">STORE DETAILS</Typography>

            <TextField
              fullWidth
              type="text"
              label="Store Name"
              variant="outlined"
              name="storeName"
              value={storeDetails.storeName}
              onChange={handleChange}
              required
              error={!fieldValidity.storeName}
              helperText={!fieldValidity.storeName && 'Store Name is required'}
              inputProps={{ maxLength: 20 }}
            />
            <TextField
              fullWidth
              type="text"
              label="Address"
              variant="outlined"
              name="address"
              value={storeDetails.address}
              onChange={handleChange}
              required
              error={!fieldValidity.address}
              helperText={!fieldValidity.address && 'Address is required'}
            />

            <TextField
              fullWidth
              type="text"
              label="Contact Name"
              variant="outlined"
              name="contactName"
              value={storeDetails.contactName}
              onChange={handleChange}
              required
              error={!fieldValidity.contactName}
              helperText={!fieldValidity.contactName && 'Contact Name is required'}
              inputProps={{ maxLength: 20 }}
            />

            <TextField
              fullWidth
              type="number"
              label="Mobile Number"
              variant="outlined"
              name="contactPhone"
              value={storeDetails.contactPhone}
              onChange={handleChange}
              required
              error={!fieldValidity.contactPhone}
              helperText={!fieldValidity.contactPhone && 'Error Occured'}
              inputProps={{ pattern: "\\d{10}", title: "Mobile Number must be 10 digits" }}
            />

            <TextField
              fullWidth
              type="text"
              label="City"
              variant="outlined"
              name="city"
              value={storeDetails.city}
              onChange={handleChange}
              required
              error={!fieldValidity.city}
              helperText={!fieldValidity.city && 'City is required'}
              inputProps={{ maxLength: 20 }}
            />

            <TextField
              fullWidth
              type="text"
              label="District"
              variant="outlined"
              name="district"
              value={storeDetails.district}
              onChange={handleChange}
              required
              error={!fieldValidity.district}
              helperText={!fieldValidity.district && 'District is required'}
              inputProps={{ maxLength: 20 }}
            />


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
