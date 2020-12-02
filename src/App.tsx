import React from 'react';
import styled from 'styled-components'
import { Map } from './Map';

import "leaflet/dist/leaflet.css";

// --------------------------------------------------------------- //
//                           Placeholder Data                      //
// --------------------------------------------------------------- //
/*
  Info like the list of all markers and the currently active marker
  should eventually live in a highler level of state. Ultimately
  this list should stay in sync with one that lives in a DB.
*/

interface Marker {
  id: string,
  position: [number, number]
}

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

// --------------------------------------------------------------- //
//                         Main Component                          //
// --------------------------------------------------------------- //

const App = () => {
  return (
    <Map
      imgUrl='https://rapidnotes.files.wordpress.com/2016/08/dyson-logos-camping-map.jpg'
      markerList={markerList}
    />
  );
}

export default App;
