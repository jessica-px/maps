import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { Map } from './mapPage/Map';
import { ContentArea } from './mapPage/ContentArea';
import { MapContextProvider, MapContext } from './mapPage/MapContextProvider';

import 'leaflet/dist/leaflet.css';

// --------------------------------------------------------------- //
//                       Styled Components                         //
// --------------------------------------------------------------- //

const PageLayout = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
`;

const SidebarColumn = styled.div`
  width: 250px;
  padding: 20px;
  padding-left: 50px;
`;

interface SidebarItemProps {
  active: boolean
}

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

const AddNewRoomButton = styled.div`
  text-align: right;
  &:hover {
    color: royalblue;
    cursor: pointer;
    text-decoration: underline;
  }
`;

// --------------------------------------------------------------- //
//                         Sidebar Component                       //
// --------------------------------------------------------------- //

const Sidebar = () => {
  const [state, dispatch] = useContext(MapContext);

  const setActiveRoomId = (newId: string): void => {
    dispatch({
      type: 'Set_ACTIVE_ROOM_ID',
      payload: newId
    });
  };

  const addRoom = () => {
    dispatch({
      type: 'ADD_ROOM',
      payload: null
    });
  };

  return (
    <SidebarColumn>
      <AddNewRoomButton onClick={() => addRoom()}>+ Add Location</AddNewRoomButton>
      {state.roomList.map((room, i) => (
        <SidebarItem
          key={room.id}
          active={state.activeRoomId === room.id}
          onClick={() => setActiveRoomId(room.id)}
        >
          {i + 1}. {room.name}
        </SidebarItem>
      ))}
    </SidebarColumn>
  );
};

// --------------------------------------------------------------- //
//                         Main Component                          //
// --------------------------------------------------------------- //

const AppWrapper = () => (
  <MapContextProvider>
    <App />
  </MapContextProvider>
);

const App = () => (
  <PageLayout>
    <Sidebar />
    <ContentArea />
    <Map
      imgUrl="https://rapidnotes.files.wordpress.com/2016/08/dyson-logos-camping-map.jpg"
    />
  </PageLayout>
);

export default AppWrapper;
