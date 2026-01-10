import { StyleSheet, Platform, StatusBar } from 'react-native';
import { hp, wp } from '../../helpers/common';

// --- THEME COLORS ---
const COLORS = {
  primary: '#003087', // Deep Blue
  secondary: '#D32F2F', // Bright Red
  background: '#ffffff',
  text: '#003087',
  textGray: '#666666',
  lightRedBg: '#FFEBEE', 
  lightBlueBg: '#E3F2FD', 
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(2),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: hp(3.5),
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  notificationBtn: {
    padding: wp(2),
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: wp(4),
    height: hp(6.5),
    marginBottom: hp(3),
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  searchIcon: {
    marginRight: wp(2),
  },
  searchInput: {
    flex: 1,
    fontSize: hp(2),
    color: '#333',
  },
  section: {
    marginBottom: hp(4),
  },
  sectionTitle: {
    fontSize: hp(2.2),
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: hp(0.5),
  },
  sectionSubtitle: {
    fontSize: hp(1.8),
    color: COLORS.textGray,
    marginBottom: hp(2),
    lineHeight: hp(2.5),
  },
  eServicesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Ensures items spread out
    flexWrap: 'wrap', // Allows wrapping if we search and match weird numbers
  },
  eServiceItem: {
    width: wp(28),
    alignItems: 'center',
    marginBottom: hp(2), // Added margin in case of wrapping
  },
  iconBox: {
    width: hp(8),
    height: hp(8),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1),
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
  },
  gridLabel: {
    fontSize: hp(1.6),
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
  featuredGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: wp(3),
  },
  featuredCard: {
    width: wp(43),
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: wp(4),
    marginBottom: hp(1.5),
    minHeight: hp(16),
    justifyContent: 'space-between',
  },
  featuredCardHidden: {
    width: wp(43), // Invisible spacer to keep alignment
    height: 0,
  },
  featuredIconContainer: {
    alignSelf: 'flex-start',
    marginBottom: hp(1),
  },
  featuredTitle: {
    fontSize: hp(1.8),
    fontWeight: '600',
    color: '#333',
    lineHeight: hp(2.5),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: wp(4),
    marginBottom: hp(1.5),
  },
  cardIconBox: {
    width: hp(6),
    height: hp(6),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(4),
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: hp(2),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp(0.5),
  },
  cardSubtitle: {
    fontSize: hp(1.6),
    color: '#777',
  },
  listContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(2.2),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listItemText: {
    fontSize: hp(2),
    color: '#333',
    flex: 1, 
    paddingRight: wp(2),
  },
});

export { styles, COLORS };
