import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "../store";
import SessionsHeader from "./SessionsHeader";
import SessionsTable from "./SessionsTable";
import axios from "axios";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import FuseLoading from "@fuse/core/FuseLoading";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
function Sessions() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [data, setData] = useState([]);
  const [total, setTotalCount] = useState(0);
  const [storeName, setstoreName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { deviceId } = routeParams;

  const storeId  =  localStorage.getItem('storeId');
  
  const getdevice = async ( page = 1, limit = 10, flag = false) => {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_PRODUCTION_KEY}/auth/getsession/device/${deviceId}/inactive`,
            {
                params: {
                    page,
                    limit,
                },
            }
        );

        const datas = response.data.data;
        setstoreName(datas.deviceName);
        setTotalCount(datas.totalData);

        if (flag) {
            setData(datas.session);
        } else {
            setData(prevData => [...prevData, ...datas.session]);
        }
    } catch (err) {
        console.log(err);
    } finally {
        setIsLoading(false);
    }
};

  useEffect(() => {
    getdevice();
  }, []);



  return (
    <>
      <FusePageCarded
        className='px-20 pb-20'
        header={
          <SessionsHeader  getDevices={getdevice} deviceId={deviceId} storeId={storeId} storeName={storeName} />
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
                    There are no Inactive Session in this Device!
                    
                  </Typography>
                 
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FuseLoading />
                </div>
              )}
            </div>
          ) : (
            <SessionsTable
            getDevices={getdevice}
              total={total}
              storeName={storeName}
              storeId={storeId}
              deviceId={deviceId}
              data={data}
            />
          )
        }
        scroll={isMobile ? "normal" : "content"}
      />
    </>
  );
}

export default withReducer("eCommerceApp", reducer)(Sessions);
