import React, { useContext } from 'react';
import styled, { css } from 'styled-components'
import { Map } from './Map';
import { ContentArea } from './ContentArea';
import { MapContextProvider, MapContext } from './MapContextProvider';

import "leaflet/dist/leaflet.css";


// --------------------------------------------------------------- //
//                       Styled Components                         //
// --------------------------------------------------------------- //

const PageLayout = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
`

const SidebarColumn = styled.div`
  width: 250px;
  padding: 20px;
  padding-left: 50px;
`


const SidebarItem = styled.div<any>`
  padding: 10px 0;
  &:hover {
    font-weight: bold;
    cursor: pointer;
  }
  ${props => props.active && css`
    font-weight: bold;
  `}
`

// --------------------------------------------------------------- //
//                         Sidebar Component                       //
// --------------------------------------------------------------- //

const Sidebar = () => {
  const [state, dispatch] = useContext(MapContext);

  const setActiveRoomId = (newId: string): void => {
    dispatch({
      type: 'Set_ACTIVE_ROOM_ID',
      payload: newId
    })
  }

  return (
    <SidebarColumn>
      {state.roomList.map((room, i) => (
        <SidebarItem
          active={state.activeRoomId === room.id}
          onClick={() => setActiveRoomId(room.id)}
        >
          {i+1}. {room.name}
        </SidebarItem>
      ))}
    </SidebarColumn>
  )
}

// --------------------------------------------------------------- //
//                         Main Component                          //
// --------------------------------------------------------------- //

const AppWrapper = () => (
  <MapContextProvider>
    <App />
  </MapContextProvider>
)

const App = () => {
  return (
    <PageLayout>
      <Sidebar />
      <ContentArea />
      <Map
        imgUrl='https://rapidnotes.files.wordpress.com/2016/08/dyson-logos-camping-map.jpg'
      />
    </PageLayout>
  );
}

export default AppWrapper;
