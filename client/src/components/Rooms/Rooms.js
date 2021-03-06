import { Box, Button, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import CreateRoom from "./CreateRoom";
import { AddRoomButton, StyledBadge, useStyles } from "./RoomsStyles";
import HomeIcon from "@material-ui/icons/Home";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../Utilities/API";
import AllRooms from "./MyRooms";
import RoomCard from "./RoomCard";
import { setMyRooms } from "../../actions/MyRoomsActions";
function Rooms() {
  const classes = useStyles();

  /* Room list */
  // const [roomList, setRoomList] = useState([]);
  const dispatch = useDispatch();
  const roomList = useSelector((state) => state.MyRoomsReducer.roomList);

  /* User */
  const user = JSON.parse(sessionStorage.getItem("user"));
  const admin = user.role === "Admin" ? true : false;
  const username = user.username;

  /* Modals */
  const [createRoomModal, setCreateRoomModal] = useState(false);
  const [roomListModal, setRoomListModal] = useState(false);

  /* Display only the first three rooms which the user has joined */
  let currentRooms;

  if (roomList.length > 0) {
    currentRooms = roomList.map((room, index) => {
      if (index < 3) {
        return <RoomCard key={index} room={room} />;
      }
      return null;
    });
  } else {
    currentRooms = (
      <Typography gutterBottom variant="body2" align="center" display="block">
        You havent joined any rooms yet! Join a room to get started!
      </Typography>
    );
  }

  /* Get the rooms that the user has joined from DB. If user is an Admin, get all rooms */
  useEffect(() => {
    let unmounted = false;

    if (admin) {
      socket.emit("get allRooms", username, (roomData) => {
        if (!unmounted) {
          dispatch(setMyRooms(roomData));
        }
      });
    } else {
      socket.emit("get myRooms", username, (roomData) => {
        if (!unmounted) {
          dispatch(setMyRooms(roomData));
        }
      });
    }

    return () => {
      unmounted = true;
    };
  }, [username, dispatch, admin]);

  /* Handle closing the modals */
  const handleModalClose = () => {
    setCreateRoomModal(false);
    setRoomListModal(false);
  };

  return (
    <Box component="div" className={classes.box}>
      {/* Home logo and Home text */}
      <Box component="div" className={classes.heading}>
        <HomeIcon className={classes.homeIcon} />
        <Typography display="block" variant="h6" noWrap>
          Rooms
        </Typography>
      </Box>

      {/* List current rooms of user */}
      <Box component="div" className={classes.userRooms}>
        {currentRooms}
        <Button
          variant="outlined"
          color="primary"
          className={classes.viewbtn}
          onClick={(e) => setRoomListModal(true)}
        >
          View Joined Rooms
        </Button>
        <AllRooms
          roomList={roomList}
          openRoomModal={roomListModal}
          handleModalClose={handleModalClose}
        />
      </Box>

      {/* Create a new Room*/}
      <Box component="div" textAlign="center" marginTop={5}>
        <StyledBadge badgeContent={"+"}>
          <AddRoomButton onClick={(e) => setCreateRoomModal(true)}>
            Create new room
          </AddRoomButton>
        </StyledBadge>

        <CreateRoom
          openRoomModal={createRoomModal}
          handleModalClose={handleModalClose}
        />
      </Box>
    </Box>
  );
}

export default Rooms;
