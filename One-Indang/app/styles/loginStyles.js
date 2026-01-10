import { StyleSheet } from 'react-native';
import { hp, wp } from '../../helpers/common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  mainWrapper: {
    flex: 1,
    position: 'relative',
  },

  header: {
    marginTop: hp(3), 
    marginBottom: hp(1),
    paddingHorizontal: wp(10),
  },
  backButton: {
    marginBottom: hp(2),
    alignSelf: 'flex-start',
  },
  titleContainer: {
    paddingHorizontal: wp(10),
    marginBottom: hp(3),
    marginTop: hp(2),
  },
  title: {
    fontSize: hp(4), 
    fontWeight: '800',
    color: '#003087',
    marginBottom: hp(1),
  },
  subtitle: {
    fontSize: hp(1.7),
    color: '#333',
  },

  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp(10), 
    paddingBottom: hp(15), 
  },
  
  formContainer: {
    gap: hp(3),
  },

  label: {
    fontSize: hp(1.8),
    fontWeight: '600',
    color: '#111',
    marginBottom: hp(0.8),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: hp(5.8),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: wp(4),
    backgroundColor: '#F9FAFB',
  },
  input: {
    flex: 1,
    fontSize: hp(1.9),
    color: '#111',
    height: '100%',
  },
  eyeIcon: {
    padding: wp(1),
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(1),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: hp(2.5),
    height: hp(2.5),
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 6,
    marginRight: wp(2.5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  checkboxChecked: {
    backgroundColor: '#D32F2F',
    borderColor: '#D32F2F',
  },
  rememberText: {
    fontSize: hp(1.7),
    color: '#333',
  },
  forgotText: {
    fontSize: hp(1.7),
    color: '#D32F2F',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  footerContainer: {
    position: 'absolute',
    bottom: hp(1),
    left: 0,
    right: 0,
    paddingHorizontal: wp(10),
    backgroundColor: 'transparent',
  },
  continueButton: {
    backgroundColor: '#D32F2F',
    height: hp(6),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: hp(2),
    fontWeight: '700',
  },
});

export default styles;
