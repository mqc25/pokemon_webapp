import { 
  Drawer, Box, Typography, IconButton, Button, TextField, 
  InputAdornment, Divider, List, ListItem, ListItemAvatar, 
  Avatar, ListItemText, Pagination, ListItemButton 
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { TypeBadge } from '../Common/TypeBadge';

export const PokemonSidebar = ({ 
  username, handleLogout, handleFileUpload, 
  searchQuery, setSearchQuery, setPage, 
  paginatedList, toggleFavorite, page, totalPages,
  getStableMarkerColor,
  onSelectPokemon
}) => (
  <Drawer
    variant="permanent"
    sx={{
      width: 340,
      [`& .MuiDrawer-paper`]: { width: 340, display: 'flex', flexDirection: 'column', height: '100vh' },
    }}
  >
    <Box sx={{ p: 2, flexShrink: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
          {username || 'Trainer'}
        </Typography>
        <IconButton onClick={handleLogout}><LogoutIcon /></IconButton>
      </Box>
      <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} fullWidth size="small" sx={{ mb: 2 }}>
        Upload CSV <input type="file" hidden onChange={handleFileUpload} />
      </Button>
      <TextField 
        fullWidth size="small" placeholder="Search Pokémon..." value={searchQuery} 
        onChange={(e) => {setSearchQuery(e.target.value); setPage(1);}}
        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
      />
    </Box>
    <Divider />
    <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
      <List>
        {paginatedList.map(p => (
          <ListItem 
            key={p.id} 
            disablePadding
            secondaryAction={
              <IconButton onClick={() => toggleFavorite(p.id)}>
                {p.is_favorite ? <FavoriteIcon sx={{ color: '#ff1744' }} /> : <FavoriteBorderIcon />}
              </IconButton>
            }
          >
            {/*ListItemButton to select the Pokemon and center to the map */}
            <ListItemButton onClick={() => onSelectPokemon(p)}>
              <ListItemAvatar>
                <Avatar src={p.sprite_url} variant="rounded" sx={{ border: `2px solid ${getStableMarkerColor(p.types, p.id)}` }} />
              </ListItemAvatar>
              <ListItemText 
                primary={<Typography fontWeight="600">{p.name}</Typography>} 
                secondary={<TypeBadge types={p.types} />} 
                secondaryTypographyProps={{ component: 'div' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
    <Divider />
    <Box sx={{ p: 2, flexShrink: 0, textAlign: 'center', bgcolor: 'white' }}>
      <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} size="small" color="primary" />
    </Box>
  </Drawer>
);