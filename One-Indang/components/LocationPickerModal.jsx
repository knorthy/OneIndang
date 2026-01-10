import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Keyboard,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import { hp, wp } from '../helpers/common';
import { PLACES_API_KEY } from '../services/transportService';
import { popularDestinations } from '../constants/popularDestinations';

const INDANG_CENTER = {
  latitude: 14.1947,
  longitude: 120.8789,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function LocationPickerModal({ 
  visible, 
  onClose, 
  onSelectLocation, 
  type = 'destination' // 'origin' or 'destination'
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mapRegion, setMapRegion] = useState(INDANG_CENTER);
  
  const mapRef = useRef(null);
  const searchTimeout = useRef(null);

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setSearchQuery('');
      setSearchResults([]);
      setSelectedLocation(null);
      setShowSuggestions(false);
      setMapRegion(INDANG_CENTER);
    }
  }, [visible]);

  // Search for places using Google Places API
  const searchPlaces = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // First, check local popular destinations
      const localResults = popularDestinations.filter(place =>
        place.name.toLowerCase().includes(query.toLowerCase()) ||
        place.category.toLowerCase().includes(query.toLowerCase()) ||
        place.barangay.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);

      // Then search Google Places
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&location=${INDANG_CENTER.latitude},${INDANG_CENTER.longitude}&radius=10000&components=country:ph&key=${PLACES_API_KEY}`
      );
      const data = await response.json();
      
      const googleResults = data.predictions?.map(place => ({
        id: place.place_id,
        name: place.structured_formatting?.main_text || place.description,
        address: place.structured_formatting?.secondary_text || '',
        placeId: place.place_id,
        isGoogle: true,
      })) || [];

      // Combine local and Google results (local first)
      setSearchResults([
        ...localResults.map(p => ({ ...p, isLocal: true })),
        ...googleResults
      ].slice(0, 10));
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to local results only
      const localResults = popularDestinations.filter(place =>
        place.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSearchResults(localResults.map(p => ({ ...p, isLocal: true })));
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    setShowSuggestions(true);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    searchTimeout.current = setTimeout(() => {
      searchPlaces(text);
    }, 300);
  };

  // Get place details from Google Places API
  const getPlaceDetails = async (placeId) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address,name&key=${PLACES_API_KEY}`
      );
      const data = await response.json();
      
      if (data.result?.geometry?.location) {
        return {
          lat: data.result.geometry.location.lat,
          lng: data.result.geometry.location.lng,
          name: data.result.name,
          address: data.result.formatted_address,
        };
      }
      return null;
    } catch (error) {
      console.error('Place details error:', error);
      return null;
    }
  };

  // Handle selecting a search result
  const handleSelectResult = async (result) => {
    setIsLoading(true);
    Keyboard.dismiss();
    
    let location;
    
    if (result.isLocal && result.coordinates) {
      // Local destination with coordinates
      location = {
        lat: result.coordinates.lat,
        lng: result.coordinates.lng,
        desc: result.name,
        address: result.address || result.barangay,
      };
    } else if (result.isGoogle && result.placeId) {
      // Google place - fetch details
      const details = await getPlaceDetails(result.placeId);
      if (details) {
        location = {
          lat: details.lat,
          lng: details.lng,
          desc: details.name,
          address: details.address,
        };
      }
    }

    if (location) {
      setSelectedLocation(location);
      setSearchQuery(location.desc);
      setShowSuggestions(false);
      
      // Animate map to location
      mapRef.current?.animateToRegion({
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    } else {
      Alert.alert('Error', 'Could not get location details. Please try again.');
    }
    
    setIsLoading(false);
  };

  // Handle map press to select location
  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    
    setIsLoading(true);
    try {
      // Reverse geocode to get address
      const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
      const address = addresses[0];
      
      const addressString = address 
        ? `${address.name || ''} ${address.street || ''}, ${address.city || ''}`
            .replace(/^[\s,]+|[\s,]+$/g, '')
            .replace(/,\s*,/g, ',')
        : `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

      const location = {
        lat: latitude,
        lng: longitude,
        desc: addressString,
        address: address ? `${address.city}, ${address.region}` : '',
      };
      
      setSelectedLocation(location);
      setSearchQuery(addressString);
      setShowSuggestions(false);
    } catch (error) {
      // Fallback to coordinates
      const location = {
        lat: latitude,
        lng: longitude,
        desc: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        address: 'Custom location',
      };
      setSelectedLocation(location);
      setSearchQuery(location.desc);
    }
    setIsLoading(false);
  };

  // Get current location
  const handleGetCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = position.coords;

      const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
      const address = addresses[0];
      
      const addressString = address 
        ? `${address.name || ''}, ${address.city || ''}, ${address.region || ''}`
            .replace(/^[\s,]+|[\s,]+$/g, '')
        : `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

      const location = {
        lat: latitude,
        lng: longitude,
        desc: addressString,
        address: address?.city || 'Current location',
      };

      setSelectedLocation(location);
      setSearchQuery(addressString);
      setShowSuggestions(false);

      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    } catch (error) {
      Alert.alert('Error', 'Could not get your current location');
    }
    setIsLoading(false);
  };

  // Confirm selection
  const handleConfirm = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation);
      onClose();
    } else {
      Alert.alert('No Location Selected', 'Please select a location first');
    }
  };

  // Render search result item
  const renderResultItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.resultItem}
      onPress={() => handleSelectResult(item)}
    >
      <View style={styles.resultIcon}>
        <Icon 
          name={item.isLocal ? 'place' : 'search'} 
          size={20} 
          color={item.isLocal ? '#D32F2F' : '#666'} 
        />
      </View>
      <View style={styles.resultTextContainer}>
        <Text style={styles.resultName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.resultAddress} numberOfLines={1}>
          {item.isLocal ? `${item.barangay} • ${item.category}` : item.address}
        </Text>
      </View>
      {item.isLocal && (
        <View style={styles.localBadge}>
          <Text style={styles.localBadgeText}>Local</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // Render popular destinations grid
  const renderPopularDestinations = () => (
    <View style={styles.popularContainer}>
      <Text style={styles.popularTitle}>Popular Destinations in Indang</Text>
      <FlatList
        data={popularDestinations.slice(0, 8)}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.popularItem}
            onPress={() => handleSelectResult({ ...item, isLocal: true })}
          >
            <View style={styles.popularIcon}>
              <Icon name={getCategoryIcon(item.category)} size={24} color="#D32F2F" />
            </View>
            <Text style={styles.popularName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.popularCategory}>{item.category}</Text>
          </TouchableOpacity>
        )}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#003087" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Select {type === 'origin' ? 'Starting Point' : 'Destination'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={`Search for ${type === 'origin' ? 'starting point' : 'destination'}...`}
              value={searchQuery}
              onChangeText={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setShowSuggestions(false);
                }}
              >
                <Icon name="close" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
          
          {type === 'origin' && (
            <TouchableOpacity 
              style={styles.currentLocationButton}
              onPress={handleGetCurrentLocation}
            >
              <Icon name="my-location" size={20} color="#D32F2F" />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Results */}
        {showSuggestions && searchResults.length > 0 && (
          <View style={styles.resultsContainer}>
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#D32F2F" />
              </View>
            )}
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id?.toString() || item.placeId}
              renderItem={renderResultItem}
              keyboardShouldPersistTaps="handled"
              style={styles.resultsList}
            />
          </View>
        )}

        {/* Map */}
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={mapRegion}
            onPress={handleMapPress}
            showsUserLocation
            showsMyLocationButton={false}
          >
            {selectedLocation && (
              <Marker
                coordinate={{
                  latitude: selectedLocation.lat,
                  longitude: selectedLocation.lng,
                }}
                title={selectedLocation.desc}
                pinColor={type === 'origin' ? '#003087' : '#D32F2F'}
              />
            )}
          </MapView>

          {/* Map Instructions */}
          <View style={styles.mapInstructions}>
            <Icon name="touch-app" size={16} color="#666" />
            <Text style={styles.instructionText}>Tap on the map to select a location</Text>
          </View>

          {/* Loading Overlay */}
          {isLoading && (
            <View style={styles.mapLoadingOverlay}>
              <ActivityIndicator size="large" color="#D32F2F" />
            </View>
          )}
        </View>

        {/* Popular Destinations (when no search) */}
        {!showSuggestions && !selectedLocation && renderPopularDestinations()}

        {/* Selected Location Card */}
        {selectedLocation && (
          <View style={styles.selectedCard}>
            <View style={styles.selectedInfo}>
              <Icon 
                name={type === 'origin' ? 'radio-button-unchecked' : 'location-on'} 
                size={24} 
                color={type === 'origin' ? '#003087' : '#D32F2F'} 
              />
              <View style={styles.selectedTextContainer}>
                <Text style={styles.selectedName} numberOfLines={1}>
                  {selectedLocation.desc}
                </Text>
                {selectedLocation.address && (
                  <Text style={styles.selectedAddress} numberOfLines={1}>
                    {selectedLocation.address}
                  </Text>
                )}
              </View>
            </View>
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
              <Icon name="check" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

// Helper function to get category icon
const getCategoryIcon = (category) => {
  const icons = {
    'Landmark': 'location-city',
    'University': 'school',
    'Cafe': 'local-cafe',
    'Resort': 'pool',
    'Church': 'church',
    'Government': 'account-balance',
    'Market': 'store',
    'Transport': 'directions-bus',
    'Nature': 'park',
    'default': 'place',
  };
  return icons[category] || icons.default;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? hp(6) : hp(4),
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: hp(2.2),
    fontWeight: '600',
    color: '#003087',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    backgroundColor: '#FFF',
    alignItems: 'center',
    gap: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: hp(6),
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: hp(1.8),
    color: '#333',
  },
  currentLocationButton: {
    width: hp(6),
    height: hp(6),
    borderRadius: 12,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D32F2F',
  },
  resultsContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? hp(18) : hp(16),
    left: wp(4),
    right: wp(4),
    backgroundColor: '#FFF',
    borderRadius: 12,
    maxHeight: hp(30),
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  loadingContainer: {
    padding: 10,
    alignItems: 'center',
  },
  resultsList: {
    maxHeight: hp(28),
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  resultIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultName: {
    fontSize: hp(1.8),
    fontWeight: '500',
    color: '#333',
  },
  resultAddress: {
    fontSize: hp(1.5),
    color: '#666',
    marginTop: 2,
  },
  localBadge: {
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  localBadgeText: {
    fontSize: hp(1.3),
    color: '#D32F2F',
    fontWeight: '500',
  },
  mapContainer: {
    flex: 1,
    margin: wp(4),
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  map: {
    flex: 1,
  },
  mapInstructions: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  instructionText: {
    fontSize: hp(1.5),
    color: '#666',
  },
  mapLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularContainer: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
  },
  popularTitle: {
    fontSize: hp(1.8),
    fontWeight: '600',
    color: '#003087',
    marginBottom: hp(1.5),
  },
  popularItem: {
    flex: 1,
    backgroundColor: '#FFF',
    margin: 5,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  popularIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  popularName: {
    fontSize: hp(1.5),
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  popularCategory: {
    fontSize: hp(1.3),
    color: '#666',
  },
  selectedCard: {
    backgroundColor: '#FFF',
    margin: wp(4),
    marginTop: 0,
    padding: wp(4),
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  selectedInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  selectedTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  selectedName: {
    fontSize: hp(1.8),
    fontWeight: '600',
    color: '#333',
  },
  selectedAddress: {
    fontSize: hp(1.5),
    color: '#666',
    marginTop: 2,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: hp(1.8),
    fontWeight: '600',
  },
});
