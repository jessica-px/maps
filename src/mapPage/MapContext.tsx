import React, { useReducer } from 'react';

// --------------------------------------------------------------- //
//                                  Types                          //
// --------------------------------------------------------------- //
// Types for the contents of the map's state

export interface Marker {
  id: string,
  position: number[]
}

export interface Room {
  id: string,
  listPosition: number,
  name: string,
  description: string
}

export interface MapState {
  id: string,
  name: string,
  description: string,
  imageUrl: string,
  activeRoomId: string,
  roomList: Room[],
  markerList: Marker[]
}

// --------------------------------------------------------------- //
//                              Reducer                            //
// --------------------------------------------------------------- //
// Much like a Redux reducer, actions and payloads get sent here,
// and then updates to state are made as described

interface Action {
  type: string,
  payload: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

const reducer = (mapState: MapState, action: Action): MapState => {
  switch (action.type) {
    case 'SET_MAP_DATA':
      return {
        ...action.payload
      };
    case 'SET_ACTIVE_ROOM_ID':
      return {
        ...mapState,
        activeRoomId: action.payload
      };
    case 'UPDATE_ROOM_DESCRIPTION':
      return {
        ...mapState,
        roomList: mapState.roomList.map((room) => {
          if (room.id === action.payload.id) {
            return { ...room, description: action.payload.description };
          }
          return room;
        })
      };
    case 'ADD_ROOM':
      return {
        ...mapState,
        ...addRoom(mapState)
      };
    case 'UPDATE_ROOM_NAME':
      return {
        ...mapState,
        roomList: renameRoom(mapState, action.payload.roomId, action.payload.newName)
      };
    case 'DELETE_ROOM':
      return {
        ...mapState,
        ...deleteRoom(mapState, action.payload.id)
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

const addRoom = (mapState: MapState): MapState => {
  const newId = Date.now().toString();
  // build new Room[]
  const newRoom = {
    id: newId,
    listPosition: mapState.roomList.length + 1,
    name: 'New Location',
    description: '## Description\nClick \'edit\' to customize this text.'
  };
  const newRoomList = mapState.roomList.slice();
  newRoomList.push(newRoom);
  // Build new Marker[]
  const newMarker = {
    id: newId,
    position: [30, 50]
  } as Marker;
  const newMarkerList = mapState.markerList.slice();
  newMarkerList.push(newMarker);

  return {
    ...mapState,
    roomList: newRoomList,
    markerList: newMarkerList
  };
};

const renameRoom = (mapState: MapState, roomId: string, newName: string): Room[] => {
  // Returns a Room[] wherein the room with the given ID is updated with the new name
  const newRoomList = mapState.roomList.map((room) => {
    if (room.id === roomId) {
      return { ...room, name: newName };
    }
    return room;
  });

  return newRoomList;
};

const deleteRoom = (mapState: MapState, roomId: string): MapState => {
  // New list of rooms, minus the one with the given id, and adjusting
  // list positions accordingly
  const sortedRoomList = sortRoomListByListPosition(mapState.roomList);
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
  const newMarkerList = mapState.markerList.filter((marker) => marker.id !== roomId);

  // Sets room with next highest listPosition as next active room, unless this is
  // the final room. Then choose the next lowest.
  const currentRoom = getRoomById(mapState.roomList, roomId);
  let newActiveRoomId = '';
  if (currentRoom.listPosition < mapState.roomList.length) {
    newActiveRoomId = getRoomByListPosition(mapState.roomList, currentRoom.listPosition + 1).id;
  } else {
    newActiveRoomId = getRoomByListPosition(mapState.roomList, currentRoom.listPosition - 1).id;
  }

  return {
    ...mapState,
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
  MapState | null,
  React.Dispatch<Action>
];

export const MapContext = React.createContext<ContextType>([null, () => null]);

interface MapContextProviderProps {
  children: React.ReactElement
}

// This wraps around the top level of the app, allowing all children to
// use useContext() to read this data and dispatch updates to the reducer
export const MapContextProvider = ({ children }: MapContextProviderProps): React.ReactElement => {
  const [mapState, dispatch] = useReducer(reducer, null as any); // eslint-disable-line @typescript-eslint/no-explicit-any

  return (
    <MapContext.Provider value={[mapState, dispatch]}>
      {children}
    </MapContext.Provider>
  );
};
