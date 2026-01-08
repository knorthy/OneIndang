import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import { hp, wp } from '../../helpers/common';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const TransportIcon = ({ name, icon, onPress, isSelected }) => (
  <TouchableOpacity onPress={onPress} style={styles.transportItem}>
    <View style={[styles.transportIconContainer, isSelected && styles.selectedTransportIcon]}>
      <Icon name={icon} size={32} color={isSelected ? "#FFF" : "#D32F2F"} />
    </View>
    <Text style={styles.transportName}>{name}</Text>
  </TouchableOpacity>
);

export default function App() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('North');
  const [timeGreeting, setTimeGreeting] = useState('');
  const [showAllRecommendations, setShowAllRecommendations] = useState(false);
  const [startingPoint, setStartingPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState('');
  const [fare, setFare] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const recommendations = [
    { id: 1, title: 'Grand Canyon National Park', distance: '277 miles away' },
    { id: 2, title: 'Yosemite National Park', distance: '150 miles away' },
    { id: 3, title: 'Zion National Park', distance: '200 miles away' },
    { id: 4, title: 'Banff National Park', distance: '320 miles away' },
    { id: 5, title: 'Yellowstone National Park', distance: '420 miles away' },
  ];

  useEffect(() => {
    const now = new Date();
    const phTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Manila"}));
    const hour = phTime.getHours();
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

  const calculateFare = () => {
    let rate = 12; // default
    if (selectedTransport === 'Tricycle') rate = 10;
    else if (selectedTransport === 'Bus') rate = 12;
    else if (selectedTransport === 'Jeep') rate = 8;
    else if (selectedTransport === 'Personal Car') rate = 15;
    if (distance) {
      const calculated = parseFloat(distance) * rate;
      setFare(calculated.toFixed(2));
    }
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
              placeholderTextColor="#BBDEFB"
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Popular Transport Modes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transportation</Text>
          </View>
          <View style={styles.transportContainer}>
            <View style={styles.transportGrid}>
              <TransportIcon name="Tricycle" icon="pedal-bike" onPress={() => setSelectedTransport('Tricycle')} isSelected={selectedTransport === 'Tricycle'} />
              <TransportIcon name="Bus" icon="directions-bus" onPress={() => setSelectedTransport('Bus')} isSelected={selectedTransport === 'Bus'} />
              <TransportIcon name="Jeep" icon="directions-car" onPress={() => setSelectedTransport('Jeep')} isSelected={selectedTransport === 'Jeep'} />
              <TransportIcon name="Personal Car" icon="drive-eta" onPress={() => setSelectedTransport('Personal Car')} isSelected={selectedTransport === 'Personal Car'} />
            </View>
          </View>
        </View>

        {/* Fare Calculator */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fare Calculator</Text>
          </View>
          <View style={styles.calculatorCard}>
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
                    placeholder="Choose starting point, enter destination"
                    placeholderTextColor="#666"
                    value={startingPoint}
                    onChangeText={setStartingPoint}
                  />
                  <Icon name="search" size={20} color="#666" style={styles.inputSearchIcon} />
                </View>

                <View style={styles.inputWrapperBottom}>
                  <TextInput
                    style={styles.locationInput}
                    placeholder="Enter destination"
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

            <View style={styles.distanceRow}>
              <TouchableOpacity style={styles.calculateBtn} onPress={calculateFare}>
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
                <TouchableOpacity key={item.id} style={styles.fullCard} activeOpacity={0.9} onPress={() => console.log('Selected', item)}>
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
  favoriteButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 40,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
    color: '#BBDEFB',
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
    color: '#BBDEFB',
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
  distanceInputSmall: {
    flex: 1,
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    paddingHorizontal: wp(4),
    height: hp(6),
    fontSize: hp(1.7),
    color: '#003087',
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