import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {Box} from "@mui/material"
function SessionsHeader(props) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap items-center justify-between py-32 px-24 md:px-32 w-full">
      <Box>

    <Typography
      component={motion.span}
      initial={{ x: -20 }}
      animate={{ x: 0, transition: { delay: 0.2 } }}
      delay={300}
      className="text-24 md:text-32 font-extrabold tracking-tight mr-5"
      >
      Inactive Sessions -
    </Typography>
    <Typography
      component={motion.span}
      initial={{ x: -20 }}
      animate={{ x: 0, transition: { delay: 0.2 } }}
      delay={300}
      className="text-18 md:text-28 font-extrabold tracking-tight mr-5"
      >
      {props.storeName}
    </Typography>
      </Box>
    <div className="flex flex-wrap items-center justify-end space-x-4 space-y-4 sm:space-y-0">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
      >
        <Button
          onClick={() => {
            navigate(
              "/apps/e-commerce/sessions/" +
                props.deviceId
            );
          }}
          size="small" 
          variant="contained"
          style={{ backgroundColor: "#5cb85c", color: "#ffffff" }}
        >
          Show Active
        </Button>
      </motion.div>
  
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
      >
        <Button
          size="small" 
          onClick={() => {
            navigate("/apps/e-commerce/devices");
          }}
          variant="contained"
          style={{ backgroundColor: "#ef5350", color: "#ffffff" }}
        >
          Go to Device
        </Button>
      </motion.div>
  
     
    </div>
  </div>
  
  );
}

export default SessionsHeader;
