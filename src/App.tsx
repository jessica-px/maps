import React, { useContext } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import {
  BrowserRouter as Router, Route, Switch, Link
} from 'react-router-dom';
import { Map } from './mapPage/Map';
import { ContentArea } from './mapPage/ContentArea';
import { Sidebar } from './mapPage/Sidebar';
import { MapContextProvider } from './mapPage/MapContextProvider';
import {
  UserContextProvider, UserContext, Directory, Map as MapType
} from './UserContext';

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

const getMapById = (maps: MapType[], mapId: string) => {
  for (const map of maps) {
    if (map.id === mapId) {
      return map;
    }
  }
  throw new Error(`No map found with id of ${mapId}.`);
};

interface DirectoryContainerProps {
  dir: Directory,
  maps: MapType[]
}

const DirectoryContainer = ({ dir, maps }: DirectoryContainerProps) => (
  <>
    <h3>{dir.name}</h3>
    <ul>
      {dir.mapIds.map((mapId) => {
        const mapData = getMapById(maps, mapId);
        return <li key={mapId}><Link to="/maps">{mapData.name}</Link></li>;
      })}
    </ul>
  </>
);

const HomePage = () => {
  const [userState, dispatch] = useContext(UserContext);
  return (
    <>
      <h1>Home Page</h1>
      <p>Hello, {userState.name}</p>
      {
        userState.directories.map((dir) => <DirectoryContainer dir={dir} maps={userState.maps} key={dir.id} />)
      }
    </>
  );
};

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
