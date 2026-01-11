import React, { useState, useMemo, useEffect } from 'react';
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
  Alert,
  BackHandler // 1. Import BackHandler
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// RESPONSIVE DIMENSIONS
const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");
const hp = (p) => (p * deviceHeight) / 100;
const wp = (p) => (p * deviceWidth) / 100;

import { COLORS } from '../../constants/theme';

// --- DATA ---
const BASE_DATA = [
  { id: '1', name: 'Indang Quick-Wash', sub: 'Laundry & Dry Cleaning', rating: '4.8', distance: '0.4 km', image: 'https://images.unsplash.com/photo-1545173168-9f18675ee2e2?w=400', tag: 'Express', verified: true, category: 'Laundry', location: 'Poblacion 2', price: '150', time: '1-Day', staff: '6 members', agent: 'Liza M.', phone: '0464151234' },
  { id: '2', name: 'Teodoro IT Solutions', sub: 'Computer & Mobile Repair', rating: '4.9', distance: '0.6 km', image: 'https://images.unsplash.com/photo-1591405351990-4726e331f121?w=400', tag: 'Best Tech', verified: true, category: 'Repairs', location: 'Near Plaza', price: '500', time: 'Same-Day', staff: '2 Experts', agent: 'Mark Teodoro', phone: '09123456789' },
  { id: '3', name: 'Bayad Center Indang', sub: 'Bills & Remittance', rating: '4.7', distance: '0.2 km', image: 'https://images.unsplash.com/photo-1601597111158-2fcee29a4a0a?w=400', tag: 'Official', verified: true, category: 'Payment', location: 'Poblacion 1', price: '15', time: 'Instant', staff: '4 Counters', agent: 'Admin', phone: '0464150000' },
  { id: '4', name: 'Auto-Fix Mechanic', sub: 'Motorcycle & Car Care', rating: '4.5', distance: '1.8 km', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400', tag: 'Pro', verified: false, category: 'Wellness', location: 'Brgy. Alulod', price: '350', time: 'Varies', staff: '3 Mechanics', agent: 'Mang Ben', phone: '09998887777' },
];

// Expanded Data for Scrolling
const SERVICE_BUSINESSES = [
  ...BASE_DATA,
  { ...BASE_DATA[0], id: '5', name: 'Labada King', location: 'Brgy. Mataas na Lupa' },
  { ...BASE_DATA[1], id: '6', name: 'Phone Doctor', location: 'Town Plaza' },
  { ...BASE_DATA[3], id: '7', name: 'Indang Car Wash', location: 'Brgy. Bancod' },
  { ...BASE_DATA[2], id: '8', name: 'Palawan Express', location: 'Poblacion 3' },
];

const FILTERS = ['All', 'Laundry', 'Repairs', 'Payment', 'Wellness'];

const GALLERY_IMGS = [
  'https://images.unsplash.com/photo-1545173168-9f18675ee2e2?w=400',
  'https://images.unsplash.com/photo-1591405351990-4726e331f121?w=400',
  'https://images.unsplash.com/photo-1601597111158-2fcee29a4a0a?w=400',
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400',
];

const REVIEWS_DATA = [
  { id: 1, user: 'Regular Customer', rating: 5, comment: 'Always on time and very clean clothes!', date: '2 days ago' },
  { id: 2, user: 'Tech Fan', rating: 4, comment: 'Fixed my laptop in 2 hours. Great service.', date: '1 week ago' },
];

export default function ServicesScreen() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('About');

  // --- FIX: HANDLE DEVICE BACK BUTTON ---
  useEffect(() => {
    const onBackPress = () => {
      if (selectedItem) {
        // If details are open, close them to go back to the list
        setSelectedItem(null);
        return true; // Prevent default behavior (exiting screen)
      }
      // If list is open, let default behavior happen (go back to previous screen)
      return false; 
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => subscription.remove();
  }, [selectedItem]);

  // --- ACTIONS ---
  const handleBook = () => {
    Alert.alert("Coming Soon", "This feature is not available coming soon...");
  };

  const handleShare = async (item) => {
    if (!item) return;
    try {
      await Share.share({ message: `Check out ${item.name} services in Indang!`, url: item.image });
    } catch (error) { console.log(error.message); }
  };

  const handleCall = (phone) => {
    if(phone) Linking.openURL(`tel:${phone}`);
  };

  // --- TAB RENDERERS ---

  // 1. ABOUT TAB
  const renderAboutTab = () => (
    <View style={{ marginTop: hp(2) }}>
      <View style={styles.amenitiesRow}>
        <View style={styles.amenity}>
          <Ionicons name="time-outline" size={22} color={COLORS.secondary} />
          <Text style={styles.amenityText}>{selectedItem?.time}</Text>
        </View>
        <View style={styles.amenity}>
          <MaterialCommunityIcons name="shield-check-outline" size={22} color={COLORS.secondary} />
          <Text style={styles.amenityText}>Verified</Text>
        </View>
        <View style={styles.amenity}>
          <MaterialCommunityIcons name="account-group-outline" size={22} color={COLORS.secondary} />
          <Text style={styles.amenityText}>{selectedItem?.staff}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Service Description</Text>
      <Text style={styles.description}>
        {selectedItem?.sub}. Providing reliable {selectedItem?.category?.toLowerCase()} services to the residents of Indang. 
        Known for professional handling and quick turnaround times.
        <Text style={styles.readMore}> Read more</Text>
      </Text>

      <Text style={styles.sectionTitle}>Service Representative</Text>
      <View style={styles.agentRow}>
        <Image source={{ uri: 'https://i.pravatar.cc/150?u=service' }} style={styles.agentAvatar} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.agentName}>{selectedItem?.agent || 'Staff'}</Text>
          <Text style={styles.agentTitle}>Primary Contact</Text>
        </View>
        <View style={styles.agentActions}>
          <TouchableOpacity style={styles.agentActionBtn} onPress={() => handleCall(selectedItem?.phone)}>
            <Ionicons name="call-outline" size={20} color={COLORS.secondary} />
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
               <View style={styles.reviewAvatar}><Text style={{color: COLORS.primary, fontWeight: 'bold'}}>{review.user[0]}</Text></View>
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

  const renderDetails = () => {
    if (!selectedItem) return null;

    return (
      <View style={styles.detailContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(15) }}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedItem?.image }} style={styles.mainImage} />
            <SafeAreaView style={styles.headerOverlay} edges={['top']}>
              <TouchableOpacity style={styles.circleBtn} onPress={() => setSelectedItem(null)}>
                <Ionicons name="arrow-back" size={20} color={COLORS.text} />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={[styles.circleBtn, { marginRight: 10 }]} onPress={() => handleShare(selectedItem)}>
                  <Ionicons name="share-social-outline" size={20} color={COLORS.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.circleBtn}>
                  <Ionicons name="heart-outline" size={20} color={COLORS.secondary} />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>

          <View style={styles.contentPadding}>
            <View style={styles.rowBetween}>
              <View style={styles.typeBadge}><Text style={styles.typeText}>{selectedItem?.category}</Text></View>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#FFB800" />
                <Text style={styles.ratingText}> {selectedItem?.rating} (Rating)</Text>
              </View>
            </View>

            <Text style={styles.title}>{selectedItem?.name}</Text>
            <Text style={styles.address}>{selectedItem?.location}</Text>

            {/* TABS */}
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

            {/* TAB CONTENT SWITCHER */}
            {activeTab === 'About' && renderAboutTab()}
            {activeTab === 'Gallery' && renderGalleryTab()}
            {activeTab === 'Review' && renderReviewTab()}
          </View>
        </ScrollView>

        {/* FOOTER */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerLabel}>Starting at</Text>
            <Text style={styles.priceText}>₱{selectedItem?.price} <Text style={styles.perMonth}>/fee</Text></Text>
          </View>
          <TouchableOpacity 
            style={[styles.bookBtn, {backgroundColor: COLORS.secondary}]}
            onPress={handleBook}
          >
            <Text style={styles.bookBtnText}>Book Service</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Filter Logic
  const filteredData = useMemo(() => {
    const category = FILTERS[activeIndex];
    return SERVICE_BUSINESSES.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.sub.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === 'All' || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeIndex]);

  const renderList = () => (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* SCROLLVIEW WITH STICKY HEADER AT INDEX 1 */}
      <ScrollView 
        stickyHeaderIndices={[1]} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp(5) }}
      >
        
        {/* Index 0: Header (Scrolls Away) */}
        <View style={styles.headerBox}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Services</Text>
        </View>

        {/* Index 1: Sticky Menu (Search + Filters) */}
        <View style={styles.stickyContainer}>
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <TextInput 
                placeholder="Search for a service..." 
                style={styles.searchInput}
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Ionicons name="search-outline" size={20} color={COLORS.text} />
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

        {/* Index 2: List Content */}
        <View style={styles.listContent}>
          {filteredData.map((item) => (
            <TouchableOpacity key={item.id} style={styles.itemContainer} activeOpacity={0.8} onPress={() => setSelectedItem(item)}>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: item.image }} style={styles.bizImage} />
                {item.verified && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="shield-checkmark" size={14} color={COLORS.secondary} />
                  </View>
                )}
              </View>

              <View style={styles.infoWrapper}>
                <View style={styles.titleRow}>
                  <Text style={styles.bizName} numberOfLines={1}>{item.name}</Text>
                  {item.tag && (
                    <View style={styles.labelBadge}><Text style={styles.labelText}>{item.tag}</Text></View>
                  )}
                </View>
                <Text style={styles.bizSub} numberOfLines={1}>{item.sub}</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location-sharp" size={14} color="#888" />
                  <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.ratingTextSmall}>{item.rating} ★  •  {item.distance}</Text>
                  <Ionicons name="heart-outline" size={22} color={COLORS.secondary} />
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
  // CONTAINER
  container: { flex: 1, backgroundColor: '#FFF' },
  
  // HEADER
  headerBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: wp(4), 
    paddingTop: hp(1), 
    paddingBottom: hp(1),
    backgroundColor: '#FFF'
  },
  headerTitle: { fontSize: wp(6), fontWeight: 'bold', marginLeft: wp(2), color: COLORS.text },
  backBtn: { padding: 4 },

  // STICKY CONTAINER
  stickyContainer: {
    backgroundColor: '#FFF',
    paddingBottom: hp(1),
    paddingTop: hp(1),
    elevation: 4, 
    shadowColor: '#000', 
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
  activePill: { backgroundColor: COLORS.secondary, borderColor: COLORS.secondary },
  filterText: { color: COLORS.textGray, fontWeight: '600', fontSize: wp(3.5) },
  activeFilterText: { color: '#FFF' },

  // LIST CONTENT
  listContent: { paddingHorizontal: wp(4), marginTop: hp(1) },
  itemContainer: { flexDirection: 'row', marginBottom: hp(2.5), alignItems: 'center' },
  imageWrapper: { position: 'relative' },
  bizImage: { width: wp(32), height: wp(28), borderRadius: 16, backgroundColor: '#EEE' },
  checkBadge: { position: 'absolute', bottom: -5, right: -5, backgroundColor: '#FFF', borderRadius: 12, padding: 4, elevation: 2 },
  infoWrapper: { flex: 1, marginLeft: wp(4), justifyContent: 'center' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bizName: { fontSize: wp(4.1), fontWeight: 'bold', color: '#111', flex: 1, marginRight: 8 },
  labelBadge: { backgroundColor: COLORS.lightRedBg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  labelText: { color: COLORS.secondary, fontSize: wp(2.4), fontWeight: 'bold', textTransform: 'uppercase' },
  bizSub: { fontSize: wp(3.3), color: COLORS.textGray, marginTop: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { fontSize: wp(3), color: COLORS.textGray, marginLeft: 2 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  ratingTextSmall: { fontSize: wp(3.5), color: COLORS.textGray, fontWeight: '600' },

  // DETAIL VIEW STYLES
  detailContainer: { flex: 1, backgroundColor: '#FFF' },
  imageContainer: { width: wp(100), height: hp(40) },
  mainImage: { width: '100%', height: '100%' },
  headerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: wp(5) },
  circleBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center' },
  contentPadding: { paddingHorizontal: wp(5), paddingTop: hp(2) },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typeBadge: { backgroundColor: COLORS.lightRedBg, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  typeText: { color: COLORS.secondary, fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { color: COLORS.textGray, fontSize: 13 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  address: { color: COLORS.textGray },
  
  // TABS
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#EEE', marginTop: hp(2) },
  tabItem: { paddingVertical: 12, marginRight: wp(8) },
  activeTabItem: { borderBottomWidth: 3, borderBottomColor: COLORS.secondary },
  tabText: { color: COLORS.textGray, fontSize: 16, fontWeight: '600' },
  activeTabText: { color: COLORS.secondary },

  // AMENITIES
  amenitiesRow: { flexDirection: 'row', marginTop: hp(2), justifyContent: 'space-between' },
  amenity: { flexDirection: 'row', alignItems: 'center' },
  amenityText: { marginLeft: 6, fontWeight: '500', color: COLORS.text },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: hp(3), color: COLORS.text },
  description: { color: COLORS.textGray, lineHeight: 22 },
  readMore: { color: COLORS.secondary, fontWeight: '600' },
  agentRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  agentAvatar: { width: 50, height: 50, borderRadius: 25 },
  agentName: { fontWeight: 'bold', fontSize: 16, color: COLORS.text },
  agentTitle: { color: COLORS.textGray },
  agentActions: { flexDirection: 'row' },
  agentActionBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: COLORS.lightRedBg, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  
  // GALLERY
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: hp(2) },
  galleryImg: { width: wp(43), height: wp(43), borderRadius: 15, marginBottom: 15, backgroundColor: '#EEE' },

  // REVIEWS
  reviewItem: { marginBottom: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  reviewAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.lightBlueBg, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
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
  footerLabel: { color: COLORS.textGray },
  priceText: { fontSize: 20, fontWeight: 'bold', color: COLORS.secondary },
  perMonth: { fontSize: 14, fontWeight: 'normal', color: COLORS.textGray },
  bookBtn: { paddingHorizontal: wp(10), paddingVertical: hp(2), borderRadius: 15 },
  bookBtnText: { color: '#FFF', fontWeight: 'bold' }
});