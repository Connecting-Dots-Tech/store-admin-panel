import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CartProducts from './CartProductModal'

import withRouter from '@fuse/core/withRouter';

import { Container, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import CartTableHead from './CartTableHead';
import FadeMenu from '../../../components/FadeMenu'
function CartTable(props) {


  const [selected, setSelected] = useState([]);
  let storeId= localStorage.getItem('storeId');
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });


  const [open,setOpen] = useState(false);
    
  const handleClose =() => {

    setOpen(false)
  }
  
  const formatDate = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    // Customize the date format as needed (e.g., MM/DD/YYYY)
    const formattedDate = `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
    return formattedDate;
  };

  
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
    console.log("click")
    console.log(open)
    console.log("----------------------------------------------------------------")
    setProducts(item);
    setOpen(true)
    // props.navigate(`/apps/e-commerce/products/${item.id}/${item.handle}`);
  }

  function handleChangePage(event, value) {
    const newPage = parseInt(value, 10)
    if(page<newPage && newPage > maxPage) {
      setMaxPage(newPage)
      props.getDevices(newPage+1,rowsPerPage)
    }
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    props.getDevices(1,newRowsPerPage)
  }

 
  const handleDelete=(e,id) => {
  
    axios.delete(process.env.REACT_APP_PRODUCTION_KEY+'/device/'+id).then((res)=>{
     
      props.getDevices(undefined, undefined, true)
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
        
           axios.post(process.env.REACT_APP_PRODUCTION_KEY+'/device/searchDevice',{
           // axios.post('http://localhost:4000/cart/searchActiveCarts',{

            queryDto: { "query":value },
            storeId,
          }).then((res)=>{

         setSearchResults(res.data.data)
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
        <CartProducts products={products} setOpen={setOpen} open={open}/>
      {/* </Container> */}
      
      <FuseScrollbars className="grow overflow-x-auto">
        <Table stickyHeader className="px-5 min-w-xl" aria-labelledby="tableTitle">
          <CartTableHead
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
              .map((n,index) => {
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
                  onClick={()=>{
                    handleClick(n.products)}}
                  >
                

                   
                    <TableCell className="p-4 md:p-16" component="th" scope="row"
                    onClick={(event) => handleClick(n)}
                    >
                      {index+1}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row"
                    onClick={(event) => handleClick(n)}
                    >
                      {n.cartId}
                    </TableCell>

                    <TableCell className="p-4 md:p-16 truncate" component="th" scope="row"  align="right" 
                      onClick={(event) => handleClick(n)}
                      >
                      {n.userId}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="right"   onClick={(event) => handleClick(n)}>
                   
                      {n.totalAmount}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="right"   onClick={(event) => handleClick(n)}>
                      {n.status}
                    </TableCell>

        

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="right"   onClick={(event) => handleClick(n)}>
                    {formatDate(n.createdAt)}
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

export default withRouter(CartTable);
