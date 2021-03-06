import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {  useStyles } from "./NavbarStyles";
import { Box, Button } from "@material-ui/core";
import { history } from "../Utilities/History";
import {socket} from '../Utilities/API';
import {useDispatch} from 'react-redux';
import { removeAllRequests } from "../../actions/RequestsActions";
/* NAVBAR. NEED TO CHANGE STUFF AS NEEDED */
export default function Navbar() {
  const username = JSON.parse(sessionStorage.getItem('user')).username;
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    socket.emit('logout', username);
    dispatch(removeAllRequests());
    history.push("/login");
  };

  return (
    <div>
      <AppBar position="static" className={classes.navbar}>
        <Toolbar className={classes.toolbar}>
          <Box display='flex' alignItems='center'>
            <img
              className={classes.img_logo}
              onClick={(e) => history.push("/")}
              src={`${process.env.PUBLIC_URL}/images/logo.png`}
              alt="Logo.png"
            />
            <Typography className={classes.title} variant="h6" noWrap>
              Chat Away
            </Typography>
          </Box>
          <Typography className={classes.slogan}>
            "It takes two to have a conversation"
          </Typography>
          
          <Button
            className={classes.logout}
            variant="outlined"
            color="inherit"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
