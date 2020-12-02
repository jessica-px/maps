import React from 'react';
import styled from 'styled-components'

import { MapContainer, Marker, Popup, ImageOverlay, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// --------------------------------------------------------------- //
//                              Set Up                             //
// --------------------------------------------------------------- //

// Bounds should be the smallest renderable size of the image (full resolution visible only via zooming)
// the aspect ratio should be the same as original size
const imgBounds = [[0,0], [500,375]] as any;

let leafletIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12,41]
})

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
  name: string,
  position: [number, number]
}

const markerList: Marker[] = [
  {
    name: 'Marker 1',
    position: [54, 70]
  },
  {
    name: 'Marker 2',
    position: [65, 35]
  }
]

// --------------------------------------------------------------- //
//                         Main Component                          //
// --------------------------------------------------------------- //

const App = () => {
  return (
    <MapContainer center={[0, 0]} zoom={1} minZoom={0} maxZoom={3} scrollWheelZoom={false} style={{ height: "600px", width: "600px" }}>
      <Hook />
      <ImageOverlay bounds={imgBounds} url="https://rapidnotes.files.wordpress.com/2016/08/dyson-logos-camping-map.jpg" />
      {markerList.map(markerData => (
        <Marker position={markerData.position} icon={leafletIcon} key={markerData.name}>
          <Popup>{markerData.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default App;
