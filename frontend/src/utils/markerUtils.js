import L from 'leaflet';

// Requirement: Marker color mapping based on type [cite: 59-69]
export const getStableMarkerColor = (typesString, id) => {
  const typeMap = {
    fire: '#ff0000', water: '#0000ff', grass: '#008000', leaf: '#008000',
    psychic: '#800080', ground: '#a52a2a', rock: '#000000',
    fighting: '#ffa500', normal: '#d2b48c', electric: '#ffff00'
  };
  const pTypes = (typesString || '').toLowerCase().split(', ');
  // Requirement: Mix types use first listed color or gray if unlisted [cite: 69, 72]
  const validColors = pTypes.map(t => typeMap[t]).filter(c => c !== undefined);
  return validColors.length > 0 ? validColors[id % validColors.length] : '#808080';
};

export const createCustomIcon = (spriteUrl, typesString, id) => {
  const color = getStableMarkerColor(typesString, id);
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 42px; height: 42px; border-radius: 50%; border: 3px solid white; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.4);">
             <img src="${spriteUrl}" style="width: 32px; height: 32px;" />
           </div>`,
    iconSize: [42, 42], iconAnchor: [21, 42], popupAnchor: [0, -42]
  });
};