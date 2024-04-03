import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "../store";
import TrackingsHeader from "./TrackingsHeader";
import TrackingsTable from "./TrackingsTable";
import axios from "axios";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import FuseLoading from "@fuse/core/FuseLoading";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
function Trackings() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [data, setData] = useState([]);
  const [total, setTotalCount] = useState(0);
  const [storeName, setstoreName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { deviceId,storeId } = routeParams;
  const getdevice = async (page = 1, limit = 10, flag = false) => {
    try {
      const response = await axios.get(
          "https://apis.datcarts.com/tracked-videos/get-video-by-device/" +deviceId+"/"+
          storeId,
        {
          params: {
            page,
            limit,
          },
        }
      );

      const datas = await response.data.data;
console.log(datas)
     
 console.log(datas.videoData)
      setTotalCount(datas.totalData);

      if (flag == true) {
        setData(datas.videoData);
      } else {
        setData([...data, ...datas.videoData]);
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

  return (
    <>
      <FusePageCarded
        className='px-20 pb-20'
        header={
          <TrackingsHeader getDevices={getdevice} storeName={storeName} />
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
                    There are no Trackings in this Device!
                  </Typography>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FuseLoading />
                </div>
              )}
            </div>
          ) : (
            <TrackingsTable
            getDevices={getdevice}
              total={total}
              storeName={storeName}
              storeId={storeId}
              data={data}
            />
          )
        }
        scroll={isMobile ? "normal" : "content"}
      />
    </>
  );
}

export default withReducer("eCommerceApp", reducer)(Trackings);
