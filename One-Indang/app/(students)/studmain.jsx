import React, { useState, useRef } from 'react';
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
  StatusBar,
  ImageBackground,
  Modal,
  Dimensions
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

// Importing your helpers
import { hp, wp } from '../../helpers/common';

// Importing student data constants
import { STUDENT_CATEGORIES, STUDENT_PROPERTIES, GALLERY_IMAGES, MOCK_REVIEWS } from '../../constants/studentData';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const HomeScreen = () => {

  // --- STATE ---
  const [activeCategory, setActiveCategory] = useState('House');
  const [searchText, setSearchText] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);

  // --- BRAND COLORS ---
  const BRAND_BLUE = '#003087';
  const BRAND_RED = '#D32F2F';

  // --- DATA ---
  const categories = STUDENT_CATEGORIES;

  const allProperties = STUDENT_PROPERTIES;

  const filteredData = allProperties.filter(item => 
    item.type === activeCategory && 
    (item.title.toLowerCase().includes(searchText.toLowerCase()) || 
     item.location.toLowerCase().includes(searchText.toLowerCase()))
  );

  const nearbyData = filteredData.slice().reverse(); 

  // COMPONENT: PROPERTY DETAILS PAGE
  const PropertyDetailsScreen = ({ item, onBack }) => {
    
    // CONDITION: If Scholarship, remove gallery and review tabs
    const tabs = item.type === 'Scholarship' 
        ? ['About'] 
        : ['About', 'Gallery', 'Review'];

    const [activeTab, setActiveTab] = useState('About');
    
    // IMAGE VIEWER STATES
    const [isViewerVisible, setIsViewerVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    //  MOCK DATA FOR TABS 
    const galleryImages = [item.image, ...GALLERY_IMAGES];

    const reviews = MOCK_REVIEWS;

    // Helper to open viewer
    const openImageViewer = (index) => {
        setSelectedImageIndex(index);
        setIsViewerVisible(true);
    };

    // LOGIC TO SWITCH CONTENT 
    const renderContent = () => {
        if (activeTab === 'About') {
            return (
                <View>
                    {/* Facilities Icons (Only for Non-Scholarships) */}
                    {item.type !== 'Scholarship' && (
                    <View style={styles.facilitiesContainer}>
                        <View style={styles.facilityItem}>
                            <Ionicons name="bed-outline" size={hp(3)} color="#6B7280" />
                            <Text style={styles.facilityText}>{item.beds || 1} Beds</Text>
                        </View>
                        <View style={styles.facilityItem}>
                            <FontAwesome5 name="bath" size={hp(2.5)} color="#6B7280" />
                            <Text style={styles.facilityText}>{item.baths || 1} Bath</Text>
                        </View>
                        <View style={styles.facilityItem}>
                            <MaterialIcons name="aspect-ratio" size={hp(3)} color="#6B7280" />
                            <Text style={styles.facilityText}>{item.sqft || 'N/A'} sqft</Text>
                        </View>
                    </View>
                    )}

                    {/* Description */}
                    <Text style={styles.descriptionTitle}>Description</Text>
                    <Text style={styles.descriptionText}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        <Text style={{ color: BRAND_BLUE, fontWeight: '700' }}> Read more</Text>
                    </Text>

                    {/* DYNAMIC PROVIDER / AGENT SECTION */}
                    {item.type === 'Scholarship' ? (
                        // SCHOLARSHIP PROVIDER LAYOUT
                        <>
                             <Text style={styles.descriptionTitle}>Scholarship Provider</Text>
                             <View style={styles.agentContainer}>
                                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: wp(3) }}>
                                     {/* Generic University/Institution Icon */}
                                     <View style={[styles.agentImage, { backgroundColor: '#F3F4F6', justifyContent:'center', alignItems:'center' }]}>
                                         <FontAwesome5 name="university" size={hp(2.5)} color={BRAND_BLUE} />
                                     </View>
                                     <View>
                                     <Text style={{ fontWeight: '700', fontSize: hp(2), color: 'black' }}>Student Affairs</Text>
                                     <Text style={{ color: '#6B7280', fontSize: hp(1.6) }}>Gov / Agency</Text>
                                     </View>
                                 </View>
                                 <View style={{ flexDirection: 'row', gap: wp(4) }}>
                                     <TouchableOpacity style={styles.agentBtn}>
                                        <Ionicons name="mail-outline" size={hp(2.5)} color="white" />
                                     </TouchableOpacity>
                                     <TouchableOpacity style={styles.agentBtn}>
                                        <Ionicons name="globe-outline" size={hp(2.5)} color="white" />
                                     </TouchableOpacity>
                                 </View>
                             </View>
                        </>
                    ) : (
                        // REAL ESTATE AGENT LAYOUT
                        <>
                            <Text style={styles.descriptionTitle}>Listing Agent</Text>
                            <View style={styles.agentContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: wp(3) }}>
                                    <Image 
                                    source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' }} 
                                    style={styles.agentImage}
                                    />
                                    <View>
                                    <Text style={{ fontWeight: '700', fontSize: hp(2), color: 'black' }}>John Doe</Text>
                                    <Text style={{ color: '#6B7280', fontSize: hp(1.6) }}>Owner</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', gap: wp(4) }}>
                                    <TouchableOpacity style={styles.agentBtn}>
                                    <Ionicons name="chatbubble-ellipses-outline" size={hp(2.5)} color="white" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.agentBtn}>
                                    <Ionicons name="call-outline" size={hp(2.5)} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    )}
                </View>
            );
        } else if (activeTab === 'Gallery') {
            return (
                <View style={styles.galleryContainer}>
                    {galleryImages.map((img, index) => (
                        <TouchableOpacity 
                            key={index} 
                            onPress={() => openImageViewer(index)}
                            activeOpacity={0.8}
                        >
                            <Image source={{ uri: img }} style={styles.galleryImage} />
                        </TouchableOpacity>
                    ))}
                </View>
            );
        } else if (activeTab === 'Review') {
            return (
                <View style={styles.reviewsContainer}>
                    {reviews.map((rev) => (
                        <View key={rev.id} style={styles.reviewItem}>
                            <View style={styles.reviewHeader}>
                                <View style={{flexDirection: 'row', alignItems: 'center', gap: wp(3)}}>
                                   <View style={styles.reviewAvatar}>
                                      <Text style={{color: 'white', fontWeight: 'bold'}}>{rev.name.charAt(0)}</Text>
                                   </View>
                                   <View>
                                      <Text style={styles.reviewName}>{rev.name}</Text>
                                      <View style={{flexDirection: 'row', gap: 2}}>
                                        {[...Array(5)].map((_, i) => (
                                            <Ionicons key={i} name="star" size={hp(1.4)} color={i < rev.rating ? "#FFD700" : "#E5E7EB"} />
                                        ))}
                                      </View>
                                   </View>
                                </View>
                                <Text style={styles.reviewDate}>{rev.date}</Text>
                            </View>
                            <Text style={styles.reviewText}>{rev.comment}</Text>
                        </View>
                    ))}
                </View>
            );
        }
    };

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        
        {/* IMAGE MODAL */}
        <Modal 
            visible={isViewerVisible} 
            transparent={true} 
            animationType="fade"
            onRequestClose={() => setIsViewerVisible(false)}
        >
            <View style={styles.modalContainer}>
                <TouchableOpacity 
                    style={styles.closeButton} 
                    onPress={() => setIsViewerVisible(false)}
                >
                    <Ionicons name="close" size={hp(4)} color="white" />
                </TouchableOpacity>

                <FlatList 
                    data={galleryImages}
                    horizontal
                    pagingEnabled
                    initialScrollIndex={selectedImageIndex}
                    getItemLayout={(data, index) => (
                        {length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index}
                    )}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.fullScreenImageContainer}>
                            <Image 
                                source={{ uri: item }} 
                                style={styles.fullScreenImage} 
                                resizeMode="contain" 
                            />
                        </View>
                    )}
                />
            </View>
        </Modal>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(12) }}>
          
          {/* Main Image Header */}
          <ImageBackground source={{ uri: item.image }} style={styles.detailsImage} resizeMode="cover">
            <View style={styles.detailsHeaderIcons}>
              <TouchableOpacity style={styles.iconCircle} onPress={onBack}>
                <Ionicons name="arrow-back" size={hp(3)} color="black" />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: wp(3) }}>
                <TouchableOpacity style={styles.iconCircle}>
                  <Ionicons name="share-social-outline" size={hp(3)} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>

          {/* Body Content */}
          <View style={styles.detailsBody}>
              
              {/* Tag & Rating */}
              <View style={styles.flexRowBetween}>
                 <View style={[styles.blueTag, { backgroundColor: '#EFF6FF' }]}>
                    <Text style={{ color: BRAND_BLUE, fontWeight: '600', fontSize: hp(1.6) }}>
                      {item.type}
                    </Text>
                 </View>
                 {item.type !== 'Scholarship' && (
                   <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                      <Ionicons name="star" size={hp(2)} color="#FFD700" />
                      <Text style={{ fontWeight: 'bold', fontSize: hp(1.8) }}>{item.rating}</Text>
                      <Text style={{ color: '#6B7280', fontSize: hp(1.6) }}>(365 reviews)</Text>
                   </View>
                 )}
              </View>

              {/* Title & Address */}
              <Text style={[styles.detailsTitle, { color: 'black' }]}>{item.title}</Text>
              <Text style={[styles.detailsLocation, { color: '#6B7280' }]}>{item.location}</Text>

              {/* Tabs */}
              <View style={styles.tabContainer}>
                 {tabs.map(tab => (
                    <TouchableOpacity 
                      key={tab} 
                      style={[styles.tabItem, activeTab === tab && { borderBottomColor: BRAND_BLUE, borderBottomWidth: 3 }]}
                      onPress={() => setActiveTab(tab)}
                    >
                      <Text style={[styles.tabText, activeTab === tab ? { color: BRAND_BLUE, fontWeight: '700' } : { color: '#9CA3AF' }]}>
                          {tab}
                      </Text>
                    </TouchableOpacity>
                 ))}
              </View>

              {/* Dynamic Content */}
              {renderContent()}

          </View>
        </ScrollView>

        {/* Bottom Footer - Button Changes based on Type */}
        <View style={styles.footerBar}>
           <View>
              <Text style={{ color: '#9CA3AF', fontSize: hp(1.6), fontWeight: '500' }}>Total Price</Text>
              <Text style={{ color: BRAND_BLUE, fontSize: hp(2.5), fontWeight: '700' }}>
                 {item.type === 'Scholarship' ? item.price : `₱${item.price}`}
                 {item.type !== 'Scholarship' && <Text style={{ fontSize: hp(1.6), fontWeight: '400' }}> /month</Text>}
              </Text>
           </View>
           <TouchableOpacity style={[styles.bookBtn, { backgroundColor: BRAND_BLUE }]}>
              {/* Conditional Button Text */}
              <Text style={styles.bookBtnText}>
                  {item.type === 'Scholarship' ? 'Apply' : 'Chat'}
              </Text>
           </TouchableOpacity>
        </View>
      </View>
    );
  };

  // MAIN RENDER (Conditional)  
  if (selectedProperty) {
    return (
      <SafeAreaView style={styles.container}>
         <View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, flex: 1 }}>
            <PropertyDetailsScreen item={selectedProperty} onBack={() => setSelectedProperty(null)} />
         </View>
      </SafeAreaView>
    );
  }


  const renderRecommendedCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.cardContainer} 
      activeOpacity={0.9} 
      onPress={() => setSelectedProperty(item)} 
    >
      <View style={styles.cardImageContainer}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={[styles.cardTypeTag, { backgroundColor: 'rgba(0, 48, 135, 0.9)' }]}>
          <Text style={styles.cardTypeText}>{item.type}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: BRAND_BLUE }]} numberOfLines={1}>{item.title}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={hp(1.8)} color="#9CA3AF" />
          <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>
        </View>
        <View style={styles.priceRow}>
           <Text style={[styles.priceText, { color: BRAND_RED }]}>
            {item.type === 'Scholarship' ? item.price : `₱${item.price}`}
            {item.type !== 'Scholarship' && <Text style={styles.priceSubText}> /mo</Text>}
           </Text>
           {item.type !== 'Scholarship' && (
             <View style={styles.ratingBadge}>
               <Ionicons name="star" size={hp(1.6)} color="#FFD700" />
               <Text style={styles.ratingText}>{item.rating}</Text>
             </View>
           )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderNearbyCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.nearbyContainer} 
      activeOpacity={0.9}
      onPress={() => setSelectedProperty(item)} 
    >
      <Image source={{ uri: item.image }} style={styles.nearbyImage} />
      <View style={styles.nearbyContent}>
         <View style={styles.tagRatingRow}>
            <View style={styles.smallTypeTag}>
                <Text style={[styles.smallTypeText, { color: BRAND_BLUE }]}>{item.type}</Text>
            </View>
            {item.type !== 'Scholarship' && (
              <View style={styles.ratingBadge}>
                 <Ionicons name="star" size={hp(1.6)} color="#FFD700" />
                 <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            )}
         </View>
         <Text style={[styles.nearbyTitle, { color: BRAND_BLUE }]}>{item.title}</Text>
         <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={hp(1.6)} color="#9CA3AF" />
            <Text style={styles.locationText}>{item.location}</Text>
         </View>
         <Text style={[styles.priceTextSmall, { color: BRAND_RED }]}>
            {item.type === 'Scholarship' ? item.price : `₱${item.price}`}
         </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => {
    const isActive = activeCategory === item.name;
    return (
      <TouchableOpacity 
        style={styles.categoryItem} 
        onPress={() => setActiveCategory(item.name)}
      >
        <View style={[styles.categoryIconContainer, isActive && { backgroundColor: BRAND_BLUE }]}>
          <FontAwesome5 name={item.icon} size={hp(2.5)} color={isActive ? 'white' : '#6B7280'} />
        </View>
        <Text style={[styles.categoryText, isActive && { color: BRAND_BLUE, fontWeight: '700' }]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Header */}
          <View style={styles.header}>
              <View>
                  <Text style={styles.locationLabel}>Location</Text>
                  <View style={styles.locationRowMain}>
                      <Ionicons name="location" size={hp(2.5)} color={BRAND_RED} />
                      <Text style={[styles.locationMainText, { color: BRAND_BLUE }]}>Indang, Cavite</Text>
                  </View>
              </View>
              <View style={styles.notificationBtn}>
                 <Ionicons name="notifications-outline" size={hp(3)} color="black" />
                 <View style={[styles.notificationDot, { backgroundColor: BRAND_RED }]} />
              </View>
          </View>

          {/* Search */}
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
                <View key={cat.id} style={{flex: 1}}>{renderCategory({item: cat})}</View>
            ))}
          </View>

          {/* Recommended */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: BRAND_BLUE }]}>Recommended {activeCategory}s</Text>
            <TouchableOpacity><Text style={[styles.seeAllText, { color: BRAND_RED }]}>See all</Text></TouchableOpacity>
          </View>
          <FlatList 
            horizontal
            data={filteredData}
            renderItem={renderRecommendedCard}
            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />

          {/* Nearby */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: BRAND_BLUE }]}>Nearby {activeCategory}s</Text>
            <TouchableOpacity><Text style={[styles.seeAllText, { color: BRAND_RED }]}>See all</Text></TouchableOpacity>
          </View>
          <View style={styles.nearbyList}>
            {nearbyData.map((prop) => (<View key={prop.id}>{renderNearbyCard({item: prop})}</View>))}
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFF' },
  scrollContent: { paddingBottom: hp(5) },

  // Header & Home Styles
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(5), marginTop: hp(2) },
  locationLabel: { fontSize: hp(1.6), color: '#9CA3AF', marginBottom: hp(0.5) },
  locationRowMain: { flexDirection: 'row', alignItems: 'center' },
  locationMainText: { fontSize: hp(2.2), fontWeight: '700', marginLeft: wp(1) },
  notificationBtn: { position: 'relative', padding: wp(2), backgroundColor: 'white', borderRadius: 50, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  notificationDot: { position: 'absolute', top: hp(1.5), right: wp(2.8), width: wp(2), height: wp(2), borderRadius: wp(1), borderWidth: 1, borderColor: 'white' },

  searchContainer: { flexDirection: 'row', paddingHorizontal: wp(5), marginTop: hp(3), gap: wp(3) },
  searchInputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 15, paddingHorizontal: wp(4), height: hp(6.5), elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  searchInput: { flex: 1, marginLeft: wp(2), fontSize: hp(1.8), color: '#1F2937' },

  categoriesContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: wp(5), marginTop: hp(3) },
  categoryItem: { alignItems: 'center' },
  categoryIconContainer: { width: wp(16), height: wp(16), backgroundColor: '#F3F4F6', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: hp(1) },
  categoryText: { fontSize: hp(1.6), color: '#6B7280', fontWeight: '500' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(5), marginTop: hp(3), marginBottom: hp(2) },
  sectionTitle: { fontSize: hp(2.2), fontWeight: '700' },
  seeAllText: { fontSize: hp(1.8), fontWeight: '600' },

  // List Cards Styles 
  horizontalList: { paddingLeft: wp(5), paddingRight: wp(2) },
  cardContainer: { width: wp(65), backgroundColor: 'white', borderRadius: 20, marginRight: wp(4), padding: wp(3), shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, marginBottom: hp(2) },
  cardImageContainer: { position: 'relative', width: '100%', height: hp(18), borderRadius: 15, overflow: 'hidden', marginBottom: hp(1.5) },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardTypeTag: { position: 'absolute', bottom: hp(1.5), left: wp(3), paddingHorizontal: wp(3), paddingVertical: hp(0.5), borderRadius: 8 },
  cardTypeText: { color: 'white', fontSize: hp(1.4), fontWeight: '600' },
  cardContent: { gap: hp(0.5) },
  cardTitle: { fontSize: hp(2), fontWeight: '700' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: hp(0.5) },
  locationText: { fontSize: hp(1.6), color: '#6B7280' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceText: { fontSize: hp(2), fontWeight: '700' },
  priceSubText: { fontSize: hp(1.6), fontWeight: '400', color: '#6B7280' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: hp(1.6), color: '#1F2937', fontWeight: '600' },

  nearbyList: { paddingHorizontal: wp(5) },
  nearbyContainer: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 15, padding: wp(3), marginBottom: hp(2), shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  nearbyImage: { width: wp(22), height: wp(22), borderRadius: 12 },
  nearbyContent: { flex: 1, marginLeft: wp(3), justifyContent: 'space-between', paddingVertical: hp(0.5) },
  tagRatingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  smallTypeTag: { backgroundColor: '#EFF6FF', paddingHorizontal: wp(2), paddingVertical: hp(0.3), borderRadius: 5 },
  smallTypeText: { fontSize: hp(1.3), fontWeight: '600' },
  nearbyTitle: { fontSize: hp(1.9), fontWeight: '700' },
  priceTextSmall: { fontSize: hp(1.9), fontWeight: '700', marginTop: hp(0.5) },

  // PROPERTY DETAILS STYLES
  detailsImage: { width: '100%', height: hp(40), justifyContent: 'space-between', paddingBottom: hp(2) },
  detailsHeaderIcons: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: wp(5), marginTop: hp(2) },
  iconCircle: { width: hp(5), height: hp(5), backgroundColor: 'white', borderRadius: 50, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  
  detailsBody: { flex: 1, backgroundColor: 'white', marginTop: -hp(2), borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: wp(5), paddingTop: hp(3) },
  flexRowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(2) },
  blueTag: { paddingHorizontal: wp(3), paddingVertical: hp(0.8), borderRadius: 8 },
  detailsTitle: { fontSize: hp(3), fontWeight: '800', marginBottom: hp(1) },
  detailsLocation: { fontSize: hp(1.8), marginBottom: hp(3) },
  
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', marginBottom: hp(3) },
  tabItem: { marginRight: wp(8), paddingBottom: hp(1) },
  tabText: { fontSize: hp(1.8) },

  // Content Styles
  facilitiesContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(4) },
  facilityItem: { flexDirection: 'row', alignItems: 'center', gap: wp(2), backgroundColor: '#F9FAFB', paddingHorizontal: wp(4), paddingVertical: hp(1.5), borderRadius: 12 },
  facilityText: { color: '#6B7280', fontSize: hp(1.6), fontWeight: '600' },

  descriptionTitle: { fontSize: hp(2.2), fontWeight: '700', color: '#1F2937', marginBottom: hp(1.5) },
  descriptionText: { fontSize: hp(1.7), color: '#6B7280', lineHeight: hp(2.8), marginBottom: hp(4) },

  agentContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(5) },
  agentImage: { width: hp(6), height: hp(6), borderRadius: 50 },
  agentBtn: { width: hp(6), height: hp(6), backgroundColor: '#003087', borderRadius: 50, justifyContent: 'center', alignItems: 'center' },

  // Gallery Styles
  galleryContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: wp(6), marginBottom: hp(4), justifyContent: 'center' },
  galleryImage: { width: wp(40), height: wp(40), borderRadius: 10, backgroundColor: '#F3F4F6', resizeMode: 'cover' },

  // IMAGE VIEWER MODAL STYLES
  modalContainer: { flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' },
  closeButton: { position: 'absolute', top: Platform.OS === 'ios' ? hp(6) : hp(3), right: wp(5), zIndex: 10, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 50 },
  fullScreenImageContainer: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT, justifyContent: 'center', alignItems: 'center' },
  fullScreenImage: { width: '100%', height: '80%' },

  // Review Styles
  reviewsContainer: { marginBottom: hp(4) },
  reviewItem: { marginBottom: hp(3), borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: hp(2) },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(1) },
  reviewAvatar: { width: hp(5), height: hp(5), borderRadius: 25, backgroundColor: '#D32F2F', justifyContent: 'center', alignItems: 'center' },
  reviewName: { fontWeight: '700', fontSize: hp(1.8), color: '#111' },
  reviewDate: { color: '#9CA3AF', fontSize: hp(1.5) },
  reviewText: { color: '#6B7280', fontSize: hp(1.6), lineHeight: hp(2.4) },

  footerBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#F3F4F6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(5), paddingVertical: hp(2), paddingBottom: Platform.OS === 'ios' ? hp(4) : hp(2) },
  bookBtn: { paddingHorizontal: wp(8), paddingVertical: hp(1.8), borderRadius: 30 },
  bookBtnText: { color: 'white', fontWeight: '700', fontSize: hp(2) }

});

export default HomeScreen;