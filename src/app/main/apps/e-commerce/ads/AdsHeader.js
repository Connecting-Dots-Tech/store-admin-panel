import Button from '@mui/material/Button';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import axios from 'axios';
import AddStoreAds from './AddStoreAds';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { toast } from 'react-toastify';
import { useAuth } from '../../../../auth/AuthContext';
import AddMultipleStoreAds from './AddMultipleStoreAds';
function AdsHeader(props) {
//  const { userRole } = useUserRole();
const { isStoreAdmin  } = useAuth();

const [dialog, setDialog] = useState("");
const [multiDialog, setMultiDialog] = useState("");
const [multiAdOpen,setMultiAdOpen] = useState(false);
const [open,setOpen] = useState(false);
const [adType, setAdType] = useState("all");
const [removeDialog, setRemoveDialog] = useState("");
const [removeOpen,setRemoveOpen] = useState(false);
const navigate = useNavigate();  
console.log("heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeyyyyyyy")

//console.log(userRole)
const handleRemoveClose = () => {
  setRemoveOpen(false);
};


const handleAdTypeChange = (event) => {
  setAdType(event.target.value);
};

const handleMultiAdClose =() => {
  setMultiDialog()
  setMultiAdOpen(false)
}

const handleMultiAdd = (e, upd = Boolean(false), button = 'ADD', data = {}) => {
   
  setMultiAdOpen(true);
  const add = (dataArray) => {
    setMultiDialog();
  
    if (!upd) {
      handleMultiAdClose();
  
      Promise.all(
        dataArray.map((data) =>
          axios.post(process.env.REACT_APP_PRODUCTION_KEY + '/ads', data)
        )
      )
        .then((responses) => {
          toast.success("All ads uploaded successfully");
          props.getAds(undefined, undefined, true);
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.response?.data?.message || "Error uploading ads");
        });
    }
  };
  
  setMultiDialog(() => (
       
    <AddMultipleStoreAds
      onClose={handleMultiAdClose}
      open={true}
       submit={add}
       updated={upd}
       button={button}
       data={data}
    />
   
  ));
};

const handleClose =() => {
  setDialog()
  setOpen(false)
}
  const handleAdd = (e, upd = Boolean(false), button = 'ADD', data = {}) => {
   
    setOpen(true);
    const add = (data) => {
    
      setDialog();
      if(!upd){
 
        handleClose();
        
       
        axios.post(process.env.REACT_APP_PRODUCTION_KEY+'/ads',data).then((res)=>{
          toast.success("Ad Uploaded");

          props.getAds(undefined, undefined, true)
        }).catch((err)=>{
          console.log(err);
          console.log("--------------------------------all")
          toast.error(err.response.data.message);

        })
      }
      //   display();
      
    };
    setDialog(() => (
         
      <AddStoreAds
        onClose={handleClose}
        open={true}
         submit={add}
         updated={upd}
         button={button}
         data={data}
      />
     
    ));
  };



  const handleRemoveAllAds = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_PRODUCTION_KEY}/ads/delete-all-ads/${props.storeId}/${adType}`);
      props.getAds(undefined, undefined, true);
      handleRemoveClose(); // Close the dialog after successful removal
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">

{multiDialog}
      {dialog}
      <Typography
        component={motion.span}
        initial={{ x: -20 }}
        animate={{ x: 0, transition: { delay: 0.2 } }}
        delay={300}
        className="text-24 md:text-32 font-extrabold tracking-tight"
      >
        Ads
      </Typography>

      <div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">
      
    <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
        >
          <Button
            size="small"
            variant="contained"
            style={{ backgroundColor: '#ef5350', color: '#ffffff' }}
            onClick={() => setRemoveOpen(true)} 
          >
            Remove All
          </Button>
        </motion.div>

<motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
        >
          <Button
            className=""
          onClick={()=>{
            navigate('/apps/e-commerce/adlogs/'+props.storeId);
          }}
          size="small" 
            variant="contained"
            style={{ backgroundColor: 'green', color: '#ffffff' }}
           
          >
           Ad Logs
          </Button>
        </motion.div>

<motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
        >
          <Button
            className=""
            size="small" 
          onClick={()=>{
            navigate('/apps/e-commerce/products/'+props.storeId);
          }}
            variant="contained"
            style={{ backgroundColor: '#ef5350', color: '#ffffff' }}
           
          >
            Go Back
          </Button>
        </motion.div>

        {
  isStoreAdmin  &&
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
        >      
          <Button
            className=""
            size="small" 
          onClick={handleMultiAdd}
            variant="contained"
            color="secondary"
            startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
          >
            ADD Multiple
          </Button>
        </motion.div>
          }
{
  isStoreAdmin  &&
        <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
        >
          <Button
            className=""
            size="small" 
            onClick={handleAdd}
            variant="contained"
            color="secondary"
            startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
            >
            ADD Ads
          </Button>
        </motion.div>
          }




        <Dialog open={removeOpen} onClose={handleRemoveClose}>
          <DialogTitle>Confirm Removal</DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              Are you sure you want to remove all ads? Please select an ad type:
            </Typography>
            <RadioGroup value={adType} onChange={handleAdTypeChange}>
              <FormControlLabel value="grid" control={<Radio />} label="Grid" />
              <FormControlLabel value="popup" control={<Radio />} label="Popup" />
              <FormControlLabel value="carousel" control={<Radio />} label="Carousel" />
              <FormControlLabel value="all" control={<Radio />} label="All" />
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRemoveClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleRemoveAllAds} color="secondary">
              Remove All
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default AdsHeader;
