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
//                       Styled Components                         //
// --------------------------------------------------------------- //

const PageLayout = styled.div`
  display: flex;
  flex-direction: row;
`

const SidebarColumn = styled.div`
  background-color: lightgray;
  width: 250px;
`

const ContentColumn = styled.div`
  background-color: lightpink;
  min-width: 400px;
  flex: 2;
`

// --------------------------------------------------------------- //
//                         Main Component                          //
// --------------------------------------------------------------- //

const App = () => {
  return (
    <PageLayout>
      <SidebarColumn>Hello World</SidebarColumn>
      <ContentColumn>Greetings</ContentColumn>
      <Map
        imgUrl='https://rapidnotes.files.wordpress.com/2016/08/dyson-logos-camping-map.jpg'
        markerList={markerList}
      />
    </PageLayout>

  );
}

export default App;
