import React, { useState, useContext, ChangeEvent } from 'react';
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
  height: 100vh;
`

const SidebarColumn = styled.div`
  width: 250px;
  padding: 20px;
  padding-left: 50px;
`

const ContentColumn = styled.div`
  min-width: 400px;
  flex: 2;
  padding: 0 20px;
  max-height: 100vh;
  margin-bottom: 55px;
  overflow: auto;
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
//                         Content Component                       //
// --------------------------------------------------------------- //

const StyledTextArea = styled.textarea`
  width: 95%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  padding: 5px;
  resize: none;
`

const EditButton = styled.div`
  background-color: royalblue;
  border-radius: 10px;
  color: white;
  font-weight: bold;
  text-align: center;
  padding: 10px 20px;
  &:hover {
    cursor: pointer;
  }
  max-width: 50px;
`

const EditMarkdownTextArea = () => {
  const [ state, dispatch ] = useContext(MapContext);
  const activeRoom = state.roomList.filter(room => room.id === state.activeRoomId)[0];

  const updateRoomDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
    console.log('dispatch?')
    console.log(state.activeRoomId)
    dispatch({
      type: 'UPDATE_ROOM_DESCRIPTION',
      payload: {id: state.activeRoomId, description: event.target.value}
    })
    console.log(state.activeRoomId)
  }

  return (
    <StyledTextArea
      value={activeRoom.description}
      onChange={updateRoomDescription}
    />
  )
}

const StyledMenu = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 5px;
`

interface MenuBarProps {
  editModeEnabled: boolean,
  setEditModeEnabled: (x: boolean) => void
}

const MenuBar = ({ editModeEnabled, setEditModeEnabled }: MenuBarProps) => {
  return (
    <StyledMenu>
      <div>Menu Bar</div>
      <EditButton
        onClick={() => setEditModeEnabled(!editModeEnabled)}
      >
        {editModeEnabled ? 'Save' : 'Edit'}
      </EditButton>
    </StyledMenu>
  )
}

const ContentArea = () => {
  const [ editModeEnabled, setEditModeEnabled ] = useState(false);
  const [ state, dispatch ] = useContext(MapContext);
  const activeRoom = state.roomList.filter(room => room.id === state.activeRoomId)[0];

  return (
    <ContentColumn>
      <MenuBar
        editModeEnabled={editModeEnabled}
        setEditModeEnabled={setEditModeEnabled}
      />
      <h1>{state.activeRoomId}. {activeRoom.name}</h1>
      {editModeEnabled
        ? <EditMarkdownTextArea />
        : <ReactMarkdown renderers={{ "link":  InternalLinkRenderer }}>{activeRoom.description}</ReactMarkdown>
      }
    </ContentColumn>
)}

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
