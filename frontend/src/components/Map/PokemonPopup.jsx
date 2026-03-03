import { Box, Typography, Button } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PokemonEnergy from './PokemonEnergy';

export const PokemonPopup = ({ pokemon, calculateDistance }) => (
  <Box sx={{ textAlign: 'center', minWidth: 200 }}>
    <img src={pokemon.sprite_url} alt={pokemon.name} width="80" />
    <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>{pokemon.name}</Typography>
    <Typography variant="body2"><strong>Type:</strong> {pokemon.types}</Typography>
    
    {/* Requirement: Display location metadata [cite: 54] */}
    <Typography variant="body2">
      <strong>Coords:</strong> {pokemon.latitude.toFixed(4)}, {pokemon.longitude.toFixed(4)}
    </Typography>
    
    <PokemonEnergy />

    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
      Recent Moves: {pokemon.recent_moves || 'N/A'}
    </Typography>

    {/* Requirement 8: "How far am I from home?" button [cite: 42] */}
    <Button 
      variant="contained" size="small" fullWidth startIcon={<SchoolIcon />} 
      onClick={() => calculateDistance(pokemon.latitude, pokemon.longitude, pokemon.name)} 
      sx={{ mt: 1, textTransform: 'none' }}
    >
      How far am I from home?
    </Button>
  </Box>
);