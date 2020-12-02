import React, { useState } from 'react';
import styled from 'styled-components'
import { Map } from './Map';

import "leaflet/dist/leaflet.css";

// --------------------------------------------------------------- //
//                           Placeholder Data                      //
// --------------------------------------------------------------- //
/*
  Info like the list of all markers and the currently active marker
  should eventually live in a highler level of state. Ultimately
  this list should stay in sync with one that lives in a DB.
*/

interface Marker {
  id: string,
  position: [number, number]
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

interface roomKey {
  id: string,
  name: string,
  description: string
}

const roomList = [
  {
    id: '1',
    name: 'Wolf Den',
    description: 'Five large wolves are sleeping in this room. If awoken, they will attack.'
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

// --------------------------------------------------------------- //
//                       Styled Components                         //
// --------------------------------------------------------------- //

const PageLayout = styled.div`
  display: flex;
  flex-direction: row;
`

const SidebarColumn = styled.div`
  background-color: lightgray;
  width: 250px;
`

const ContentColumn = styled.div`
  background-color: lightpink;
  min-width: 400px;
  flex: 2;
`

// --------------------------------------------------------------- //
//                         Main Component                          //
// --------------------------------------------------------------- //

const App = () => {
  const [activeRoomId, setActiveRoomId] = useState('1');
  const activeRoom = roomList.filter(room => room.id === activeRoomId)[0];

  return (
    <PageLayout>
      <SidebarColumn>
        {roomList.map(room => (
          <p>{room.name}</p>
        ))}
      </SidebarColumn>
      <ContentColumn>
        <h1>{activeRoom.name}</h1>
        <p>{activeRoom.description}</p>
      </ContentColumn>
      <Map
        imgUrl='https://rapidnotes.files.wordpress.com/2016/08/dyson-logos-camping-map.jpg'
        markerList={markerList}
        activeRoomId={activeRoomId}
        setActiveRoomId={setActiveRoomId}
      />
    </PageLayout>

  );
}

export default App;
