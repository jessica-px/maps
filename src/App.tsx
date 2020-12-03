import React, { useState } from 'react';
import styled, { css } from 'styled-components'
import ReactMarkdown from 'react-markdown'
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
    description: '## Description  \nSix wolves sleep in a cozy little wolf nest. If awoken, they will attack.  \n## Treasure  \nUnder a secret floorboard is a **Bag of Holding**. Perception DC 12 to notice the board is loose.  \n## Exits  \nThrough the [Eastern Door](1). Up the **ladder** is the attic (Dex Save DC 10 to not fall when its rotting rung gives out!)'
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

const MarkdownLink = styled.span`
  font-weight: bold;
  color: royalblue;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

const InternalLinkRenderer = ({href, children}: any) => {
  const linkId = href;
  const linkText = children[0].props.value;
  return (
    <MarkdownLink onClick={() => console.log("Click! Id: " + linkId)}>{linkText}</MarkdownLink>
  );
}

// --------------------------------------------------------------- //
//                       Styled Components                         //
// --------------------------------------------------------------- //

const PageLayout = styled.div`
  display: flex;
  flex-direction: row;
`

const SidebarColumn = styled.div`
  width: 250px;
  padding: 20px;
  padding-left: 50px;
`

const ContentColumn = styled.div`
  min-width: 400px;
  flex: 2;
  padding: 20px;
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
//                         Sub-Components                          //
// --------------------------------------------------------------- //

const Sidebar = ({activeRoomId, setActiveRoomId}: any) => (
  <SidebarColumn>
    {roomList.map((room, i) => (
      <SidebarItem
        active={activeRoomId === room.id}
        onClick={() => setActiveRoomId(room.id)}
      >
        {i+1}. {room.name}
      </SidebarItem>
    ))}
  </SidebarColumn>
)

// --------------------------------------------------------------- //
//                         Main Component                          //
// --------------------------------------------------------------- //

const App = () => {
  const [activeRoomId, setActiveRoomId] = useState('1');
  const activeRoom = roomList.filter(room => room.id === activeRoomId)[0];

  return (
    <PageLayout>
      <Sidebar activeRoomId={activeRoomId} setActiveRoomId={setActiveRoomId} />
      <ContentColumn>
        <h1>{activeRoom.name}</h1>
        <ReactMarkdown renderers={{ "link":  InternalLinkRenderer }}>{activeRoom.description}</ReactMarkdown>
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
