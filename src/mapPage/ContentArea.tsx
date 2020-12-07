import React, { useState, useContext, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { Room, MapContext } from './MapContext';
import { RoomTitle } from './RoomTitle';

// --------------------------------------------------------------- //
//                              Styles                             //
// --------------------------------------------------------------- //

// Container in which everything inthe content area is held
const ContentColumn = styled.div`
  min-width: 400px;
  flex: 2;
  overflow: auto;
  box-sizing: border-box;
`;

// height is temporarily hardcoded until dynamic height for textareas
// can be figured out :(
const StyledTextArea = styled.textarea`
  width: 90%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  padding: 5px;
  margin: 0 20px;
  resize: none;
  height: 557px;
`;

// Style for the edit/delete buttons
const MenuButton = styled.div`
  &:hover {
    color: royalblue;
    cursor: pointer;
    text-decoration: underline;
  }
`;

// The menu bar that renders above the room title,
// contains (fake) breadcrumbs on the left and edit/delete buttons on the right
const StyledMenu = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  padding: 20px;
  border-bottom: 1px solid lightgrey;
`;

const MenuButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  font-size: 20px;
  & > div {
    padding-left: 18px;
  }
`;

// For adding scrollbars
const SizeContainer = styled.div`
  overflow: auto;
  min-height: 600px;
  box-sizing: border-box;
  padding: 0 20px;
`;

const MapTitle = styled.div`
  font-weight: 300;
  font-size: 24px;
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
  const [, dispatch] = useContext(MapContext);

  const setActiveRoomId = (newId: string): void => {
    dispatch({
      type: 'SET_ACTIVE_ROOM_ID',
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
interface EditMarkdownTextAreaProps {
  activeRoom: Room
}
const EditMarkdownTextArea = ({ activeRoom }:EditMarkdownTextAreaProps) => {
  const [, dispatch] = useContext(MapContext);

  const updateRoomDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({
      type: 'UPDATE_ROOM_DESCRIPTION',
      payload: { id: activeRoom.id, description: event.target.value }
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
  setEditModeEnabled: (x: boolean) => void,
  activeRoomId: string
}
// The menu bar above the content area, containing the Edit button
const MenuBar = ({ editModeEnabled, setEditModeEnabled, activeRoomId }: MenuBarProps) => {
  const [mapState, dispatch] = useContext(MapContext);

  const deleteRoom = (id: string): void => {
    dispatch({
      type: 'DELETE_ROOM',
      payload: { id }
    });
  };

  if (mapState) {
    return (
      <StyledMenu>
        <MapTitle>{mapState.name}</MapTitle>
        <MenuButtons>
          <MenuButton
            onClick={() => deleteRoom(activeRoomId)}
          >
            <FontAwesomeIcon icon={['fal', 'trash']} />
          </MenuButton>
          <MenuButton
            onClick={() => setEditModeEnabled(!editModeEnabled)}
          >
            {editModeEnabled ? <FontAwesomeIcon icon={['fal', 'save']} /> : <FontAwesomeIcon icon={['fal', 'edit']} />}
          </MenuButton>
        </MenuButtons>
      </StyledMenu>
    );
  }
  return <p>Loading...</p>;
};
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

interface ContentAreaProps {
  activeRoom: Room
}

export const ContentArea = ({ activeRoom }: ContentAreaProps) => {
  const [editModeEnabled, setEditModeEnabled] = useState(false);

  return (
    <ContentColumn>
      <MenuBar
        editModeEnabled={editModeEnabled}
        setEditModeEnabled={setEditModeEnabled}
        activeRoomId={activeRoom.id}
      />
      <RoomTitle
        room={activeRoom}
      />
      {editModeEnabled
        ? <EditMarkdownTextArea activeRoom={activeRoom} />
        : <ContentDisplayArea activeRoom={activeRoom} />}
    </ContentColumn>
  );
};
