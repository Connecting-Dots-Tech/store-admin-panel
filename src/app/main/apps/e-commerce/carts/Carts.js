import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "../store";
import CartHeader from "./CartHeader";
import CartTable from "./CartTable";
import axios from "axios";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import FuseLoading from "@fuse/core/FuseLoading";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
function Carts() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [data, setData] = useState([]);
  const [status, setStatus] = useState('active');
  const [total, setTotalCount] = useState(10);
  const [storeName, setstoreName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const storeId  =  localStorage.getItem('storeId');
  const getCarts = async (status='active',page = 1, limit = 10, flag = false) => {

    try {
      const response = await axios.post(
        process.env.REACT_APP_PRODUCTION_KEY+"/cart/getAllStoreCarts/"+page+"/"+limit,
        {
          storeId
        }
      );



      // const response = await axios.post(
      //   "http://localhost:4000/cart/getAllStoreCarts/"+page+"/"+limit,
      //   {
      //     storeId
      //   }
      // );

      const datas = await response.data.data;
console.log(datas)
      setstoreName( localStorage.getItem('storeName'));

      setTotalCount(datas.totalData);

      if (flag == true) {
        setData(datas.carts);
      } else {
        setData([ ...datas.carts]);
        console.log([...datas.carts]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false); // Update loading state when fetching is completed
    }
  };

  useEffect(() => {
    getCarts();
   
    const intervalId = setInterval(() => getCarts(undefined, 1, 10, true), 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

 const updateStatus=(status) => {
setStatus(status)
  }

  return (
    <>
      <FusePageCarded
        className='px-20 pb-20'
        header={
          <CartHeader status={status} updateStatus={updateStatus} getDevices={getCarts} storeId={storeId} storeName={storeName} />
        }
        content={
          data.length === 0 ? (
            <div>
              {data.length === 0 && !isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.1 } }}
                  className="flex flex-1 items-center justify-center h-full"
                >
                  <Typography color="text.secondary" variant="h5" className="mt-32">
                    There are no {status} Cart in this Store!
                    
                  </Typography>
                 
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FuseLoading />
                </div>
              )}
            </div>
          ) : (
            <CartTable
            getDevices={getCarts}
              total={total}
              storeName={storeName}
              storeId={storeId}
              data={data}
              status={status}
              updateStatus={updateStatus}
            />
          )
        }
        scroll={isMobile ? "normal" : "content"}
      />
    </>
  );
}

export default withReducer("eCommerceApp", reducer)(Carts);
