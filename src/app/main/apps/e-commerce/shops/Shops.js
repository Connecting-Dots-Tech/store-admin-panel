import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "../store";
import ShopsHeader from "./ShopsHeader";
import ShopsTable from "./ShopsTable";
import axios from "axios";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import FuseLoading from "@fuse/core/FuseLoading";

import { useState, useEffect } from "react";
function Shops() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const [data, setData] = useState([]);
  const [total, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const getShops = async (page = 1, limit = 10, flag = false) => {
    try {
      const response = await axios.get(
        "https://apis.datcarts.com/store",
        {
          params: {
            page,
            limit,
          },
        }
      );

      const { datas, totalData } = response.data;
      setTotalCount(totalData);
      if (flag == true) {
        setData(datas);
      } else {
        setData([...data, ...datas]);
      }
    } catch (err) {
      return [];
      console.log(err);
    } finally {
      setIsLoading(false); // Update loading state when fetching is completed
    }
  };

  useEffect(() => {
    getShops();
  }, []);

  return (
    <>
      <FusePageCarded
        className='px-20 pb-20'
        header={<ShopsHeader getShop={getShops} />}
        content={
          data.length === 0 ? (
            <div>
              {data.length === 0 && !isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.1 } }}
                  className="flex flex-1 items-center justify-center h-full"
                >
                  <Typography color="text.secondary" variant="h5">
                    There are no stores!
                  </Typography>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FuseLoading />
                </div>
              )}
            </div>
          ) : (
            <ShopsTable getShop={getShops} total={total} data={data} />
          )
        }
        scroll={isMobile ? "normal" : "content"}
      />
    </>
  );
}

export default withReducer("eCommerceApp", reducer)(Shops);
