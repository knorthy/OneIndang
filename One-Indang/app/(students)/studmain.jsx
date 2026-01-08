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
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { hp, wp } from '../../helpers/common';

const HomeScreen = () => {
  const [activeCategory, setActiveCategory] = useState('House');
  const [searchText, setSearchText] = useState('');

  const categories = [
    { id: 1, name: 'House', icon: 'home' },
    { id: 2, name: 'Bed Space', icon: 'bed' },
    { id: 3, name: 'Apartment', icon: 'building' },
    { id: 4, name: 'Scholarship', icon: 'graduation-cap' },
  ];

  const allProperties = [
    {
      id: 101,
      title: 'Sunrise Family Home',
      location: 'Poblacion 1, Indang',
      price: '15,000',
      rating: 4.7,
      type: 'House',
      image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: '3 Bedroom, 2 Bath, Garage'
    },
    {
      id: 102,
      title: 'Casa Verde Bungalow',
      location: 'Bancod, Indang',
      price: '12,500',
      rating: 4.5,
      type: 'House',
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: '2 Bedroom, Garden'
    },
    {
      id: 103,
      title: 'Villa Alfonso Rental',
      location: 'Kaytapos, Indang',
      price: '18,000',
      rating: 4.8,
      type: 'House',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: 'Fully Furnished, Near highway'
    },
    {
      id: 104,
      title: 'Metrogate Indang House',
      location: 'Alulod, Indang',
      price: '20,000',
      rating: 4.9,
      type: 'House',
      image: 'https://images.unsplash.com/photo-1600596542815-22b8c36002ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1475&q=80',
      details: 'Secure Subdivision'
    },
    {
      id: 105,
      title: 'Cozy Bamboo Retreat',
      location: 'Buna Lejos, Indang',
      price: '8,000',
      rating: 4.3,
      type: 'House',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: 'Native style, spacious lot'
    },
    {
      id: 106,
      title: 'Poblacion Townhouse',
      location: 'Poblacion 3, Indang',
      price: '14,000',
      rating: 4.6,
      type: 'House',
      image: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-4.0.3&auto=format&fit=crop&w=1678&q=80',
      details: '2 Storey, 2 BR'
    },
    {
      id: 107,
      title: 'Hidden Haven Villa',
      location: 'Calumpang Lejos, Indang',
      price: '25,000',
      rating: 5.0,
      type: 'House',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80',
      details: 'Pool access, 4 BR'
    },
    {
      id: 108,
      title: 'Blue Roof Cottage',
      location: 'Mataas na Lupa, Indang',
      price: '10,000',
      rating: 4.4,
      type: 'House',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: 'Quiet neighborhood'
    },
    {
      id: 109,
      title: 'Modern Minimalist',
      location: 'Poblacion 4, Indang',
      price: '16,500',
      rating: 4.7,
      type: 'House',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      details: 'Newly renovated'
    },
    {
      id: 110,
      title: 'Farm View House',
      location: 'Tambo Kulit, Indang',
      price: '9,500',
      rating: 4.5,
      type: 'House',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: 'Scenic view, 2 BR'
    },

    // BED SPACES
    {
      id: 201,
      title: 'Lola Fely\'s Dormitory',
      location: 'Near CvSU Main, Indang',
      price: '1,500',
      rating: 4.8,
      type: 'Bed Space',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80',
      details: 'Female only, Free WiFi'
    },
    {
      id: 202,
      title: 'CvSU Student Lodge',
      location: 'Bancod, Indang',
      price: '1,800',
      rating: 4.2,
      type: 'Bed Space',
      image: 'https://images.unsplash.com/photo-1596276020587-8044fe049813?ixlib=rb-4.0.3&auto=format&fit=crop&w=1478&q=80',
      details: 'Walking distance to gate'
    },
    {
      id: 203,
      title: 'SHO Dormitory',
      location: 'Rough Road, Indang',
      price: '2,000',
      rating: 4.9,
      type: 'Bed Space',
      image: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: 'Airconditioned rooms'
    },
    {
      id: 204,
      title: 'Green House Boarding',
      location: 'Poblacion 2, Indang',
      price: '1,200',
      rating: 4.0,
      type: 'Bed Space',
      image: 'https://images.unsplash.com/photo-1526725702345-bdda2b97ef73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1467&q=80',
      details: 'Fan room, Common CR'
    },
    {
      id: 205,
      title: 'Indang Scholars Dorm',
      location: 'Kaytapos, Indang',
      price: '2,500',
      rating: 4.6,
      type: 'Bed Space',
      image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1518&q=80',
      details: 'Inclusive of Water/Elec'
    },
    {
      id: 206,
      title: 'Nanay Esther\'s Place',
      location: 'Bancod, Indang',
      price: '1,600',
      rating: 4.7,
      type: 'Bed Space',
      image: 'https://images.unsplash.com/photo-1623625434462-e5e42318ae64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      details: 'Home cooked meals avail'
    },
    {
      id: 207,
      title: 'St. Thomas Hall',
      location: 'San Gregorio, Indang',
      price: '3,000',
      rating: 4.5,
      type: 'Bed Space',
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: 'Premium solo room'
    },
    {
      id: 208,
      title: 'Happy Students Home',
      location: 'Poblacion 1, Indang',
      price: '1,500',
      rating: 4.3,
      type: 'Bed Space',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80',
      details: '4 pax per room'
    },
    {
      id: 209,
      title: 'Yellow Gate Boarding',
      location: 'Bancod, Indang',
      price: '1,300',
      rating: 4.1,
      type: 'Bed Space',
      image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=1473&q=80',
      details: 'Budget friendly'
    },
    {
      id: 210,
      title: 'Cristian Jay Dorm',
      location: 'Near 7-11 Indang',
      price: '2,200',
      rating: 4.4,
      type: 'Bed Space',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: 'Male quarters'
    },

    //  APARTMENTS 
    {
      id: 301,
      title: 'Woodland Apartments',
      location: 'Rough Road, Indang',
      price: '5,500',
      rating: 4.5,
      type: 'Apartment',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: 'Studio Type'
    },
    {
      id: 302,
      title: 'Poblacion Heights',
      location: 'Poblacion 4, Indang',
      price: '7,000',
      rating: 4.6,
      type: 'Apartment',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1380&q=80',
      details: '1 Bedroom, Balcony'
    },
    {
      id: 303,
      title: 'CvSU Gate 2 Apts',
      location: 'Bancod, Indang',
      price: '4,500',
      rating: 4.3,
      type: 'Apartment',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: 'Unfurnished studio'
    },
    {
      id: 304,
      title: 'Indang Ridge Flats',
      location: 'Alulod, Indang',
      price: '6,500',
      rating: 4.7,
      type: 'Apartment',
      image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: 'Gated compound'
    },
    {
      id: 305,
      title: 'San Gregorio Studio',
      location: 'San Gregorio, Indang',
      price: '3,800',
      rating: 4.0,
      type: 'Apartment',
      image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80',
      details: 'Affordable solo unit'
    },
    {
      id: 306,
      title: 'Mahogany Place',
      location: 'Mahogany Ave, Indang',
      price: '8,000',
      rating: 4.9,
      type: 'Apartment',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: '2 BR, WiFi included'
    },
    {
      id: 307,
      title: 'Bancod River View',
      location: 'Bancod, Indang',
      price: '5,000',
      rating: 4.4,
      type: 'Apartment',
      image: 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: 'Scenic, quiet'
    },
    {
      id: 308,
      title: 'Town Plaza Apts',
      location: 'Near Plaza, Indang',
      price: '6,000',
      rating: 4.5,
      type: 'Apartment',
      image: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: 'Accessible to market'
    },
    {
      id: 309,
      title: 'White House Units',
      location: 'Kaytapos, Indang',
      price: '4,000',
      rating: 4.2,
      type: 'Apartment',
      image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: 'Water pump available'
    },
    {
      id: 310,
      title: 'East Wood Rental',
      location: 'Buna Cerca, Indang',
      price: '5,500',
      rating: 4.3,
      type: 'Apartment',
      image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: 'Studio w/ loft'
    },

    // SCHOLARSHIPS 
    {
      id: 401,
      title: 'CvSU Academic Scholarship',
      location: 'Cavite State University',
      price: 'Full',
      rating: 5.0,
      type: 'Scholarship',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: 'For Dean\'s Listers'
    },
    {
      id: 402,
      title: 'Provincial Scholarship',
      location: 'Cavite Provincial Gov',
      price: 'Grant',
      rating: 4.9,
      type: 'Scholarship',
      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80',
      details: 'Gov. Jonvic Remulla Program'
    },
    {
      id: 403,
      title: 'DOST-SEI Scholarship',
      location: 'Indang, Cavite',
      price: 'Stipend',
      rating: 5.0,
      type: 'Scholarship',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: 'Science & Tech students'
    },
    {
      id: 404,
      title: 'CHED Tulong Dunong',
      location: 'Indang, Cavite',
      price: 'Assist',
      rating: 4.7,
      type: 'Scholarship',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: 'Financial Assistance'
    },
    {
      id: 405,
      title: 'LGU Indang Scholarship',
      location: 'Municipal Hall, Indang',
      price: 'Varies',
      rating: 4.6,
      type: 'Scholarship',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: 'Residents of Indang'
    },
    {
      id: 406,
      title: 'CvSU Sports Scholarship',
      location: 'Cavite State University',
      price: 'Full',
      rating: 4.8,
      type: 'Scholarship',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: 'Varsity Athletes'
    },
    {
      id: 407,
      title: 'Student Assistantship',
      location: 'CvSU Main Campus',
      price: 'Wage',
      rating: 4.5,
      type: 'Scholarship',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: 'Work-study program'
    },
    {
      id: 408,
      title: 'OWWA Scholarship',
      location: 'Cavite Region',
      price: 'Grant',
      rating: 4.7,
      type: 'Scholarship',
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=1349&q=80',
      details: 'For OFW dependents'
    },
    {
      id: 409,
      title: 'Cebuana Lhuillier Schol',
      location: 'Indang Branches',
      price: 'Grant',
      rating: 4.4,
      type: 'Scholarship',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: 'ALS Learners'
    },
    {
      id: 410,
      title: 'Rotary Club Grant',
      location: 'Rotary Indang',
      price: 'Books',
      rating: 4.3,
      type: 'Scholarship',
      image: 'https://images.unsplash.com/photo-1577896335477-2858506f48db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      details: 'Book allowance'
    }
  ];


  const filteredData = allProperties.filter(item => 
    item.type === activeCategory && 
    (item.title.toLowerCase().includes(searchText.toLowerCase()) || 
     item.location.toLowerCase().includes(searchText.toLowerCase()))
  );

  
  const nearbyData = filteredData.slice().reverse(); 

  

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
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        </View>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={hp(1.8)} color="#9CA3AF" />
          <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
           <Text style={styles.priceText}>
            {item.type === 'Scholarship' ? item.price : `₱${item.price}`}
            {item.type !== 'Scholarship' && <Text style={styles.priceSubText}> /mo</Text>}
           </Text>
           <View style={styles.ratingBadge}>
             <Ionicons name="star" size={hp(1.6)} color="#FFD700" />
             <Text style={styles.ratingText}>{item.rating}</Text>
           </View>
        </View>
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
            <View style={styles.ratingBadge}>
               <Ionicons name="star" size={hp(1.6)} color="#FFD700" />
               <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
         </View>
         <Text style={styles.nearbyTitle}>{item.title}</Text>
         <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={hp(1.6)} color="#9CA3AF" />
            <Text style={styles.locationText}>{item.location}</Text>
         </View>
         <Text style={styles.priceTextSmall}>
            {item.type === 'Scholarship' ? item.price : `₱${item.price}`}
         </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Fix for Android StatusBar overlap */}
      <View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, flex: 1 }}>
        <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
             <View>
                 <Text style={styles.locationLabel}>Location</Text>
                 <View style={styles.locationRowMain}>
                     <Ionicons name="location" size={hp(2.5)} color="#D32F2F" />
                     <Text style={styles.locationMainText}>Indang, Cavite</Text>
                 </View>
             </View>
             {/* Notification Icon Placeholder */}
             <View style={styles.notificationBtn}>
                <Ionicons name="notifications-outline" size={hp(3)} color="black" />
                <View style={styles.notificationDot} />
             </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Ionicons name="search" size={hp(2.5)} color="#9CA3AF" />
              <TextInput 
                placeholder="Search" 
                placeholderTextColor="#9CA3AF"
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          </View>

          {/* Categories */}
          <View style={styles.categoriesContainer}>
            {categories.map((cat) => (
                <View key={cat.id} style={{flex: 1}}>
                    {renderCategory({item: cat})}
                </View>
            ))}
          </View>

          {/* Recommended Section (Horizontal) */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended {activeCategory}s</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <FlatList 
            horizontal
            data={filteredData}
            renderItem={renderRecommendedCard}
            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />

          {/* Nearby Section (Vertical) */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby {activeCategory}s</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.nearbyList}>
            {nearbyData.map((prop) => (
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
    marginTop: hp(2),
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
    fontSize: hp(2.2),
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
    right: wp(2.8),
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1),
    backgroundColor: '#D32F2F',
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
    elevation: 1, 
    shadowColor: '#000',
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
    backgroundColor: '#003087', // Changed to your blue
  },
  categoryText: {
    fontSize: hp(1.6),
    color: '#6B7280',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#003087',
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
    color: '#D32F2F', // Changed to your red
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
    backgroundColor: 'rgba(0, 48, 135, 0.9)', // Blue transparency
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: 8,
  },
  cardTypeText: {
    color: 'white',
    fontSize: hp(1.4),
    fontWeight: '600',
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
    maxWidth: '100%',
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
    color: '#003087',
    fontSize: hp(1.3),
    fontWeight: '600',
  },
  nearbyTitle: {
    fontSize: hp(1.9),
    fontWeight: '700',
    color: '#003087',
  },
  priceTextSmall: {
    fontSize: hp(1.9),
    fontWeight: '700',
    color: '#D32F2F',
    marginTop: hp(0.5),
  },
});

export default HomeScreen;