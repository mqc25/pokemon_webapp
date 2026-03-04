import { 
  Drawer, Box, Typography, IconButton, Button, TextField, 
  InputAdornment, Divider, List, ListItem, ListItemAvatar, 
  Avatar, ListItemText, Pagination, ListItemButton,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { TypeBadge } from '../Common/TypeBadge';

export const PokemonSidebar = ({ 
  username, handleLogout, handleFileUpload, 
  searchQuery, setSearchQuery, setPage, 
  paginatedList, toggleFavorite,
  handleDeletePokemon, page, totalPages,
  getStableMarkerColor, onSelectPokemon,
  activeCategory, handleCategoryChange, counts
}) => {
  
  // Reusable UI strictly for the active paginated array
  const renderPokemonList = () => (
    <List disablePadding>
      {paginatedList.map(p => (
        <ListItem 
          key={p.id} 
          disablePadding
          secondaryAction={
            <Box sx={{ display: 'flex' }}>
              {/* Conditionally render Delete Icon ONLY if the user own it */}
              {p.owner_name === username && (
                <IconButton onClick={(e) => { 
                  e.stopPropagation();
                  handleDeletePokemon(p.id)
                  }}>
                  <DeleteIcon sx={{ color: 'text.secondary' }} />
                </IconButton>
              )}
              
              <IconButton onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(p.id)
                }}>
                {p.is_favorite ? <FavoriteIcon sx={{ color: '#ff1744' }} /> : <FavoriteBorderIcon />}
              </IconButton>
            </Box>
          }
        >
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
  );

  return (
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
        {/* Wild Pokemon List */}
        <Accordion expanded={activeCategory === 'wild'} onChange={() => handleCategoryChange('wild')} disableGutters elevation={0} square>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'grey.100', borderBottom: 1, borderColor: 'divider' }}>
            <Typography fontWeight="bold">Wild Pokémon ({counts.wild})</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
             {activeCategory === 'wild' && renderPokemonList()}
          </AccordionDetails>
        </Accordion>

        {/* Community Pokemon List */}
        <Accordion expanded={activeCategory === 'community'} onChange={() => handleCategoryChange('community')} disableGutters elevation={0} square>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'grey.100', borderBottom: 1, borderColor: 'divider' }}>
            <Typography fontWeight="bold">Community Pokémon ({counts.community})</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
             {activeCategory === 'community' && renderPokemonList()}
          </AccordionDetails>
        </Accordion>

        {/* My Pokemon List */}
        <Accordion expanded={activeCategory === 'my'} onChange={() => handleCategoryChange('my')} disableGutters elevation={0} square>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'grey.100', borderBottom: 1, borderColor: 'divider' }}>
            <Typography fontWeight="bold">My Pokémon ({counts.my})</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
             {activeCategory === 'my' && renderPokemonList()}
          </AccordionDetails>
        </Accordion>
      </Box>

      <Divider />
      <Box sx={{ p: 2, flexShrink: 0, textAlign: 'center', bgcolor: 'white' }}>
        {totalPages > 0 && (
          <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} size="small" color="primary" />
        )}
      </Box>
    </Drawer>
  );
};