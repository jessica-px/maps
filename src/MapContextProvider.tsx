import React, { useReducer } from 'react';

// --------------------------------------------------------------- //
//                         Placeholder State                       //
// --------------------------------------------------------------- //
// Dummy data and types for the contents of the map's state

export interface Marker {
  id: string,
  position: [number, number]
}

export interface Room {
  id: string,
  name: string,
  description: string
}

export interface MapState {
  activeRoomId: string,
  roomList: Room[],
  markerList: Marker[]
}

const markerList: Marker[] = [
  {
    id: '1',
    position: [54, 70]
  },
  {
    id: '2',
    position: [65, 35]
  },
  {
    id: '3',
    position: [30, 70]
  }
]

const roomList = [
  {
    id: '1',
    name: 'Wolf Den',
    description: '## Description  \nSix wolves sleep in a cozy little wolf nest. If awoken, they will attack.  \n## Treasure  \nUnder a secret floorboard is a **Bag of Holding**. Perception DC 12 to notice the board is loose.  \n## Exits  \nThrough the eastern door is the [Storage Room](2). Up the **ladder** is the attic (Dex Save DC 10 to not fall when its rotting rung gives out!)'
  },
  {
    id: '2',
    name: 'Storage Room',
    description: 'This room is filled with crates and barrels. Searching them will only reveal rotting grain.'
  },
  {
    id: '3',
    name: 'Skeleton Room',
    description: 'Three dusty skeletons are strewn across this room. If the magic altar in Room 10 was activated, they will awaken and wander the halls.'
  }
]

export const initialState = {
  roomList: roomList,
  markerList: markerList,
  activeRoomId: '1'
}

// --------------------------------------------------------------- //
//                              Reducer                            //
// --------------------------------------------------------------- //
// Much like a Redux reducer, actions and payloads get sent here,
// and then updates to state are made as described

interface Action {
  type: string,
  payload: any
}

const reducer = (state: MapState, action: Action): MapState => {
  switch (action.type) {
    case "Set_ACTIVE_ROOM_ID":
      return {
        ...state,
        activeRoomId: action.payload
      };
    // case "DEL_CONTACT":
    //   return {
    //     contacts: state.contacts.filter(
    //       contact => contact.id !== action.payload
    //     )
    //   };
    // case "START":
    //   return {
    //     loading: true
    //   };
    // case "COMPLETE":
    //   return {
    //     loading: false
    //   };
    default:
      throw new Error();
  }
};


// --------------------------------------------------------------- //
//                        Context and Provider                     //
// --------------------------------------------------------------- //

type ContextType = [
  MapState,
  React.Dispatch<any>
]

export const MapContext = React.createContext<ContextType>([initialState, () => {return null}]);

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