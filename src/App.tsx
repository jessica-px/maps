import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Map } from './mapPage/Map';
import { ContentArea } from './mapPage/ContentArea';
import { Sidebar } from './mapPage/Sidebar';
import { MapContextProvider } from './mapPage/MapContextProvider';

import 'leaflet/dist/leaflet.css';

// --------------------------------------------------------------- //
//                       Styled Components                         //
// --------------------------------------------------------------- //

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

`;

const PageLayout = styled.div`
  display: flex;
  flex-direction: row;
  max-height: calc(100vh - 40px);
`;

const Footer = styled.div`
  background-color: lightgray;
  height: 40px;
  width: 100%;
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
  <>
    <GlobalStyle />
    <PageLayout>
      <Sidebar />
      <ContentArea />
      <Map
        imgUrl="https://rapidnotes.files.wordpress.com/2016/08/dyson-logos-camping-map.jpg"
      />
    </PageLayout>
    <Footer />
  </>
);

export default AppWrapper;
