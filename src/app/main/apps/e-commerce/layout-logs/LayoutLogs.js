import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import reducer from '../store';
import LayoutHeader from './LayoutHeader';
import LayoutTable from './LayoutTable';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseLoading from '@fuse/core/FuseLoading';
import {  useParams } from 'react-router-dom';
import { useState, useEffect} from 'react';
function Ads() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const routeParams = useParams();
const [data,setData]= useState([])
const [total,setTotalCount]= useState(0)
const [isLoading, setIsLoading] = useState(true);
const { storeId } = routeParams;

  const getLogs =async (page=1, limit=10,flag=false)=> {
    try{

      const response = await axios.get('https://apis.datcarts.com/layout/getLogsByStore/'+storeId,{
        params: {
        page,
        limit,
      },
    });

      const datas = await response.data.data;
console.log(datas)
      setTotalCount(datas.totalData);
      if(flag==true){
        setData(datas.logs)
      }else{
        setData([...data, ...datas.logs])
      }
      
    }catch(err){
      console.log(err)
    }finally {
      setIsLoading(false); // Update loading state when fetching is completed
    }
  }

  useEffect(() => {
   
    getLogs()
       
  },[])

  return (
    <>
      <FusePageCarded
        className='px-20 pb-20'
        header={<LayoutHeader getShop={getLogs} storeId={storeId}/>}
        content={data.length === 0 ? (
          <div>
            {data.length === 0 && !isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.1 } }}
                className="flex flex-1 items-center justify-center h-full"
              >
                <Typography color="text.secondary" variant="h5" className='mt-32'>
                  There are no Logs!
                </Typography>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <FuseLoading />
              </div>
            )}
          </div>
        ) : (
          <LayoutTable getAds={getLogs} total={total} storeId={storeId} data={data} />
        )}
        scroll={isMobile ? 'normal' : 'content'}
      />
    </>
  );
  
}

export default withReducer('eCommerceApp', reducer)(Ads);
