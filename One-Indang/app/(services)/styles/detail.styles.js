import { StyleSheet, Platform, StatusBar } from 'react-native';
import { hp, wp } from '../../../helpers/common';

// --- THEME COLORS ---
const COLORS = {
  primary: '#003087',
  secondary: '#D32F2F',
  lightBlueBg: '#E3F2FD',
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
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: hp(2.2),
    fontWeight: '700',
    color: COLORS.primary, // Brand Blue
    flex: 1,
    textAlign: 'center',
    marginHorizontal: wp(2),
  },
  scrollContent: {
    padding: wp(5),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: wp(5),
    marginBottom: hp(3),
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2.5),
  },
  logoPlaceholder: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(3),
    backgroundColor: COLORS.lightBlueBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(4),
  },
  officeName: {
    flex: 1,
    fontSize: hp(2),
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  contactRow: {
    flexDirection: 'row',
    marginBottom: hp(1.5),
    alignItems: 'flex-start',
  },
  contactText: {
    flex: 1,
    fontSize: hp(1.8),
    color: '#333',
    lineHeight: hp(2.5),
  },
  sectionTitle: {
    fontSize: hp(2.2),
    fontWeight: '700',
    color: COLORS.primary, // Brand Blue
    marginBottom: hp(1.5),
    marginTop: hp(0.5),
  },
  description: {
    fontSize: hp(1.9),
    color: '#444',
    lineHeight: hp(3),
    marginBottom: hp(2),
  },
  bulletList: {
    marginTop: hp(0.5),
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: hp(1),
    alignItems: 'flex-start',
  },
  bulletPoint: {
    fontSize: hp(2.2),
    marginRight: wp(2),
    color: '#333',
    lineHeight: hp(3),
    width: wp(6), 
  },
  bulletText: {
    flex: 1,
    fontSize: hp(1.9),
    color: '#444',
    lineHeight: hp(3),
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: wp(5),
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  applyButton: {
    backgroundColor: COLORS.secondary, // Brand Red
    paddingVertical: hp(2),
    borderRadius: 30,
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: hp(2),
    fontWeight: 'bold',
  },
});
