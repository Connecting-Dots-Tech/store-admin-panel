import FuseScrollbars from "@fuse/core/FuseScrollbars";
import _ from "@lodash";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactPlayer from 'react-player';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import withRouter from "@fuse/core/withRouter";
// import { VmPlayer, VmVideo, VmFile, defineCustomElements } from '@vime/core';

import { Container, TextField, InputAdornment, Link, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import ShopsTableHead from "./TrackingsTableHead";
import FadeMenu from "../../../components/FadeMenu";
function TrackingsTable(props) {

  const [openVideoDialog, setOpenVideoDialog] = useState(false);
  const [selectedVideoLink, setSelectedVideoLink] = useState("");


//   customElements.define('vm-player', VmPlayer);
// customElements.define('vm-video', VmVideo);
// customElements.define('vm-file', VmFile);
// defineCustomElements();

  const handleOpenVideoDialog = (link) => {
    setSelectedVideoLink(link);
    setOpenVideoDialog(true);
  };

  const handleCloseVideoDialog = () => {
    setOpenVideoDialog(false);
    setSelectedVideoLink("");
  };

  const [selected, setSelected] = useState([]);
  let storeId = props.storeId;
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: "asc",
    id: null,
  });
  const navigate = useNavigate();

  const [dialog, setDialog] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setData(props.data);
  }, [props]);

  function handleRequestSort(event, property) {
    const id = property;
    let direction = "desc";

    if (order.id === property && order.direction === "desc") {
      direction = "asc";
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

  function handleChangePage(event, value) {
    const newPage = parseInt(value, 10);
    if (page < newPage && newPage > maxPage) {
      setMaxPage(newPage);
      props.getTracking(newPage + 1, rowsPerPage);
    }
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    props.getTracking(1, newRowsPerPage);
  }

  const handleDelete = (e, id) => {
    axios
      .delete(process.env.REACT_APP_PRODUCTION_KEY + "/device/" + id)
      .then((res) => {
        props.getTracking(undefined, undefined, true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleVerify = (id) => {
console.log(id)
axios
.patch(process.env.REACT_APP_PRODUCTION_KEY + "/tracked-videos/create-tracked-videoData/" + id,{"verificationStatus":true})
.then((res) => {
  console.log(res)
  props.getTracking(undefined, undefined, true);
})
.catch((err) => {
  console.log(err);
});

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
      axios
        .post(process.env.REACT_APP_PRODUCTION_KEY + "/device/searchDevice", {
          queryDto: { query: value },
          storeId,
        })
        .then((res) => {
          setSearchResults(res.data.data.devices);
        })
        .catch((err) => {
          setIsSearching(false);
          console.log(err);
        });
    } else {
      // Clear searchResults when the search term is empty
      setSearchResults([]);
      setSearchTerm(false);
    }
  };

  return (
    <div className="w-full flex flex-col min-h-full">
      {/* <Container maxWidth="md" sx={{ml:0, mt: 2, mb:2 }}>
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
      </Container> */}
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
                    case "categories": {
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
                  className={`h-72 cursor-pointer ${
                    n.isAbnormal && !n.verificationStatus ? 'bg-red-200' : ''
                  }`}
                    hover
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n._id}
                    selected={isSelected}
                  >
                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                    >
                      {n.source}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                    >
                      {n.productCount}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16 truncate"
                      component="th"
                      scope="row"
                      align="right"
                    >
                      {n.verificationStatus?'verified':(
                      <Button   className="bg-blue-500 text-white" onClick={() => handleVerify(n._id)}>Verify</Button>
                      )}
                    </TableCell>

                    <TableCell className="p-4 md:p-16" component="th" scope="row" align="right">
                      {n.videoLink ? (
                        <Link  onClick={() => handleOpenVideoDialog(n.videoLink)}>Link</Link>
                      ) : ""}
                    </TableCell>

                   
                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                      align="right"
                    >
                      {n.verifiedUser}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16 "
                      component="th"
                      scope="row"
                      align="right"
                    >
                      {n.isAbnormal?"true":"false"}
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
          "aria-label": "Previous Page",
        }}
        nextIconButtonProps={{
          "aria-label": "Next Page",
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />


<Dialog open={openVideoDialog} onClose={handleCloseVideoDialog} maxWidth="md" fullWidth>
        <DialogContent>
        <ReactPlayer url={selectedVideoLink}  playing={true}
         controls width="100%" /> 


        </DialogContent>
      </Dialog>

    </div>
  );
}

export default withRouter(TrackingsTable);