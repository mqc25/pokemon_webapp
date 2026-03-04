import { useEffect, useState } from 'react';
import { Typography, Box, LinearProgress, Chip } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';


const PokemonEnergy = ({ pokemonId }) => {
  const [energy, setEnergy] = useState(100);
  const [weather, setWeather] = useState('Loading...');
  
  useEffect(() => {
    // Check for connection type
    const socketUrl = window.location.protocol === 'https:' 
    ? `wss://${window.location.host}/ws/pokemon/${pokemonId}/` 
    : `ws://${window.location.host}/ws/pokemon/${pokemonId}/`;

    // Hook AsyncWebsocketConsumer for weather
    const socket = new WebSocket(socketUrl);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setEnergy(data.energy_level); 
      setWeather(data.condition);  
    };

    return () => socket.close();
  }, []);

  const getEnergyColor = (val) => {
    if (val > 70) return 'success';
    if (val > 40) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ mt: 1.5, p: 1, bgcolor: '#f0f2f5', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption" fontWeight="bold">LIVE ENERGY</Typography>
        <Chip label={weather} size="small" variant="filled" color="primary" sx={{ height: 18, fontSize: '0.6rem' }} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <BoltIcon sx={{ color: '#ffd600', fontSize: 18 }} />
        <Box sx={{ flexGrow: 1 }}>
          <LinearProgress variant="determinate" value={energy} color={getEnergyColor(energy)} sx={{ height: 6, borderRadius: 3 }} />
        </Box>
        <Typography variant="caption" fontWeight="bold">{energy}%</Typography>
      </Box>
    </Box>
  );
};

export default PokemonEnergy;