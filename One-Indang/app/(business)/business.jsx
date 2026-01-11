import React, { useState, useCallback, memo, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  LayoutAnimation, 
  Platform, 
  UIManager,
  BackHandler // 1. IMPORT BACKHANDLER
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 

// --- HELPERS IMPORT ---
import { hp, wp } from '../../helpers/common';
import { BUSINESS_CATEGORIES, POPULAR_BUSINESSES, BUSINESS_SETUP_STAGES } from '../../constants/businessData'; 

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

// --- THEME COLORS ---
const THEME_BLUE = '#003087'; 
const BABY_BLUE_OPACITY = 'rgba(224, 242, 254, 0.4)'; 
const HEART_RED = '#EF4444';
const SUCCESS_GREEN = '#22C55E';
const TEXT_GRAY = '#6B7280';

const BusinessListScreen = () => {
  const router = useRouter(); 
  const [favorites, setFavorites] = useState([]); 
  const [showAll, setShowAll] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const displayedBusinesses = showAll ? POPULAR_BUSINESSES : POPULAR_BUSINESSES.slice(0, 3);

  // --- FIX: HANDLE DEVICE BACK BUTTON ---
  useEffect(() => {
    const onBackPress = () => {
      // If a property is selected (Detail View is open), close it
      if (selectedProperty) {
        setSelectedProperty(null);
        return true; // Stop the event here (don't exit screen)
      }
      // If nothing selected (List View), let default behavior happen (go back to Home)
      return false; 
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => subscription.remove();
  }, [selectedProperty]);

  const toggleFavorite = useCallback((item) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === item.id);
      if (exists) return prev.filter(f => f.id !== item.id);
      return [...prev, item];
    });
  }, []);

  const toggleShowAll = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowAll(!showAll);
  };

  if (selectedProperty) {
    return (
      <DetailsView 
        item={selectedProperty} 
        onBack={() => setSelectedProperty(null)} 
        isLiked={favorites.some(f => f.id === selectedProperty.id)}
        toggleFavorite={toggleFavorite}
      />
    );
  }

  return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Stack.Screen options={{ headerShown: false }} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(15) }}>
          
          <View style={styles.headerBox}>
            <Text style={styles.title}>BUSINESS</Text>
          </View>

          {/* 1. TOP CATEGORIES */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>TOP CATEGORIES</Text>
            </View>
            <View style={styles.gridContainer}>
              {BUSINESS_CATEGORIES.map((cat) => (
                <TouchableOpacity style={styles.catItem} key={cat.id} onPress={() => router.push(cat.route)}>
                  <View style={styles.catCircle}>
                    <Image source={{ uri: cat.img }} style={styles.catImage} />
                  </View>
                  <Text style={styles.catName}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 2. POPULAR BUSINESSES */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>POPULAR BUSINESSES</Text>
              <TouchableOpacity onPress={toggleShowAll} style={styles.toggleBtn}>
                <Text style={styles.moreText}>{showAll ? 'Show Less' : 'Show All'}</Text>
                <Ionicons name={showAll ? "chevron-up" : "chevron-forward"} size={16} color={THEME_BLUE} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              horizontal={!showAll}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={!showAll ? { paddingHorizontal: (width - (width * 0.82)) / 2 } : { paddingHorizontal: wp(5) }}
            >
              <View style={showAll ? styles.verticalList : { flexDirection: 'row' }}>
                {displayedBusinesses.map((item) => (
                  <BusinessCard 
                    key={item.id} 
                    item={item} 
                    isLiked={favorites.some(f => f.id === item.id)}
                    toggleFavorite={toggleFavorite} 
                    onPress={() => setSelectedProperty(item)}
                    isVertical={showAll} 
                  />
                ))}
              </View>
            </ScrollView>
          </View>

          {/* 3. SAVED PLACES */}
          {favorites.length > 0 && (
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionLabel, { color: THEME_BLUE }]}>SAVED PLACES</Text>
              </View>
              <View style={styles.favListContainer}>
                {favorites.map((fav) => (
                  <TouchableOpacity 
                    key={fav.id} 
                    style={styles.favListItem}
                    onPress={() => setSelectedProperty(fav)}
                  >
                    <Image source={{ uri: fav.image }} style={styles.favListImage} />
                    <View style={styles.favListInfo}>
                        <Text style={styles.favListTitle}>{fav.name}</Text>
                        <Text style={styles.favListSub}>{fav.category}</Text>
                    </View>
                    <TouchableOpacity style={styles.removeBtn} onPress={() => toggleFavorite(fav)}>
                        <Ionicons name="trash-outline" size={18} color="white" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* 4. BUSINESS SETUP GUIDE */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>BUSINESS SETUP GUIDE</Text>
            </View>
            <View style={styles.timelineWrapper}>
              <View style={styles.centeredLine} />
              {BUSINESS_SETUP_STAGES.map((item, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <View key={item.id} style={styles.stepRow}>
                    <View style={styles.sideColumn}>
                      {isLeft && (
                        <View style={styles.textBlock}>
                          <Text style={[styles.stageTitle, { textAlign: 'right' }]}>{item.title}</Text>
                          <Text style={[styles.descriptionText, { textAlign: 'right' }]}>{item.description}</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.middlePoint}>
                      <View style={styles.numberCircle}>
                        <Text style={styles.numberText}>{index + 1}</Text>
                      </View>
                    </View>
                    <View style={styles.sideColumn}>
                      {!isLeft && (
                        <View style={styles.textBlock}>
                          <Text style={[styles.stageTitle, { textAlign: 'left' }]}>{item.title}</Text>
                          <Text style={[styles.descriptionText, { textAlign: 'left' }]}>{item.description}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
  );
};

// --- SUB-COMPONENTS ---

const BusinessCard = memo(({ item, isLiked, toggleFavorite, onPress, isVertical }) => (
  <TouchableOpacity 
    style={[styles.popularCard, isVertical && styles.verticalCard]} 
    onPress={onPress}
  >
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.image }} style={[styles.popularImage, isVertical && styles.verticalImage]} />
      <View style={[styles.statusBadge, { backgroundColor: item.isOpen ? SUCCESS_GREEN : HEART_RED }]}>
          <Text style={styles.statusText}>{item.isOpen ? 'OPEN' : 'CLOSED'}</Text>
      </View>
      <TouchableOpacity style={styles.heartBtn} onPress={() => toggleFavorite(item)}>
        <Ionicons name={isLiked ? "heart" : "heart-outline"} size={22} color={isLiked ? HEART_RED : "#333"} />
      </TouchableOpacity>
    </View>
    <View style={styles.popularInfo}>
      <Text style={styles.popularName}>{item.name}</Text>
      <Text style={styles.popularSubtext}>{item.category} • {item.address}</Text>
    </View>
  </TouchableOpacity>
));

const DetailsView = ({ item, onBack, isLiked, toggleFavorite }) => (
  <SafeAreaView style={styles.container} edges={['top']}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(12) }}>
      <View style={styles.detailsHeader}>
        <Image source={{ uri: item.image }} style={styles.detailsMainImg} />
        <TouchableOpacity style={styles.backCircle} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.detailsHeart} onPress={() => toggleFavorite(item)}>
          <Ionicons name={isLiked ? "heart" : "heart-outline"} size={24} color={isLiked ? HEART_RED : "#333"} />
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContent}>
        <View style={styles.titleRow}>
          <Text style={styles.catBadge}>{item.category}</Text>
          <View style={styles.row}>
            <Ionicons name="star" size={16} color="#FBBF24" />
            <Text style={styles.ratingText}>4.5 (385 reviews)</Text>
          </View>
        </View>
        <Text style={styles.detailsTitle}>{item.name}</Text>
        <Text style={styles.detailsAddress}>{item.address}, Indang, Cavite</Text>

        <View style={styles.featuresRow}>
          <Feature icon="bed-outline" label={`${item.beds} Beds`} />
          <Feature icon="bathtub-outline" label={`${item.baths} Bath`} />
          <Feature icon="arrow-expand-all" label={`${item.sqft} sqft`} />
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.descText}>
          Discover this beautiful {item.category} in the heart of Indang. Perfect for those looking for quality, comfort, and a great location. <Text style={{color: THEME_BLUE, fontWeight: 'bold'}}>Read more</Text>
        </Text>
      </View>
    </ScrollView>

    <View style={styles.footer}>
      <View>
        <Text style={styles.priceLabel}>Total Price</Text>
        <Text style={styles.priceValue}>{item.price} <Text style={styles.pricePeriod}>/month</Text></Text>
      </View>
      <TouchableOpacity style={styles.bookBtn}>
        <Text style={styles.bookBtnText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

const Feature = ({ icon, label }) => (
  <View style={styles.featureItem}>
    <MaterialCommunityIcons name={icon} size={22} color={THEME_BLUE} />
    <Text style={styles.featureText}>{label}</Text>
  </View>
);

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerBox: { padding: wp(6), alignItems: 'center' },
  title: { fontSize: wp(7), fontWeight: '900', color: THEME_BLUE },
  sectionContainer: { marginTop: hp(3) },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: wp(5), marginBottom: hp(2) },
  sectionLabel: { fontSize: wp(3.5), fontWeight: '800', color: '#9E9E9E', letterSpacing: 1 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: wp(5) },
  catItem: { alignItems: 'center', width: wp(22), marginBottom: hp(2) }, 
  catCircle: { width: wp(16), height: wp(16), borderRadius: wp(8), backgroundColor: 'rgba(224, 242, 254, 0.7)', justifyContent: 'center', alignItems: 'center' },
  catImage: { width: wp(9), height: wp(9), resizeMode: 'contain' },
  catName: { marginTop: hp(0.8), fontSize: wp(2.6), fontWeight: '600', color: '#333', textAlign: 'center' },
  
  popularCard: { width: width * 0.82, marginRight: wp(4), borderRadius: wp(6), backgroundColor: '#fff', elevation: 4, overflow: 'hidden' },
  verticalCard: { width: '100%', marginBottom: hp(2), marginRight: 0 },
  popularImage: { width: '100%', height: hp(22) },
  verticalImage: { height: hp(18) },
  statusBadge: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusText: { color: '#FFF', fontSize: wp(2.5), fontWeight: '900' },
  popularInfo: { padding: wp(4) },
  popularName: { fontSize: wp(4), fontWeight: 'bold' },
  popularSubtext: { fontSize: wp(3), color: '#666' },
  imageContainer: { position: 'relative' },
  heartBtn: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255,255,255,0.9)', padding: 8, borderRadius: 20 },

  // SAVED LIST
  favListContainer: { paddingHorizontal: wp(5) },
  favListItem: { flexDirection: 'row', backgroundColor: BABY_BLUE_OPACITY, borderRadius: 18, padding: 12, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0, 48, 135, 0.05)' },
  favListImage: { width: wp(12), height: wp(12), borderRadius: 10 },
  favListInfo: { flex: 1, marginLeft: 15 },
  favListTitle: { fontSize: wp(3.5), fontWeight: 'bold' },
  favListSub: { fontSize: wp(2.8), color: '#555' },
  removeBtn: { backgroundColor: THEME_BLUE, padding: 8, borderRadius: 10 },

  // TIMELINE
  timelineWrapper: { position: 'relative', width: '100%', paddingVertical: hp(2) },
  centeredLine: { position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, backgroundColor: THEME_BLUE, opacity: 0.15, marginLeft: -1, zIndex: 1 },
  stepRow: { flexDirection: 'row', width: '100%', alignItems: 'center', marginBottom: hp(8) },
  sideColumn: { flex: 1, paddingHorizontal: wp(4) },
  middlePoint: { width: wp(12), alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  numberCircle: { width: wp(9), height: wp(9), borderRadius: wp(4.5), backgroundColor: THEME_BLUE, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFF', elevation: 3 },
  numberText: { color: '#FFF', fontWeight: 'bold', fontSize: wp(3.5) },
  textBlock: { width: '100%' },
  stageTitle: { fontSize: wp(2.8), fontWeight: '800', color: THEME_BLUE, marginBottom: 4 },
  descriptionText: { fontSize: wp(2.4), color: '#666', lineHeight: wp(3.4) },

  // DETAILS VIEW STYLES
  detailsHeader: { height: hp(40), width: '100%' },
  detailsMainImg: { width: '100%', height: '100%', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  backCircle: { position: 'absolute', top: 20, left: 20, backgroundColor: 'white', padding: 10, borderRadius: 25, elevation: 2 },
  detailsHeart: { position: 'absolute', top: 20, right: 20, backgroundColor: 'white', padding: 10, borderRadius: 25, elevation: 2 },
  detailsContent: { padding: wp(6) },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catBadge: { color: THEME_BLUE, fontWeight: 'bold', fontSize: 16 },
  ratingText: { marginLeft: 5, color: TEXT_GRAY, fontSize: 13 },
  detailsTitle: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  detailsAddress: { color: TEXT_GRAY, marginTop: 4, fontSize: 14 },
  featuresRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  featureItem: { flexDirection: 'row', alignItems: 'center' },
  featureText: { marginLeft: 6, color: TEXT_GRAY, fontWeight: '500' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 25 },
  descText: { color: TEXT_GRAY, lineHeight: 22, marginTop: 10 },
  footer: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    padding: wp(6), borderTopWidth: 1, borderColor: '#EEE', backgroundColor: 'white' 
  },
  priceLabel: { color: TEXT_GRAY, fontSize: 13 },
  priceValue: { fontSize: 20, fontWeight: 'bold', color: THEME_BLUE },
  pricePeriod: { fontSize: 14, fontWeight: 'normal', color: TEXT_GRAY },
  bookBtn: { backgroundColor: '#3B82F6', paddingVertical: 15, paddingHorizontal: 35, borderRadius: 15 },
  bookBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  
  row: { flexDirection: 'row', alignItems: 'center' },
  moreText: { fontSize: wp(3.5), fontWeight: 'bold', color: THEME_BLUE, marginRight: 4 },
  toggleBtn: { flexDirection: 'row', alignItems: 'center' },
});

export default BusinessListScreen;