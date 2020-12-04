import React, { useState, useContext, ChangeEvent } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { MapContext, Room, getRoomById } from './MapContextProvider';
import { RoomTitle } from './RoomTitle';

// --------------------------------------------------------------- //
//                              Styles                             //
// --------------------------------------------------------------- //

// Container in which everything inthe content area is held
const ContentColumn = styled.div`
  min-width: 400px;
  flex: 2;
  padding: 20px 20px 0 20px;
  overflow: auto;
  box-sizing: border-box;
`;

// height is temporarily hardcoded until dynamic height for textareas
// can be figured out :(
const StyledTextArea = styled.textarea`
  width: 96%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  padding: 5px;
  resize: none;
  height: 557px;
`;

// Style for the edit/delete buttons
const EditButton = styled.div`
  &:hover {
    color: royalblue;
    cursor: pointer;
    text-decoration: underline;
  }
`;

// The menu bar that renders above the room title,
// contains the the edit/delete buttons
const StyledMenu = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
`;

// For adding scrollbars
const SizeContainer = styled.div`
  overflow: auto;
`;

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
`;

interface InternalLinkRendererProps {
  href: string,
  children: React.ReactElement[]
}

const InternalLinkRenderer = ({ href, children }: InternalLinkRendererProps) => {
  const linkId = href;
  const linkText = children[0].props.value;
  const [state, dispatch] = useContext(MapContext);

  const setActiveRoomId = (newId: string): void => {
    dispatch({
      type: 'Set_ACTIVE_ROOM_ID',
      payload: newId
    });
  };

  return (
    <MarkdownLink onClick={() => setActiveRoomId(linkId)}>{linkText}</MarkdownLink>
  );
};

// --------------------------------------------------------------- //
//                           Sub-Components                        //
// --------------------------------------------------------------- //

// A large text area for editing the body content of a room. Text is
// in markdown format.
const EditMarkdownTextArea = () => {
  const [state, dispatch] = useContext(MapContext);
  const activeRoom = getRoomById(state.roomList, state.activeRoomId);

  const updateRoomDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({
      type: 'UPDATE_ROOM_DESCRIPTION',
      payload: { id: state.activeRoomId, description: event.target.value }
    });
  };

  return (
    <StyledTextArea
      value={activeRoom.description}
      onChange={updateRoomDescription}
    />
  );
};

interface MenuBarProps {
  editModeEnabled: boolean,
  setEditModeEnabled: (x: boolean) => void
}
// The menu bar above the content area, containing the Edit button
const MenuBar = ({ editModeEnabled, setEditModeEnabled }: MenuBarProps) => (
  <StyledMenu>
    <div>Menu Bar</div>
    <EditButton
      onClick={() => setEditModeEnabled(!editModeEnabled)}
    >
      {editModeEnabled ? 'Save' : 'Edit'}
    </EditButton>
  </StyledMenu>
);

interface ContentDisplayAreaProps {
  activeRoom: Room
}

// The large section for displaying a room's body content. Takes markdown
// as input and renders it with react-markdown.
const ContentDisplayArea = ({ activeRoom }: ContentDisplayAreaProps) => (
  <SizeContainer>
    <ReactMarkdown renderers={{ link: InternalLinkRenderer }}>
      {activeRoom.description}
    </ReactMarkdown>
  </SizeContainer>
);

// --------------------------------------------------------------- //
//                           Main Component                        //
// --------------------------------------------------------------- //
// The contents of the middle column of the map page:
// renders a menu bar with edit/delete buttons, the room's title,
// and can swap between displaying the styled content or a textarea
// where users can edit the markdown.

export const ContentArea = () => {
  const [editModeEnabled, setEditModeEnabled] = useState(false);
  const [state] = useContext(MapContext);

  const activeRoom = getRoomById(state.roomList, state.activeRoomId);

  return (
    <ContentColumn>
      <MenuBar
        editModeEnabled={editModeEnabled}
        setEditModeEnabled={setEditModeEnabled}
      />
      <RoomTitle
        id={state.activeRoomId}
        name={activeRoom.name}
      />
      {editModeEnabled
        ? <EditMarkdownTextArea />
        : <ContentDisplayArea activeRoom={activeRoom} />}
    </ContentColumn>
  );
};
