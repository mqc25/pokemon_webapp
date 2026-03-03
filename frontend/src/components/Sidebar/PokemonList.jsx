import { List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { getStableMarkerColor } from '../../utils/markerUtils';

export const PokemonList = ({ paginatedList, toggleFavorite }) => {
  return (
    <List>
      {paginatedList.map((p) => (
        <ListItem 
          key={p.id} 
          divider 
          secondaryAction={
            <IconButton onClick={() => toggleFavorite(p.id)}>
              {p.is_favorite ? <FavoriteIcon sx={{ color: '#ff1744' }} /> : <FavoriteBorderIcon />}
            </IconButton>
          }
        >
          <ListItemAvatar>
            <Avatar 
              src={p.sprite_url} 
              variant="rounded" 
              sx={{ border: `2px solid ${getStableMarkerColor(p.types, p.id)}` }} 
            />
          </ListItemAvatar>
          <ListItemText 
            primary={<Typography fontWeight="600">{p.name}</Typography>} 
            secondary={p.types} 
          />
        </ListItem>
      ))}
    </List>
  );
};