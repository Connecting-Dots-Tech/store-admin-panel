import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { DataGrid } from '@mui/x-data-grid';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

const columns = [
  { field: 'image', headerName: 'Image', width: 150, renderCell: (params) => <img src={params.row.image} alt={params.row.name} style={{ maxWidth: '100%', maxHeight: '100%' }} /> },
  { field: 'barcodeid', headerName: 'Barcode ID', width: 150 },
  { field: 'qty', headerName: 'Qty', width: 100 },
  { field: 'price', headerName: 'Price', width: 150, type: 'number' },
];

export default function CartProducts(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    props.setOpen(false);
  }
  React.useEffect(() => {
    setOpen(props.open)
  }, [props.open]);

  const rows = React.useMemo(() => {
    // Create rows using the products prop
    return props.products.map((product) => ({
      id: product.productId._id, // Assuming each product has a unique ID
      image: product.productId.productImage,
      barcodeid: product.productId.barcodeId,
      qty: product.quantity,
      price: product.productId.price,
    }));
  }, [props.products]);

  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Products
          </Typography>
          <Box id="modal-modal-description" sx={{ mt: 2 }}>
            <div style={{ height: 400, width: '100%', display: 'flex', justifyContent: 'center' }}>
              <DataGrid rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10, 20]} />
            </div>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
