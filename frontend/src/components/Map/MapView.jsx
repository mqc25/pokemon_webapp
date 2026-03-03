import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap } from 'react-leaflet';
import { Box } from '@mui/material';
import L from 'leaflet';
import { createCustomIcon } from '../../utils/markerUtils';
import { PokemonPopup } from './PokemonPopup';

// Component to handle map centering when a Pokemon is selected
const MapFocusHandler = ({ selectedPokemon }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedPokemon) {
      // Centers the map on the coordinates with a smooth animation
      map.flyTo([selectedPokemon.latitude, selectedPokemon.longitude], 15, {
        animate: true,
        duration: 1.5
      });
    }
  }, [selectedPokemon, map]);

  return null;
};

export const MapView = ({ filteredPokemon, UCLA_COORDS, calculateDistance, selectedPokemon }) => {
  return (
    <Box sx={{ flexGrow: 1, height: '100%' }}>
      <MapContainer center={UCLA_COORDS} zoom={13} style={{ height: "100%", width: "100%" }}>
        <MapFocusHandler selectedPokemon={selectedPokemon} />
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" subdomains={['mt0','mt1','mt2','mt3']} />
          </LayersControl.BaseLayer>
        </LayersControl>

        {filteredPokemon.map((p) => (
          <Marker 
            key={p.id} 
            position={[p.latitude, p.longitude]} 
            icon={createCustomIcon(p.sprite_url, p.types, p.id)}
            eventHandlers={{
              click: (e) => {
                // Fix bubbleup issue when clicking on marker
                L.DomEvent.stopPropagation(e); 
              },
            }}
          >
            <Popup>
              <PokemonPopup pokemon={p} calculateDistance={calculateDistance} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};