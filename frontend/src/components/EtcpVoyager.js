import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const EtcpVoyager = () => {
  const [mapCenter] = useState([7.8731, 80.7718]); // Sri Lanka coordinates
  const [zoom] = useState(8);
  const [experiences, setExperiences] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [itinerary, setItinerary] = useState([]);
  const [sustainabilityImpact, setSustainabilityImpact] = useState({
    carbonOffset: 0,
    localEconomyContribution: 0,
    conservationSupport: 0
  });

  useEffect(() => {
    fetchMapExperiences();
    calculateSustainabilityImpact();
  }, [itinerary]);

  const fetchMapExperiences = () => {
    // Mock data with coordinates
    setExperiences([
      {
        id: 1,
        title: 'Sinharaja Rainforest Trek',
        position: [6.4067, 80.4167],
        type: 'hiking',
        sustainabilityRating: 4.8,
        price: 85,
        inItinerary: false
      },
      {
        id: 2,
        title: 'Whale Watching at Mirissa',
        position: [5.9549, 80.4692],
        type: 'wildlife watching',
        sustainabilityRating: 4.5,
        price: 120,
        inItinerary: false
      },
      {
        id: 3,
        title: 'Yala National Park Safari',
        position: [6.3667, 81.5167],
        type: 'wildlife watching',
        sustainabilityRating: 4.6,
        price: 95,
        inItinerary: false
      },
      {
        id: 4,
        title: 'Sigiriya Rock Fortress',
        position: [7.9568, 80.7597],
        type: 'cultural',
        sustainabilityRating: 4.3,
        price: 60,
        inItinerary: false
      }
    ]);
  };

  const calculateSustainabilityImpact = () => {
    const impact = itinerary.reduce((acc, item) => {
      return {
        carbonOffset: acc.carbonOffset + (item.sustainabilityRating * 0.5),
        localEconomyContribution: acc.localEconomyContribution + item.price,
        conservationSupport: acc.conservationSupport + (item.sustainabilityRating * 10)
      };
    }, { carbonOffset: 0, localEconomyContribution: 0, conservationSupport: 0 });
    
    setSustainabilityImpact(impact);
  };

  const addToItinerary = (experience) => {
    if (!itinerary.find(item => item.id === experience.id)) {
      setItinerary([...itinerary, { ...experience, inItinerary: true }]);
      setExperiences(experiences.map(exp => 
        exp.id === experience.id ? { ...exp, inItinerary: true } : exp
      ));
    }
  };

  const removeFromItinerary = (experienceId) => {
    setItinerary(itinerary.filter(item => item.id !== experienceId));
    setExperiences(experiences.map(exp => 
      exp.id === experienceId ? { ...exp, inItinerary: false } : exp
    ));
  };

  const getMarkerColor = (experience) => {
    if (experience.inItinerary) return '#4caf50';
    switch (experience.type) {
      case 'hiking': return '#ff9800';
      case 'wildlife watching': return '#2196f3';
      case 'cultural': return '#9c27b0';
      default: return '#607d8b';
    }
  };

  const createCustomIcon = (experience) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${getMarkerColor(experience)}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  return (
    <div className="page-container">
      <h2 className="page-title">🗺️ ETCP Voyager</h2>
      <p className="page-subtitle">Plan your sustainable travel itinerary with our interactive map</p>

      <div className="voyager-layout">
        <div className="map-container">
          <MapContainer 
            center={mapCenter} 
            zoom={zoom} 
            style={{ height: '500px', width: '100%', borderRadius: '8px' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {experiences.map(experience => (
              <Marker
                key={experience.id}
                position={experience.position}
                icon={createCustomIcon(experience)}
                eventHandlers={{
                  click: () => setSelectedExperience(experience)
                }}
              >
                <Popup>
                  <div className="map-popup">
                    <h4>{experience.title}</h4>
                    <p>🌿 {experience.sustainabilityRating}/5</p>
                    <p>${experience.price} per person</p>
                    {!experience.inItinerary ? (
                      <button 
                        className="button"
                        onClick={() => addToItinerary(experience)}
                      >
                        Add to Itinerary
                      </button>
                    ) : (
                      <span className="in-itinerary">✓ In Itinerary</span>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <div className="map-legend card">
            <h4>Legend</h4>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#ff9800' }}></div>
                <span>Hiking</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#2196f3' }}></div>
                <span>Wildlife Watching</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#9c27b0' }}></div>
                <span>Cultural</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#4caf50' }}></div>
                <span>In Itinerary</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="sustainability-impact card">
            <h3>Sustainability Impact</h3>
            <div className="impact-metrics">
              <div className="impact-item">
                <span className="impact-value">{sustainabilityImpact.carbonOffset.toFixed(1)}kg</span>
                <span className="impact-label">CO₂ Offset</span>
              </div>
              <div className="impact-item">
                <span className="impact-value">${sustainabilityImpact.localEconomyContribution}</span>
                <span className="impact-label">Local Economy</span>
              </div>
              <div className="impact-item">
                <span className="impact-value">{sustainabilityImpact.conservationSupport.toFixed(0)}%</span>
                <span className="impact-label">Conservation Support</span>
              </div>
            </div>
          </div>

          <div className="itinerary-planner card">
            <h3>Your Itinerary</h3>
            {itinerary.length === 0 ? (
              <p>Click on map markers to add experiences to your itinerary</p>
            ) : (
              <div className="itinerary-list">
                {itinerary.map((item, index) => (
                  <div key={item.id} className="itinerary-item">
                    <div className="itinerary-number">{index + 1}</div>
                    <div className="itinerary-details">
                      <h4>{item.title}</h4>
                      <p>🌿 {item.sustainabilityRating}/5 • ${item.price}</p>
                    </div>
                    <button 
                      className="remove-button"
                      onClick={() => removeFromItinerary(item.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="itinerary-total">
                  <strong>Total: ${itinerary.reduce((sum, item) => sum + item.price, 0)}</strong>
                </div>
              </div>
            )}
          </div>

          {selectedExperience && (
            <div className="experience-details card">
              <h3>Experience Details</h3>
              <h4>{selectedExperience.title}</h4>
              <p><strong>Type:</strong> {selectedExperience.type}</p>
              <p><strong>Sustainability:</strong> {selectedExperience.sustainabilityRating}/5</p>
              <p><strong>Price:</strong> ${selectedExperience.price} per person</p>
              {!selectedExperience.inItinerary ? (
                <button 
                  className="button"
                  onClick={() => addToItinerary(selectedExperience)}
                >
                  Add to Itinerary
                </button>
              ) : (
                <button 
                  className="button secondary"
                  onClick={() => removeFromItinerary(selectedExperience.id)}
                >
                  Remove from Itinerary
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EtcpVoyager;