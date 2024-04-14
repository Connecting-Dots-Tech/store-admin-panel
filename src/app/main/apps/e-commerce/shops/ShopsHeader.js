import Button from '@mui/material/Button';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectProductsSearchText, setProductsSearchText } from '../store/productsSlice';
import FullScreenDialog from './AddShop';
function ShopsHeader(props) {
  const dispatch = useDispatch();
  const searchText = useSelector(selectProductsSearchText);
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
        
       
        axios.post(process.env.REACT_APP_PRODUCTION_KEY+'/store',data).then((res)=>{
         
          props.getShop(undefined, undefined, true)
        }).catch((err)=>{
          console.log(err);
        })
      }
      //   display();
      
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
    <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">

      {dialog}
      <Typography
        component={motion.span}
        initial={{ x: -20 }}
        animate={{ x: 0, transition: { delay: 0.2 } }}
        delay={300}
        className="text-24 md:text-32 font-extrabold tracking-tight"
      >
        Stores
      </Typography>

      <div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">
      
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
            ADD Store
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export default ShopsHeader;
