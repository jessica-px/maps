import React, { useState, useRef, useMemo } from 'react';
import { Marker as MarkerType } from './MapContextProvider';

import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';


const activeLeafletIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12,41],
  className: ''
})

const inactiveLeafletIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [22, 36],
  iconAnchor: [10, 36],
  shadowAnchor: [12, 41],
  className: 'leaflet-marker-icon-inactive'
})

// --------------------------------------------------------------- //
//                         Main Component                          //
// --------------------------------------------------------------- //
/*
  This is the draggable marker that we render on maps. When moved, it
  will update markerData with the new position for the marker with the
  same ID. It also conditionally shows a different icon depending on
  whether the given markerData has the same ID as the currently active
  marker.
*/

interface DraggableMarkerProps {
  roomName: string,
  markerData: MarkerType,
  setActiveMarkerId: (x: string) => void;
  active: boolean
}

export const DraggableMarker = ({ roomName, markerData, setActiveMarkerId, active }: DraggableMarkerProps) => {
  // Adapted from: https://react-leaflet.js.org/docs/example-draggable-marker
  const [position, setPosition] = useState(markerData.position)
  const markerRef = useRef(null)

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current as any;
        if (marker != null) {
          const newPosition = [marker.getLatLng().lat, marker.getLatLng().lng] as [number, number];
          setPosition(newPosition)
        }
      },
      click() {
        setActiveMarkerId(markerData.id);
      }
    }),
    [],
  )

  return (
    <Marker
      icon={active ? activeLeafletIcon : inactiveLeafletIcon}
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
      <Tooltip
        direction="top"
        offset={[0, -35]}
        opacity={90}
      >
        {roomName}
      </Tooltip>
    </Marker>
  )
}