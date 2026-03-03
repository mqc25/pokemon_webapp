import { Box, Typography, Button } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PokemonEnergy from './PokemonEnergy';

export const PokemonPopup = ({ pokemon, calculateDistance }) => (
  <Box sx={{ textAlign: 'center', minWidth: 200 }}>
    <img src={pokemon.sprite_url} alt={pokemon.name} width="80" />
    <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>{pokemon.name}</Typography>
    <Typography variant="body2"><strong>Type:</strong> {pokemon.types}</Typography>
    
    {/*Display location*/}
    <Typography variant="body2">
      <strong>Coords:</strong> {pokemon.latitude.toFixed(4)}, {pokemon.longitude.toFixed(4)}
    </Typography>

    {/* Display Ownership*/}
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
    
    <PokemonEnergy pokemonId={pokemon.id} />

    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
      Recent Moves: {pokemon.recent_moves || 'N/A'}
    </Typography>

    {/*"How far am I from home?" button*/}
    <Button 
      variant="contained" size="small" fullWidth startIcon={<SchoolIcon />} 
      onClick={() => calculateDistance(pokemon.latitude, pokemon.longitude, pokemon.name)} 
      sx={{ mt: 1, textTransform: 'none' }}
    >
      How far am I from home?
    </Button>
  </Box>
);