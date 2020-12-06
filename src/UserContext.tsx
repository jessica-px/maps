import React, { useReducer } from 'react';
import { dummyUser } from './dummyData';

// --------------------------------------------------------------- //
//                              Types                              //
// --------------------------------------------------------------- //

export interface UserState {
  id: string,
  name: string
}

export interface Directory {
  id: string,
  name: string,
  maps: {id: string, name: string}[]
}

type ContextType = [
  UserState,
  React.Dispatch<Action>
];

interface Action {
  type: string,
  payload: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface UserContextProviderProps {
  children: React.ReactNode
}

// --------------------------------------------------------------- //
//                             Reducer                             //
// --------------------------------------------------------------- //

const userReducer = (userState: UserState, action: Action): UserState => {
  switch (action.type) {
    default:
      return userState;
  }
};

// --------------------------------------------------------------- //
//                           Context Provider                      //
// --------------------------------------------------------------- //
// All children of UserContextProvider can use useContext() to read this
// data and dispatch updates to the reducer

export const UserContext = React.createContext<ContextType>([dummyUser, () => null]);

export const UserContextProvider = ({ children }: UserContextProviderProps): React.ReactElement => {
  const [state, dispatch] = useReducer(userReducer, dummyUser);

  return (
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};
