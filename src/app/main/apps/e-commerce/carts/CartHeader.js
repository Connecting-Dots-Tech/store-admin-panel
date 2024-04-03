import Button from '@mui/material/Button';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import {  useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'


function CartHeader(props) {

  const navigate = useNavigate();
  const routeParams = useParams();

  const { deviceId,storeId } = routeParams;
  
  return (
    <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">

      
      <Typography
        component={motion.span}
        initial={{ x: -20 }}
        animate={{ x: 0, transition: { delay: 0.2 } }}
        delay={300}
        className="text-24 md:text-32 font-extrabold tracking-tight mr-5"
      >
      {props.status == 'active'? 'Active' : 'Inactive' }  Sessions -
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
      <div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">
        
         
      <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
        >




        </motion.div>


      </div>
    </div>
  );
}

export default CartHeader;
