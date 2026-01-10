import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  Dimensions, 
  Linking, 
  Share, 
  Alert 
} from 'react-native';
import { Stack, useRouter } from 'expo-router';

// IMPORT DATA
import { 
  EDUCATION_INSTITUTIONS, 
  EDUCATION_FILTERS, 
  EDUCATION_GALLERY_IMGS, 
  EDUCATION_REVIEWS_DATA 
} from '../../constants/businessData';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// STYLESHEET
import styles from './styles/education.styles';

// RESPONSIVE DIMENSIONS
const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");
const hp = (p) => (p * deviceHeight) / 100;
const wp = (p) => (p * deviceWidth) / 100;

// EDUCATION THEME
const EDU_BLUE = '#1A73E8'; 
const LIGHT_EDU_BG = '#E8F0FE';
const PRIMARY_BLUE = '#2D6BFF';
const AGRI_HEART_RED = '#FF6B6B'; 

export default function EducationScreen() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('About');

  // --- ACTIONS ---
  const handleInquiry = () => {
    Alert.alert("Coming Soon", "This feature is not available coming soon...");
  };

  const handleShare = async (item) => {
    if (!item) return;
    try {
      await Share.share({ message: `Check out ${item.name} in Indang!`, url: item.image });
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
          <Ionicons name="book-outline" size={22} color={EDU_BLUE} />
          <Text style={styles.amenityText}>{selectedItem?.beds} Rooms</Text>
        </View>
        <View style={styles.amenity}>
          <MaterialCommunityIcons name="shield-check-outline" size={22} color={EDU_BLUE} />
          <Text style={styles.amenityText}>Accredited</Text>
        </View>
        <View style={styles.amenity}>
          <MaterialCommunityIcons name="vector-square" size={22} color={EDU_BLUE} />
          <Text style={styles.amenityText}>{selectedItem?.sqft} sqft</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>About Institution</Text>
      <Text style={styles.description}>
        {selectedItem?.sub}. A cornerstone of the Indang community, providing quality education and fostering growth for students in the region.
        <Text style={styles.readMore}> Read more</Text>
      </Text>

      <Text style={styles.sectionTitle}>Contact Person</Text>
      <View style={styles.agentRow}>
        <Image source={{ uri: 'https://i.pravatar.cc/150?u=edu' }} style={styles.agentAvatar} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.agentName}>{selectedItem?.agent || 'Admin'}</Text>
          <Text style={styles.agentTitle}>Administrative Officer</Text>
        </View>
        <View style={styles.agentActions}>
          <TouchableOpacity style={styles.agentActionBtn} onPress={() => handleCall(selectedItem?.phone)}>
            <Ionicons name="call-outline" size={20} color={EDU_BLUE} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // 2. GALLERY TAB
  const renderGalleryTab = () => (
    <View style={styles.galleryGrid}>
      {EDUCATION_GALLERY_IMGS.map((img, index) => (
        <Image key={index} source={{ uri: img }} style={styles.galleryImg} />
      ))}
    </View>
  );

  // 3. REVIEW TAB
  const renderReviewTab = () => (
    <View style={{ marginTop: hp(2) }}>
      {EDUCATION_REVIEWS_DATA.map((review) => (
        <View key={review.id} style={styles.reviewItem}>
          <View style={styles.reviewHeader}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
               <View style={styles.reviewAvatar}><Text style={{color: EDU_BLUE, fontWeight: 'bold'}}>{review.user[0]}</Text></View>
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
                  <Ionicons name="heart-outline" size={20} color={AGRI_HEART_RED} />
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
            <Text style={styles.footerLabel}>Est. Tuition</Text>
            <Text style={styles.priceText}>₱{selectedItem?.price} <Text style={styles.perMonth}>/sem</Text></Text>
          </View>
          <TouchableOpacity 
            style={[styles.bookBtn, {backgroundColor: EDU_BLUE}]}
            onPress={handleInquiry}
          >
            <Text style={styles.bookBtnText}>Inquire Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Filter Logic
  const filteredData = useMemo(() => {
    const category = EDUCATION_FILTERS[activeIndex];
    return EDUCATION_INSTITUTIONS.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.sub.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === 'All' || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeIndex]);

  const renderList = () => (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* SCROLLVIEW WITH STICKY HEADER at Index 1 */}
      <ScrollView 
        stickyHeaderIndices={[1]} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp(5) }}
      >
        
        {/* Index 0: Header (Scrolls away) */}
        <View style={styles.headerBox}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={EDU_BLUE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Education</Text>
        </View>

        {/* Index 1: Sticky Search & Filters */}
        <View style={styles.stickyContainer}>
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <TextInput 
                placeholder="Search schools or levels..." 
                style={styles.searchInput}
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Ionicons name="search" size={20} color={EDU_BLUE} />
            </View>
          </View>

          <View style={styles.filterRowContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {EDUCATION_FILTERS.map((filter, index) => (
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
                    <Ionicons name="school" size={14} color={EDU_BLUE} />
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
                  <Ionicons name="heart-outline" size={22} color={AGRI_HEART_RED} />
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