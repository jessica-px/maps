import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import {
  BrowserRouter as Router, Route, Switch
} from 'react-router-dom';
import { UserContextProvider } from './UserContext';

import { HomePage } from './homePage/HomePage';
import { MapPage } from './mapPage/MapPage';

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

const Footer = styled.div`
  background-color: #EEE;
  height: 40px;
  width: 100%;
`;

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
