import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import L from 'leaflet';
import { Box } from '@mui/material';

// Modular Component Imports
import { AuthScreen } from './components/Auth/AuthScreen';
import { PokemonSidebar } from './components/Sidebar/PokemonSidebar';
import { MapView } from './components/Map/MapView';

// Utility Imports
import { getStableMarkerColor, createCustomIcon } from './utils/markerUtils';

// Production Security Configuration
axios.defaults.withCredentials = true;
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const UCLA_COORDS = [34.0689, -118.4452];

function App() {
  // Global state
  const [pokemonList, setPokemonList] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // User state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [activeCategory, setActiveCategory] = useState('wild'); // New State: 'wild', 'community', or 'my'

  // Initial fetch
  useEffect(() => { 
    if (isLoggedIn) fetchPokemon(); 
  }, [isLoggedIn]);

  const fetchPokemon = () => {
    axios.get('/api/pokemon/')
      .then(res => setPokemonList(res.data));
  };

  // Auth 
  const handleAuth = async () => {
    setErrors({});
    const endpoint = isRegistering ? 'register' : 'login';
    const payload = isRegistering ? { username, password, email } : { username, password };
    
    try {
      const res = await axios.post(`/api/${endpoint}/`, payload);
      if (res.data.status === 'success') {
        if (res.data.username) setUsername(res.data.username);
        setIsLoggedIn(true);
      }
    } catch (err) {
      setErrors(err.response?.data || { non_field_errors: ["Authentication failed."] });
    }
  };

  const handleLogout = () => {
    axios.post('/api/logout/')
      .then(() => {
        setIsLoggedIn(false);
        setUsername('');
        setErrors({});
      });
  };

  const toggleFavorite = (id) => {
    setPokemonList(prev => prev.map(p => 
      p.id === id ? { ...p, is_favorite: !p.is_favorite } : p
    ));
    axios.post(`/api/pokemon/${id}/toggle_favorite/`)
      .catch(() => fetchPokemon());
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    axios.post('/api/pokemon/upload_csv/', formData)
      .then(() => { fetchPokemon(); })
      .catch(() => alert("Upload failed. Check CSV format."));
  };

  const calculateDistance = (lat, lng, name) => {
    const dist = (L.latLng(lat, lng).distanceTo(L.latLng(UCLA_COORDS)) / 1000).toFixed(2);
    alert(`${name} is ${dist} km from UCLA Campus.`);
  };

  // --- Computed Data Logic ---
  const filteredPokemon = useMemo(() => {
    return pokemonList.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [pokemonList, searchQuery]);

  // Group Pokemon into categories
  const categorizedPokemon = useMemo(() => {
    const wild = filteredPokemon.filter(p => p.owner_name === 'Wild');
    const my = filteredPokemon.filter(p => p.owner_name === username);
    const community = filteredPokemon.filter(p => p.owner_name !== 'Wild' && p.owner_name !== username);
    return { wild, my, community };
  }, [filteredPokemon, username]);

  // Determine active list & pagination stats
  const activeList = categorizedPokemon[activeCategory] || [];
  const totalPages = Math.ceil(activeList.length / itemsPerPage) || 1;

  const paginatedList = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return activeList.slice(start, start + itemsPerPage);
  }, [activeList, page]);

  // Reset page when category tab changes
  const handleCategoryChange = (category) => {
    if (activeCategory !== category) {
      setActiveCategory(category);
      setPage(1);
    }
  };

  // Render Logic
  if (!isLoggedIn) {
    return (
      <AuthScreen 
        isRegistering={isRegistering} setIsRegistering={setIsRegistering}
        username={username} setUsername={setUsername}
        password={password} setPassword={setPassword}
        email={email} setEmail={setEmail}
        handleAuth={handleAuth} errors={errors} setErrors={setErrors}
      />
    );
  }

  const handleSelectPokemon = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <PokemonSidebar 
        username={username}
        handleLogout={handleLogout}
        handleFileUpload={handleFileUpload}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
        paginatedList={paginatedList}
        toggleFavorite={toggleFavorite}
        page={page}
        totalPages={totalPages}
        getStableMarkerColor={getStableMarkerColor}
        onSelectPokemon={handleSelectPokemon}
        
        // New Accordion Props
        activeCategory={activeCategory}
        handleCategoryChange={handleCategoryChange}
        counts={{
          wild: categorizedPokemon.wild.length,
          community: categorizedPokemon.community.length,
          my: categorizedPokemon.my.length
        }}
      />
      
      <MapView 
        filteredPokemon={filteredPokemon} // Keeping global map view as requested
        UCLA_COORDS={UCLA_COORDS}
        calculateDistance={calculateDistance}
        selectedPokemon={selectedPokemon}
      />
    </Box>
  );
}

export default App;