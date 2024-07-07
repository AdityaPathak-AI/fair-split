const express = require('express');
const { createRoom, leaveRoom, getRoom, getAllMembers, updateRoom, addRoomMember, netTotal, expenseListByRoom, getTotalExpense, deleteRoom } = require('../controllers/room.controller');

const roomRoute = express.Router();

roomRoute.post("/create", createRoom);
roomRoute.delete("/left/:room_id", leaveRoom)
roomRoute.delete("/delete_room/:room_id", deleteRoom)
roomRoute.post("/add-member", addRoomMember)
roomRoute.get("/get-room", getRoom)
roomRoute.get("/get-totalExpense/:room_id", getTotalExpense)
roomRoute.get("/members/:room_id", getAllMembers)
roomRoute.put("/update/:id", updateRoom);
roomRoute.get("/expenseHistory/:room_id", expenseListByRoom)
roomRoute.get("/netTotal", netTotal)

module.exports = roomRoute;