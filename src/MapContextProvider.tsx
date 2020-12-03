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

const initialMarkerList: Marker[] = [
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
];

const initialRoomList = [
  {
    id: '1',
    name: 'Barracks',
    description: `## Description
      \nFifteen straw mattresses are placed around the room, each with a small wooden chest at its foot. A long table is in the center of the room, with benches to each side. Four lizardfolk warriors receive orders from a heavily armored officer. Another lizardfolk dressed in a robe stands to one side, observing the assembly.
      \n## Creatures
      \nIf they have not been called elsewhere, four **lizard folk**, one **lizardfolk scaleshield**, and one **lizardfolk shaman** prepare for patrol in this room.
      \nIf the party arrives here accompanied by friendly lizardfolk, the shaman initially urges the guards to attack. A successful DC 15 Charisma (Persuasion) check by a character prevents a fight, and instead the lizardfolk take the characters  in custody and take them to meet the queen.
      \n## Treasure
      \nThe chests are unlocked and contain personal possessions. Five of the chests each contain a purse with 6 sp. Three of the other chests hold a whet stone, a dagger in a scabbard, and a crude wooden carving of a crocodile.
      \n## Exits
      \nThe northern door connects to a long hallway -- within sight are doors to the [Storage Room](2) and [Officer's Quarters](3). Around a corner are doors to the Alligator Pit and Lunch Hall.
      `
  },
  {
    id: '2',
    name: 'Storage Room',
    description: `## Description
    \nHanging from hooks set into the ceiling are **six carcasses** of various shapes and sizes. Against the south and west walls are a collection of crates, baskets, and barrels filled with fruit, oil, salt, and pickled meat. Against the east wall is a large wooden cage in which squawk a dozen irritable waterfowl.
    \n## Carcasses
    \nThe carcasses include:
    \n- a manta ray
    \n- a giant frog
    \n- an adult male hobgoblin
    \n- two sharks
    \n- a giant crayfish
    \nOne of the sharks has a mostly smashed armor plate embedded in its side. The plate is made from coral and wood and appears to have been driven into the creature. If Oceanus is with the party, he identifies the shark's armor as of sahuagin manufacture and relates that animals like this serve the sahuagin as war beasts. Jn his absence, a character can glean the same information with a successful DC 14 Intelligence (Nature) check. 
    \n## Exits
    \n The eastern door opens into a long hallway -- within sight are doors to the [Barracks](1) and [Officer's Quarters](3). Around a corner are doors to the Alligator Pit and Lunch Hall.
    `
  },
  {
    id: '3',
    name: 'Officer\'s Quarters',
    description: `## Description
    \nA wooden table against the north wall is set with an earthenware jug of cider and a wooden cup. A wooden chair stands by the table. A bed stands against the west wall with a brass-bound, wooden chest against its foot.
    \n## Creatures
    \nAn officer (a **lizardfolk scaleshield**) sits on the bed, sharpening their sword. They leap up, ready to fight, as soon as the characters enter.
    \nIf the characters have avoided combat to this point, the lizardfolk in the [Barracks](1) join the officer in this room when they hear sounds of combat.
    \n## Treasure
    \n The chest is locked and can be opened by a character who makes a successful DC 12 Dexterity check using thieves' tools or who has the key. It contains personal possessions, a purse containing 25 ep, a dagger in a scabbard, and a leather whip. The officer carries the key to the chest and he wears a silver collar (15 gp).
    \n## Exits
    \n The northern door opens into a long hallway -- within sight are doors to the [Barracks](1) and [Store Room](2). Around a corner are doors to the Alligator Pit and Lunch Hall.
    \n South is a passage leading to the Armory.
    `
  }
];

export const initialState = {
  roomList: initialRoomList,
  markerList: initialMarkerList,
  activeRoomId: '1'
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
    case 'Set_ACTIVE_ROOM_ID':
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
        roomList: addRoom(state),
        markerList: addMarker(state)
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
      throw new Error(`No action found in reducer with type: ${action.type}.`);
  }
};

// --------------------------------------------------------------- //
//                          State Updaters                         //
// --------------------------------------------------------------- //
// Functions for making updates to the state -- should return values
// for use by reducer, but doesn't directly modify state

const addRoom = (state: MapState): Room[] => {
  const newRoomId = state.roomList.length + 1;
  const newRoom = {
    id: newRoomId.toString(),
    name: 'New Location',
    description: '## Description\nClick \'edit\' to customize this text.'
  };
  const newRoomList = state.roomList.slice();
  newRoomList.push(newRoom);
  return newRoomList;
};

const addMarker = (state: MapState): Marker[] => {
  const newMarkerId = state.markerList.length + 1;
  const newMarker = {
    id: newMarkerId.toString(),
    position: [30, 50]
  } as Marker;
  const newMarkerList = state.markerList.slice();
  newMarkerList.push(newMarker);
  return newMarkerList;
};

// --------------------------------------------------------------- //
//                           State Helpers                         //
// --------------------------------------------------------------- //

export const getRoomById = (roomList: Room[], id: string): Room => {
  for (const room of roomList) {
    if (room.id === id) {
      return room;
    }
  }
  throw new Error(`No room found with id: ${id}`);
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
