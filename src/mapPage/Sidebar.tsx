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
  overflow: auto;
  background: rgba(230,239,241,1);
`;

interface SidebarItemProps {
  active: boolean
}

// Items listed in the sidebar (room titles)
const SidebarItem = styled.div<SidebarItemProps>`
  padding: 0 0 15px 10px;
  &:hover {
    font-weight: bold;
    cursor: pointer;
  }
  ${(props) => props.active && css`
    font-weight: bold;
  `}
`;

// The "+ Add Location" button at the top of the sidebar
const TextButton = styled.div`
  padding-left: 10px;
  &:hover {
    color: royalblue;
    cursor: pointer;
    text-decoration: underline;
  }
`;

const ListHeader = styled.h5`
  opacity: .5;
`;
// --------------------------------------------------------------- //
//                         Main Component                          //
// --------------------------------------------------------------- //

export const Sidebar = () => {
  const [mapState, dispatch] = useContext(MapContext);

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

  if (mapState) {
    const sortedRoomList = sortRoomListByListPosition(mapState.roomList);

    return (
      <SidebarColumn>
        <ListHeader>{mapState.name.toUpperCase()}</ListHeader>
        <TextButton onClick={() => addRoom()}>+ Add Location</TextButton>
        <ListHeader>LOCATIONS</ListHeader>
        {sortedRoomList.map((room) => (
          <SidebarItem
            key={room.id}
            active={mapState.activeRoomId === room.id}
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
