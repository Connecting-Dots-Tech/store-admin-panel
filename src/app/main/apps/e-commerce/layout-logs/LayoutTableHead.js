
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import TableHead from '@mui/material/TableHead';
import { lighten } from '@mui/material/styles';

const rows = [
  {
    id: 'layoutId',
    align: 'left',
    disablePadding: false,
    label: 'Layout Id',
    sort: true,
  },
  {
    id: 'deviceId',
    align: 'left',
    disablePadding: false,
    label: 'Device Id',
    sort: true,
  },
  {
    id: 'sessionId',
    align: 'left',
    disablePadding: false,
    label: 'session Id',
    sort: true,
  },
  {
    id: 'timeStamp',
    align: 'left',
    disablePadding: false,
    label: 'Time Stamp',
    sort: true,
  }
];

function LayoutLogsTableHead(props) {
  const { selectedProductIds } = props;
  const numSelected = selectedProductIds.length;

  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };


  return (
    <TableHead>
      <TableRow className="h-48 sm:h-64">
       
        {rows.map((row) => {
          return (
            <TableCell
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
              className="p-4 md:p-16"
              key={row.id}
              align={row.align}
              padding={row.disablePadding ? 'none' : 'normal'}
              sortDirection={props.order.id === row.id ? props.order.direction : false}
            >
              {row.sort && (
                <Tooltip
                  title="Sort"
                  placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={props.order.id === row.id}
                    direction={props.order.direction}
                    onClick={createSortHandler(row.id)}
                    className="font-semibold"
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              )}
            </TableCell>
          );
        }, this)}
      </TableRow>
    </TableHead>
  );
}

export default LayoutLogsTableHead;
