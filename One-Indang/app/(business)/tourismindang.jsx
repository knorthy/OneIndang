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

// BEIGE THEME
const TOURISM_BEIGE = '#A68966'; 
const LIGHT_BEIGE_BG = '#F5F5DC'; 
const HEART_ORANGE = '#FF8C00'; // UPDATED: Orange Heart

// --- DATA ---
const BASE_DATA = [
  { id: '1', name: 'Balite Falls', sub: 'Natural Springs & Waterfalls', rating: '4.8', distance: '2.4 km', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400', tag: 'Nature', verified: true, location: 'Brgy. Banaba Lejos', category: 'Nature', price: '100', guests: 'Unlimited', time: '8AM-5PM', agent: 'LGU Tourism', phone: '0464151234' },
  { id: '2', name: 'Indang Town Plaza', sub: 'Historical Landmark & Park', rating: '4.5', distance: '0.1 km', image: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=400', tag: 'Historic', verified: true, location: 'Poblacion', category: 'Parks', price: '0', guests: 'Public', time: '24/7', agent: 'Town Admin', phone: '0464150000' },
  { id: '3', name: 'Villa Filomena', sub: 'Resort & Events Venue', rating: '4.6', distance: '1.2 km', image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400', tag: 'Resort', verified: false, location: 'Brgy. Calumpang', category: 'Resorts', price: '350', guests: '150 Max', time: '8AM-9PM', agent: 'Front Desk', phone: '09123456789' },
  { id: '4', name: 'St. Gregory Parish', sub: '17th Century Church', rating: '4.9', distance: '0.2 km', image: 'https://images.unsplash.com/photo-1548625361-195feee1048e?w=400', tag: 'Historic', verified: true, location: 'Poblacion 1', category: 'Historic', price: '0', guests: 'Public', time: '6AM-7PM', agent: 'Parish Office', phone: '0464151111' },
];

// Expanded Data for Scrolling
const TOURISM_DATA = [
  ...BASE_DATA,
  { ...BASE_DATA[0], id: '5', name: 'Rio Villa Nuevo', location: 'Brgy. Tambo Malaki' },
  { ...BASE_DATA[2], id: '6', name: 'Alta Rios Resort', location: 'Brgy. Lumampong' },
  { ...BASE_DATA[1], id: '7', name: 'Bonifacio Shrine', location: 'Brgy. Limbon' },
  { ...BASE_DATA[0], id: '8', name: 'Hidden Garden', location: 'Brgy. Alulod' },
];

const FILTERS = ['All', 'Nature', 'Resorts', 'Historic', 'Parks'];

const GALLERY_IMGS = [
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
  'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=400',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400',
  'https://images.unsplash.com/photo-1548625361-195feee1048e?w=400',
];

const REVIEWS_DATA = [
  { id: 1, user: 'Traveler Joe', rating: 5, comment: 'Very peaceful and clean. Great for family picnics.', date: '3 days ago' },
  { id: 2, user: 'History Buff', rating: 4, comment: 'Rich history but needs more tour guides.', date: '2 weeks ago' },
];

export default function TourismScreen() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('About');

  // --- ACTIONS ---
  const handleVisit = () => {
    Alert.alert("Coming Soon", "This feature is not available coming soon...");
  };

  const handleShare = async (item) => {
    if (!item) return;
    try {
      await Share.share({ message: `Visit ${item.name} in Indang!`, url: item.image });
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
          <Ionicons name="leaf-outline" size={22} color={TOURISM_BEIGE} />
          <Text style={styles.amenityText}>Eco-Tourism</Text>
        </View>
        <View style={styles.amenity}>
          <MaterialCommunityIcons name="clock-outline" size={22} color={TOURISM_BEIGE} />
          <Text style={styles.amenityText}>{selectedItem?.time}</Text>
        </View>
        <View style={styles.amenity}>
          <MaterialCommunityIcons name="account-group-outline" size={22} color={TOURISM_BEIGE} />
          <Text style={styles.amenityText}>{selectedItem?.guests}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Attraction Info</Text>
      <Text style={styles.description}>
        {selectedItem?.sub}. Discover the beauty and history of Indang through this {selectedItem?.category?.toLowerCase()} destination. 
        A must-visit for travelers seeking relaxation and culture.
        <Text style={styles.readMore}> Read more</Text>
      </Text>

      <Text style={styles.sectionTitle}>Tourism Contact</Text>
      <View style={styles.agentRow}>
        <Image source={{ uri: 'https://i.pravatar.cc/150?u=tour' }} style={styles.agentAvatar} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.agentName}>{selectedItem?.agent || 'Admin'}</Text>
          <Text style={styles.agentTitle}>Tourism Representative</Text>
        </View>
        <View style={styles.agentActions}>
          <TouchableOpacity style={styles.agentActionBtn} onPress={() => handleCall(selectedItem?.phone)}>
            <Ionicons name="call-outline" size={20} color={TOURISM_BEIGE} />
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
               <View style={styles.reviewAvatar}><Text style={{color: TOURISM_BEIGE, fontWeight: 'bold'}}>{review.user[0]}</Text></View>
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
                <Ionicons name="arrow-back" size={20} color="#000" />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={[styles.circleBtn, { marginRight: 10 }]} onPress={() => handleShare(selectedItem)}>
                  <Ionicons name="share-social-outline" size={20} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.circleBtn}>
                  {/* UPDATED: Orange Heart */}
                  <Ionicons name="heart-outline" size={20} color={HEART_ORANGE} />
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
            <Text style={styles.footerLabel}>Entrance Fee</Text>
            <Text style={styles.priceText}>₱{selectedItem?.price} <Text style={styles.perMonth}>/person</Text></Text>
          </View>
          <TouchableOpacity 
            style={[styles.bookBtn, {backgroundColor: TOURISM_BEIGE}]}
            onPress={handleVisit}
          >
            <Text style={styles.bookBtnText}>Visit Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Filter Logic
  const filteredData = useMemo(() => {
    const category = FILTERS[activeIndex];
    return TOURISM_DATA.filter(item => {
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
            <Ionicons name="arrow-back" size={24} color={TOURISM_BEIGE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tourism</Text>
        </View>

        {/* Index 1: Sticky Menu (Search + Filters) */}
        <View style={styles.stickyContainer}>
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <TextInput 
                placeholder="Search attractions..." 
                style={styles.searchInput}
                placeholderTextColor="#A1887F"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Ionicons name="map-outline" size={20} color={TOURISM_BEIGE} />
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
                    <Ionicons name="shield-checkmark" size={14} color={TOURISM_BEIGE} />
                  </View>
                )}
              </View>

              <View style={styles.infoWrapper}>
                <View style={styles.nameRow}>
                  <Text style={styles.bizName} numberOfLines={1}>{item.name}</Text>
                  {item.tag && (
                    <View style={styles.labelBadge}><Text style={styles.labelText}>{item.tag}</Text></View>
                  )}
                </View>
                <Text style={styles.bizSub} numberOfLines={1}>{item.sub}</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location-sharp" size={14} color="#8D6E63" />
                  <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.ratingTextSmall}>{item.rating} ★  •  {item.distance}</Text>
                  {/* UPDATED: Heart color to Orange */}
                  <Ionicons name="heart-outline" size={22} color={HEART_ORANGE} />
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
  headerTitle: { fontSize: wp(6), fontWeight: 'bold', marginLeft: wp(2), color: TOURISM_BEIGE },
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
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FDFCFB', borderRadius: 25, paddingHorizontal: 15, height: 45, borderWidth: 1, borderColor: '#EFEBE9' },
  searchInput: { flex: 1, fontSize: wp(3.8), color: '#3E2723' },
  
  filterRowContainer: { marginBottom: 5 },
  filterScroll: { paddingHorizontal: wp(4) },
  filterPill: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFF', marginRight: 10, borderWidth: 1, borderColor: '#D7CCC8' },
  activePill: { backgroundColor: TOURISM_BEIGE, borderColor: TOURISM_BEIGE },
  filterText: { color: '#8D6E63', fontWeight: '600', fontSize: wp(3.5) },
  activeFilterText: { color: '#FFF' },

  // LIST CONTENT
  listContent: { paddingHorizontal: wp(4), marginTop: hp(1) },
  itemContainer: { flexDirection: 'row', marginBottom: hp(2.5), alignItems: 'center' },
  imageWrapper: { position: 'relative' },
  bizImage: { width: wp(32), height: wp(28), borderRadius: 16, backgroundColor: '#EEE' },
  checkBadge: { position: 'absolute', bottom: -5, right: -5, backgroundColor: '#FFF', borderRadius: 12, padding: 4, elevation: 2 },
  infoWrapper: { flex: 1, marginLeft: wp(4), justifyContent: 'center' },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bizName: { fontSize: wp(4.1), fontWeight: 'bold', color: '#3E2723', flex: 1, marginRight: 8 },
  labelBadge: { backgroundColor: LIGHT_BEIGE_BG, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  labelText: { color: TOURISM_BEIGE, fontSize: wp(2.4), fontWeight: 'bold', textTransform: 'uppercase' },
  bizSub: { fontSize: wp(3.3), color: '#6D4C41', marginTop: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { fontSize: wp(3), color: '#8D6E63', marginLeft: 2 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  ratingTextSmall: { fontSize: wp(3.5), color: '#5D4037', fontWeight: '600' },

  // DETAIL VIEW STYLES
  detailContainer: { flex: 1, backgroundColor: '#FFF' },
  imageContainer: { width: wp(100), height: hp(40) },
  mainImage: { width: '100%', height: '100%' },
  headerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: wp(5) },
  circleBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center' },
  contentPadding: { paddingHorizontal: wp(5), paddingTop: hp(2) },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typeBadge: { backgroundColor: LIGHT_BEIGE_BG, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  typeText: { color: TOURISM_BEIGE, fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { color: '#888', fontSize: 13 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 10, color: '#3E2723' },
  address: { color: '#7D7F88' },
  
  // TABS
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#EEE', marginTop: hp(2) },
  tabItem: { paddingVertical: 12, marginRight: wp(8) },
  activeTabItem: { borderBottomWidth: 3, borderBottomColor: TOURISM_BEIGE },
  tabText: { color: '#7D7F88', fontSize: 16, fontWeight: '600' },
  activeTabText: { color: TOURISM_BEIGE },

  // AMENITIES
  amenitiesRow: { flexDirection: 'row', marginTop: hp(2), justifyContent: 'space-between' },
  amenity: { flexDirection: 'row', alignItems: 'center' },
  amenityText: { marginLeft: 6, fontWeight: '500', color: '#3E2723' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: hp(3) },
  description: { color: '#7D7F88', lineHeight: 22 },
  readMore: { color: TOURISM_BEIGE, fontWeight: '600' },
  agentRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  agentAvatar: { width: 50, height: 50, borderRadius: 25 },
  agentName: { fontWeight: 'bold', fontSize: 16, color: '#3E2723' },
  agentTitle: { color: '#7D7F88' },
  agentActions: { flexDirection: 'row' },
  agentActionBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: LIGHT_BEIGE_BG, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  
  // GALLERY
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: hp(2) },
  galleryImg: { width: wp(43), height: wp(43), borderRadius: 15, marginBottom: 15, backgroundColor: '#EEE' },

  // REVIEWS
  reviewItem: { marginBottom: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  reviewAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: LIGHT_BEIGE_BG, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
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
  priceText: { fontSize: 20, fontWeight: 'bold', color: TOURISM_BEIGE },
  perMonth: { fontSize: 14, fontWeight: 'normal' },
  bookBtn: { paddingHorizontal: wp(10), paddingVertical: hp(2), borderRadius: 15 },
  bookBtnText: { color: '#FFF', fontWeight: 'bold' }
});