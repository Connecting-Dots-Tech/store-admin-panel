import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function TrackingsHeader(props) {
  const navigate = useNavigate();
  const routeParams = useParams();

  const { storeId, deviceId, status } = routeParams;

  return (
    <div className="flex flex-col space-y-16 sm:space-y-0 w-full items-start justify-between py-32 px-24 md:px-32">
      <div className="flex flex-col sm:flex-row items-center justify-start w-full sm:w-auto space-y-4 sm:space-y-0">
        <Typography
          component={motion.span}
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          className="text-24 md:text-32 font-extrabold tracking-tight mr-5"
        >
          Trackings -
        </Typography>
        <Typography
          component={motion.span}
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          className="text-18 md:text-28 font-extrabold tracking-tight"
        >
          {props.storeName}
        </Typography>
      </div>

      <div className="flex w-full sm:flex-row items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
        >
          <h2>total video count: {props.total}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
        >
          <Button
            size="small" 
            onClick={() => {
              if (status == "active")
                navigate(
                  "/apps/e-commerce/sessions/" + deviceId + "/" + storeId
                );
              else
                navigate(
                  "/apps/e-commerce/inactivesessions/" +
                    deviceId
                );
            }}
            variant="contained"
            style={{ backgroundColor: "#ef5350", color: "#ffffff" }}
          >
            Go Back
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export default TrackingsHeader;
