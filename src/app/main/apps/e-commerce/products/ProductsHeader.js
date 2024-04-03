import Button from '@mui/material/Button';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';
import FullScreenDialog from './AddProduct';
import AddStoreAds from '../ads/AddStoreAds';

function ProductsHeader(props) {
  const navigate = useNavigate();
  const routeParams = useParams();

  const { storeId } = routeParams;

 
  const [dialog, setDialog] = useState("");
const [open,setOpen] = useState(false);
  
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
        axios.post('https://apis.datcarts.com/products',data).then((res)=>{
        
          props.getProducts(undefined, undefined, true)
        }).catch((err)=>{
         
          console.log(err);
        })
      }

      
    };
    setDialog(() => (
      
      <FullScreenDialog
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
    <>
    <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">

      {dialog}
      
      <Typography
        component={motion.span}
        initial={{ x: -20 }}
        animate={{ x: 0, transition: { delay: 0.2 } }}
        delay={300}
        className="text-24 md:text-32 font-extrabold tracking-tight mr-5"
      >
        Products 
      </Typography>
      <Typography
        component={motion.span}
        initial={{ x: -20 }}
        animate={{ x: 0, transition: { delay: 0.2 } }}
        delay={300}
        className="text-18 md:text-28 font-extrabold tracking-tight"
      >
        {props.storeName}
      </Typography>
      
    </div>
    </>
  );
}

export default ProductsHeader;
