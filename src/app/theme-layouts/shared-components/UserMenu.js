import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { selectUser } from "app/store/userSlice";

function UserMenu(props) {
  const user = useSelector(selectUser);

  const [openDialog, setOpenDialog] = useState(false); // State for the dialog

  const [userMenu, setUserMenu] = useState(null);

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };

  const openProfileDialog = () => {
    setOpenDialog(true);
    userMenuClose(); // Close the menu when opening the dialog
  };

  const closeProfileDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Button
        className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6"
        onClick={userMenuClick}
        color="inherit"
      >
        <div className="hidden md:flex flex-col mx-4 items-end">
          <Typography component="span" className="font-semibold flex">
            {user.data.displayName}
          </Typography>
          <Typography
            className="text-11 font-medium capitalize"
            color="text.secondary"
          >
            {user.role.toString()}
            {(!user.role ||
              (Array.isArray(user.role) && user.role.length === 0)) &&
              "Guest"}
          </Typography>
        </div>

        {user.data.photoURL ? (
          <Avatar className="md:mx-4">{user.data.displayName[0]}</Avatar>
        ) : (
          <Avatar className="md:mx-4">{user.data.displayName[0]}</Avatar>
        )}
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        classes={{
          paper: "py-8",
        }}
      >
        {!user.role || user.role.length === 0 ? (
          <>
            <MenuItem component={Link} to="/sign-in" role="button">
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:lock-closed</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign In" />
            </MenuItem>
            <MenuItem component={Link} to="/sign-up" role="button">
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:user-add </FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign up" />
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={openProfileDialog} role="button">
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:user-circle</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </MenuItem>

            <MenuItem
              component={NavLink}
              to="/sign-out"
              onClick={() => {
                userMenuClose();
              }}
            >
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:logout</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Sign out" />
            </MenuItem>
          </>
        )}
      </Popover>

      <Dialog
        onClose={closeProfileDialog}
        aria-labelledby="customized-dialog-title"
        open={openDialog}
      >
        <DialogTitle sx={{ m: 0, p: 5 }} id="customized-dialog-title">
          User Profile
          {/* ... (close button) */}
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            alt="User Photo"
            // src={user.data.photoURL || ''}
            sx={{ width: 100, height: 100, marginBottom: 2 }}
          >
            {/* <Avatar className="md:mx-4"> */}
            {user.data.displayName[0]}
          </Avatar>
          <Typography variant="h6" align="center" gutterBottom>
            {user.data.displayName}
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            {user.data.email && <>Email: {user.data.email}</>}
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
          {user.data.phone && (
        <>
           Mobile Number: {user.data.phone}
        </>
    )}   
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={closeProfileDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UserMenu;
