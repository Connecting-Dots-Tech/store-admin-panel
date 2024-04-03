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
import { Container, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

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
import ShopsTableHead from './ShopsTableHead';
import FadeMenu from '../../../components/FadeMenu'
import FullScreenDialog from './AddShop';
function ShopsTable(props) {
  // const dispatch = useDispatch();
  // const products = useSelector(selectShops);
  // const searchText = useSelector(selectShopsSearchText);

  const [selected, setSelected] = useState([]);
  
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [search, setSearch] = useState(false);
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
            
            axios.patch('https://apis.datcarts.com/store/'+id,data).then((res)=>{
             
              props.getShop(undefined, undefined, true)
             
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
        
        <FullScreenDialog
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
    props.navigate(`/apps/e-commerce/products/${item._id}`);
  }


  function handleChangePage(event, value) {
    const newPage = parseInt(value, 10)
    
    if(page<newPage && newPage > maxPage) {
      setMaxPage(newPage)
      props.getShop(newPage+1,rowsPerPage)
    }
    setPage(newPage);
    
      
  
  }

  function handleChangeRowsPerPage(event) {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    props.getShop(1,newRowsPerPage)
  }


  const handleDelete=(e,id) => {
   
    axios.delete('https://apis.datcarts.com/store/'+id).then((res)=>{
   
      props.getShop(undefined, undefined, true)
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
      
        axios.get('https://apis.datcarts.com/store/search-store?query='+value).then((res)=>{
       setSearchResults(res.data)
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
                console.log(n._id)
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
                      className="w-52 px-6 "
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
                          className="w-full block rounded "
                          src={n.logo}
                          alt={n.storeName}
                        />
                      )}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row"
                    onClick={(event) => handleClick(n)}
                    >
                      {n.storeName}
                      <div>{n._id}</div>
                    </TableCell>

                    <TableCell className="p-4 md:p-16 truncate" component="th" scope="row"
                      onClick={(event) => handleClick(n)}
                      >
                      {n.contactPhone}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="right"   onClick={(event) => handleClick(n)}>
                   
                      {n.city}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="right"   onClick={(event) => handleClick(n)}>
                      {n.district}
                    
                      
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

export default withRouter(ShopsTable);
