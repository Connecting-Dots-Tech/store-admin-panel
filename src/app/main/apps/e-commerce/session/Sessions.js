import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "../store";
import DeviceHeader from "./SessionsHeader";
import DeviceTable from "./SessionsTable";
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
  const [status, setStatus] = useState('active');
  const [total, setTotalCount] = useState(0);
  const [storeName, setstoreName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { deviceId,storeId } = routeParams;
  const getdevice = async (status='active',page = 1, limit = 10, flag = false) => {

    try {
      const response = await axios.get(
          "https://apis.datcarts.com/auth/getsession/device/" +
          deviceId+"/"+status,
        {
          params: {
            page,
            limit,
          },
        }
      );

      const datas = await response.data.data;

      setstoreName(datas.deviceName);

      setTotalCount(datas.totalData);

      if (flag == true) {
        setData(datas.session);
      } else {
        setData([ ...datas.session]);
        console.log([...datas.session]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false); // Update loading state when fetching is completed
    }
  };

  useEffect(() => {
    getdevice();
  }, []);

 const updateStatus=(status) => {
setStatus(status)
  }

  return (
    <>
      <FusePageCarded
        className='px-20 pb-20'
        header={
          <DeviceHeader status={status} updateStatus={updateStatus} getDevices={getdevice} deviceId={deviceId} storeId={storeId} storeName={storeName} />
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
                    There are no {status} Session in this Device!
                    
                  </Typography>
                 
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FuseLoading />
                </div>
              )}
            </div>
          ) : (
            <DeviceTable
            getDevices={getdevice}
              total={total}
              storeName={storeName}
              storeId={deviceId}
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

export default withReducer("eCommerceApp", reducer)(Sessions);
