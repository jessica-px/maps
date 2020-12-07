import React, { useContext, useState } from 'react';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MapContext, sortRoomListByListPosition, Room } from './MapContext';

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
  text-align: left;
  flex: 1;
  padding: 10px 0;
  &:hover {
    color: royalblue;
    cursor: pointer;
  }
  ${(props) => props.active && css`
    font-weight: bold;
  `}
`;

// The "+ Add Location" button at the top of the sidebar
const TextButton = styled.div`
  padding: 0 0 15px 10px;
  &:hover {
    color: royalblue;
    cursor: pointer;
  }
`;

const ListHeader = styled.h5`
  opacity: .5;
`;

// A completely unstyled html button, for extending
const UnStyledButton = styled.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  outline: inherit;
  cursor: pointer;
`;

// The full-width "buttons" in the sidebar
const SidebarButtonStyle = styled(UnStyledButton)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background-color: aliceblue;
  }
`;

// The trash can button that gets rendered on hovering over
// a sidebar item
const SidebarItemTrashButton = styled(UnStyledButton)`
  font-size: 18px;
  padding: 9px;
  &:hover {
    font-weight: bold;
    color: royalblue;
  }
`;

// --------------------------------------------------------------- //
//                         Sub Components                          //
// --------------------------------------------------------------- //

interface RoomButtonProps {
  room: Room,
  active: boolean,
  setActiveRoomId: (id: string) => void
}

const RoomButton = ({ room, active, setActiveRoomId }: RoomButtonProps) => {
  const [, dispatch] = useContext(MapContext);
  const [isHovering, setIsHovering] = useState(false);

  const deleteRoom = () => {
    dispatch({
      type: 'DELETE_ROOM',
      payload: { id: room.id }
    });
  };

  return (
    <SidebarButtonStyle
      type="button"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <SidebarItem
        key={room.id}
        active={active}
        onClick={() => setActiveRoomId(room.id)}
      >
        {room.listPosition}. {room.name}
      </SidebarItem>
      {isHovering
        && (
          <SidebarItemTrashButton onClick={() => deleteRoom()}>
            <FontAwesomeIcon icon={['fal', 'trash']} />
          </SidebarItemTrashButton>
        )}
    </SidebarButtonStyle>
  );
};

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
          <RoomButton
            key={room.id}
            room={room}
            active={room.id === mapState.activeRoomId}
            setActiveRoomId={setActiveRoomId}
          />
        ))}
      </SidebarColumn>
    );
  }
  return <p>Didn't load!</p>;
};
