import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  Dimensions, 
  Linking, 
  Share, 
  Alert 
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// RESPONSIVE DIMENSIONS
const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");
const hp = (p) => (p * deviceHeight) / 100;
const wp = (p) => (p * deviceWidth) / 100;

// THEME COLORS
const GRAB_GREEN = '#00B14F';
const LIGHT_GREEN_BG = '#E8F5E9';
const HEART_RED = '#EF4444';

// --- DATA ---
const BASE_DATA = [
  { id: '1', name: 'Indang Farm Heritage', category: 'Agriculture', sub: 'Organic Vegetables & Tours', rating: '4.9', distance: '0.8 km', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400', verified: true, location: 'Brgy. Mataas na Lupa', tag: 'Popular', type: 'Farms', price: '500', sqft: '5,000', agent: 'Farmer Jun', phone: '09123456789' },
  { id: '2', name: 'Silan Dragon Fruit Farm', category: 'Agriculture', sub: 'Pick-and-Pay Fruit Orchard', rating: '4.8', distance: '3.1 km', image: 'https://images.unsplash.com/photo-1527333323140-79886a8969bb?w=400', verified: true, location: 'Brgy. Tambo Munti', tag: 'Must Try', type: 'Produce', price: '300', sqft: '10,000', agent: 'Ms. Silan', phone: '09987654321' },
  { id: '3', name: 'EMV Flower Farm', category: 'Agriculture', sub: 'Ornamental Flowers & Events', rating: '4.7', distance: '2.4 km', image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400', verified: true, location: 'Sitio Colong', tag: 'Trending', type: 'Farms', price: '450', sqft: '7,500', agent: 'Admin Rose', phone: '09112223333' },
];

// Expanded Data for Scrolling
const AGRI_DATA = [
  ...BASE_DATA,
  { ...BASE_DATA[0], id: '4', name: 'Cavite Green House', location: 'Brgy. Buna Lejos' },
  { ...BASE_DATA[1], id: '5', name: 'Harvest Moon Fields', location: 'Brgy. Kayquit' },
  { ...BASE_DATA[2], id: '6', name: 'Sunny Side Orchards', location: 'Brgy. Alulod' },
  { ...BASE_DATA[0], id: '7', name: 'Indang Eco Park', location: 'Poblacion' },
  { ...BASE_DATA[1], id: '8', name: 'Buna Lejos Agri', location: 'Brgy. Buna' },
];

const FILTERS = ['All', 'Farms', 'Produce', 'Services', 'Suppliers'];

const GALLERY_IMGS = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400',
  'https://images.unsplash.com/photo-1625246333195-58197bd4773d?w=400',
  'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400',
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
  'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400',
  'https://images.unsplash.com/photo-1527333323140-79886a8969bb?w=400',
];

const REVIEWS_DATA = [
  { id: 1, user: 'Maria Santos', rating: 5, comment: 'Sobrang ganda ng place! Fresh air and fresh veggies.', date: '2 days ago' },
  { id: 2, user: 'John Doe', rating: 4, comment: 'Nice experience but the road going there is a bit narrow.', date: '1 week ago' },
  { id: 3, user: 'Anna Cruz', rating: 5, comment: 'Very accomodating staff and the dragon fruit shake is a must try!', date: '3 weeks ago' },
];

export default function AgriScreen() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('About'); // Controls Tab Switching

  // --- ACTIONS ---
  const handleCall = (phoneNumber) => {
    if (!phoneNumber) return;
    Linking.openURL(`tel:${phoneNumber}`).catch(() => Alert.alert("Error", "Unable to open dialer"));
  };

  const handleSMS = (phoneNumber, name) => {
    if (!phoneNumber) return;
    const message = `Hello, I am interested in inquiring about ${name}.`;
    Linking.openURL(`sms:${phoneNumber}?body=${message}`).catch(() => Alert.alert("Error", "Unable to open SMS"));
  };

  const handleShare = async (item) => {
    if (!item) return;
    try {
      await Share.share({ message: `Check out ${item.name} in Indang, Cavite!`, url: item.image });
    } catch (error) { console.log(error.message); }
  };

  // UPDATED: Alert Message
  const handleInquiry = () => {
    Alert.alert("Coming Soon", "This feature is not available coming soon...");
  };

  // --- TAB CONTENT RENDERERS ---

  // 1. ABOUT TAB
  const renderAboutTab = () => (
    <View style={{ marginTop: hp(2) }}>
      <View style={styles.amenitiesRow}>
        <View style={styles.amenity}>
          <Ionicons name="flower-outline" size={20} color={GRAB_GREEN} />
          <Text style={styles.amenityText}>{selectedItem?.type || 'N/A'}</Text>
        </View>
        <View style={styles.amenity}>
          <MaterialCommunityIcons name="map-marker-distance" size={20} color={GRAB_GREEN} />
          <Text style={styles.amenityText}>{selectedItem?.distance || 'N/A'}</Text>
        </View>
        <View style={styles.amenity}>
          <MaterialCommunityIcons name="arrow-expand-all" size={20} color={GRAB_GREEN} />
          <Text style={styles.amenityText}>{selectedItem?.sqft ? `${selectedItem.sqft} sqft` : 'N/A'}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>
        {selectedItem?.sub}. This facility is a primary part of Indang's agricultural heritage. Lush greenery, fresh produce, and a relaxing environment awaits you.
        <Text style={styles.readMore}> Read more</Text>
      </Text>

      <Text style={styles.sectionTitle}>Farm Coordinator</Text>
      <View style={styles.agentRow}>
        <Image source={{ uri: 'https://i.pravatar.cc/150?u=agri' }} style={styles.agentAvatar} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          {/* Safety check ?. to prevent crash */}
          <Text style={styles.agentName}>{selectedItem?.agent || 'Unknown Agent'}</Text>
          <Text style={styles.agentTitle}>Agricultural Lead</Text>
        </View>
        <View style={styles.agentActions}>
          <TouchableOpacity style={styles.agentActionBtn} onPress={() => handleSMS(selectedItem?.phone, selectedItem?.name)}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={GRAB_GREEN} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.agentActionBtn} onPress={() => handleCall(selectedItem?.phone)}>
            <Ionicons name="call-outline" size={20} color={GRAB_GREEN} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // 2. GALLERY TAB
  const renderGalleryTab = () => (
    <View style={styles.galleryGrid}>
      {GALLERY_IMGS.map((img, index) => (
        <Image key={index} source={{ uri: img }} style={styles.galleryImg} />
      ))}
    </View>
  );

  // 3. REVIEW TAB
  const renderReviewTab = () => (
    <View style={{ marginTop: hp(2) }}>
      {REVIEWS_DATA.map((review) => (
        <View key={review.id} style={styles.reviewItem}>
          <View style={styles.reviewHeader}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
               <View style={styles.reviewAvatar}><Text style={{color: GRAB_GREEN, fontWeight: 'bold'}}>{review.user[0]}</Text></View>
               <Text style={styles.reviewUser}>{review.user}</Text>
            </View>
            <Text style={styles.reviewDate}>{review.date}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 5, paddingLeft: 52 }}>
            {[1,2,3,4,5].map(s => (
              <Ionicons key={s} name="star" size={14} color={s <= review.rating ? "#FFB800" : "#DDD"} />
            ))}
          </View>
          <Text style={styles.reviewComment}>{review.comment}</Text>
        </View>
      ))}
    </View>
  );

  // --- MAIN RENDERERS ---

  // DETAIL VIEW
  const renderDetails = () => {
    if (!selectedItem) return null;

    return (
      <View style={styles.detailContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(18) }}>
          {/* HEADER IMAGE */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedItem?.image }} style={styles.mainImage} />
            <SafeAreaView style={styles.headerOverlay} edges={['top']}>
              <TouchableOpacity style={styles.circleBtn} onPress={() => setSelectedItem(null)}>
                <Ionicons name="arrow-back" size={20} color="#000" />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={[styles.circleBtn, { marginRight: 10 }]} onPress={() => handleShare(selectedItem)}>
                  <Ionicons name="share-social-outline" size={20} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.circleBtn}>
                  <Ionicons name="heart-outline" size={20} color={HEART_RED} />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>

          <View style={styles.contentPadding}>
            {/* TITLE & RATING */}
            <View style={styles.rowBetween}>
              <View style={styles.typeBadge}><Text style={styles.typeText}>{selectedItem?.type}</Text></View>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#FFB800" />
                <Text style={styles.ratingText}> {selectedItem?.rating} (Verified)</Text>
              </View>
            </View>

            <Text style={styles.title}>{selectedItem?.name}</Text>
            <Text style={styles.address}>{selectedItem?.location}, Indang, Cavite</Text>

            {/* TABS HEADER - FUNCTIONAL */}
            <View style={styles.tabContainer}>
              {['About', 'Gallery', 'Review'].map((tab) => (
                <TouchableOpacity 
                  key={tab} 
                  onPress={() => setActiveTab(tab)} 
                  style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
                >
                  <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* SWITCHING CONTENT BASED ON STATE */}
            {activeTab === 'About' && renderAboutTab()}
            {activeTab === 'Gallery' && renderGalleryTab()}
            {activeTab === 'Review' && renderReviewTab()}

          </View>
        </ScrollView>

        {/* BOTTOM BOOKING BAR */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerLabel}>Starting Price</Text>
            <Text style={styles.priceText}>₱{selectedItem?.price} <Text style={styles.perMonth}>/visit</Text></Text>
          </View>
          <TouchableOpacity 
            style={[styles.bookBtn, {backgroundColor: GRAB_GREEN}]}
            onPress={handleInquiry} 
          >
            <Text style={styles.bookBtnText}>Inquire Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // FILTER LOGIC
  const filteredData = useMemo(() => {
    const categoryFilter = FILTERS[activeIndex];
    return AGRI_DATA.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.sub.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || item.type === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeIndex]);

  // LIST VIEW
  const renderList = () => (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* USING SCROLLVIEW WITH stickyHeaderIndices 
         Index 0: Title View (Scrolls away)
         Index 1: Search & Filter Block (Sticks to Top)
         Index 2: The List Items (Scrolls under)
      */}
      <ScrollView 
        stickyHeaderIndices={[1]} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp(5) }}
      >
        
        {/* INDEX 0: Header Title (Scrolls Away) */}
        <View style={styles.headerBox}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={GRAB_GREEN} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agriculture</Text>
        </View>

        {/* INDEX 1: Sticky Menu (Search + Categories) */}
        <View style={styles.stickyContainer}>
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <TextInput 
                placeholder="Search Indang farms..." 
                style={styles.searchInput}
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Ionicons name="search" size={20} color={GRAB_GREEN} />
            </View>
          </View>

          <View style={styles.filterRowContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {FILTERS.map((filter, index) => (
                <TouchableOpacity 
                  key={filter} 
                  onPress={() => setActiveIndex(index)} 
                  style={[styles.filterPill, activeIndex === index && styles.activePill]}
                >
                  <Text style={[styles.filterText, activeIndex === index && styles.activeFilterText]}>{filter}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* INDEX 2: List Items */}
        <View style={styles.listContent}>
          {filteredData.map((item) => (
            <TouchableOpacity key={item.id} style={styles.itemContainer} activeOpacity={0.8} onPress={() => setSelectedItem(item)}>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: item.image }} style={styles.bizImage} />
                {item.verified && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark-circle" size={18} color={GRAB_GREEN} />
                  </View>
                )}
              </View>

              <View style={styles.infoWrapper}>
                <View style={styles.nameRow}>
                  <Text style={styles.bizName} numberOfLines={1}>{item.name}</Text>
                  {item.tag && <View style={styles.labelBadge}><Text style={styles.labelText}>{item.tag}</Text></View>}
                </View>
                <Text style={styles.bizSub} numberOfLines={1}>{item.sub}</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location-sharp" size={14} color="#888" />
                  <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.ratingTextSmall}>{item.rating} ★  •  {item.distance}</Text>
                  <Ionicons name="heart-outline" size={20} color={HEART_RED} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );

  return selectedItem ? renderDetails() : renderList();
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  
  // HEADER
  headerBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: wp(4),
    paddingTop: hp(1), 
    paddingBottom: hp(1),
    backgroundColor: '#FFF' // Ensure bg is white so it doesn't look transparent
  },
  headerTitle: { fontSize: wp(6), fontWeight: 'bold', marginLeft: wp(2), color: GRAB_GREEN },
  backBtn: { padding: 4 },

  // STICKY CONTAINER
  stickyContainer: {
    backgroundColor: '#FFF',
    paddingBottom: hp(1),
    paddingTop: hp(1),
    elevation: 4, // Shadow for Android when sticky
    shadowColor: '#000', // Shadow for iOS when sticky
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    zIndex: 10,
  },
  searchContainer: { paddingHorizontal: wp(4), marginBottom: hp(1.5) },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', borderRadius: 25, paddingHorizontal: 15, height: 45, borderWidth: 1, borderColor: '#EEE' },
  searchInput: { flex: 1, fontSize: wp(3.8), color: '#333' },
  
  filterRowContainer: { marginBottom: 5 },
  filterScroll: { paddingHorizontal: wp(4) },
  filterPill: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFF', marginRight: 10, borderWidth: 1, borderColor: '#DDD' },
  activePill: { backgroundColor: GRAB_GREEN, borderColor: GRAB_GREEN },
  filterText: { color: '#666', fontWeight: '600', fontSize: wp(3.5) },
  activeFilterText: { color: '#FFF' },

  // LIST
  listContent: { paddingHorizontal: wp(4), marginTop: hp(1) },
  itemContainer: { flexDirection: 'row', marginBottom: hp(2.5), alignItems: 'center' },
  imageWrapper: { position: 'relative' },
  bizImage: { width: wp(32), height: wp(28), borderRadius: 16, backgroundColor: '#EEE' },
  checkBadge: { position: 'absolute', bottom: -5, right: -5, backgroundColor: '#FFF', borderRadius: 12, padding: 2 },
  infoWrapper: { flex: 1, marginLeft: wp(4), justifyContent: 'center' },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bizName: { fontSize: wp(4.1), fontWeight: 'bold', color: '#111', flex: 1, marginRight: 8 },
  labelBadge: { backgroundColor: LIGHT_GREEN_BG, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  labelText: { color: GRAB_GREEN, fontSize: wp(2.4), fontWeight: 'bold', textTransform: 'uppercase' },
  bizSub: { fontSize: wp(3.3), color: '#777', marginTop: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { fontSize: wp(3), color: '#888', marginLeft: 2 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  ratingTextSmall: { fontSize: wp(3.5), color: '#666', fontWeight: '600' },

  // DETAILS VIEW
  detailContainer: { flex: 1, backgroundColor: '#FFF' },
  imageContainer: { width: wp(100), height: hp(40) },
  mainImage: { width: '100%', height: '100%' },
  headerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: wp(5) },
  circleBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center' },
  contentPadding: { paddingHorizontal: wp(5), paddingTop: hp(2) },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typeBadge: { backgroundColor: LIGHT_GREEN_BG, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  typeText: { color: GRAB_GREEN, fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { color: '#888', fontSize: 13 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  address: { color: '#7D7F88' },
  
  // TABS
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#EEE', marginTop: hp(2) },
  tabItem: { paddingVertical: 12, marginRight: wp(8) },
  activeTabItem: { borderBottomWidth: 3, borderBottomColor: GRAB_GREEN },
  tabText: { color: '#7D7F88', fontSize: 16, fontWeight: '600' },
  activeTabText: { color: GRAB_GREEN },

  // AMENITIES
  amenitiesRow: { flexDirection: 'row', marginTop: hp(2), justifyContent: 'space-between' },
  amenity: { flexDirection: 'row', alignItems: 'center' },
  amenityText: { marginLeft: 6, fontWeight: '500' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: hp(3) },
  description: { color: '#7D7F88', lineHeight: 22 },
  readMore: { color: GRAB_GREEN, fontWeight: '600' },
  agentRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  agentAvatar: { width: 50, height: 50, borderRadius: 25 },
  agentName: { fontWeight: 'bold', fontSize: 16 },
  agentTitle: { color: '#7D7F88' },
  agentActions: { flexDirection: 'row' },
  agentActionBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: LIGHT_GREEN_BG, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },

  // GALLERY
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: hp(2) },
  galleryImg: { width: wp(43), height: wp(43), borderRadius: 15, marginBottom: 15, backgroundColor: '#EEE' },

  // REVIEWS
  reviewItem: { marginBottom: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  reviewAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: LIGHT_GREEN_BG, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  reviewUser: { fontWeight: 'bold', fontSize: 15, color: '#333' },
  reviewDate: { color: '#999', fontSize: 12 },
  reviewComment: { color: '#555', lineHeight: 20, paddingLeft: 52 },

  // FOOTER
  footer: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', 
    paddingHorizontal: wp(5), paddingBottom: hp(4), paddingTop: 15, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 10,
  },
  footerLabel: { color: '#7D7F88' },
  priceText: { fontSize: 20, fontWeight: 'bold', color: GRAB_GREEN },
  perMonth: { fontSize: 14, fontWeight: 'normal' },
  bookBtn: { paddingHorizontal: wp(10), paddingVertical: hp(2), borderRadius: 15 },
  bookBtnText: { color: '#FFF', fontWeight: 'bold' }
});