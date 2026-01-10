import { StyleSheet } from 'react-native';
import { hp, wp } from '../../helpers/common';

const BRAND_RED = '#D32F2F'; 
const SUCCESS_COLOR = '#388E3C';
const DISABLED_RED = '#FFB4A9'; 

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
  progressContainer: {
    flexDirection: 'row',
    height: hp(0.6),
    width: '100%',
  },
  progressSegment: {
    flex: 1,
    borderRadius: 5,
    marginRight: wp(2),
  },

  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp(10), 
    paddingBottom: hp(15), 
  },
  
  title: {
    fontSize: hp(3), 
    fontWeight: '800',
    color: '#003087',
    marginBottom: hp(3), 
    marginTop: hp(2),   
  },
  subtitle: {
    fontSize: hp(1.9),
    color: '#333',
    lineHeight: hp(3),
    marginBottom: hp(4),
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
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeContainer: {
    width: wp(17),
    height: hp(5.8),
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  countryCodeText: {
    fontSize: hp(2),
    color: '#111',
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    height: hp(5.8),
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: wp(4),
    fontSize: hp(2),
    color: '#111',
  },
  input: {
    width: '100%',
    height: hp(5.8),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: wp(4),
    fontSize: hp(1.9),
    color: '#111',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: hp(5.8),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: wp(4),
  },
  passwordInput: {
    flex: 1,
    fontSize: hp(1.9),
    color: '#111',
    height: '100%',
  },
  eyeIcon: {
    padding: wp(1),
  },
  inputError: {
    borderColor: '#FF4D32',
    borderWidth: 1.5,
  },

  criteriaContainer: {
    marginTop: hp(1),
  },
  criteriaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(0.3),
  },
  criteriaText: {
    marginLeft: wp(2),
    fontSize: hp(1.6),
    color: '#555',
  },
  criteriaTextSuccess: {
    color: '#388E3C',
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(3),
  },
  otpBox: {
    width: wp(11),
    height: wp(11), 
    borderRadius: 12,
    borderWidth: 1.5,
    textAlign: 'center',
    textAlignVertical: 'center', 
    padding: 0, 
    fontSize: hp(3),
    fontWeight: '600',
    color: '#111',
    backgroundColor: '#fff',
  },
  
  timerContainer: {
    marginBottom: hp(5),
  },
  timerText: {
    fontSize: hp(1.8),
    color: '#111',
  },
  resendLinkText: {
    fontSize: hp(1.9),
    color: '#D32F2F',
    fontWeight: '700',
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
  button: {
    width: '100%',
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
  buttonText: {
    color: '#fff',
    fontSize: hp(2),
    fontWeight: '700',
  },
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(2),
  },
  signinText: {
    color: '#111',
    fontSize: hp(1.8),
  },
  signinLinkText: {
    color: '#D32F2F',
    fontSize: hp(1.8),
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export { styles, BRAND_RED, SUCCESS_COLOR, DISABLED_RED };
