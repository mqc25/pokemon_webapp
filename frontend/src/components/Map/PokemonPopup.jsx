import { Box, Typography, Button } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PokemonEnergy from './PokemonEnergy';
import { TypeBadge } from '../Common/TypeBadge';
import { MoveList } from '../Common/MoveList';

export const PokemonPopup = ({ pokemon, calculateDistance }) => {
  const displayLocation = pokemon.encounter_location 
    ? pokemon.encounter_location.split(',')[0].trim() 
    : 'Unknown Location';

  return (
    <Box sx={{ textAlign: 'center', minWidth: 200 }}>
      <img src={pokemon.sprite_url} alt={pokemon.name} width="80" />
      <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>{pokemon.name}</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
          <TypeBadge types={pokemon.types} />
      </Box>    

      <Typography variant="body2">
        <strong>Coords:</strong> {pokemon.latitude.toFixed(4)}, {pokemon.longitude.toFixed(4)}
      </Typography>

      <Typography variant="body2">
        <strong>Seen:</strong> {displayLocation}
      </Typography>

      <Typography 
        variant="subtitle2" 
        sx={{ 
          color: pokemon.owner_name === 'Wild' ? 'green' : 'primary.main',
          fontWeight: 'bold',
          mb: 1 
        }}
      >
        Owner: {pokemon.owner_name}
      </Typography>
      
      {/* The energy component handles its own WebSocket connection now */}
      <PokemonEnergy pokemonId={pokemon.id} />

      <MoveList moves={pokemon.recent_moves} /> 

      <Button 
        variant="contained" size="small" fullWidth startIcon={<SchoolIcon />} 
        onClick={() => calculateDistance(pokemon.latitude, pokemon.longitude, pokemon.name)} 
        sx={{ mt: 1, textTransform: 'none' }}
      >
        How far am I from home?
      </Button>
    </Box>
  );
};