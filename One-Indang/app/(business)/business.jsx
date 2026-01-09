import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { hp, wp } from '../../helpers/common';

// Sample business data (unchanged)
const businesses = [
  {
    id: '1',
    name: 'Bigg\'s Diner',
    category: 'Restaurant',
    rating: 4.5,
    reviews: 120,
    address: 'Naga City Center',
    image: 'https://example.com/biggs-diner.jpg',
    open: true,
  },
  {
    id: '2',
    name: 'Bob Marlin Restaurant',
    category: 'Seafood',
    rating: 4.7,
    reviews: 89,
    address: 'Magsaysay Avenue',
    image: 'https://example.com/bob-marlin.jpg',
    open: false,
  },
  {
    id: '3',
    name: 'SM City Naga',
    category: 'Mall',
    rating: 4.3,
    reviews: 450,
    address: 'CBD II',
    image: 'https://example.com/sm-naga.jpg',
    open: true,
  },
];

// NEW: Timeline data matching your infographic exactly
const timelineStages = [
  {
    id: '1',
    number: '1',
    title: 'PRE-OPERATION',
    steps: [
      '1. Register with SEC, DTI or CDA',
      '2. If availing national incentives, register with PEZA, BOI or TIEZA',
    ],
    color: '#e74c3c',
  },
  {
    id: '2',
    number: '2',
    title: 'LAND DEVELOPMENT',
    steps: [
      '1. Covert/Reclassify agricultural land.',
      '2. Apply for rezoning for non-agricultural land.',
      '3. Secure requirements for subdivision/condominium development',
    ],
    color: '#3498db',
  },
  {
    id: '3',
    number: '3',
    title: 'FACILITY CONSTRUCTION',
    steps: [
      '1. Apply for Building Permit before construction or renovation',
      '2. Apply for Occupancy Permit after construction or renovation',
    ],
    color: '#2ecc71',
  },
  {
    id: '4',
    number: '4',
    title: 'OPERATION',
    steps: [
      '1. Secure Mayor’s Permit',
      '2. Register with BIR',
      '3. Register with SSS, Philhealth & Pagibig',
    ],
    color: '#9b59b6',
  },
];

const BusinessListScreen = () => {
  const navigation = useNavigation();

  const renderBusinessItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => {/* Navigate to business details */}}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.rating}>★ {item.rating}</Text>
          <Text style={styles.reviews}>({item.reviews} reviews)</Text>
        </View>
        <Text style={styles.address}>{item.address}</Text>
        <Text style={[styles.status, { color: item.open ? '#28a745' : '#dc3545' }]}>
          {item.open ? 'Open Now' : 'Closed'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // NEW: Render timeline stage
  const renderTimelineStage = ({ item }) => (
    <View style={styles.timelineItem}>
      <View style={styles.timelineDotContainer}>
        <View style={[styles.timelineDot, { backgroundColor: item.color }]}>
          <Text style={styles.timelineNumber}>{item.number}</Text>
        </View>
        {item.id !== '4' && <View style={styles.timelineLine} />}
      </View>
      <View style={styles.timelineContent}>
        <Text style={styles.stageTitle}>{item.title}</Text>
        {item.steps.map((step, index) => (
          <Text key={index} style={styles.stepText}>• {step}</Text>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Existing Business List Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Local Businesses in Naga</Text>
          <Text style={styles.subtitle}>Discover restaurants, shops, and more</Text>
        </View>

        {/* Existing Business List */}
        <FlatList
          data={businesses}
          renderItem={renderBusinessItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          scrollEnabled={false} // Since we're inside ScrollView
        />

        {/* NEW: Business Setup Guide Section */}
        <View style={styles.guideSection}>
          <Text style={styles.guideTitle}>Setting Up a Business in the Philippines</Text>
          <Text style={styles.guideSubtitle}>Step-by-step requirements and process</Text>
        </View>

        {/* NEW: Timeline */}
        <View style={styles.timelineContainer}>
          <FlatList
            data={timelineStages}
            renderItem={renderTimelineStage}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: wp(5),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: wp(4),
    color: '#666',
    marginTop: hp(0.5),
  },
  list: {
    padding: wp(4),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: wp(3),
    marginBottom: hp(2),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
  },
  image: {
    width: wp(30),
    height: hp(18),
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
    padding: wp(4),
    justifyContent: 'space-between',
  },
  name: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#333',
  },
  category: {
    fontSize: wp(3.8),
    color: '#888',
    marginTop: hp(0.5),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(0.5),
  },
  rating: {
    fontSize: wp(4),
    color: '#f39c12',
    fontWeight: 'bold',
  },
  reviews: {
    fontSize: wp(3.5),
    color: '#666',
    marginLeft: wp(2),
  },
  address: {
    fontSize: wp(3.8),
    color: '#666',
    marginTop: hp(0.5),
  },
  status: {
    fontSize: wp(4),
    fontWeight: 'bold',
    marginTop: hp(1),
  },

  // NEW STYLES FOR BUSINESS SETUP GUIDE
  guideSection: {
    padding: wp(5),
    backgroundColor: '#fff',
    marginTop: hp(3),
  },
  guideTitle: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  guideSubtitle: {
    fontSize: wp(4.2),
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: hp(1),
  },
  timelineContainer: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(3),
    backgroundColor: '#fff',
    marginTop: hp(2),
    marginBottom: hp(4),
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: hp(3),
  },
  timelineDotContainer: {
    alignItems: 'center',
    width: wp(12),
  },
  timelineDot: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  timelineNumber: {
    color: '#fff',
    fontSize: wp(5),
    fontWeight: 'bold',
  },
  timelineLine: {
    width: 3,
    height: hp(10),
    backgroundColor: '#bdc3c7',
    marginTop: hp(1),
  },
  timelineContent: {
    flex: 1,
    marginLeft: wp(4),
  },
  stageTitle: {
    fontSize: wp(4.8),
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: hp(1),
  },
  stepText: {
    fontSize: wp(4),
    color: '#34495e',
    lineHeight: hp(3),
    marginBottom: hp(0.5),
  },
});

export default BusinessListScreen;