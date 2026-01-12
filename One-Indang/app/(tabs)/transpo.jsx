import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Alert,
  Keyboard,
  LogBox,
  Linking, //  for Google Maps
  Switch,   //  for Discount Toggle
  Modal,    //  for Receipt Modal
  Image,    //  for displaying recommendation images
  StyleSheet, // for local styles
} from 'react-native';
import LocationPickerModal from '../../components/LocationPickerModal';
import UserProfileSheet from '../../components/UserProfileSheet';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { auth } from '../../services/supabase';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from 'axios';
import * as Location from 'expo-location'; 
import { hp, wp } from "../../helpers/common";
import { calculateFare, fetchRouteDetails, PLACES_API_KEY, getGoogleMapsUrl } from '../../services/transportService';
import { recommendations } from '../../constants/recommendations';
import { popularDestinations, searchDestinations } from '../../constants/popularDestinations';
import { styles, autocompleteStyles } from '../../styles/transpoStyles';

// Ignore specific warnings
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

const TransportIcon = ({ name, icon, onPress, isSelected }) => (
  <TouchableOpacity onPress={onPress} style={styles.transportItem}>
    <View style={[styles.transportIconContainer, isSelected && styles.selectedTransportIcon]}>
      <Icon name={icon} size={32} color={isSelected ? "#FFF" : "#D32F2F"} />
    </View>
    <Text style={styles.transportName}>{name}</Text>
  </TouchableOpacity>
);

export default function App() {
  const router = useRouter();
  const [userName, setUserName] = useState(null);
  const [timeGreeting, setTimeGreeting] = useState('');
  const [showAllRecommendations, setShowAllRecommendations] = useState(false);
  
  // User session state
  const [session, setSession] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Bottom Sheet ref for profile
  const profileSheetRef = useRef(null);

  // SEARCH STATE
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecommendations, setFilteredRecommendations] = useState(recommendations.slice(0, 3));

  // STATE FOR LOCATIONS & FARE 
  const [origin, setOrigin] = useState(null); 
  const [destination, setDestination] = useState(null); 
  
  const [distance, setDistance] = useState(''); 
  const [duration, setDuration] = useState(''); 
  const [fare, setFare] = useState(null);
  
  const [selectedTransport, setSelectedTransport] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // TRICYCLE & DISCOUNT STATE 
  const [tricycleType, setTricycleType] = useState('Regular');
  const [passengerCount, setPassengerCount] = useState(1);
  const [isDiscounted, setIsDiscounted] = useState(false); // For Student/Senior/PWD

  // RECEIPT MODAL STATE
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // LOCATION PERMISSION STATE
  const [locationPermission, setLocationPermission] = useState(null);

  // LOCATION PICKER MODAL STATE
  const [showOriginPicker, setShowOriginPicker] = useState(false);
  const [showDestinationPicker, setShowDestinationPicker] = useState(false);

  // PLACE SELECTION MODAL STATE
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    let greeting = 'Good Morning';
    if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
    else if (hour >= 17) greeting = 'Good Evening';
    setTimeGreeting(greeting);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Check for existing user session
    const checkUser = async () => {
      try {
        const response = await auth.getSession();
        if (response?.session) {
          setSession(response.session);
          setIsLoggedIn(true);
          // Get user name from metadata or email
          const user = response.session.user;
          const name = user?.user_metadata?.full_name || 
                       user?.user_metadata?.name || 
                       user?.email?.split('@')[0] || 
                       null;
          setUserName(name);
        }
      } catch (e) {
        console.log('Session check error:', e);
      }
    };
    checkUser();

    // Listen for auth state changes
    const { data: authListener } = auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setSession(session);
        setIsLoggedIn(true);
        const user = session.user;
        const name = user?.user_metadata?.full_name || 
                     user?.user_metadata?.name || 
                     user?.email?.split('@')[0] || 
                     null;
        setUserName(name);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setIsLoggedIn(false);
        setUserName(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Handle avatar press - open bottom sheet if logged in, otherwise go to login
  const handleAvatarPress = useCallback(() => {
    if (isLoggedIn) {
      profileSheetRef.current?.expand();
    } else {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      setSession(null);
      setIsLoggedIn(false);
      setUserName(null);
      profileSheetRef.current?.close();
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  // Handle edit profile
  const handleEditProfile = () => {
    profileSheetRef.current?.close();
    router.push('/profile');
  };

  // SEARCH FILTERING EFFECT
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRecommendations(recommendations.slice(0, 3));
    } else {
      const filtered = recommendations.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.distance.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecommendations(filtered.slice(0, 10));
    }
  }, [searchQuery]);

  // --- INDANG SPECIFIC FARE LOGIC ---
  const calculateFareHandler = async () => {
    try {
      const result = await calculateFare(selectedTransport, tricycleType, passengerCount, isDiscounted, origin, destination);
      
      // Prepare receipt data
      const receipt = {
        transportType: selectedTransport,
        origin: origin?.desc || 'Not specified',
        destination: destination?.desc || 'Not specified',
        distance: result.distance,
        duration: result.duration,
        fare: result.fare,
        tricycleType: selectedTransport === 'Tricycle' ? tricycleType : null,
        passengerCount: selectedTransport === 'Tricycle' && tricycleType === 'Regular' ? passengerCount : null,
        isDiscounted: (selectedTransport === 'Jeep' || selectedTransport === 'Bus') && isDiscounted
      };
      
      setReceiptData(receipt);
      setFare(result.fare);
      setDistance(result.distance);
      setDuration(result.duration);
      setShowReceiptModal(true);
      Keyboard.dismiss();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // --- GOOGLE MAPS REDIRECT ---
  const handleDirection = async () => {
    try {
      const url = getGoogleMapsUrl(origin, destination);
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Google Maps is not installed or supported.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const incrementPassenger = () => {
    if (passengerCount < 6) setPassengerCount(prev => prev + 1);
  };

  const decrementPassenger = () => {
    if (passengerCount > 2) setPassengerCount(prev => prev - 1);
  };

  const swapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  // --- GET CURRENT LOCATION FUNCTION ---
  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);

      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to use current location');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Reverse geocode to get address
      const address = await Location.reverseGeocodeAsync({ latitude, longitude });
      const addressString = address[0] ?
        `${address[0].name || ''}, ${address[0].city || ''}, ${address[0].region || ''}`.replace(/^, |, $/g, '') :
        `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

      setOrigin({
        lat: latitude,
        lng: longitude,
        desc: addressString
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to get current location. Please check your GPS settings.');
    }
  };

  const handleRecommendationPress = (item) => {
    // Find matching destination with coordinates
    const matchedDestination = popularDestinations.find(
      dest => dest.name.toLowerCase() === item.title.toLowerCase()
    );
    
    // Store selected place data and show custom modal
    setSelectedPlace({ ...item, matchedDestination });
    setShowPlaceModal(true);
  };

  const handleSetAsOrigin = () => {
    if (!selectedPlace) return;
    
    if (selectedPlace.matchedDestination?.coordinates) {
      setOrigin({ 
        lat: selectedPlace.matchedDestination.coordinates.lat, 
        lng: selectedPlace.matchedDestination.coordinates.lng, 
        desc: selectedPlace.title 
      });
    } else {
      setShowOriginPicker(true);
    }
    setShowPlaceModal(false);
    setSelectedPlace(null);
  };

  const handleSetAsDestination = () => {
    if (!selectedPlace) return;
    
    if (selectedPlace.matchedDestination?.coordinates) {
      setDestination({ 
        lat: selectedPlace.matchedDestination.coordinates.lat, 
        lng: selectedPlace.matchedDestination.coordinates.lng, 
        desc: selectedPlace.title 
      });
    } else {
      setShowDestinationPicker(true);
    }
    setShowPlaceModal(false);
    setSelectedPlace(null);
  };

  // PLACE SELECTION MODAL COMPONENT
  const PlaceSelectionModal = () => (
    <Modal
      visible={showPlaceModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowPlaceModal(false)}
    >
      <TouchableOpacity 
        style={localStyles.placeModalOverlay} 
        activeOpacity={1} 
        onPress={() => setShowPlaceModal(false)}
      >
        <View style={localStyles.placeModalContainer}>
          {/* Header with place info */}
          <View style={localStyles.placeModalHeader}>
            <View style={localStyles.placeIconCircle}>
              <Icon name="place" size={28} color="#D32F2F" />
            </View>
            <Text style={localStyles.placeModalTitle}>{selectedPlace?.title}</Text>
            <Text style={localStyles.placeModalSubtitle}>{selectedPlace?.distance}</Text>
          </View>

          {/* Divider */}
          <View style={localStyles.placeModalDivider} />

          {/* Action Buttons */}
          <View style={localStyles.placeModalActions}>
            {/* Set as Origin Button */}
            <TouchableOpacity 
              style={localStyles.placeActionButton} 
              onPress={handleSetAsOrigin}
              activeOpacity={0.7}
            >
              <View style={[localStyles.placeActionIconCircle, { backgroundColor: '#E8F5E9' }]}>
                <Icon name="trip-origin" size={22} color="#4CAF50" />
              </View>
              <View style={localStyles.placeActionTextContainer}>
                <Text style={localStyles.placeActionTitle}>Set as Origin</Text>
                <Text style={localStyles.placeActionSubtitle}>Start your trip from here</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#CCC" />
            </TouchableOpacity>

            {/* Set as Destination Button */}
            <TouchableOpacity 
              style={localStyles.placeActionButton} 
              onPress={handleSetAsDestination}
              activeOpacity={0.7}
            >
              <View style={[localStyles.placeActionIconCircle, { backgroundColor: '#FFEBEE' }]}>
                <Icon name="flag" size={22} color="#D32F2F" />
              </View>
              <View style={localStyles.placeActionTextContainer}>
                <Text style={localStyles.placeActionTitle}>Set as Destination</Text>
                <Text style={localStyles.placeActionSubtitle}>End your trip here</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#CCC" />
            </TouchableOpacity>
          </View>

          {/* Cancel Button */}
          <TouchableOpacity 
            style={localStyles.placeCancelButton} 
            onPress={() => setShowPlaceModal(false)}
            activeOpacity={0.7}
          >
            <Text style={localStyles.placeCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // RECEIPT MODAL COMPONENT
  const ReceiptModal = () => (
    <Modal
      visible={showReceiptModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowReceiptModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.receiptContainer}>
          {/* Header */}
          <View style={styles.receiptHeader}>
            <Text style={styles.receiptTitle}>Trip Receipt</Text>
            <TouchableOpacity 
              onPress={() => setShowReceiptModal(false)}
              style={styles.closeButton}
            >
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Transport Type */}
          <View style={styles.receiptSection}>
            <View style={styles.transportBadge}>
              <Icon 
                name={
                  receiptData?.transportType === 'Tricycle' ? 'pedal-bike' :
                  receiptData?.transportType === 'Bus' ? 'directions-bus' :
                  receiptData?.transportType === 'Jeep' ? 'directions-car' : 'drive-eta'
                } 
                size={20} 
                color="#D32F2F" 
              />
              <Text style={styles.transportBadgeText}>{receiptData?.transportType}</Text>
            </View>
          </View>

          {/* Trip Details */}
          <View style={styles.receiptSection}>
            <View style={styles.receiptRow}>
              <Icon name="radio-button-unchecked" size={16} color="#666" />
              <Text style={styles.receiptLabel}>From:</Text>
              <Text style={styles.receiptValue} numberOfLines={2}>{receiptData?.origin}</Text>
            </View>
            
            <View style={styles.receiptDivider} />
            
            <View style={styles.receiptRow}>
              <Icon name="location-on" size={16} color="#D32F2F" />
              <Text style={styles.receiptLabel}>To:</Text>
              <Text style={styles.receiptValue} numberOfLines={2}>{receiptData?.destination}</Text>
            </View>
          </View>

          {/* Trip Info */}
          <View style={styles.receiptSection}>
            <View style={styles.receiptRow}>
              <Icon name="straighten" size={16} color="#666" />
              <Text style={styles.receiptLabel}>Distance:</Text>
              <Text style={styles.receiptValue}>{receiptData?.distance} km</Text>
            </View>
            
            <View style={styles.receiptRow}>
              <Icon name="schedule" size={16} color="#666" />
              <Text style={styles.receiptLabel}>Duration:</Text>
              <Text style={styles.receiptValue}>{receiptData?.duration}</Text>
            </View>
          </View>

          {/* Additional Details */}
          {receiptData?.tricycleType && (
            <View style={styles.receiptSection}>
              <View style={styles.receiptRow}>
                <Icon name="info" size={16} color="#666" />
                <Text style={styles.receiptLabel}>Type:</Text>
                <Text style={styles.receiptValue}>{receiptData.tricycleType}</Text>
              </View>
              {receiptData.passengerCount && (
                <View style={styles.receiptRow}>
                  <Icon name="group" size={16} color="#666" />
                  <Text style={styles.receiptLabel}>Passengers:</Text>
                  <Text style={styles.receiptValue}>{receiptData.passengerCount}</Text>
                </View>
              )}
            </View>
          )}

          {receiptData?.isDiscounted && (
            <View style={styles.receiptSection}>
              <View style={styles.discountBadge}>
                <Icon name="local-offer" size={16} color="#4CAF50" />
                <Text style={styles.discountBadgeText}>20% Student/Senior/PWD Discount Applied</Text>
              </View>
            </View>
          )}

          {/* Total Fare */}
          <View style={styles.receiptTotal}>
            <Text style={styles.totalLabel}>Total Fare</Text>
            <Text style={styles.totalAmount}>₱{receiptData?.fare}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.receiptActions}>
            <TouchableOpacity 
              style={styles.actionButtonSecondary}
              onPress={() => setShowReceiptModal(false)}
            >
              <Text style={styles.actionButtonTextSecondary}>Close</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButtonPrimary}
              onPress={() => {
                setShowReceiptModal(false);
                handleDirection();
              }}
            >
              <Text style={styles.actionButtonTextPrimary}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Receipt Modal */}
      <ReceiptModal />

      {/* Place Selection Modal */}
      <PlaceSelectionModal />

      {/* Location Picker Modals */}
      <LocationPickerModal
        visible={showOriginPicker}
        onClose={() => setShowOriginPicker(false)}
        onSelectLocation={(location) => {
          setOrigin(location);
        }}
        type="origin"
      />
      <LocationPickerModal
        visible={showDestinationPicker}
        onClose={() => setShowDestinationPicker(false)}
        onSelectLocation={(location) => {
          setDestination(location);
        }}
        type="destination"
      />

      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <View style={styles.header}>
          {userName ? (
            <TouchableOpacity style={styles.profileSection} onPress={handleAvatarPress} activeOpacity={0.7}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{userName[0].toUpperCase()}</Text>
              </View>
              <View>
                <Text style={styles.greeting}>Welcome, {userName}!</Text>
                <Text style={styles.timeGreeting}>{timeGreeting}</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.profileSection} onPress={handleAvatarPress} activeOpacity={0.7}>
              <View style={styles.avatar}>
                <Icon name="person" size={24} color="#D32F2F" />
              </View>
              <View>
                <Text style={styles.greeting}>Welcome to One-Indang</Text>
                <Text style={styles.timeGreeting}>{timeGreeting}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Search Bar - Local search for Indang recommendations */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { zIndex: 1100 }]}>
            <Icon name="search" size={18} color="#D32F2F" style={{marginRight: 10}} />
            <TextInput
              placeholder='Search Indang places...'
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={autocompleteStyles.textInput}
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.scrollContent}
      >

        {/* Transportation Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transportation</Text>
          </View>
          <View style={styles.transportContainer}>
            <View style={styles.transportGrid}>
              <TransportIcon name="Tricycle" icon="pedal-bike" onPress={() => setSelectedTransport('Tricycle')} isSelected={selectedTransport === 'Tricycle'} />
              <TransportIcon name="Bus" icon="directions-bus" onPress={() => setSelectedTransport('Bus')} isSelected={selectedTransport === 'Bus'} />
              <TransportIcon name="Jeep" icon="directions-car" onPress={() => setSelectedTransport('Jeep')} isSelected={selectedTransport === 'Jeep'} />
              <TransportIcon name="Car" icon="drive-eta" onPress={() => setSelectedTransport('Personal Car')} isSelected={selectedTransport === 'Personal Car'} />
            </View>
          </View>
        </View>

        {/* Fare Calculator */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fare Calculator</Text>
          </View>
          <View style={styles.calculatorCard}>
            
            {/* Tricycle Specific Inputs */}
            {selectedTransport === 'Tricycle' && (
                <View style={styles.tricycleContainer}>
                    <Text style={styles.tricycleLabel}>Trip Type:</Text>
                    <View style={styles.trikeTypeRow}>
                        <TouchableOpacity 
                            style={[styles.typeBtn, tricycleType === 'Regular' && styles.activeTypeBtn]}
                            onPress={() => setTricycleType('Regular')}
                        >
                            <Text style={[styles.typeBtnText, tricycleType === 'Regular' && styles.activeTypeBtnText]}>Regular</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.typeBtn, tricycleType === 'Special' && styles.activeTypeBtn]}
                            onPress={() => setTricycleType('Special')}
                        >
                            <Text style={[styles.typeBtnText, tricycleType === 'Special' && styles.activeTypeBtnText]}>Special</Text>
                        </TouchableOpacity>
                    </View>

                    {tricycleType === 'Regular' && (
                        <View style={styles.passengerRow}>
                            <Text style={styles.tricycleLabel}>Passengers:</Text>
                            <View style={styles.counterContainer}>
                                <TouchableOpacity onPress={decrementPassenger} style={styles.counterBtn}>
                                    <Icon name="remove" size={20} color="white" />
                                </TouchableOpacity>
                                <Text style={styles.counterText}>{passengerCount}</Text>
                                <TouchableOpacity onPress={incrementPassenger} style={styles.counterBtn}>
                                    <Icon name="add" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    <View style={styles.divider} />
                </View>
            )}

            {/* Discount Toggle for Jeep and Bus */}
            {(selectedTransport === 'Jeep' || selectedTransport === 'Bus') && (
                 <View style={styles.discountRow}>
                    <Text style={styles.tricycleLabel}>Student/Senior/PWD (20% off):</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#ffadad" }}
                        thumbColor={isDiscounted ? "#D32F2F" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setIsDiscounted(!isDiscounted)}
                        value={isDiscounted}
                    />
                 </View>
            )}

            <View style={styles.calculatorRow}>
              <View style={styles.leftIconsColumn}>
                <Icon name="radio-button-unchecked" size={20} color="#333" style={{marginTop: 15}} />
                <View style={styles.verticalLine} />
                <Icon name="location-on" size={20} color="#D32F2F" style={{marginBottom: 15}}/>
              </View>

              <View style={styles.inputsColumn}>
                <TouchableOpacity 
                  style={[styles.inputWrapperTop, { zIndex: 1000 }]}
                  onPress={() => setShowOriginPicker(true)}
                  activeOpacity={0.7}
                >
                  <Text 
                    style={[styles.locationInputText, !origin && styles.placeholderText]}
                    numberOfLines={1}
                  >
                    {origin?.desc || 'Select starting point'}
                  </Text>
                  <TouchableOpacity
                    style={styles.currentLocationBtn}
                    onPress={(e) => {
                      e.stopPropagation();
                      getCurrentLocation();
                    }}
                  >
                    <Icon name="my-location" size={16} color="#D32F2F" />
                  </TouchableOpacity>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.inputWrapperBottom, { zIndex: 900 }]}
                  onPress={() => setShowDestinationPicker(true)}
                  activeOpacity={0.7}
                >
                  <Text 
                    style={[styles.locationInputText, !destination && styles.placeholderText]}
                    numberOfLines={1}
                  >
                    {destination?.desc || 'Select destination'}
                  </Text>
                  <Icon name="chevron-right" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={swapLocations} style={styles.swapButton}>
                <Icon name="swap-vert" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {distance !== '' && (
                 <View style={{marginTop: 10, flexDirection: 'row', alignItems: 'center'}}>
                     <Text style={{fontSize: hp(1.6), color: '#666'}}>
                         Dist: <Text style={{fontWeight:'bold', color: 'black'}}>{distance} km</Text>
                     </Text>
                     <Text style={{fontSize: hp(1.6), color: '#666', marginLeft: 10}}>
                         Time: <Text style={{fontWeight:'bold', color: 'black'}}>{duration}</Text>
                     </Text>
                 </View>
            )}

            <View style={styles.distanceRow}>
              <TouchableOpacity style={styles.calculateBtn} onPress={selectedTransport === 'Personal Car' ? handleDirection : calculateFareHandler}>
                <Text style={styles.calculateBtnText}>
                    {selectedTransport === 'Personal Car' ? 'Open Maps' : 'Calculate'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Recommendations Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {searchQuery.trim() ? `Search Results (${filteredRecommendations.length})` : 'Featured Places'}
            </Text>
            <TouchableOpacity onPress={() => setShowAllRecommendations(!showAllRecommendations)}>
              <Text style={styles.showAll}>
                {showAllRecommendations ? 'Show less' : searchQuery.trim() ? 'Show all results' : 'Show featured'}
              </Text>
            </TouchableOpacity>
          </View>
          {showAllRecommendations ? (
            <ScrollView style={styles.fullRecommendationsContainer} showsVerticalScrollIndicator={false}>
              {filteredRecommendations.map((item) => (
                <TouchableOpacity key={item.id} style={styles.fullCard} activeOpacity={0.9} onPress={() => handleRecommendationPress(item)}>
                  <View style={styles.fullCardImageContainer}>
                    {item.image ? (
                      <Image source={item.image} style={styles.fullCardImage} resizeMode="cover" />
                    ) : (
                      <View style={styles.cardImagePlaceholder}>
                        <Icon name="photo" size={Math.round(hp(3))} color="#BDBDBD" />
                      </View>
                    )}
                  </View>
                  <View style={styles.fullCardContent}>
                    <Text style={styles.fullCardTitle}>{item.title}</Text>
                    <View style={styles.row}>
                      <Icon name="location-on" size={Math.round(hp(2.6))} color="#BBDEFB" />
                      <Text style={styles.fullCardDistance}>{item.distance}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Animated.View style={{ opacity: fadeAnim }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendationsContainer}>
                {filteredRecommendations.slice(0, 3).map((item, index) => (
                  <View key={index} style={styles.card}>
                    <View style={styles.cardImageContainer}>
                      <View style={styles.cardImage}>
                        {item.image ? (
                          <Image source={item.image} style={styles.cardImageFill} resizeMode="cover" />
                        ) : (
                          <View style={styles.blankImage} />
                        )}
                      </View>
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <Text style={styles.cardDistance}>{item.distance}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </Animated.View>
          )}
        </View>
      </ScrollView>

      {/* User Profile Bottom Sheet */}
      {isLoggedIn && (
        <UserProfileSheet
          ref={profileSheetRef}
          onEditProfile={handleEditProfile}
          onLogout={handleLogout}
        />
      )}
    </View>
  );
}

// Local styles for Place Selection Modal
const localStyles = StyleSheet.create({
  placeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  placeModalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: hp(2),
    paddingBottom: hp(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  placeModalHeader: {
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
  },
  placeIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1.5),
    borderWidth: 2,
    borderColor: '#FFEBEE',
  },
  placeModalTitle: {
    fontSize: hp(2.4),
    fontWeight: 'bold',
    color: '#003087',
    textAlign: 'center',
    marginBottom: hp(0.5),
  },
  placeModalSubtitle: {
    fontSize: hp(1.6),
    color: '#666',
    textAlign: 'center',
  },
  placeModalDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: wp(5),
    marginVertical: hp(1),
  },
  placeModalActions: {
    paddingHorizontal: wp(5),
  },
  placeActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    borderRadius: 16,
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderColor: '#E8EEF8',
  },
  placeActionIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  placeActionTextContainer: {
    flex: 1,
  },
  placeActionTitle: {
    fontSize: hp(1.9),
    fontWeight: '600',
    color: '#003087',
    marginBottom: 2,
  },
  placeActionSubtitle: {
    fontSize: hp(1.4),
    color: '#888',
  },
  placeCancelButton: {
    marginTop: hp(1),
    marginHorizontal: wp(5),
    paddingVertical: hp(1.8),
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  placeCancelText: {
    fontSize: hp(1.8),
    fontWeight: '600',
    color: '#666',
  },
});