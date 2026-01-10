import { StyleSheet, Dimensions, Platform } from 'react-native';
import { hp, wp } from '../../../helpers/common';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BRAND_BLUE = '#003087';
const BRAND_RED = '#D32F2F';

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

export { styles, BRAND_BLUE, BRAND_RED, SCREEN_WIDTH, SCREEN_HEIGHT };
