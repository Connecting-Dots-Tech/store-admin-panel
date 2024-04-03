import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

function SimpleSnackbar(props) {
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    }
    React.useEffect(() => {
       ;
        
    }, [])

  return (
    <Snackbar
    open={props.open}
    autoHideDuration={6000}
    onClose={handleClose}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
  >
    <Alert onClose={handleClose} severity={props.status} sx={{ width: '100%' }}>
      {props.message}
    </Alert>
  </Snackbar>
  )
}

export default SimpleSnackbar