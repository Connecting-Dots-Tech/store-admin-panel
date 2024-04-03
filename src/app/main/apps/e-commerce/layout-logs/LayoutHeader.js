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

function LayoutHeader(props) {

  const [dialog, setDialog] = useState("");

const navigate = useNavigate();  


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
        Region Logs
      </Typography>

      <div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">
  
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

       
      </div>
    </div>
  );
}

export default LayoutHeader;
