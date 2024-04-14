import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import axios from 'axios';
import AddStoreAds from './AddStoreAds';
function AdsHeader(props) {

  const [dialog, setDialog] = useState("");
const [open,setOpen] = useState(false);
const navigate = useNavigate();  
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
         
          props.getShop(undefined, undefined, true)
        }).catch((err)=>{
          console.log(err);
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
  return (
    <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">

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
        {/* <Paper
          component={motion.div}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
          className="flex items-center w-full sm:max-w-256 space-x-8 px-16 rounded-full border-1 shadow-0"
        >
          <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

          <Input
            placeholder="Search stores"
            className="flex flex-1"
            disableUnderline
            fullWidth
            value={searchText}
            inputProps={{
              'aria-label': 'Search',
            }}
            onChange={(ev) => dispatch(setProductsSearchText(ev))}
          />
        </Paper> */}


<motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
        >
          <Button
            className=""
          onClick={()=>{
            navigate('/apps/e-commerce/products/'+props.storeId);
          }}
            variant="contained"
            style={{ backgroundColor: '#ef5350', color: '#ffffff' }}
           
          >
            Go Back
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
        >
          <Button
            className=""
          onClick={handleAdd}
            variant="contained"
            color="secondary"
            startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
          >
            ADD Ads
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export default AdsHeader;
