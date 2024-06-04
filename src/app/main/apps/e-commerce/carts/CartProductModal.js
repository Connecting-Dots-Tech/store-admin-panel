import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { DataGrid } from '@mui/x-data-grid';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton, Checkbox } from '@mui/material';

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


export default function CartProducts(props) {
  const { open, setOpen, products } = props;
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [partialSelectedRows, setPartialSelectedRows] = React.useState(new Set());
const handleClose = () => {
setOpen(false);
}
  
const columns = [
  {
    field: 'checkbox',
    headerName: '',
    width: 50,
    renderCell: (params) =>(
      <Checkbox
      checked={selectedRows.includes(params.row.id)}
      indeterminate={partialSelectedRows.has(params.row.id)}
      onChange={(event) => handleCheckboxChange(event, params.row.id)}
    />
    )
  ,
  },
  {
    field: 'image',
    headerName: 'Image',
    width: 150,
    renderCell: (params) => (
      <img src={params.row.image} alt={params.row.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />
    ),
  },
  { field: 'barcodeid', headerName: 'Barcode ID', width: 150 },
  { field: 'qty', headerName: 'Qty', width: 50 },
  { field: 'price', headerName: 'Price', width: 150, type: 'number' },
  {
    field: 'action',
    headerName: 'Action',
    width: 150,
    renderCell: (params) => (
      <IconButton onClick={() => handleCopyToClipboard(params.row.barcodeid)} style={{ outline: 'none' }}>
        <ContentCopyIcon />
      </IconButton>
    ),
  },
];

const handleCheckboxChange = (event, id) => {
  if (event.target.checked) {
    if (partialSelectedRows.has(id)) {
   
      setPartialSelectedRows((prevSet) => {
        const newSet = new Set(prevSet); 
        newSet.delete(id); 
        return newSet;
      });
      setSelectedRows((prevSelected) => [...prevSelected, id]);
    } else {
      
      setPartialSelectedRows((prevSet) => new Set(prevSet.add(id)));
    }
  } else {
   
    setSelectedRows((prevSelected) => prevSelected.filter((item) => item !== id));
   
  }
};



  const handleCopyToClipboard = (barcodeId) => {
    navigator.clipboard.writeText(barcodeId)
      .then(() => {
        console.log('Copied to clipboard:', barcodeId);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const rows = React.useMemo(() => {
 
    if (!products?.products) {
      return []; 
    }

    return products?.products?.map((product) => ({
      id: product.productId._id, 
      image: product.productId.productImage,
      barcodeid: product.productId.barcodeId,
      qty: product.quantity,
      price: product.productId.price*product.quantity,
      isChecked: selectedRows.includes(product.productId._id),
      isPartialChecked: partialSelectedRows.has(product.productId._id),
    })) || []; 
  }, [products, selectedRows]);
  
  return (
    <div>
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
