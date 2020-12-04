import React from 'react';
import styled from 'styled-components';
import { Map } from './mapPage/Map';
import { ContentArea } from './mapPage/ContentArea';
import { Sidebar } from './mapPage/Sidebar';
import { MapContextProvider } from './mapPage/MapContextProvider';

import 'leaflet/dist/leaflet.css';

// --------------------------------------------------------------- //
//                       Styled Components                         //
// --------------------------------------------------------------- //

const PageLayout = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
`;

// --------------------------------------------------------------- //
//                         Main Component                          //
// --------------------------------------------------------------- //

const AppWrapper = () => (
  <MapContextProvider>
    <App />
  </MapContextProvider>
);

const App = () => (
  <PageLayout>
    <Sidebar />
    <ContentArea />
    <Map
      imgUrl="https://rapidnotes.files.wordpress.com/2016/08/dyson-logos-camping-map.jpg"
    />
  </PageLayout>
);

export default AppWrapper;
