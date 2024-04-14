import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "../store";
import ProductsHeader from "./ProductsHeader";
import ProductsTable from "./ProductsTable";
import axios from "axios";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import FuseLoading from "@fuse/core/FuseLoading";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
function Products() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [data, setData] = useState([]);
  const [total, setTotalCount] = useState(0);
  const [storeName, setstoreName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const storeId  =  localStorage.getItem('storeId');;
  const getProducts = async (page = 1, limit = 10, flag = false) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_PRODUCTION_KEY+"/products/getProducts/" +
          storeId,
        {
          params: {
            page,
            limit,
          },
        }
      );

      const datas = await response.data.data;

      setstoreName(datas.storeName);

      setTotalCount(datas.totalData);

      if (flag == true) {
        setData(datas.products);
      } else {
        setData([...data, ...datas.products]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false); // Update loading state when fetching is completed
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <FusePageCarded
        className='px-20 pb-20'
        header={
          <ProductsHeader getProducts={getProducts} storeName={storeName} />
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
                    There are no products!
                  </Typography>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FuseLoading />
                </div>
              )}
            </div>
          ) : (
            <ProductsTable
              getProducts={getProducts}
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

export default withReducer("eCommerceApp", reducer)(Products);
