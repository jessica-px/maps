import React, { useContext } from 'react';
import styled from 'styled-components';
import { MapContainer, ImageOverlay, useMap } from 'react-leaflet';
import { LatLngBoundsExpression } from 'leaflet';
import { DraggableMarker } from './DraggableMarker';
import { MapContext, getRoomById } from './MapContextProvider';

import 'leaflet/dist/leaflet.css';

// --------------------------------------------------------------- //
//                              Set Up                             //
// --------------------------------------------------------------- //

// Bounds should be the smallest renderable size of the image (full resolution visible only via zooming)
// the aspect ratio should be the same as original size. Eventually this should be caluclated based on
// the actual image, not hardcoded.
const imgBounds = [[0, 0], [500, 375]] as LatLngBoundsExpression;

// This allows us to hook the leaflet "map" contained within <MapContainer />
// We can then call all kinds of methods on it
// https://react-leaflet.js.org/docs/api-map#hooks
// https://leafletjs.com/reference-1.7.1.html#map-example
function SetMapBoundsHook() {
  const map = useMap();
  map.setMaxBounds(imgBounds);
  return null;
}

// --------------------------------------------------------------- //
//                       Styled Components                         //
// --------------------------------------------------------------- //

// We have to interact with leaflet's icons via classes -- these
// let us changes appearances for active/inactive icons
const StyleContainer = styled.div`
  .leaflet-marker-icon {
    filter: saturate(120%);
  }
  .leaflet-marker-icon-inactive {
    filter: saturate(50%);
  }
`;

// --------------------------------------------------------------- //
//                         Main Component                          //
// --------------------------------------------------------------- //
/*
  This is a dynamic map that displays:
    1. A pan-able, zoomable image from the given url, and
    2. An assortment of draggable markers laid out on this image based on the data
      in markerList, which describes the coordinates and IDs for each marker
*/

interface MapProps {
  imgUrl: string
}

export const Map = ({ imgUrl }: MapProps) => {
  const [state, dispatch] = useContext(MapContext);

  const setActiveMarkerId = (newId: string): void => {
    dispatch({
      type: 'Set_ACTIVE_ROOM_ID',
      payload: newId
    });
  };

  return (
    <StyleContainer>
      <MapContainer center={[0, 0]} zoom={1} minZoom={0} maxZoom={3} scrollWheelZoom={false} style={{ height: '600px', width: '600px' }}>
        <SetMapBoundsHook />
        <ImageOverlay bounds={imgBounds} url={imgUrl} />
        {state.markerList.map((markerData) => (
          <DraggableMarker
            roomName={getRoomById(state.roomList, markerData.id).name}
            markerData={markerData}
            key={markerData.id}
            active={state.activeRoomId === markerData.id}
            setActiveMarkerId={setActiveMarkerId}
          />
        ))}
      </MapContainer>
    </StyleContainer>
  );
};
