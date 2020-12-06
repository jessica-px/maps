import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router';
import styled from 'styled-components';
import { Map } from './Map';
import { ContentArea } from './ContentArea';
import { Sidebar } from './Sidebar';
import {
  MapContextProvider,
  MapContext,
  MapState,
  getRoomById
} from './MapContext';

// --------------------------------------------------------------- //
//                        Styled Components                        //
// --------------------------------------------------------------- //

const PageLayout = styled.div`
  display: flex;
  flex-direction: row;
  max-height: calc(100vh - 40px);
`;

// --------------------------------------------------------------- //
//                         Main Component                          //
// --------------------------------------------------------------- //

const MapPageContents = () => {
  const [mapData, dispatch] = useContext(MapContext);

  const location = useLocation();
  const id = location ? location.search.split('id=')[1] : null;

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    fetch(`/api/map?id=${id}`, options)
      .then((response: any) => response.json()) // eslint-disable-line @typescript-eslint/no-explicit-any
      .then((json: MapState) => {
        dispatch({
          type: 'SET_MAP_DATA',
          payload: json
        });
      });
  }, [dispatch, id]);

  if (mapData) {
    const activeRoom = getRoomById(mapData.roomList, mapData.activeRoomId);
    return (
      <PageLayout>
        <Sidebar />
        <ContentArea activeRoom={activeRoom} />
        <Map />
      </PageLayout>
    );
  }
  return <p>Loading...</p>;
};

export const MapPage = () => (
  <MapContextProvider>
    <MapPageContents />
  </MapContextProvider>
);
