import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Animated,
  Alert,
  Keyboard,
  LogBox,
  Linking, // Added for Google Maps
  Switch,   // Added for Discount Toggle
  Modal     // Added for Receipt Modal
} from 'react-native';
import LocationPickerModal from '../../components/LocationPickerModal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from 'axios';
import * as Location from 'expo-location'; // Added for GPS functionality
import { hp, wp } from "../../helpers/common";
import { calculateFare, fetchRouteDetails, PLACES_API_KEY, getGoogleMapsUrl } from '../../services/transportService';
import { recommendations } from '../../constants/recommendations';
import { popularDestinations, searchDestinations } from '../../constants/popularDestinations';

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
  const [userName, setUserName] = useState('North');
  const [timeGreeting, setTimeGreeting] = useState('');
  const [showAllRecommendations, setShowAllRecommendations] = useState(false);

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

  const originRef = useRef();
  const destRef = useRef();

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
  }, []);

  // SEARCH FILTERING EFFECT
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRecommendations(recommendations.slice(0, 3));
    } else {
      const filtered = recommendations.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.distance.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecommendations(filtered.slice(0, 10)); // Limit to 10 results for performance
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
    
    originRef.current?.setAddressText(destination?.desc || '');
    destRef.current?.setAddressText(origin?.desc || '');
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

      originRef.current?.setAddressText(addressString);
    } catch (error) {
      Alert.alert('Error', 'Unable to get current location. Please check your GPS settings.');
    }
  };

  const handleRecommendationPress = (item) => {
    // Find matching destination with coordinates
    const matchedDestination = popularDestinations.find(
      dest => dest.name.toLowerCase() === item.title.toLowerCase()
    );
    
    // Show place details with option to set as origin/destination
    Alert.alert(
      item.title,
      item.distance,
      [
        { text: 'Set as Origin', onPress: () => {
          if (matchedDestination?.coordinates) {
            setOrigin({ 
              lat: matchedDestination.coordinates.lat, 
              lng: matchedDestination.coordinates.lng, 
              desc: item.title 
            });
          } else {
            // Open location picker to search for exact location
            setShowOriginPicker(true);
          }
          originRef.current?.setAddressText(item.title);
        }},
        { text: 'Set as Destination', onPress: () => {
          if (matchedDestination?.coordinates) {
            setDestination({ 
              lat: matchedDestination.coordinates.lat, 
              lng: matchedDestination.coordinates.lng, 
              desc: item.title 
            });
          } else {
            // Open location picker to search for exact location
            setShowDestinationPicker(true);
          }
          destRef.current?.setAddressText(item.title);
        }},
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

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

      {/* Location Picker Modals */}
      <LocationPickerModal
        visible={showOriginPicker}
        onClose={() => setShowOriginPicker(false)}
        onSelectLocation={(location) => {
          setOrigin(location);
          originRef.current?.setAddressText(location.desc);
        }}
        type="origin"
      />
      <LocationPickerModal
        visible={showDestinationPicker}
        onClose={() => setShowDestinationPicker(false)}
        onSelectLocation={(location) => {
          setDestination(location);
          destRef.current?.setAddressText(location.desc);
        }}
        type="destination"
      />

      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userName[0].toUpperCase()}</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Hi {userName}</Text>
              <Text style={styles.timeGreeting}>{timeGreeting}</Text>
            </View>
          </View>
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
                    {origin?.desc || 'Tap to select starting point'}
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
                    {destination?.desc || 'Tap to select destination'}
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
                    <View style={styles.cardImagePlaceholder}>
                      <Icon name="photo" size={Math.round(hp(3))} color="#BDBDBD" />
                    </View>
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
                        <View style={styles.blankImage} />
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
    </View>
  );
}

// --- AUTOCOMPLETE STYLES ---
const autocompleteStyles = {
  container: { flex: 1, overflow: 'visible' },
  textInput: { height: hp(5.5), color: '#333', fontSize: hp(1.7), backgroundColor: 'transparent', marginTop: 2 },
  listView: { position: 'absolute', top: 45, left: 0, right: 0, zIndex: 10000, backgroundColor: 'white', borderRadius: 8, borderWidth: 1, borderColor: '#EEE', elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, maxHeight: 132, overflow: 'hidden' },
  row: { backgroundColor: 'white', padding: 13, height: 44, flexDirection: 'row' },
  separator: { height: 0.5, backgroundColor: '#c8c7cc' },
  description: { fontSize: 14, color: '#333' },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFF' },
  fixedHeader: { backgroundColor: '#F8FAFF', paddingTop: hp(6), paddingBottom: hp(2) },
  scrollView: { flex: 1, backgroundColor: '#F8FAFF' },
  scrollContent: { paddingBottom: hp(5) },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(5), paddingBottom: hp(2) },
  profileSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#003087', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  greeting: { fontSize: 13, color: '#003087' },
  timeGreeting: { fontSize: 18, fontWeight: '600', color: '#003087' },
  searchContainer: { flexDirection: 'row', paddingHorizontal: wp(5), marginBottom: hp(3), gap: 10 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 15, height: 50 },
  section: { marginBottom: hp(3) },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(5), marginBottom: hp(2) },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#003087' },
  showAll: { fontSize: 14, color: '#D32F2F' },
  transportGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, justifyContent: 'space-around' },
  transportContainer: { paddingHorizontal: wp(5) },
  transportItem: { alignItems: 'center', gap: 8 },
  transportIconContainer: { width: 70, height: 70, borderRadius: 15, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  selectedTransportIcon: { backgroundColor: '#D32F2F' },
  transportName: { fontSize: 12, color: '#003087', textAlign: 'center', maxWidth: 70 },
  tricycleContainer: { marginBottom: 15 },
  tricycleLabel: { fontSize: 14, color: '#666', marginBottom: 8, fontWeight: '500' },
  trikeTypeRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  typeBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#D32F2F', alignItems: 'center' },
  activeTypeBtn: { backgroundColor: '#D32F2F' },
  typeBtnText: { color: '#D32F2F', fontWeight: '600' },
  activeTypeBtnText: { color: 'white' },
  passengerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  counterContainer: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  counterBtn: { backgroundColor: '#003087', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  counterText: { fontSize: 18, fontWeight: 'bold', color: '#333', width: 20, textAlign: 'center' },
  divider: { height: 1, backgroundColor: '#EEE', marginBottom: 15 },
  discountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  card: { width: 250, marginRight: wp(3), backgroundColor: '#FFF', borderRadius: 15, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  cardImageContainer: { position: 'relative', height: 180, backgroundColor: '#BBDEFB', justifyContent: 'center', alignItems: 'center' },
  cardImage: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  cardContent: { padding: 15 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#003087', marginBottom: 4 },
  cardDistance: { fontSize: 13, color: '#666' },
  recommendationsContainer: { paddingHorizontal: wp(5) },
  blankImage: { backgroundColor: '#BBDEFB', flex: 1 },
  fullRecommendationsContainer: { paddingHorizontal: wp(5) },
  fullCard: { backgroundColor: 'white', borderRadius: 14, marginBottom: hp(2), overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 5, flexDirection: 'row', alignItems: 'center' },
  fullCardImageContainer: { width: wp(35), height: hp(12) },
  cardImagePlaceholder: { flex: 1, backgroundColor: '#BBDEFB', justifyContent: 'center', alignItems: 'center' },
  fullCardContent: { padding: wp(3), flex: 1, justifyContent: 'center' },
  fullCardTitle: { fontSize: hp(2.0), fontWeight: '600', color: '#003087', marginBottom: hp(0.6) },
  fullCardDistance: { fontSize: hp(1.6), color: '#666' },
  row: { flexDirection: 'row', alignItems: 'center', gap: wp(1.5) },
  calculatorCard: { marginHorizontal: wp(5), backgroundColor: 'white', borderRadius: 20, padding: wp(5), shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, position: 'relative' },
  calculatorRow: { flexDirection: 'row', alignItems: 'flex-start' },
  leftIconsColumn: { alignItems: 'center', marginRight: wp(2), paddingTop: 5 },
  verticalLine: { width: 0, height: hp(5.5), borderLeftWidth: 2, borderColor: '#CCC', borderStyle: 'dotted', marginVertical: 4 },
  inputsColumn: { flex: 1, gap: hp(1.5) },
  inputWrapperTop: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#DDD', borderRadius: 12, paddingHorizontal: wp(3), height: hp(6), overflow: 'visible' },
  inputWrapperBottom: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#DDD', borderRadius: 12, paddingHorizontal: wp(3), height: hp(6), overflow: 'visible' },
  swapButton: { marginLeft: wp(3), padding: 8, alignSelf: 'center' },
  distanceRow: { flexDirection: 'row', marginTop: hp(2.5), gap: wp(3) },
  calculateBtn: { backgroundColor: '#D32F2F', borderRadius: 15, paddingHorizontal: wp(6), height: hp(5.5), justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, position: 'absolute', bottom: -35, right: 0, left: 170 },
  calculateBtnText: { color: 'white', fontSize: hp(1.7), fontWeight: '600' },

  // RECEIPT MODAL STYLES
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: wp(5) },
  receiptContainer: { backgroundColor: 'white', borderRadius: 20, width: '100%', maxWidth: wp(90), shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 10 },
  receiptHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: wp(5), borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  receiptTitle: { fontSize: hp(2.5), fontWeight: 'bold', color: '#003087' },
  closeButton: { padding: 5 },
  receiptSection: { paddingHorizontal: wp(5), paddingVertical: hp(1.5) },
  transportBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', backgroundColor: '#FFF5F5', paddingHorizontal: wp(4), paddingVertical: hp(1), borderRadius: 20, borderWidth: 1, borderColor: '#FFE5E5' },
  transportBadgeText: { fontSize: hp(1.8), fontWeight: '600', color: '#D32F2F', marginLeft: wp(2) },
  receiptRow: { flexDirection: 'row', alignItems: 'center', marginVertical: hp(0.5) },
  receiptLabel: { fontSize: hp(1.6), color: '#666', marginLeft: wp(2), minWidth: wp(15) },
  receiptValue: { fontSize: hp(1.6), color: '#333', fontWeight: '500', flex: 1, textAlign: 'right' },
  receiptDivider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: hp(1), marginLeft: wp(8) },
  discountBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', backgroundColor: '#E8F5E8', paddingHorizontal: wp(4), paddingVertical: hp(1), borderRadius: 15, borderWidth: 1, borderColor: '#C8E6C9' },
  discountBadgeText: { fontSize: hp(1.4), color: '#2E7D32', marginLeft: wp(2) },
  receiptTotal: { backgroundColor: '#F8FAFF', margin: wp(5), marginBottom: hp(2), padding: wp(4), borderRadius: 15, borderWidth: 2, borderColor: '#BBDEFB', alignItems: 'center' },
  totalLabel: { fontSize: hp(1.8), color: '#666', marginBottom: hp(0.5) },
  totalAmount: { fontSize: hp(3), fontWeight: 'bold', color: '#003087' },
  receiptActions: { flexDirection: 'row', padding: wp(5), paddingTop: 0, gap: wp(3) },
  actionButtonSecondary: { flex: 1, backgroundColor: '#F5F5F5', paddingVertical: hp(1.5), borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0' },
  actionButtonTextSecondary: { fontSize: hp(1.6), color: '#666', fontWeight: '600' },
  actionButtonPrimary: { flex: 1, backgroundColor: '#D32F2F', paddingVertical: hp(1.5), borderRadius: 10, alignItems: 'center' },
  actionButtonTextPrimary: { fontSize: hp(1.6), color: '#FFF', fontWeight: '600' },

  // CURRENT LOCATION BUTTON STYLES
  currentLocationBtn: { 
    position: 'absolute', 
    right: 10, 
    top: 10, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F8FAFF', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#D32F2F' 
  },
  currentLocationText: { 
    fontSize: 12, 
    color: '#D32F2F', 
    marginLeft: 4, 
    fontWeight: '500' 
  },

  // Location input text styles
  locationInputText: {
    flex: 1,
    fontSize: hp(1.7),
    color: '#333',
    paddingVertical: 10,
  },
  placeholderText: {
    color: '#999',
  }
});