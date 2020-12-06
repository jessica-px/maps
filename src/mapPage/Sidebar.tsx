import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { MapContext, sortRoomListByListPosition } from './MapContext';

// --------------------------------------------------------------- //
//                       Styled Components                         //
// --------------------------------------------------------------- //

// Container for the sidebar
const SidebarColumn = styled.div`
  width: 250px;
  padding: 20px;
  padding-left: 50px;
  overflow: auto;
`;

interface SidebarItemProps {
  active: boolean
}

// Items listed in the sidebar (room titles)
const SidebarItem = styled.div<SidebarItemProps>`
  padding: 10px 0;
  &:hover {
    font-weight: bold;
    cursor: pointer;
  }
  ${(props) => props.active && css`
    font-weight: bold;
  `}
`;

// The "+ Add Location" button at the top of the sidebar
const AddNewRoomButton = styled.div`
  text-align: right;
  &:hover {
    color: royalblue;
    cursor: pointer;
    text-decoration: underline;
  }
`;

// --------------------------------------------------------------- //
//                         Main Component                          //
// --------------------------------------------------------------- //

export const Sidebar = () => {
  const [state, dispatch] = useContext(MapContext);

  const setActiveRoomId = (newId: string): void => {
    dispatch({
      type: 'SET_ACTIVE_ROOM_ID',
      payload: newId
    });
  };

  const addRoom = () => {
    dispatch({
      type: 'ADD_ROOM',
      payload: null
    });
  };

  if (state) {
    const sortedRoomList = sortRoomListByListPosition(state.roomList);

    return (
      <SidebarColumn>
        <AddNewRoomButton onClick={() => addRoom()}>+ Add Location</AddNewRoomButton>
        {sortedRoomList.map((room) => (
          <SidebarItem
            key={room.id}
            active={state.activeRoomId === room.id}
            onClick={() => setActiveRoomId(room.id)}
          >
            {room.listPosition}. {room.name}
          </SidebarItem>
        ))}
      </SidebarColumn>
    );
  }
  return <p>Didn't load!</p>;
};
