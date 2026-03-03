import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import { Box } from '@mui/material';
import { createCustomIcon } from '../../utils/markerUtils';
import { PokemonPopup } from './PokemonPopup';

export const MapView = ({ filteredPokemon, UCLA_COORDS, calculateDistance }) => {
  return (
    <Box sx={{ flexGrow: 1, height: '100%' }}>
      <MapContainer center={UCLA_COORDS} zoom={13} style={{ height: "100%", width: "100%" }}>
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