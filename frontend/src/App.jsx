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

  // Initial 100 pokemon fetch
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

  // Pokemon favorite
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

  // Computed Data
  const filteredPokemon = useMemo(() => {
    return pokemonList.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [pokemonList, searchQuery]);

  const paginatedList = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredPokemon.slice(start, start + itemsPerPage);
  }, [filteredPokemon, page]);

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

  // Function to handle sidebar clicks
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
        totalPages={Math.ceil(filteredPokemon.length / itemsPerPage)}
        getStableMarkerColor={getStableMarkerColor}
        onSelectPokemon={handleSelectPokemon}
      />
      
      <MapView 
        filteredPokemon={filteredPokemon}
        UCLA_COORDS={UCLA_COORDS}
        calculateDistance={calculateDistance}
        selectedPokemon={selectedPokemon}
      />
    </Box>
  );
}

export default App;