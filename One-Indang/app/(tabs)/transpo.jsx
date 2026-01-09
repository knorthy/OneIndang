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
} from 'react-native';   
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

// Helper for responsiveness (Mocking imports if you don't have the file)
import { Dimensions } from 'react-native';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const hp = (percentage) => (percentage * SCREEN_HEIGHT) / 100;
const wp = (percentage) => (percentage * SCREEN_WIDTH) / 100;

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
  const [startingPoint, setStartingPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState(''); // Note: User needs to input distance or API needs to fetch it.
  const [fare, setFare] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // --- NEW STATE FOR TRICYCLE ---
  const [tricycleType, setTricycleType] = useState('Regular'); // 'Regular' or 'Special'
  const [passengerCount, setPassengerCount] = useState(1);

  const recommendations = [
    { id: 1, title: 'Grand Canyon National Park', distance: '277 miles away' },
    { id: 2, title: 'Yosemite National Park', distance: '150 miles away' },
    { id: 3, title: 'Zion National Park', distance: '200 miles away' },
    { id: 4, title: 'Banff National Park', distance: '320 miles away' },
    { id: 5, title: 'Yellowstone National Park', distance: '420 miles away' },
  ];

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    let greeting = 'Good Morning';
    if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
    else if (hour >= 17) greeting = 'Good Evening';
    setTimeGreeting(greeting);
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const swapLocations = () => {
    const temp = startingPoint;
    setStartingPoint(destination);
    setDestination(temp);
  };

  // --- UPDATED PASSENGER HANDLERS ---
  const incrementPassenger = () => {
    if (passengerCount < 6) setPassengerCount(prev => prev + 1);
  };

  const decrementPassenger = () => {
    if (passengerCount > 1) setPassengerCount(prev => prev - 1);
  };

  const calculateFare = () => {
    // Note: For this to work, 'distance' needs a value. 
    // Since there is no map API here, I'm assuming user inputs distance 
    // or we assume a dummy distance for demo if empty.
    const distValue = distance ? parseFloat(distance) : 5; // Default 5km if empty for demo

    let rate = 0;
    
    if (selectedTransport === 'Tricycle') {
        if (tricycleType === 'Regular') {
            // Example: 15 pesos base + (distance * 2) per person
            const baseFare = 15;
            rate = (baseFare + (distValue * 2)) * passengerCount;
        } else {
            // Special: Flat rate usually higher, ignoring passengers (paying for whole trike)
            // Example: 50 base + (distance * 5)
            rate = 50 + (distValue * 5);
        }
        // Direct set for Tricycle since logic is complex
        setFare(rate.toFixed(2));
        return; 
    } 
    
    // Logic for other vehicles
    else if (selectedTransport === 'Bus') rate = 12;
    else if (selectedTransport === 'Jeep') rate = 13;
    else if (selectedTransport === 'Personal Car') rate = 15;

    const calculated = distValue * rate;
    setFare(calculated.toFixed(2));
  };

  const handleDirection = () => {
    if (startingPoint && destination) {
      Alert.alert('Directions', `Getting directions from ${startingPoint} to ${destination}`);
    } else {
      Alert.alert('Missing Information', 'Please enter both starting point and destination');
    }
  };

  const handleRecommendationPress = (item) => {
    Alert.alert('Recommendation Selected', `Selected: ${item.title}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
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

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="search" size={18} color="#D32F2F" style={{marginRight: 10}} />
            <TextInput
              placeholder="Discover places"
              placeholderTextColor="#666"
              style={styles.searchInput}
            />
          </View>
        </View>

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
            
            {/* --- NEW TRICYCLE CONTAINER --- */}
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

                    {/* Passenger Input (Only for Regular) */}
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
            {/* --- END TRICYCLE CONTAINER --- */}

            <View style={styles.calculatorRow}>
              {/* Left Icons Column */}
              <View style={styles.leftIconsColumn}>
                <Icon name="radio-button-unchecked" size={20} color="#333" />
                <View style={styles.verticalLine} />
                <Icon name="location-on" size={20} color="#D32F2F" />
              </View>

              {/* Inputs Column */}
              <View style={styles.inputsColumn}>
                <View style={styles.inputWrapperTop}>
                  <TextInput
                    style={styles.locationInput}
                    placeholder="Starting point"
                    placeholderTextColor="#666"
                    value={startingPoint}
                    onChangeText={setStartingPoint}
                  />
                  <Icon name="search" size={20} color="#666" style={styles.inputSearchIcon} />
                </View>

                <View style={styles.inputWrapperBottom}>
                  <TextInput
                    style={styles.locationInput}
                    placeholder="Destination"
                    placeholderTextColor="#666"
                    value={destination}
                    onChangeText={setDestination}
                  />
                </View>
              </View>

              {/* Right Swap Column */}
              <TouchableOpacity onPress={swapLocations} style={styles.swapButton}>
                <Icon name="swap-vert" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Added a temporary distance input for demo calculation since we don't have map API */}
            <View style={{marginTop: 10, flexDirection: 'row', alignItems: 'center'}}>
                 <Text style={{fontSize: 12, color: '#666', marginRight: 10}}>Dist(km):</Text>
                 <TextInput 
                    style={{backgroundColor: '#F0F0F0', padding: 5, borderRadius: 5, width: 60}}
                    placeholder="5"
                    keyboardType='numeric'
                    value={distance}
                    onChangeText={setDistance}
                 />
            </View>

            <View style={styles.distanceRow}>
              <TouchableOpacity style={styles.calculateBtn} onPress={selectedTransport === 'Personal Car' ? handleDirection : calculateFare}>
                <Text style={styles.calculateBtnText}>{selectedTransport === 'Personal Car' ? 'Direction' : 'Calculate'}</Text>
              </TouchableOpacity>
            </View>

            {fare && (
              <View style={styles.fareResultCard}>
                <Text style={styles.fareResultText}>Estimated Fare: ₱{fare}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Recommended */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommendation</Text>
            <TouchableOpacity onPress={() => setShowAllRecommendations(!showAllRecommendations)}>
              <Text style={styles.showAll}>{showAllRecommendations ? 'Show less' : 'Show all'}</Text>
            </TouchableOpacity>
          </View>
          {showAllRecommendations ? (
            <ScrollView style={styles.fullRecommendationsContainer} showsVerticalScrollIndicator={false}>
              {recommendations.map((item) => (
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
                {recommendations.slice(0, 3).map((item, index) => (
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingTop: hp(6),
    paddingBottom: hp(2),
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#003087',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: 13,
    color: '#003087',
  },
  timeGreeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003087',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(5),
    marginBottom: hp(3),
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#003087',
  },
  section: {
    marginBottom: hp(3),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#003087',
  },
  showAll: {
    fontSize: 14,
    color: '#D32F2F',
  },
  transportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'space-around',
  },
  transportContainer: {
    paddingHorizontal: wp(5),
  },
  transportItem: {
    alignItems: 'center',
    gap: 8,
  },
  transportIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedTransportIcon: {
    backgroundColor: '#D32F2F',
  },
  transportName: {
    fontSize: 12,
    color: '#003087',
    textAlign: 'center',
    maxWidth: 70,
  },
  // --- NEW STYLES FOR TRICYCLE UI ---
  tricycleContainer: {
    marginBottom: 15,
  },
  tricycleLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  trikeTypeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D32F2F',
    alignItems: 'center',
  },
  activeTypeBtn: {
    backgroundColor: '#D32F2F',
  },
  typeBtnText: {
    color: '#D32F2F',
    fontWeight: '600',
  },
  activeTypeBtnText: {
    color: 'white',
  },
  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  counterBtn: {
    backgroundColor: '#003087',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    width: 20,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginBottom: 15,
  },
  // --- END NEW STYLES ---
  card: {
    width: 250,
    marginRight: wp(3),
    backgroundColor: '#FFF',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardImageContainer: {
    position: 'relative',
    height: 180,
    backgroundColor: '#BBDEFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003087',
    marginBottom: 4,
  },
  cardDistance: {
    fontSize: 13,
    color: '#666',
  },
  recommendationsContainer: {
    paddingHorizontal: wp(5),
  },
  blankImage: {
    backgroundColor: '#BBDEFB',
    flex: 1,
  },
  fullRecommendationsContainer: {
    paddingHorizontal: wp(5),
  },
  fullCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    marginBottom: hp(2),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullCardImageContainer: {
    width: wp(35),
    height: hp(12),
  },
  cardImagePlaceholder: {
    flex: 1,
    backgroundColor: '#BBDEFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullCardContent: {
    padding: wp(3),
    flex: 1,
    justifyContent: 'center',
  },
  fullCardTitle: {
    fontSize: hp(2.0),
    fontWeight: '600',
    color: '#003087',
    marginBottom: hp(0.6),
  },
  fullCardDistance: {
    fontSize: hp(1.6),
    color: '#666',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1.5),
  },
  calculatorCard: {
    marginHorizontal: wp(5),
    backgroundColor: 'white',
    borderRadius: 20,
    padding: wp(5),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    position: 'relative',
  },
  calculatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIconsColumn: {
    alignItems: 'center',
    marginRight: wp(2),
  },
  verticalLine: {
    width: 0,
    height: hp(3.5),
    borderLeftWidth: 2,
    borderColor: '#CCC',
    borderStyle: 'dotted',
    marginVertical: 4,
  },
  inputsColumn: {
    flex: 1,
    gap: hp(1.5),
  },
  inputWrapperTop: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#DDD', 
    borderRadius: 12,
    paddingHorizontal: wp(3),
    height: hp(6),
  },
  inputWrapperBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    paddingHorizontal: wp(3),
    height: hp(6),
  },
  locationInput: {
    flex: 1,
    fontSize: hp(1.7),
    color: '#333',
  },
  inputSearchIcon: {
    marginLeft: 8,
  },
  swapButton: {
    marginLeft: wp(3),
    padding: 8,
  },
  distanceRow: {
    flexDirection: 'row',
    marginTop: hp(2.5),
    gap: wp(3),
  },
  calculateBtn: {
    backgroundColor: '#D32F2F',
    borderRadius: 15,
    paddingHorizontal: wp(6),
    height: hp(5.5),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'absolute',
    bottom: -35,
    right: 0,
    left: 170,
  },
  calculateBtnText: {
    color: 'white',
    fontSize: hp(1.7),
    fontWeight: '600',
  },
  fareResultCard: {
    marginTop: hp(2),
    backgroundColor: '#F8FAFF',
    padding: hp(2),
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  fareResultText: {
    fontSize: hp(2),
    fontWeight: '700',
    color: '#003087',
  },
});