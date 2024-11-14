import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { Event } from '../types';

// Custom icons for events
const activeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const archivedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface EventMapProps {
  events: Event[];
  selectedEvent: Event | null;
  onEventSelect: (event: Event) => void;
}

const defaultCenter: [number, number] = [50.2649, 19.0238]; // Katowice center

const EventMap: React.FC<EventMapProps> = ({ events, selectedEvent, onEventSelect }) => {
  const center = useMemo(() => {
    if (selectedEvent?.coordinates) {
      return selectedEvent.coordinates;
    }
    
    const visibleEvents = events.filter(e => e.coordinates);
    if (visibleEvents.length > 0) {
      const latSum = visibleEvents.reduce((sum, e) => sum + (e.coordinates?.[0] || 0), 0);
      const lngSum = visibleEvents.reduce((sum, e) => sum + (e.coordinates?.[1] || 0), 0);
      return [
        latSum / visibleEvents.length,
        lngSum / visibleEvents.length
      ] as [number, number];
    }
    
    return defaultCenter;
  }, [events, selectedEvent]);

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {events.map(event => 
        event.coordinates && (
          <Marker
            key={event.id}
            position={event.coordinates}
            icon={event.isArchived ? archivedIcon : activeIcon}
            eventHandlers={{
              click: () => onEventSelect(event)
            }}
          />
        )
      )}
    </MapContainer>
  );
};

export default EventMap;