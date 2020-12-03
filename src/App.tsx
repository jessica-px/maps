import React, { useState, useContext } from 'react';
import styled, { css } from 'styled-components'
import ReactMarkdown from 'react-markdown'
import { Map } from './Map';
import { MapContextProvider, MapContext } from './MapContextProvider';

import "leaflet/dist/leaflet.css";

// --------------------------------------------------------------- //
//                           Custom Markdown                       //
// --------------------------------------------------------------- //
/*
  Styling and rendering setup for customizing the markdown links:
  now the [link](url) syntax expects the "url" to instead be a room
  id. Clicking the link sets that room to active.
  This doesn't really belong in this file and should be moved out.
*/


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
  const [state, dispatch] = useContext(MapContext);

  const setActiveRoomId = (newId: string): void => {
    dispatch({
      type: 'Set_ACTIVE_ROOM_ID',
      payload: newId
    })
  }

  return (
    <MarkdownLink onClick={() => setActiveRoomId(linkId)}>{linkText}</MarkdownLink>
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
  const [ state, dispatch ] = useContext(MapContext);
  const activeRoom = state.roomList.filter(room => room.id === state.activeRoomId)[0];

  return (
    <PageLayout>
      <Sidebar />
      <ContentColumn>
        <h1>{state.activeRoomId}. {activeRoom.name}</h1>
        <ReactMarkdown renderers={{ "link":  InternalLinkRenderer }}>{activeRoom.description}</ReactMarkdown>
      </ContentColumn>
      <Map
        imgUrl='https://rapidnotes.files.wordpress.com/2016/08/dyson-logos-camping-map.jpg'
      />
    </PageLayout>
  );
}

export default AppWrapper;
