import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SimpleSnackbar from '../../../components/Snackbar'
import ShopsTableHead from './AdsTableHead';
import FadeMenu from '../../../components/FadeMenu'
import AddStoreAds from './AddStoreAds';
import { Box, Button, Chip, Divider, Grid, Tooltip, Typography } from '@mui/material';
import { Container, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useAuth } from '../../../../auth/AuthContext';


function AdsTable(props) {
  // const dispatch = useDispatch();
  // const products = useSelector(selectShops);
  // const searchText = useSelector(selectShopsSearchText);
  const { isStoreAdmin  } = useAuth();
  const [selected, setSelected] = useState([]);
  let storeId=props.storeId
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
   const [maxPage, setMaxPage] = useState(0);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  
  const [filter, setFilter] = useState('');

  const [dialog, setDialog] = useState("");
  const [snackbar,setSnackbar] = useState();
  const [open,setOpen] = useState(false);
    
  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);
  
    // Filter the data based on the selected adType
    if (selectedFilter) {
      const filteredData = props.data.filter(ad => ad.adType === selectedFilter);
      setData(filteredData);
    } else {
      setData(props.data);
    }
  };
  
  
  const handleImageClick = (data) => {
    setSelectedData(data);
    setOpenImageDialog(true);
};

const handleCloseImageDialog = () => {
    setOpenImageDialog(false);
    setSelectedData(null);
};


  const handleClose =() => {
    setDialog()
    setOpen(false)
  }
    const handleAdd = (e, upd = Boolean(true),button = 'ADD', data = {}) => {
    
     let id = data._id
      setOpen(true);
      const add = (data) => {
       
        setDialog();
        if(upd){
   
          handleClose();
          try{
          
            axios.patch(process.env.REACT_APP_PRODUCTION_KEY+'/ads/'+id,data).then((res)=>{
              setPage(0)
            setRowsPerPage(10);
               setMaxPage(0);
              props.getAds(undefined, undefined, true)
             
            }).catch((err)=>{
              console.log(err);
            })

          }catch(err){
            console.log(err)
          }
        }
        //   display();
        
      };
      setDialog(() => (
        
        <AddStoreAds
          onClose={handleClose}
          open={true}
           submit={add}
           updated={upd}
           button={button}
           data={data}
        />
      ));
    };
 

    const handleSnackbar=()=>{
      setSnackbar(()=>(
        <SimpleSnackbar
        status={"success"}
        message={"Add Successfully"}
        open={true}
        />
      ))
    }


  useEffect(() => {
        setData(props.data)
      
  }, [props]);

  function handleRequestSort(event, property) {
    const id = property;
    let direction = 'desc';

    if (order.id === property && order.direction === 'desc') {
      direction = 'asc';
    }

    setOrder({
      direction,
      id,
    });
  }

 
  const handleSelectAllClick = (event) => {

    if (event.target.checked) {
      const newSelecteds = data.map((ad) => ad._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };


  const handleSelectClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };


   // Handle deleting all selected ads
   const handleDeleteSelected = () => {
    axios
      .post(process.env.REACT_APP_PRODUCTION_KEY + '/ads/delete-ads', {  ids: selected })
      .then((res) => {
        toast.success('Ads deleted successfully');
        setSelected([]);
        props.getAds(undefined, undefined, true);
      })
      .catch((err) => {
        toast.error('Error deleting ads');
        console.log(err);
      });
  };

  function handleDeselect() {
    setSelected([]);
  }

  function handleClick(item) {
    // props.navigate(`/apps/e-commerce/products/${item._id}`);
  }


  function handleChangePage(event, value) {
    const newPage = parseInt(value, 10)
    if(page<newPage && newPage > maxPage) {
      setMaxPage(newPage)
      props.getAds(newPage+1,rowsPerPage)
    }
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    props.getAds(1,newRowsPerPage)
  }


  const handleDelete=(e,id) => {
   
    axios.delete(process.env.REACT_APP_PRODUCTION_KEY+'/ads/'+id).then((res)=>{
   
      props.getAds(undefined, undefined, true)
      toast.success("Ad deleted")
    }).catch((err)=>{
      toast.error(err.response.data.message)
      console.log(err);
    })
  
  }


  

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    // Set isSearching to true if there's a search term, false if it's empty
    setIsSearching(!!value);

    // Call your API for search results here
    if (value) {
        axios.post(process.env.REACT_APP_PRODUCTION_KEY+'/ads/searchAds',{
          queryDto: { "query":value },
            storeId,
        }).then((res)=>{

       setSearchResults(res.data.data.ads)
      }).catch((err)=>{
        setIsSearching(false);
        console.log(err);
      })
    
    } else {
      // Clear searchResults when the search term is empty
      setSearchResults([]);
      setSearchTerm(false)
    }
  }

  return (
    <div className="w-full flex flex-col min-h-full">

<Container maxWidth="md" sx={{ml:0, mt: 2, mb:2 }}>
        <TextField  type="search" id="search" label="Search"
         
          onChange={handleChange}
        sx={{ width: 600 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
           />


{/* <FormControl sx={{ minWidth: 120 }}>
    <InputLabel id="filter-label">Filter</InputLabel>
    <Select
      labelId="filter-label"
      id="filter"
      value={filter}
      label="Filter"
      onChange={handleFilterChange}
    >
      <MenuItem value=""><em>None</em></MenuItem>
      <MenuItem value="carousel">Carousel</MenuItem>
      <MenuItem value="grid">Grid</MenuItem>
      <MenuItem value="popup">Popup</MenuItem>
    </Select>
  </FormControl> */}
      </Container>


      {dialog}


      {selected.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1, mr: 2 }}>
        <Button variant="contained" color="error" onClick={handleDeleteSelected}>
          Delete Selected Ads
        </Button>
      </Box>
      )}


     
      <FuseScrollbars className="grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">

          <ShopsTableHead
            selectedProductIds={selected}
            order={order}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
            onMenuItemClick={handleDeselect}
          />

          <TableBody>
            {_.orderBy(
                 isSearching ? searchResults : data,
              [
                (o) => {
                  switch (order.id) {
                    case 'categories': {
                      return o.categories[0];
                    }
                    default: {
                      return o[order.id];
                    }
                  }
                },
              ],
              [order.direction]
            )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((n) => {
                const isSelected = selected.indexOf(n._id) !== -1;
                return (
                  <TableRow
                    className="h-72 cursor-pointer"
                    
                    hover
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n._id}
                    selected={isSelected}
                  
                  >
                
                <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectClick(n._id)}
                        color="primary"
                      />
                    </TableCell>

                    <TableCell
                    pl={2}
                      className="w-85 px-4 md:px-0"
                      style={{paddingLeft:"10px"}}
                      component="th"
                      scope="row"
                      padding="none"
                    //  onClick={(event) => handleClick(n)}
                    onClick={() => handleImageClick(n)}
                    >
                      {!n.imageUrl   ? (  
                        n.popupUrl?
                        (
                          <img
                          className="w-full block rounded ml-10"
                          src={n.popupUrl}
                          alt={n.title}
                          style={{
                            maxWidth: "150px",   
                            maxHeight: "150px",  
                            width: "auto",       
                            height: "auto",    
                            objectFit: "contain" 
                        }}
                        />
                        ) :
                      <h1>image</h1>
                      ) : (
                        <img
                          className="w-full block rounded ml-10"
                          src={n.imageUrl}
                          alt={n.title}
                          style={{
                            maxWidth: "150px",   
                            maxHeight: "150px",  
                            width: "auto",       
                            height: "auto",    
                            objectFit: "contain" 
                        }}
                        />
                      )}
                    </TableCell>

                    <TableCell
  className="p-4 md:p-16"
  component="th"
  scope="row"
  onClick={(event) => handleClick(n)}
>

  <Tooltip title={n.title} arrow>
    <span>
      {n.title.length > 20 ? `${n.title.substring(0, 20)}...` : n.title}
    </span>
  </Tooltip>
</TableCell>

                    <TableCell className="p-4 md:p-16 truncate" component="th" scope="row"
                      onClick={(event) => handleClick(n)}
                      >
                      {n.adType}
                    </TableCell>

                    <TableCell className="p-4 md:p-16 truncate" component="th" scope="row" align="left">
  {n.regionId && n.regionId.length > 0 && (
    <>
      {/* Tooltip to show all regions on hover */}
      <Tooltip
        title={n.regionId.join(', ')} // Join all regions with a comma
        arrow
      >
        <div style={{ display: 'inline-block' }}>
          {/* Display the first 3 regions */}
          {n.regionId.slice(0, 3).map((res, index) => (
            res ? (
              <Chip
                key={index}
                label={res}
                style={{ margin: '0.5rem' }}
              />
            ) : null
          ))}

         
          {n.regionId.length > 3 && (
            <Chip
              label={`+${n.regionId.length - 3} more`} 
              style={{ margin: '0.5rem' }}
            />
          )}
        </div>
      </Tooltip>
    </>
  )}
</TableCell>

                
                    {/* {
                   isStoreAdmin? */}
                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
                   <FadeMenu
  delete={(e) => handleDelete(e, n._id)}
  update={isStoreAdmin ? (e) => handleAdd(e, true, 'EDIT', n) : undefined}
/>

                  </TableCell>
                  {/* } */}
                    
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </FuseScrollbars>

      <TablePagination
        className="shrink-0 border-t-1"
        component="div"
        count={props.total}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10]}
        page={page}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />




    <Dialog
      open={openImageDialog}
      onClose={handleCloseImageDialog}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle
        sx={{
          position: 'relative',
          paddingBottom: '16px', // Add padding for spacing
        }}
      >
        AD DETAILS
        <IconButton
          aria-label="close"
          onClick={handleCloseImageDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {selectedData && (
          <Box>
           
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Title:
                </Typography>
                <Typography variant="body1">{selectedData.title}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Ad Type:
                </Typography>
                <Typography variant="body1">{selectedData.adType}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Category:
                </Typography>
                <Typography variant="body1">{selectedData.category}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Valid From:
                </Typography>
                <Typography variant="body1">{selectedData.validFrom}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Valid To:
                </Typography>
                <Typography variant="body1">{selectedData.validTo}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Type:
                </Typography>
                <Typography variant="body1">{selectedData.type}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Terms:
                </Typography>
                <Typography variant="body1">{selectedData.terms}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Description:
                </Typography>
                <Typography variant="body1">{selectedData.description}</Typography>
              </Grid>
            </Grid>

            <Box
  sx={{
    display: 'flex',
    flexDirection: 'column', // Stack images vertically
    alignItems: 'center', // Center align images
    mb: 2, // Margin bottom for spacing
  }}
>
  {selectedData.imageUrl && (
    <>
      <Typography variant="h6" gutterBottom>
        Grid Image
      </Typography>
      <img
        src={selectedData.imageUrl}
        alt="Full-size"
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '8px', // Rounded corners
          marginBottom: '10px', // Space between images
        }}
      />
    </>
  )}
 <Divider style={{ background: 'black' }} variant="middle" />
  {selectedData.carouselUrl && (
    <>
      <Typography variant="h6" gutterBottom>
        Carousel Image
      </Typography>
      <img
        src={selectedData.carouselUrl}
        alt="Carousel"
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '8px', // Rounded corners
          marginBottom: '10px', // Space between images
        }}
      />
    </>
  )}
   <Divider style={{ background: 'black' }} variant="middle" />
  {selectedData.popupUrl && (
    <>
      <Typography variant="h6" gutterBottom>
        Popup Image
      </Typography>
      <img
        src={selectedData.popupUrl}
        alt="Popup"
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '8px', // Rounded corners
          marginBottom: '10px', // Space between images
        }}
      />
    </>
  )}
  {(!selectedData.imageUrl && !selectedData.carouselUrl && !selectedData.popupUrl) && (
    <Typography>No images available</Typography> // Fallback if none are available
  )}
</Box>


          </Box>
        )}
      </DialogContent>
    </Dialog>


    </div>
  );
}

export default withRouter(AdsTable);
