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

// IMPORT DATA
import { 
  AGRICULTURE_DATA, 
  AGRICULTURE_FILTERS, 
  AGRICULTURE_GALLERY_IMGS, 
  AGRICULTURE_REVIEWS_DATA 
} from '../../constants/businessData';
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

import styles from './styles/agri.styles';

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
      {AGRICULTURE_GALLERY_IMGS.map((img, index) => (
        <Image key={index} source={{ uri: img }} style={styles.galleryImg} />
      ))}
    </View>
  );

  // 3. REVIEW TAB
  const renderReviewTab = () => (
    <View style={{ marginTop: hp(2) }}>
      {AGRICULTURE_REVIEWS_DATA.map((review) => (
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
    const categoryFilter = AGRICULTURE_FILTERS[activeIndex];
    return AGRICULTURE_DATA.filter(item => {
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
              {AGRICULTURE_FILTERS.map((filter, index) => (
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