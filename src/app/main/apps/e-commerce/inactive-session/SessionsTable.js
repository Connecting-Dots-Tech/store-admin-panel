import FuseScrollbars from "@fuse/core/FuseScrollbars";
import _ from "@lodash";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import Pagination from '@mui/material/Pagination';
import withRouter from "@fuse/core/withRouter";

import ShopsTableHead from "./SessionsTableHead";
import { Stack,Box } from "@mui/system";
function SessionsTable(props) {
  const [selected, setSelected] = useState([]);
  let storeId = props.storeId;
  let deviceId = props.deviceId;
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: "asc",
    id: null,
  });

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

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
    props.navigate(
      `/apps/e-commerce/trackings/${item._id}/${deviceId}/inactive`
    );
  }

  function handleChangePage(event, newPage) {
    // Correct the page number logic
    const pageNumber = newPage + 1;

    // Fetch data for the next page
    if (newPage >= maxPage) {
      setMaxPage(newPage);
      props.getDevices(pageNumber, rowsPerPage);
    }
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    props.getDevices(1, newRowsPerPage);
  }

  return (
    <div className="w-full flex flex-col">
      
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
              data,
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
                    className="h-72 cursor-pointer"
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
                      onClick={(event) => handleClick(n)}
                    >
                      {n.userId.mobile ? n.userId.mobile : n.userId.email}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                      onClick={(event) => handleClick(n)}
                    >
                      {n.state}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                      align="right"
                      onClick={(event) => handleClick(n)}
                    >
                      {n.verificationStatus}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                      align="right"
                      onClick={(event) => handleClick(n)}
                    >
                      {n.videoCount}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                      align="right"
                      onClick={(event) => handleClick(n)}
                    >
                      {n.loginDate}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </FuseScrollbars>

      <Box
  display="flex"
  justifyContent="space-between"
  alignItems="center"
  flexWrap="wrap"
  sx={{
    gap: 1,
    "@media (min-width: 600px)": {
      justifyContent: "space-between", 
    },
    "@media (max-width: 599px)": {
      justifyContent: "center", 
    },
  }}
>
  <Box
    sx={{
      flexGrow: 1,
      display: "flex",
      justifyContent: {
        xs: "center", 
        sm: "flex-start", 
      },
      flexBasis: {
        xs: "100%", 
        sm: "auto", 
      },
    }}
  >
    <Pagination
      count={Math.ceil(props.total / rowsPerPage)}
      page={page + 1}
      onChange={(event, value) => handleChangePage(event, value - 1)}
    />
  </Box>
  <Box
    sx={{
      flexGrow: 1,
      display: "flex",
      justifyContent: {
        xs: "center", 
        sm: "flex-end", 
      },
      flexBasis: {
        xs: "100%", 
        sm: "auto", 
      },
    }}
  >
    <TablePagination
      component="div"
      count={props.total}
      page={page}
  onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      labelDisplayedRows={() => null} 
      sx={{
        '& .MuiTablePagination-actions': {
          display: 'none',
        },
      }}
    />
  </Box>
</Box>


    </div>
  );
}

export default withRouter(SessionsTable);
