import { StyleSheet, Platform, StatusBar } from 'react-native';
import { hp, wp } from '../helpers/common';

// --- THEME COLORS ---
const COLORS = {
  primary: '#003087', // Indang Blue
  secondary: '#D32F2F', // Indang Red
  background: '#fff',
  text: '#333',
  gray: '#999',
  lightGray: '#f9f9f9',
  border: '#e0e0e0',
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: hp(2.2),
    fontWeight: 'bold',
    color: COLORS.primary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: wp(2),
  },
  scrollContent: {
    padding: wp(5),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.text,
  },
  officeContainer: {
    marginBottom: hp(1.5),
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    overflow: 'hidden',
  },
  officeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: wp(5),
    backgroundColor: COLORS.lightGray,
  },
  officeHeaderExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  officeTitle: {
    fontSize: hp(1.9),
    fontWeight: '600',
    color: COLORS.text,
    width: '90%',
  },
  itemsContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: wp(5),
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pdfIcon: {
    marginRight: wp(3),
  },
  itemText: {
    fontSize: hp(1.8),
    color: COLORS.primary,
    flex: 1,
    lineHeight: hp(2.5),
    marginRight: wp(2),
  },
  emptyState: {
    alignItems: 'center',
    marginTop: hp(5),
  },
  emptyText: {
    color: COLORS.gray,
    marginTop: 10,
    fontSize: hp(1.8),
  }
});
