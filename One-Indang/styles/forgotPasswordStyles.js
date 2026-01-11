import { StyleSheet } from 'react-native';
import { hp, wp } from '../helpers/common';

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
    lineHeight: hp(2.5),
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

  inputGroup: {
    marginBottom: hp(0.5),
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

  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: hp(1.5),
    borderRadius: 10,
    gap: wp(2),
  },
  infoText: {
    fontSize: hp(1.5),
    color: '#6B7280',
    flex: 1,
  },

  // Success State Styles
  successContainer: {
    alignItems: 'center',
    paddingVertical: hp(4),
  },
  successIconContainer: {
    width: hp(15),
    height: hp(15),
    borderRadius: hp(7.5),
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(3),
  },
  successTitle: {
    fontSize: hp(2.5),
    fontWeight: '700',
    color: '#111',
    marginBottom: hp(1.5),
  },
  successText: {
    fontSize: hp(1.8),
    color: '#333',
    textAlign: 'center',
    lineHeight: hp(2.8),
    marginBottom: hp(2),
  },
  emailHighlight: {
    fontWeight: '700',
    color: '#D32F2F',
  },
  successSubtext: {
    fontSize: hp(1.5),
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: hp(2.2),
    paddingHorizontal: wp(5),
  },

  footerContainer: {
    position: 'absolute',
    bottom: hp(9),
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
  backToLoginButton: {
    marginTop: hp(2),
    alignItems: 'center',
  },
  backToLoginText: {
    fontSize: hp(1.7),
    color: '#003087',
    fontWeight: '600',
  },
});

export default styles;
