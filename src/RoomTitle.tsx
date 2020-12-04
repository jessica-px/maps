import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { MapContext } from './MapContextProvider';

// --------------------------------------------------------------- //
//                              Styles                             //
// --------------------------------------------------------------- //

// Styling for the "rename" button next to a room's title.
const RoomTitleRenameButton = styled.span`
  padding-left: 20px;
  font-size: 16px;
  font-weight: normal;
  &:hover {
    cursor: pointer;
    color: royalblue;
    text-decoration: underline;
  }
`;

// Container for the room's title, the input box for editing
// it, and the "rename"/"save" buttons.
const RoomTitleContainer = styled.div`
  display: flex;
  align-items: flex-end;
  padding: 20px 0;
`;

// Styling for the room's title header
const RoomTitleText = styled.div`
  font-size: 32px;
  font-weight: bold;
`;

// --------------------------------------------------------------- //
//                         Sub-Components                          //
// --------------------------------------------------------------- //

interface RoomTitleDisplayModeProps {
  id: string,
  name: string,
  toggleEditMode: () => void
}

// The RoomTitle in display mode: text title and "rename" button
const RoomTitleDisplayMode = ({ id, name, toggleEditMode }: RoomTitleDisplayModeProps) => (
  <RoomTitleContainer>
    <RoomTitleText>{id}. {name}</RoomTitleText>
    <RoomTitleRenameButton
      onClick={() => toggleEditMode()}
    >
      Rename
    </RoomTitleRenameButton>
  </RoomTitleContainer>
);

interface RoomTitleEditModeProps {
  name: string,
  id: string,
  toggleEditMode: () => void
}

// The RoomTitle in edit mode: input field and "save" button
const RoomTitleEditMode = ({ name, id, toggleEditMode }: RoomTitleEditModeProps) => {
  const [state, dispatch] = useContext(MapContext);
  const [editText, setEditText] = useState(name);

  const updateRoomName = () => {
    dispatch({
      type: 'UPDATE_ROOM_NAME',
      payload: { roomId: id, newName: editText }
    });
    toggleEditMode();
  };

  return (
    <h1>
      <input value={editText} onChange={(event) => setEditText(event.target.value)} />
      <RoomTitleRenameButton
        onClick={() => updateRoomName()}
      >
        Save
      </RoomTitleRenameButton>
    </h1>
  );
};

// --------------------------------------------------------------- //
//                           Main Component                        //
// --------------------------------------------------------------- //

interface RoomTitleProps {
  id: string,
  name: string
}

// Displays a room's title alongside an edit/save button that toggles
// between display/edit modes.
export const RoomTitle = ({ id, name }: RoomTitleProps) => {
  const [editModeEnabled, setEditModeEnabled] = useState(false);

  const toggleEditMode = () => setEditModeEnabled(!editModeEnabled);

  if (editModeEnabled) {
    return (
      <RoomTitleEditMode
        name={name}
        id={id}
        toggleEditMode={toggleEditMode}
      />
    );
  }

  return (
    <RoomTitleDisplayMode
      name={name}
      id={id}
      toggleEditMode={toggleEditMode}
    />
  );
};
