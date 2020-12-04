import React, { useReducer } from 'react';
import { initialRoomList, initialMarkerList } from '../dummyData';

// --------------------------------------------------------------- //
//                         Placeholder State                       //
// --------------------------------------------------------------- //
// Dummy data and types for the contents of the map's state

const getRoomList = (): Room[] => initialRoomList as Room[];
const getMarkerList = (): Marker[] => initialMarkerList as Marker[];

export interface Marker {
  id: string,
  position: [number, number]
}

export interface Room {
  id: string,
  listPosition: number,
  name: string,
  description: string
}

export interface MapState {
  activeRoomId: string,
  roomList: Room[],
  markerList: Marker[]
}

export const initialState: MapState = {
  roomList: getRoomList(),
  markerList: getMarkerList(),
  activeRoomId: initialRoomList[0].id
};

// --------------------------------------------------------------- //
//                              Reducer                            //
// --------------------------------------------------------------- //
// Much like a Redux reducer, actions and payloads get sent here,
// and then updates to state are made as described

interface Action {
  type: string,
  payload: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

const reducer = (state: MapState, action: Action): MapState => {
  switch (action.type) {
    case 'SET_ACTIVE_ROOM_ID':
      return {
        ...state,
        activeRoomId: action.payload
      };
    case 'UPDATE_ROOM_DESCRIPTION':
      return {
        ...state,
        roomList: state.roomList.map((room) => {
          if (room.id === action.payload.id) {
            return { ...room, description: action.payload.description };
          }
          return room;
        })
      };
    case 'ADD_ROOM':
      return {
        ...state,
        ...addRoom(state)
      };
    case 'UPDATE_ROOM_NAME':
      return {
        ...state,
        roomList: renameRoom(state, action.payload.roomId, action.payload.newName)
      };
    case 'DELETE_ROOM':
      return {
        ...state,
        ...deleteRoom(state, action.payload.id)
      };
    default:
      throw new Error(`No action found in reducer with type: ${action.type}.`);
  }
};

// --------------------------------------------------------------- //
//                          State Updaters                         //
// --------------------------------------------------------------- //
// Functions for making updates to the state -- should return values
// for use by reducer, but doesn't directly modify state

const addRoom = (state: MapState): MapState => {
  const newId = Date.now().toString();
  // build new Room[]
  const newRoom = {
    id: newId,
    listPosition: state.roomList.length + 1,
    name: 'New Location',
    description: '## Description\nClick \'edit\' to customize this text.'
  };
  const newRoomList = state.roomList.slice();
  newRoomList.push(newRoom);
  // Build new Marker[]
  const newMarker = {
    id: newId,
    position: [30, 50]
  } as Marker;
  const newMarkerList = state.markerList.slice();
  newMarkerList.push(newMarker);

  return {
    ...state,
    roomList: newRoomList,
    markerList: newMarkerList
  };
};

const renameRoom = (state: MapState, roomId: string, newName: string): Room[] => {
  // Returns a Room[] wherein the room with the given ID is updated with the new name
  const newRoomList = state.roomList.map((room) => {
    if (room.id === roomId) {
      return { ...room, name: newName };
    }
    return room;
  });

  return newRoomList;
};

const deleteRoom = (state: MapState, roomId: string): MapState => {
  // New list of rooms, minus the one with the given id, and adjusting
  // list positions accordingly
  const sortedRoomList = sortRoomListByListPosition(state.roomList);
  const newRoomList = [];
  let currListPosition = 1;
  for (let i = 0; i < sortedRoomList.length; i++) {
    const room = sortedRoomList[i];
    if (room.id !== roomId) {
      newRoomList.push({ ...room, listPosition: currListPosition });
      currListPosition += 1;
    }
  }
  // Removes marker associated with deleted room
  const newMarkerList = state.markerList.filter((marker) => marker.id !== roomId);

  // Sets room with next highest listPosition as next active room, unless this is
  // the final room. Then choose the next lowest.
  const currentRoom = getRoomById(state.roomList, roomId);
  let newActiveRoomId = '';
  if (currentRoom.listPosition < state.roomList.length) {
    newActiveRoomId = getRoomByListPosition(state.roomList, currentRoom.listPosition + 1).id;
  } else {
    newActiveRoomId = getRoomByListPosition(state.roomList, currentRoom.listPosition - 1).id;
  }

  return {
    roomList: newRoomList,
    markerList: newMarkerList,
    activeRoomId: newActiveRoomId
  };
};

// --------------------------------------------------------------- //
//                           State Getters                         //
// --------------------------------------------------------------- //
// Functions for filtering and sorting through state data -- requires
// state (or its properties) to be passed in. No mutations.

export const getRoomById = (roomList: Room[], id: string): Room => {
  for (const room of roomList) {
    if (room.id === id) {
      return room;
    }
  }
  throw new Error(`No room found with id: ${id}`);
};

export const getRoomByListPosition = (roomList: Room[], position: number): Room => {
  for (const room of roomList) {
    if (room.listPosition === position) {
      return room;
    }
  }
  throw new Error(`No room found with listPosition: ${position}`);
};

export const sortRoomListByListPosition = (roomList: Room[]): Room[] => {
  const newRoomList = roomList.slice();
  newRoomList.sort((a: Room, b: Room) => a.listPosition - b.listPosition);
  return newRoomList;
};

// --------------------------------------------------------------- //
//                        Context and Provider                     //
// --------------------------------------------------------------- //

type ContextType = [
  MapState,
  React.Dispatch<Action>
];

export const MapContext = React.createContext<ContextType>([initialState, () => null]);

interface MapContextProviderProps {
  children: React.ReactElement
}

// This wraps around the top level of the app, allowing all children to
// use useContext() to read this data and dispatch updates to the reducer
export const MapContextProvider = ({ children }: MapContextProviderProps): React.ReactElement => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MapContext.Provider value={[state, dispatch]}>
      {children}
    </MapContext.Provider>
  );
};
