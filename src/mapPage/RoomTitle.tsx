import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { MapContext, Room } from './MapContextProvider';

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

const RoomTitleInputStyle = styled.input`
  font-size: 32px;
  font-weight: bold;
`;

// --------------------------------------------------------------- //
//                         Sub-Components                          //
// --------------------------------------------------------------- //

interface RoomTitleDisplayModeProps {
  listPosition: number,
  name: string,
  toggleEditMode: () => void
}

// The RoomTitle in display mode: text title and "rename" button
const RoomTitleDisplayMode = ({
  listPosition,
  name,
  toggleEditMode
}: RoomTitleDisplayModeProps) => (
  <RoomTitleContainer>
    <RoomTitleText>{listPosition}. {name}</RoomTitleText>
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
    <RoomTitleContainer>
      <RoomTitleInputStyle value={editText} onChange={(event) => setEditText(event.target.value)} />
      <RoomTitleRenameButton
        onClick={() => updateRoomName()}
      >
        Save
      </RoomTitleRenameButton>
    </RoomTitleContainer>
  );
};

// --------------------------------------------------------------- //
//                           Main Component                        //
// --------------------------------------------------------------- //

interface RoomTitleProps {
  room: Room
}

// Displays a room's title alongside an edit/save button that toggles
// between display/edit modes.
export const RoomTitle = ({ room }: RoomTitleProps) => {
  const [editModeEnabled, setEditModeEnabled] = useState(false);

  const toggleEditMode = () => setEditModeEnabled(!editModeEnabled);

  if (editModeEnabled) {
    return (
      <RoomTitleEditMode
        name={room.name}
        id={room.id}
        toggleEditMode={toggleEditMode}
      />
    );
  }

  return (
    <RoomTitleDisplayMode
      name={room.name}
      listPosition={room.listPosition}
      toggleEditMode={toggleEditMode}
    />
  );
};
