import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// @ts-ignore
import PanelGroup from 'react-panelgroup';

import { MapContext, sortRoomListByListPosition, Room } from './MapContext';
import { Directory, UserState } from '../UserContext';

// --------------------------------------------------------------- //
//                       Styled Components                         //
// --------------------------------------------------------------- //

// Container for the sidebar
const SidebarColumn = styled.div`
  width: 250px;
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

// The "Add Location" button at the top of the sidebar
const AddButton = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  &:hover {
    color: royalblue;
    cursor: pointer;
  }
`;

// The small, all-caps headers in each section
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

// Used for the top half of the sidebar, adds padding
const SidebarTopSection = styled.div`
  padding: 20px 0;
  width: 100%;
  overflow: auto;
  & > * {
    padding: 0 20px;
  }
`;

// Used for the bottom half of the sidebar, adds padding
const SidebarBottomSection = styled.div`
  padding: 20px 0;
  width: 100%;
  overflow: auto;
  & > * {
    padding: 0 20px;
  }
`;

// --------------------------------------------------------------- //
//                         Sub Components                          //
// --------------------------------------------------------------- //

interface RoomButtonProps {
  room: Room,
  active: boolean
}

const RoomButton = ({ room, active }: RoomButtonProps) => {
  const [, dispatch] = useContext(MapContext);
  const [isHovering, setIsHovering] = useState(false);

  const setActiveRoomId = (newId: string): void => {
    dispatch({
      type: 'SET_ACTIVE_ROOM_ID',
      payload: newId
    });
  };

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

interface DirectoryContainerProps {
  dir: Directory
}

const DirectoryContainer = ({ dir }: DirectoryContainerProps) => {
  const history = useHistory();

  const goToMap = (id: string) => {
    history.push(`maps?id=${id}`);
  };

  return (
    <>
      <div>{dir.name}</div>
      <>
        {dir.maps.map((map) => (
          <SidebarButtonStyle key={map.id}>
            <SidebarItem onClick={() => goToMap(map.id)} active={false}>{map.name}</SidebarItem>
          </SidebarButtonStyle>
        ))}
      </>
    </>
  );
};

const DirectoriesList = () => {
  const [userState, setUserState] = useState<UserState | null>(null);
  const [directories, setDirectories] = useState<Directory[] | null>(null);

  useEffect(() => {
    getUser();
  }, []);

  const getOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const getUser = () => {
    fetch('/api/user', getOptions)
      .then((response: any) => response.json()) // eslint-disable-line @typescript-eslint/no-explicit-any
      .then((json: UserState) => {
        setUserState(json);
        getDirectories(json.id);
      });
  };

  const getDirectories = (id: string) => {
    fetch(`/api/directories?userId=${id}`, getOptions)
      .then((response: any) => response.json()) // eslint-disable-line @typescript-eslint/no-explicit-any
      .then((json: Directory[]) => {
        setDirectories(json);
      });
  };

  if (userState && directories) {
    return (
      <>
        {
          directories.map((dir) => <DirectoryContainer dir={dir} key={dir.id} />)
        }
      </>
    );
  }

  return <p>Loading...</p>;
};

// --------------------------------------------------------------- //
//                         Main Component                          //
// --------------------------------------------------------------- //

export const Sidebar = () => {
  const [mapState, dispatch] = useContext(MapContext);

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
        <PanelGroup direction="column" borderColor="#CCC">
          <SidebarTopSection>
            <ListHeader>{mapState.name.toUpperCase()}</ListHeader>
            <DirectoriesList />
          </SidebarTopSection>
          <SidebarBottomSection>
            <AddButton onClick={() => addRoom()}>
              <FontAwesomeIcon icon={['fas', 'map-marker-plus']} />&nbsp;New Location
            </AddButton>
            <ListHeader>LOCATIONS</ListHeader>
            {sortedRoomList.map((room) => (
              <RoomButton
                key={room.id}
                room={room}
                active={room.id === mapState.activeRoomId}
              />
            ))}
          </SidebarBottomSection>
        </PanelGroup>
      </SidebarColumn>
    );
  }
  return <p>Didn't load!</p>;
};
