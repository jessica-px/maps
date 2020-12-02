import React from 'react';
import styled from 'styled-components'

import { MapContainer, Marker, Popup, ImageOverlay, useMap } from 'react-leaflet';
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

// the react-leaflet library can't load the default marker images on its own,
// so we have to do that setup ourselves. But this is essentially still the default marker.
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

// --------------------------------------------------------------- //
//                         Main Component                          //
// --------------------------------------------------------------- //

const App = () => {
  return (
    <MapContainer center={[0, 0]} zoom={1} minZoom={0} maxZoom={3} scrollWheelZoom={false} style={{ height: "600px", width: "600px" }}>
      <Hook />
      <ImageOverlay bounds={imgBounds} url="https://rapidnotes.files.wordpress.com/2016/08/dyson-logos-camping-map.jpg" />
      <Marker position={[20, 20]} icon={leafletIcon}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default App;
