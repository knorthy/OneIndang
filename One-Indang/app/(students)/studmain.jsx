import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import { hp, wp } from '../../helpers/common';

const HomeScreen = () => {
  const categories = [
    { id: 1, name: 'House', icon: 'home' },
    { id: 2, name: 'Bed Space', icon: 'bed' },
    { id: 3, name: 'Apartment', icon: 'building' },
    { id: 4, name: 'Scholarship', icon: 'graduation-cap' },
  ];

  const recommendedProperties = [
    {
      id: 1,
      title: 'Woodland Apartments',
      location: 'New York, USA',
      price: '$1500',
      rating: 4.5,
      type: 'Apartment',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 2,
      title: 'Oakleaf Cottage',
      location: 'New York, USA',
      price: '$900',
      rating: 4.8,
      type: 'Home',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    }
  ];

  const nearbyProperties = [
    {
      id: 1,
      title: 'BlissView Villa',
      location: 'New York, USA',
      rating: 4.9,
      type: 'Villa',
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    }
  ];

  const [activeCategory, setActiveCategory] = useState('House');

  // --- RENDER ITEMS ---

  const renderCategory = ({ item }) => {
    const isActive = activeCategory === item.name;
    return (
      <TouchableOpacity 
        style={styles.categoryItem} 
        onPress={() => setActiveCategory(item.name)}
      >
        <View style={[styles.categoryIconContainer, isActive && styles.activeCategoryIcon]}>
          <FontAwesome5 
            name={item.icon} 
            size={hp(2.5)} 
            color={isActive ? 'white' : '#6B7280'} 
          />
        </View>
        <Text style={[styles.categoryText, isActive && styles.activeCategoryText]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRecommendedCard = ({ item }) => (
    <TouchableOpacity style={styles.cardContainer} activeOpacity={0.9}>
      {/* Image Section */}
      <View style={styles.cardImageContainer}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.cardTypeTag}>
          <Text style={styles.cardTypeText}>{item.type}</Text>
        </View>
      </View>

      {/* Details Section */}
      <View style={styles.cardContent}>
        <View style={styles.ratingRow}>
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={hp(1.8)} color="#9CA3AF" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>

        <Text style={styles.priceText}>
          {item.price}<Text style={styles.priceSubText}> /month</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderNearbyCard = ({ item }) => (
    <TouchableOpacity style={styles.nearbyContainer} activeOpacity={0.9}>
      <Image source={{ uri: item.image }} style={styles.nearbyImage} />
      <View style={styles.nearbyContent}>
         <View style={styles.tagRatingRow}>
            <View style={styles.smallTypeTag}>
                <Text style={styles.smallTypeText}>{item.type}</Text>
            </View>
         </View>
         <Text style={styles.nearbyTitle}>{item.title}</Text>
         <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={hp(1.6)} color="#9CA3AF" />
            <Text style={styles.locationText}>{item.location}</Text>
         </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Fix for Android StatusBar overlap */}
      <View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
        <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            {/* Removed location and notification elements */}
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Ionicons name="search" size={hp(2.5)} color="#9CA3AF" />
              <TextInput 
                placeholder="Search" 
                placeholderTextColor="#9CA3AF"
                style={styles.searchInput}
              />
            </View>
            <TouchableOpacity style={styles.filterBtn}>
              <Ionicons name="options-outline" size={hp(3)} color="white" />
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <View style={styles.categoriesContainer}>
            {categories.map((cat) => (
                <View key={cat.id} style={{flex: 1}}>
                    {renderCategory({item: cat})}
                </View>
            ))}
          </View>

          {/* Recommended Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommendation</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <FlatList 
            horizontal
            data={recommendedProperties}
            renderItem={renderRecommendedCard}
            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />

          {/* Nearby Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Dormitory</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.nearbyList}>
            {nearbyProperties.map((prop) => (
                <View key={prop.id}>
                    {renderNearbyCard({item: prop})}
                </View>
            ))}
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  scrollContent: {
    paddingBottom: hp(5),
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    marginTop: hp(.5),
  },
  locationLabel: {
    fontSize: hp(1.6),
    color: '#9CA3AF',
    marginBottom: hp(0.5),
  },
  locationRowMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationMainText: {
    fontSize: hp(2),
    fontWeight: '700',
    color: '#003087',
    marginLeft: wp(1),
  },
  notificationBtn: {
    position: 'relative',
    padding: wp(2),
    backgroundColor: 'white',
    borderRadius: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  notificationDot: {
    position: 'absolute',
    top: hp(1.5),
    right: wp(2.2),
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: 'white',
  },

  // Search Styles
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(5),
    marginTop: hp(3),
    gap: wp(3),
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: wp(4),
    height: hp(6.5),
    elevation: 1, // Shadow for android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: wp(2),
    fontSize: hp(1.8),
    color: '#1F2937',
  },
  filterBtn: {
    width: hp(6.5),
    height: hp(6.5),
    backgroundColor: '#D32F2F',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Categories Styles
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
    marginTop: hp(3),
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryIconContainer: {
    width: wp(16),
    height: wp(16),
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  activeCategoryIcon: {
    backgroundColor: '#2563EB',
  },
  categoryText: {
    fontSize: hp(1.6),
    color: '#6B7280',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#2563EB',
    fontWeight: '700',
  },

  // Sections Common
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    marginTop: hp(3),
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: hp(2.2),
    fontWeight: '700',
    color: '#003087',
  },
  seeAllText: {
    fontSize: hp(1.8),
    color: '#2563EB',
    fontWeight: '600',
  },

  // Recommended Card Styles
  horizontalList: {
    paddingLeft: wp(5),
    paddingRight: wp(2),
  },
  cardContainer: {
    width: wp(65),
    backgroundColor: 'white',
    borderRadius: 20,
    marginRight: wp(4),
    padding: wp(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: hp(2),
  },
  cardImageContainer: {
    position: 'relative',
    width: '100%',
    height: hp(18),
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: hp(1.5),
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardTypeTag: {
    position: 'absolute',
    bottom: hp(1.5),
    left: wp(3),
    backgroundColor: 'rgba(211, 47, 47, 0.9)', // Red transparency
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: 8,
  },
  cardTypeText: {
    color: 'white',
    fontSize: hp(1.4),
    fontWeight: '600',
  },
  heartButton: {
    position: 'absolute',
    top: hp(1.5),
    right: wp(3),
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: wp(1.5),
    borderRadius: 50,
  },
  cardContent: {
    gap: hp(0.5),
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: hp(2),
    fontWeight: '700',
    color: '#003087',
    maxWidth: '75%',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: hp(1.6),
    color: '#1F2937',
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: hp(0.5),
  },
  locationText: {
    fontSize: hp(1.6),
    color: '#6B7280',
  },
  priceText: {
    fontSize: hp(2),
    fontWeight: '700',
    color: '#D32F2F',
  },
  priceSubText: {
    fontSize: hp(1.6),
    fontWeight: '400',
    color: '#6B7280',
  },

  // Nearby List Styles
  nearbyList: {
    paddingHorizontal: wp(5),
  },
  nearbyContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: wp(3),
    marginBottom: hp(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  nearbyImage: {
    width: wp(22),
    height: wp(22),
    borderRadius: 12,
  },
  nearbyContent: {
    flex: 1,
    marginLeft: wp(3),
    justifyContent: 'space-between',
    paddingVertical: hp(0.5),
  },
  tagRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallTypeTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: 5,
  },
  smallTypeText: {
    color: '#D32F2F',
    fontSize: hp(1.3),
    fontWeight: '600',
  },
  nearbyTitle: {
    fontSize: hp(1.9),
    fontWeight: '700',
    color: '#003087',
  },
  nearbyHeart: {
    justifyContent: 'flex-start',
    paddingTop: hp(0.5),
  },

});

export default HomeScreen;