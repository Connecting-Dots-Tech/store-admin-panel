import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { useDispatch, useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { getShops, selectShops, selectShopsSearchText } from '../store/shopsSlice';
import { getProducts, selectProducts, selectProductsSearchText } from '../store/productsSlice';
import SimpleSnackbar from '../../../components/Snackbar'
import ShopsTableHead from './AdsTableHead';
import FadeMenu from '../../../components/FadeMenu'
import AddStoreAds from './AddStoreAds';
import { Chip } from '@mui/material';
import { Container, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function AdsTable(props) {
  // const dispatch = useDispatch();
  // const products = useSelector(selectShops);
  // const searchText = useSelector(selectShopsSearchText);

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


  const [dialog, setDialog] = useState("");
  const [snackbar,setSnackbar] = useState();
  const [open,setOpen] = useState(false);
    
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
          
            axios.patch('https://apis.datcarts.com/ads/'+id,data).then((res)=>{
             
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

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(data.map((n) => n.id));
      return;
    }
    setSelected([]);
  }

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
   
    axios.delete('https://apis.datcarts.com/ads/'+id).then((res)=>{
   
      props.getAds(undefined, undefined, true)
    }).catch((err)=>{
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
        axios.post('https://apis.datcarts.com/ads/searchAds',{
          queryDto: { "query":value },
            storeId,
        }).then((res)=>{

       setSearchResults(res.data.data.ads)
      }).catch((err)=>{
        setIsSearching(false);
        console.log(err);
      })
      // Perform your API call and update searchResults state
      // Example: 
      // fetch(`/api/search?query=${value}`)
      //   .then((response) => response.json())
      //   .then((data) => setSearchResults(data));
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
      </Container>


      {dialog}

     {/* {snackbar} */}





     
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
                

                    <TableCell
                    pl={2}
                      className="w-52 px-4 md:px-0"
                      style={{paddingLeft:"10px"}}
                      component="th"
                      scope="row"
                      padding="none"
                      onClick={(event) => handleClick(n)}
                    >
                      {n.logo > 0  ? (
                        // <img
                        //   className="w-full block rounded"
                        //   src={_.find(n.logo, { id: n.featuredImageId }).url}
                        //   alt={n.name}
                        // />
                      <h1>image</h1>
                      ) : (
                        <img
                          className="w-full block rounded ml-10"
                          src={n.imageUrl}
                          alt={n.title}
                        />
                      )}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row"
                    onClick={(event) => handleClick(n)}
                    >
                      {n.title}
                    </TableCell>

                    <TableCell className="p-4 md:p-16 truncate" component="th" scope="row"
                      onClick={(event) => handleClick(n)}
                      >
                      {n.adType}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="right"   onClick={(event) => handleClick(n)}>
                  {
                    n.tags.map((tag)=>{
                      return(
                        <Chip label={tag} className="mr-4" />
                      )
                    }
                    )
                  }
                     
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
                    <FadeMenu delete={(e)=>{handleDelete(e,n._id)}} update={(e)=>{handleAdd(e,true,'EDIT',n)}} />
                    </TableCell>
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
    </div>
  );
}

export default withRouter(AdsTable);
