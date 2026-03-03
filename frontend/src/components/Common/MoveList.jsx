import { Box, Typography } from '@mui/material';

export const MoveList = ({ moves }) => {
  if (!moves) return null;

  // Split comma-separated moves
  const moveArray = moves
    .replace(/[\[\]'"]/g, '') 
    .replace('-', ' ') 
    .split(',')
    .map(m => m.trim())
    .filter(m => m);

  return (
    <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography 
        variant="caption" 
        fontWeight="bold" 
        sx={{ textAlign: 'left', color: '#555', letterSpacing: '0.5px' }}
      >
        KNOWN MOVES:
      </Typography>
      
      {moveArray.map((move, index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: '#F8F8EA', // GBA off-white/cream paper color
            border: '1px solid #506888', // Gen 3 Menu Blue border
            borderRadius: '4px',
            px: 0.5,
            py: 0.25,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: 'inset 1px 1px 0px #FFFFFF, inset -1px -1px 0px #D8D8C0, 1px 1px 1px rgba(0,0,0,0.3)',
          }}
        >
          <Typography 
            sx={{ 
              fontWeight: 'bold', 
              fontSize: '0.65rem',
              color: '#303030',
              textTransform: 'uppercase',
              textShadow: '1px 1px 0px #FFFFFF',
              lineHeight: 1.2,
              textAlign: 'center',
              width: '100%'
            }}
          >
            {move}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};