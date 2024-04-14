import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import axios from 'axios';


import withRouter from '@fuse/core/withRouter';

import { Container, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import ShopsTableHead from './DevicesTableHead';
import FadeMenu from '../../../components/FadeMenu'
import FullScreenDialog from './AddDevice';
function DevicesTable(props) {


  const [selected, setSelected] = useState([]);
  let storeId=props.storeId
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });
  const navigate = useNavigate();

  const [dialog, setDialog] = useState("");
  const [open,setOpen] = useState(false);
    
  const handleClose =() => {
    setDialog()
    setOpen(false)
  }
    const handleAdd = (e, upd = Boolean(true),button = 'EDIT', data = {}) => {
    
     let id = data._id
      setOpen(true);
      const add = (data) => {
      
        setDialog();
        if(upd){
   
          handleClose();
          try{
    
            axios.patch(process.env.REACT_APP_PRODUCTION_KEY+'/device/'+id,data).then((res)=>{
             
              props.getDevices(undefined, undefined, true)
           
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
     navigate(`/apps/e-commerce/sessions/${item._id}/${storeId}`);
  }

  // function handleCheck(event, id) {
  //   const selectedIndex = selected.indexOf(id);
  //   let newSelected = [];

  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, id);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1)
  //     );
  //   }

  //   setSelected(newSelected);
  // }

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
         // axios.get(process.env.REACT_APP_PRODUCTION_KEY+'/store/search-store?query='+value).then((res)=>{
          axios.post(process.env.REACT_APP_PRODUCTION_KEY+'/device/searchDevice',{
            queryDto: { "query":value },
            storeId,
          }).then((res)=>{

         setSearchResults(res.data.data.devices)
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
      </Container>
      {dialog}
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
                

                   
                    <TableCell className="p-4 md:p-16" component="th" scope="row"
                    onClick={(event) => handleClick(n)}
                    >
                      {n.deviceName}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row"
                    onClick={(event) => handleClick(n)}
                    >
                      {n.deviceID}
                    </TableCell>

                    <TableCell className="p-4 md:p-16 truncate" component="th" scope="row"  align="right" 
                      onClick={(event) => handleClick(n)}
                      >
                      {n.appVersion}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="right"   onClick={(event) => handleClick(n)}>
                   
                      {n.details}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="right"   onClick={(event) => handleClick(n)}>
                      {n.status}
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

export default withRouter(DevicesTable);
