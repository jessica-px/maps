import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import {
  BrowserRouter as Router, Route, Switch, Link
} from 'react-router-dom';
import { Map } from './mapPage/Map';
import { ContentArea } from './mapPage/ContentArea';
import { Sidebar } from './mapPage/Sidebar';
import { MapContextProvider } from './mapPage/MapContextProvider';
import { UserContextProvider } from './UserContext';

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
  background-color: #EEE;
  height: 40px;
  width: 100%;
`;

// --------------------------------------------------------------- //
//                          Sub-Components                         //
// --------------------------------------------------------------- //

const MapPage = () => (
  <MapContextProvider>
    <PageLayout>
      <Sidebar />
      <ContentArea />
      <Map
        imgUrl="https://rapidnotes.files.wordpress.com/2016/08/dyson-logos-camping-map.jpg"
      />
    </PageLayout>
  </MapContextProvider>
);

const HomePage = () => (
  <>
    <h1>Home Page</h1>
    <Link to="/maps">Maps</Link>
  </>
);

// --------------------------------------------------------------- //
//                         Main Component                          //
// --------------------------------------------------------------- //

const App = () => (
  <Router>
    <UserContextProvider>
      <GlobalStyle />
      <Switch>
        <Route path="/maps">
          <MapPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
      <Footer />
    </UserContextProvider>
  </Router>
);

export default App;
