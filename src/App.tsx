import React from 'react';
import styled from 'styled-components'
import { DraggableMarker } from './DraggableMarker'

import { MapContainer, Marker, ImageOverlay, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";

// --------------------------------------------------------------- //
//                              Set Up                             //
// --------------------------------------------------------------- //

// Bounds should be the smallest renderable size of the image (full resolution visible only via zooming)
// the aspect ratio should be the same as original size
const imgBounds = [[0,0], [500,375]] as any;

// This allows us to hook the leaflet "map" contained within <MapContainer />
// We can then call all kinds of methods on it
// https://react-leaflet.js.org/docs/api-map#hooks
// https://leafletjs.com/reference-1.7.1.html#map-example
function Hook() {
  const map = useMap()
  map.setMaxBounds(imgBounds)
  return null
}

interface Marker {
  id: string,
  position: [number, number]
}

const activeMarker = '1';

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

const updateMarkerPosition = (id: string, newPosition: [number, number]) => {
  for (let marker of markerList) {
    if (marker.id == id) {
      marker.position = newPosition;
      return;
    }
  }
  console.warn('No marker found with id ' + id + '.')
}

const StyleContainer = styled.div`
  .leaflet-marker-icon {
    filter: saturate(150%);
  }
  .leaflet-marker-icon-inactive {
    filter: saturate(50%);
  }
`

// --------------------------------------------------------------- //
//                         Main Component                          //
// --------------------------------------------------------------- //

const App = () => {
  return (
    <StyleContainer>
      <MapContainer center={[0, 0]} zoom={1} minZoom={0} maxZoom={3} scrollWheelZoom={false} style={{ height: "600px", width: "600px" }}>
        <Hook />
        <ImageOverlay bounds={imgBounds} url="https://rapidnotes.files.wordpress.com/2016/08/dyson-logos-camping-map.jpg" />
        {markerList.map(markerData => (
          <DraggableMarker
            markerData={markerData}
            key={markerData.id}
            updateMarkerPosition={updateMarkerPosition}
            active={activeMarker === markerData.id}
          />
        ))}
      </MapContainer>
    </StyleContainer>
  );
}

export default App;
