import Button from '@mui/material/Button';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import {  useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'


function DevicesHeader(props) {

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


{props.status === 'active' ? (
  <Button
    onClick={()=>{

    props.updateStatus('inactive')
      props.getDevices('inactive');
    }}
    variant="contained"
    style={{ backgroundColor: '#ef5350', color: '#ffffff' }}
  >
   Show Inactive
  </Button>
) : (
  <Button
  onClick={()=>{
    props.updateStatus('active') 
    props.getDevices('active');
  }}
    variant="contained"
    style={{ backgroundColor: '#5cb85c', color: '#ffffff' }}
  >
  Show Active
  </Button>
)}


        </motion.div>


        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
        >
          <Button
            className=""
          onClick={()=>{
            navigate('/apps/e-commerce/trackings/'+props.deviceId+'/'+props.storeId);
          }}
            variant="contained"
            
            color="secondary"
          >
            Show Trackings
          </Button>
        </motion.div>


<motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
        >
          <Button
            className=""
          onClick={()=>{
            navigate('/apps/e-commerce/devices/'+props.storeId);
          }}
            variant="contained"
            style={{ backgroundColor: '#ef5350', color: '#ffffff' }}
           
          >
            Go Back to Device
          </Button>
        </motion.div>


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
            Go Back to Store
          </Button>
        </motion.div>

       
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
        >
      
        
        </motion.div>
      </div>
    </div>
  );
}

export default DevicesHeader;
