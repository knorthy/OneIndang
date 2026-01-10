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
import styles from './styles/transport.styles';

// RESPONSIVE DIMENSIONS
const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");
const hp = (p) => (p * deviceHeight) / 100;
const wp = (p) => (p * deviceWidth) / 100;

// --- DATA ---
const BASE_DATA = [
  { id: '1', name: 'Indang Central Terminal', sub: 'Bus & Jeepney Routes • To Trece/Manila', rating: '4.5', distance: '0.2 km', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400', tag: 'Main Hub', verified: true, category: 'Terminals', location: 'Poblacion 4', price: 'Varies', capacity: 'Large', time: '4AM - 10PM', agent: 'LGU Terminal', phone: '0464150000' },
  { id: '2', name: 'Tricycle TODA - Town Plaza', sub: 'Local Neighborhood Service', rating: '4.8', distance: '0.1 km', image: 'https://images.unsplash.com/photo-1599321520108-36940a696414?w=400', tag: '24/7', verified: true, category: 'Tricycle', location: 'Indang Plaza', price: '20', capacity: '4 Pax', time: '24/7', agent: 'TODA Dispatch', phone: '09123456789' },
  { id: '3', name: 'Indang Rent-a-Car', sub: 'Self-drive & Chauffeur Services', rating: '4.7', distance: '1.5 km', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400', tag: 'Reliable', verified: true, category: 'Rentals', location: 'Brgy. San Jose', price: '1,500', capacity: '5 Seats', time: 'Daily', agent: 'Leo Rentals', phone: '09987654321' },
  { id: '4', name: 'Shuttle Express', sub: 'Point-to-Point Van Service', rating: '4.4', distance: '0.5 km', image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400', tag: 'Direct', verified: false, category: 'Terminals', location: 'Poblacion 1', price: '80', capacity: '14 Pax', time: 'Scheduled', agent: 'Express Dispatch', phone: '09112223333' },
];

// Expanded Data for Scrolling
const TRANSPORT_HUBS = [
  ...BASE_DATA,
  { ...BASE_DATA[1], id: '5', name: 'Bancod Tricycle Station', location: 'Brgy. Bancod' },
  { ...BASE_DATA[3], id: '6', name: 'Van Terminal to Dasma', location: 'Poblacion 3' },
  { ...BASE_DATA[0], id: '7', name: 'Jeepney Stop (Alulod)', location: 'Brgy. Alulod' },
  { ...BASE_DATA[2], id: '8', name: 'Motorcycle Rentals', location: 'Town Plaza' },
];

const FILTERS = ['All', 'Terminals', 'Tricycle', 'Rentals', 'Logistics'];

const GALLERY_IMGS = [
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400',
  'https://images.unsplash.com/photo-1599321520108-36940a696414?w=400',
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400',
];

const REVIEWS_DATA = [
  { id: 1, user: 'Commuter 1', rating: 5, comment: 'Very organized terminal. Buses leave on time.', date: '1 day ago' },
  { id: 2, user: 'Tourist', rating: 4, comment: 'Tricycle drivers are friendly but fares can vary.', date: '3 days ago' },
];

export default function TransportScreen() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0); 
  const [activeTab, setActiveTab] = useState('About');

  // --- ACTIONS ---
  const handleBook = () => {
    Alert.alert("Coming Soon", "This feature is not available coming soon...");
  };

  const handleShare = async (item) => {
    if (!item) return;
    try {
      await Share.share({ message: `Travel via ${item.name} in Indang!`, url: item.image });
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
          <Ionicons name="map-outline" size={22} color={TRANS_BLUE} />
          <Text style={styles.amenityText}>Routes</Text>
        </View>
        <View style={styles.amenity}>
          <MaterialCommunityIcons name="clock-outline" size={22} color={TRANS_BLUE} />
          <Text style={styles.amenityText}>{selectedItem?.time}</Text>
        </View>
        <View style={styles.amenity}>
          <MaterialCommunityIcons name="account-group-outline" size={22} color={TRANS_BLUE} />
          <Text style={styles.amenityText}>{selectedItem?.capacity}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Hub Info</Text>
      <Text style={styles.description}>
        {selectedItem?.sub}. Reliable transport node in Indang, providing essential connectivity for locals and tourists alike.
        <Text style={styles.readMore}> Read more</Text>
      </Text>

      <Text style={styles.sectionTitle}>Dispatch Contact</Text>
      <View style={styles.agentRow}>
        <Image source={{ uri: 'https://i.pravatar.cc/150?u=trans' }} style={styles.agentAvatar} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.agentName}>{selectedItem?.agent || 'Dispatcher'}</Text>
          <Text style={styles.agentTitle}>Supervisor</Text>
        </View>
        <View style={styles.agentActions}>
          <TouchableOpacity style={styles.agentActionBtn} onPress={() => handleCall(selectedItem?.phone)}>
            <Ionicons name="call-outline" size={20} color={TRANS_BLUE} />
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
               <View style={styles.reviewAvatar}><Text style={{color: TRANS_BLUE, fontWeight: 'bold'}}>{review.user[0]}</Text></View>
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
                  {/* UPDATED: Heart color to Orange */}
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
            <Text style={styles.footerLabel}>Base Fare</Text>
            <Text style={styles.priceText}>₱{selectedItem?.price} <Text style={styles.perMonth}>/start</Text></Text>
          </View>
          <TouchableOpacity 
            style={[styles.bookBtn, {backgroundColor: TRANS_BLUE}]}
            onPress={handleBook}
          >
            <Text style={styles.bookBtnText}>Book Trip</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Filter Logic
  const filteredData = useMemo(() => {
    const category = FILTERS[activeIndex];
    return TRANSPORT_HUBS.filter(item => {
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
            <Ionicons name="arrow-back" size={24} color={TRANS_BLUE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transport</Text>
        </View>

        {/* Index 1: Sticky Menu (Search + Filters) */}
        <View style={styles.stickyContainer}>
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <TextInput 
                placeholder="Search routes or terminals..." 
                style={styles.searchInput}
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Ionicons name="bus-outline" size={20} color={TRANS_BLUE} />
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
                    <Ionicons name="navigate" size={14} color={TRANS_BLUE} />
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