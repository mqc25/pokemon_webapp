import { Box } from '@mui/material';

// Pokemon Ruby Type Colors
const TYPE_COLORS = {
  Normal: '#A8A878', Fire: '#F08030', Water: '#6890F0', Electric: '#F8D030',
  Grass: '#78C850', Ice: '#98D8D8', Fighting: '#C03028', Poison: '#A040A0',
  Ground: '#E0C068', Flying: '#A890F0', Psychic: '#F85888', Bug: '#A8B820',
  Rock: '#B8A038', Ghost: '#705898', Dragon: '#7038F8', Dark: '#705848',
  Steel: '#B8B8D0', Fairy: '#EE99AC'
};

export const TypeBadge = ({ types }) => {
  // Handle comma-separated string
  const typeList = types ? types.split(/[,/]/).map(t => t.trim()).filter(Boolean) : [];
  
  return (
    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
      {typeList.map((type) => (
        <Box
          key={type}
          sx={{
            backgroundColor: TYPE_COLORS[type] || '#777777', // Fallback color
            color: 'white',
            px: 1,
            py: 0.25,
            borderRadius: '4px',
            fontSize: '0.65rem',
            fontWeight: 'bold',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            border: '1px solid rgba(0,0,0,0.6)',
            // Gen 3 GBA bevel effect
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -2px 0 rgba(0,0,0,0.3)',
            textShadow: '1px 1px 0px rgba(0,0,0,0.7)', 
            lineHeight: 1.2
          }}
        >
          {type}
        </Box>
      ))}
    </Box>
  );
};