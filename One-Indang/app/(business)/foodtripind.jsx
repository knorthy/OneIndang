import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  Dimensions, 
  FlatList, 
  Platform, 
  StatusBar, 
  Animated, 
  Modal,
  BackHandler 
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { auth } from '../../services/supabase'; 

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");
const hp = (p) => (p * deviceHeight) / 100;
const wp = (p) => (p * deviceWidth) / 100;

const COLORS = {
  primary: '#003087', 
  secondary: '#D32F2F', 
  background: '#ffffff',
  text: '#003087',
  textGray: '#666666',
  lightRedBg: '#FFEBEE', 
  lightBlueBg: '#E3F2FD', 
};

// --- FOOD DATA ---
const FOOD_DATA = [
  { 
    id: '1', 
    name: 'Jollibee Indang', 
    sub: 'Fried Chicken • Burgers • Spaghetti', 
    rating: '4.8', 
    distance: '0.2 km', 
    image: require('../../assets/images/foods/jollibee.png'), 
    verified: true, 
    location: 'Indang Town Plaza', 
    tag: 'Bida ang Saya', 
    category: 'Fast Food', 
    price: '150', 
    capacity: '100+', 
    time: '24/7', 
    agent: 'Store Manager',
    desc: 'Philippines’ favorite fast food chain known for its crispylicious Chickenjoy, sweet-style Jolly Spaghetti, and savory Yumburgers.'
  },
  { 
    id: '2', 
    name: 'Siglo Farm Café', 
    sub: 'Farm-to-Table • Organic • Coffee', 
    rating: '4.9', 
    distance: '1.5 km', 
    image: require('../../assets/images/foods/siglo.png'), 
    verified: true, 
    location: 'Brgy. Kayquit', 
    tag: 'Relaxing', 
    category: 'Cafes', 
    price: '350', 
    capacity: '40', 
    time: '8AM-9PM', 
    agent: 'Chef Aris',
    desc: 'Experience fresh, organic dining right in the middle of a lush farm. Famous for their Barako coffee and fresh garden salads.'
  },
  { 
    id: '3', 
    name: 'Celyns Inasal', 
    sub: 'Grilled Chicken • Unli Rice', 
    rating: '4.6', 
    distance: '0.5 km', 
    image: require('../../assets/images/foods/celyns.png'), 
    verified: false, 
    location: 'San Gregorio St.', 
    tag: 'Budget Meal', 
    category: 'Native', 
    price: '130', 
    capacity: '60', 
    time: '10AM-8PM', 
    agent: 'Celyn S.',
    desc: 'The home of the best Chicken Inasal in town. Enjoy smoky, savory grilled chicken with unlimited rice.'
  },
  { 
    id: '4', 
    name: 'Indang Town Milk Tea', 
    sub: 'Milk Tea • Fruit Tea • Snacks', 
    rating: '4.5', 
    distance: '0.3 km', 
    image: require('../../assets/images/foods/milktea.png'), 
    verified: false, 
    location: 'Poblacion 1', 
    tag: 'Student Choice', 
    category: 'Desserts', 
    price: '90', 
    capacity: '15', 
    time: '11AM-7PM', 
    agent: 'Barista Jane',
    desc: 'Your go-to spot for refreshing milk teas and quick snacks. A favorite hangout spot for students.'
  },
  { 
    id: '5', 
    name: 'Kusina ni Lolo', 
    sub: 'Bulalo • Kare-Kare • Lutong Bahay', 
    rating: '4.7', 
    distance: '2.1 km', 
    image: require('../../assets/images/foods/kusina.png'), 
    verified: true, 
    location: 'Brgy. Alulod', 
    tag: 'Family Feast', 
    category: 'Native', 
    price: '400', 
    capacity: '80', 
    time: '9AM-10PM', 
    agent: 'Lolo Bert',
    desc: 'Authentic Caviteño dishes served in a rustic setting. Famous for their steaming hot Bulalo and Kare-Kare.'
  },
];

const FILTERS = ['All', 'Fast Food', 'Cafes', 'Native', 'Desserts'];

export default function FoodScreen() {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('About');
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user } = await auth.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        setCurrentUser(null);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      if (selectedItem) {
        setSelectedItem(null);
        return true; 
      }
      return false; 
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [selectedItem]);

  const filteredData = useMemo(() => {
    const category = FILTERS[activeIndex];
    return FOOD_DATA.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.sub.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === 'All' || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeIndex]);

  const handleGoToCart = () => router.push('/(business)/cart');
  const handleViewOrders = () => router.push('/(business)/orders');

  const renderDetails = () => {
    if (!selectedItem) return null; 

    const headerBgOpacity = scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    return (
      <View style={styles.detailContainer}>
        <View style={styles.fixedHeaderWrapper}>
            <Animated.View style={[styles.headerBackground, { opacity: headerBgOpacity }]} />
            <View style={styles.headerNav}>
                <TouchableOpacity style={styles.circleBtn} onPress={() => setSelectedItem(null)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity style={styles.circleBtn} onPress={() => setIsFavorite(!isFavorite)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? COLORS.secondary : COLORS.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.circleBtn} onPress={handleGoToCart} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Ionicons name="cart-outline" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>

        <Animated.ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={{ paddingBottom: hp(15) }}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
            scrollEventThrottle={16}
        >
          <View style={styles.imageContainer}>
            <Image source={selectedItem.image} style={styles.mainImage} />
          </View>

          <View style={styles.contentPadding}>
            <View style={styles.rowBetween}>
              <View style={styles.typeBadge}><Text style={styles.typeText}>{selectedItem.category}</Text></View>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#FFB800" />
                <Text style={styles.ratingText}> {selectedItem.rating} (Review)</Text>
              </View>
            </View>

            <Text style={styles.title}>{selectedItem.name}</Text>
            <Text style={styles.address}>{selectedItem.location}</Text>

            <View style={styles.tabContainer}>
              {['About', 'Gallery', 'Review'].map((tab) => (
                <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}>
                  <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.amenitiesRow}>
              <View style={styles.amenity}>
                <Ionicons name="people-outline" size={22} color={COLORS.secondary} />
                <Text style={styles.amenityText}>{selectedItem?.capacity} Pax</Text>
              </View>
              <View style={styles.amenity}>
                <MaterialCommunityIcons name="clock-outline" size={22} color={COLORS.secondary} />
                <Text style={styles.amenityText}>{selectedItem?.time}</Text>
              </View>
              <View style={styles.amenity}>
                <MaterialCommunityIcons name="silverware-fork-knife" size={22} color={COLORS.secondary} />
                <Text style={styles.amenityText}>Dine-in</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {selectedItem.desc} 
              <Text style={styles.readMore}> Read more</Text>
            </Text>

            <Text style={styles.sectionTitle}>Contact Person</Text>
            <View style={styles.agentRow}>
              <Image source={{ uri: 'https://i.pravatar.cc/150?u=food' }} style={styles.agentAvatar} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.agentName}>{selectedItem.agent}</Text>
                <Text style={styles.agentTitle}>Customer Relations</Text>
              </View>
              <View style={styles.agentActions}>
                <TouchableOpacity style={styles.agentActionBtn}><Ionicons name="chatbubble-ellipses-outline" size={20} color={COLORS.secondary} /></TouchableOpacity>
                <TouchableOpacity style={styles.agentActionBtn}><Ionicons name="call-outline" size={20} color={COLORS.secondary} /></TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.ScrollView>

        <View style={styles.footer}>
          <View>
            <Text style={styles.footerLabel}>Avg. Cost</Text>
            <Text style={styles.priceText}>₱{selectedItem.price} <Text style={styles.perMonth}>/person</Text></Text>
          </View>
          <TouchableOpacity 
            style={[styles.bookBtn, {backgroundColor: COLORS.secondary}]}
            onPress={() => {
              if (!currentUser) {
                setShowAuthModal(true);
                return;
              }
              router.push({
                pathname: '/(business)/order', 
                params: { name: selectedItem.name }
              });
            }}
          >
            <Text style={styles.bookBtnText}>Order Now</Text>
          </TouchableOpacity>
        </View>

        {/* AUTH MODAL - UPDATED WITH REDIRECT LOGIC */}
        <Modal
          visible={showAuthModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowAuthModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.modalClose} onPress={() => setShowAuthModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
              
              <View style={styles.modalIconContainer}>
                <Ionicons name="lock-closed" size={48} color={COLORS.secondary} />
              </View>
              
              <Text style={styles.modalTitle}>Sign In Required</Text>
              <Text style={styles.modalMessage}>
                Please sign in or create an account to place an order.
              </Text>
              
              <TouchableOpacity 
                style={styles.modalPrimaryBtn}
                onPress={() => {
                  setShowAuthModal(false);
                  setSelectedItem(null);
                  // PASS REDIRECT PARAMS TO LOGIN
                  router.push({
                    pathname: '/(tabs)/login',
                    params: { 
                        redirect: '/(business)/order',
                        name: selectedItem.name,
                        image: selectedItem.image // Note: passing image resource ID might warn, but works in Expo
                    }
                  });
                }}
              >
                <Text style={styles.modalPrimaryBtnText}>Sign In</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalSecondaryBtn}
                onPress={() => {
                  setShowAuthModal(false);
                  setSelectedItem(null);
                  // PASS REDIRECT PARAMS TO SIGNUP
                  router.push({
                    pathname: '/(tabs)/signup',
                    params: { 
                        redirect: '/(business)/order',
                        name: selectedItem.name,
                        image: selectedItem.image 
                    }
                  });
                }}
              >
                <Text style={styles.modalSecondaryBtnText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const renderList = () => (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 15 : 20 }]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={{top:10, bottom:10, left:10, right:10}}>
                <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Food</Text>
        </View>
        <TouchableOpacity style={styles.headerCartBtn} onPress={handleGoToCart} hitSlop={{top:10, bottom:10, left:10, right:10}}>
            <Ionicons name="cart-outline" size={26} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput 
            placeholder="Search for restaurants or dishes..." 
            style={styles.searchInput}
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="search" size={20} color={COLORS.primary} />
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

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemContainer} activeOpacity={0.8} onPress={() => setSelectedItem(item)}>
            <View style={styles.imageWrapper}>
              <Image source={item.image} style={styles.bizImage} />
              {item.verified && (
                <View style={styles.checkBadge}>
                  <Ionicons name="checkmark-circle" size={18} color={COLORS.secondary} />
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
                <Ionicons name="location-sharp" size={14} color="#888" />
                <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.ratingTextSmall}>{item.rating} ★  •  {item.distance}</Text>
                <Ionicons name="heart-outline" size={20} color={COLORS.secondary} />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={handleViewOrders} activeOpacity={0.8}>
        <MaterialCommunityIcons name="receipt-text-outline" size={24} color="#FFF" />
        <Text style={styles.fabText}>My Orders</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );

  return selectedItem ? renderDetails() : renderList();
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  fixedHeaderWrapper: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50, paddingHorizontal: wp(4), paddingBottom: 10 },
  headerBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#FFF', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 4 },
  headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  circleBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(4), paddingBottom: 10 },
  headerTitle: { fontSize: wp(7), fontWeight: 'bold', marginLeft: wp(2), color: COLORS.primary },
  backBtn: { padding: 4 },
  headerCartBtn: { padding: 8, backgroundColor: COLORS.lightBlueBg, borderRadius: 20 },
  fab: { position: 'absolute', bottom: hp(4), right: wp(5), backgroundColor: COLORS.secondary, flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30, elevation: 10, zIndex: 999, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
  fabText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8, fontSize: 16 },
  searchContainer: { paddingHorizontal: wp(4), marginBottom: hp(1.5) },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', borderRadius: 25, paddingHorizontal: 15, height: 45, borderWidth: 1, borderColor: '#EEE' },
  searchInput: { flex: 1, fontSize: wp(3.8), color: '#333' },
  filterRowContainer: { marginBottom: hp(1.5) },
  filterScroll: { paddingHorizontal: wp(4) },
  filterPill: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFF', marginRight: 10, borderWidth: 1, borderColor: '#DDD' },
  activePill: { backgroundColor: COLORS.secondary, borderColor: COLORS.secondary },
  filterText: { color: COLORS.textGray, fontWeight: '600', fontSize: wp(3.5) },
  activeFilterText: { color: '#FFF' },
  listContent: { paddingHorizontal: wp(4), paddingBottom: hp(10) }, 
  itemContainer: { flexDirection: 'row', marginBottom: hp(2.5), alignItems: 'center' },
  imageWrapper: { position: 'relative' },
  bizImage: { width: wp(32), height: wp(28), borderRadius: 16, backgroundColor: '#EEE' },
  checkBadge: { position: 'absolute', bottom: -5, right: -5, backgroundColor: '#FFF', borderRadius: 12, padding: 2 },
  infoWrapper: { flex: 1, marginLeft: wp(4), justifyContent: 'center' },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bizName: { fontSize: wp(4.1), fontWeight: 'bold', color: '#111', flex: 1, marginRight: 8 },
  labelBadge: { backgroundColor: COLORS.lightRedBg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  labelText: { color: COLORS.secondary, fontSize: wp(2.4), fontWeight: 'bold', textTransform: 'uppercase' },
  bizSub: { fontSize: wp(3.3), color: COLORS.textGray, marginTop: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { fontSize: wp(3), color: COLORS.textGray, marginLeft: 2 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  ratingTextSmall: { fontSize: wp(3.5), color: COLORS.textGray, fontWeight: '600' },
  detailContainer: { flex: 1, backgroundColor: '#FFF' },
  imageContainer: { width: wp(100), height: hp(40), backgroundColor: '#E5E7EB' },
  mainImage: { width: '100%', height: '100%' },
  contentPadding: { paddingHorizontal: wp(5), paddingTop: hp(2) },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typeBadge: { backgroundColor: COLORS.lightRedBg, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  typeText: { color: COLORS.secondary, fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { color: COLORS.textGray, fontSize: 13 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 10, color: COLORS.text },
  address: { color: COLORS.textGray },
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#EEE', marginTop: hp(2) },
  tabItem: { paddingVertical: 12, marginRight: wp(8) },
  activeTabItem: { borderBottomWidth: 3, borderBottomColor: COLORS.secondary },
  tabText: { color: COLORS.textGray, fontSize: 16, fontWeight: '600' },
  activeTabText: { color: COLORS.secondary },
  amenitiesRow: { flexDirection: 'row', marginTop: hp(2), justifyContent: 'space-between' },
  amenity: { flexDirection: 'row', alignItems: 'center' },
  amenityText: { marginLeft: 6, fontWeight: '500', color: COLORS.textGray },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: hp(3), color: COLORS.text },
  description: { color: COLORS.textGray, lineHeight: 22 },
  readMore: { color: COLORS.secondary, fontWeight: '600' },
  agentRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  agentAvatar: { width: 50, height: 50, borderRadius: 25 },
  agentName: { fontWeight: 'bold', fontSize: 16, color: COLORS.text },
  agentTitle: { color: COLORS.textGray },
  agentActions: { flexDirection: 'row' },
  agentActionBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: COLORS.lightRedBg, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', paddingHorizontal: wp(5), paddingBottom: hp(4), paddingTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 20 },
  footerLabel: { color: COLORS.textGray },
  priceText: { fontSize: 20, fontWeight: 'bold', color: COLORS.secondary },
  perMonth: { fontSize: 14, fontWeight: 'normal', color: COLORS.textGray },
  bookBtn: { paddingHorizontal: wp(10), paddingVertical: hp(2), borderRadius: 15 },
  bookBtnText: { color: '#FFF', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 20, padding: 24, width: '100%', maxWidth: 340, alignItems: 'center' },
  modalClose: { position: 'absolute', top: 12, right: 12, padding: 4 },
  modalIconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.lightRedBg, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  modalMessage: { fontSize: 14, color: COLORS.textGray, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  modalPrimaryBtn: { backgroundColor: COLORS.secondary, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12, width: '100%', alignItems: 'center', marginBottom: 12 },
  modalPrimaryBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  modalSecondaryBtn: { backgroundColor: '#F5F5F5', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12, width: '100%', alignItems: 'center' },
  modalSecondaryBtnText: { color: '#333', fontWeight: '600', fontSize: 16 },
});