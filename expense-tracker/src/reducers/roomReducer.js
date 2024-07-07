import {
  GET_ROOM_SUCCESS,
  GET_ROOM_FAIL,
  CREATE_ROOM_SUCCESS,
  CREATE_ROOM_FAIL,
  ADD_ROOM_MEMBER_SUCCESS,
  ADD_ROOM_MEMBER_FAIL,
  GET_ALL_ROOM_MEMBERS_SUCCESS,
  GET_ALL_ROOM_MEMBERS_FAIL,
  GET_ROOMS_SUCCESS,
  GET_ROOMS_FAIL,
  GET_ALL_EXPENSE_ROOM_FAIL,
  GET_ALL_EXPENSE_ROOM_SUCCESS,
  CLEAR_ERROR,
  CLEAR_SUCCESS,
  LEFT_ROOM_FAIL,
  LEFT_ROOM_SUCCESS,
  DELETE_ROOM_SUCCESS,
  DELETE_ROOM_FAIL,
  GET_NET_TOTAL_SUCCESS,
  GET_NET_TOTAL_FAIL,
} from "../actions/types";

const initialState = {
  room: [],
  rooms: [],
  addedMembers: [],
  invitedMembers: [],
  existingMembers: [],
  createdRoom: null,
  roomError: null,
  members:[],
  expenseByRoom:[],
  success:null,
  message:null,
  netTotal:null,
  Delerror:null,
  Delmessage:null,
  loading: true,

};

const roomReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_ROOMS_SUCCESS:
      return {
        ...state,
        rooms: payload,
        roomError: null,
      };
    case GET_ROOMS_FAIL:
      return {
         ...state,
          rooms: [],
          roomError: payload,
      };
    case GET_ROOM_SUCCESS:
      return {
        ...state,
        room: payload,
        roomError: null,
      };
    case GET_ROOM_FAIL:
      return {
        ...state,
        room: [],
        roomError: payload,
      };
    case CREATE_ROOM_SUCCESS:
      return {
        ...state,
        createdRoom: payload.Room,
        roomError: null,
        success:payload.message
      };
    case CREATE_ROOM_FAIL:
      return {
        ...state,
        createdRoom: null,
        roomError: payload,
      }

    case ADD_ROOM_MEMBER_SUCCESS:
      return {
        ...state,
        addedMembers: payload.newMembers,
        invitedMembers: payload.invitedMembers,
        existingMembers: payload.existingMembers,
        success: payload.message,
        roomError: null
      };
    case ADD_ROOM_MEMBER_FAIL:
      return {
        ...state,
        roomError: payload
      };

    case GET_ALL_EXPENSE_ROOM_SUCCESS:
      return {
        ...state,
        expenseByRoom: payload,
        roomError: null,
      };
    case GET_ALL_EXPENSE_ROOM_FAIL:
      return {
        ...state,
        expenseByRoom: null,
        roomError: payload,
      }
    case GET_ALL_ROOM_MEMBERS_SUCCESS:
      return {
        ...state,
        members: payload,
        roomError: null,
      };
    case GET_ALL_ROOM_MEMBERS_FAIL:
      return {
        ...state,
        members: null,
        roomError: payload,
      }
    case LEFT_ROOM_SUCCESS:
      return {
        ...state,
        Delmessage: payload,
        Delerror: null,
      };
    case LEFT_ROOM_FAIL:
      return {
        ...state,
        Delmessage: null,
        Delerror: payload,
      }
    case DELETE_ROOM_SUCCESS:
      return {
        ...state,
        Delmessage: payload,
        Delerror: null,
      };
    case DELETE_ROOM_FAIL:
      return {
        ...state,
        Delmessage: null,
        Delerror: payload,
      }

      case GET_NET_TOTAL_SUCCESS:
        return {
          ...state,
          netTotal: payload,
          loading:false,
          roomError: null,
        };
      case GET_NET_TOTAL_FAIL:
        return {
          ...state,
          netTotal: null,
          loading:false,
          roomError: payload,
        }

      case CLEAR_SUCCESS:
        return {
          ...state,
          success: null,
          message:null,
          Delmessage:null
        };
      case CLEAR_ERROR:
        return {
          ...state,
          roomError: null,
          message:null,
          Delerror:null
        };

    default:
      return state;
  }
};


export default roomReducer;
