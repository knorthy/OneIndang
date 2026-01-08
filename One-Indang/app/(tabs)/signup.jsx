import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Importing your helpers
import { hp, wp } from '../../helpers/common'; 

const AccountSetupScreen = () => {
  const insets = useSafeAreaInsets();
  // --- STATE MANAGEMENT ---
  const [currentStep, setCurrentStep] = useState(1); // 1 = Form, 2 = OTP

  // FORM STATE
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  // OTP STATE
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [timerCount, setTimer] = useState(60); // CHANGED: Set to 60 seconds (1 minute)
  const inputRefs = useRef([]); 

  // ERROR STATE
  const [errors, setErrors] = useState({
    phone: false,
    firstName: false,
    lastName: false,
    password: false,
  });

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    format: false,
  });

  const BRAND_RED = '#D32F2F'; 
  const SUCCESS_COLOR = '#388E3C';
  const DISABLED_RED = '#FFB4A9'; 


  useEffect(() => {
    const isLengthValid = password.length >= 8;
    const isFormatValid = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password);
    
    setPasswordCriteria({
      length: isLengthValid,
      format: isFormatValid
    });
  }, [password]);

  // Timer Countdown (Only runs when in Step 2)
  useEffect(() => {
    let interval;
    if (currentStep === 2 && timerCount > 0) {
      interval = setInterval(() => {
        setTimer((lastTimerCount) => lastTimerCount - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep, timerCount]);


  // --- HANDLERS: STEP 1 (FORM) ---

  const handlePhoneChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setPhone(numericValue);
    if(errors.phone) setErrors({...errors, phone: false});
  };

  const handleNameChange = (text, setter, errorField) => {
    const alphabetValue = text.replace(/[^a-zA-Z\s]/g, '');
    setter(alphabetValue);
    if(errors[errorField]) setErrors({...errors, [errorField]: false});
  };

  const validateAndSubmit = () => {
    let valid = true;
    let newErrors = { phone: false, firstName: false, lastName: false, password: false };

    if (!phone || phone.length < 10) { newErrors.phone = true; valid = false; }
    if (!firstName.trim()) { newErrors.firstName = true; valid = false; }
    if (!lastName.trim()) { newErrors.lastName = true; valid = false; }
    if (!passwordCriteria.length || !passwordCriteria.format) { newErrors.password = true; valid = false; }

    setErrors(newErrors);

    if (valid) {
      setCurrentStep(2);
      setTimer(60); // Reset timer when entering step 2
    }
  };

  // --- HANDLERS: STEP 2 (OTP) ---

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  const handleOtpChange = (text, index) => {
    if (/[^0-9]/.test(text)) return;
    const newCode = [...otpCode];
    newCode[index] = text;
    setOtpCode(newCode);
    if (text && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // New Resend Handler
  const handleResendCode = () => {
    setTimer(60); // Reset back to 1 minute
    Alert.alert("Code Resent", "A new verification code has been sent to your number.");
    // Add your actual API resend call here
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1); 
    } else {
      console.log("Go back from screen"); 
    }
  };

  const isFullCode = otpCode.every((digit) => digit !== '');

  // --- RENDER ---
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.mainWrapper}>
            
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="chevron-back" size={hp(3.5)} color="black" />
            </TouchableOpacity>
            
            <View style={styles.progressContainer}>
                <View style={[styles.progressSegment, { backgroundColor: BRAND_RED }]} />
                <View style={[styles.progressSegment, { backgroundColor: currentStep === 2 ? BRAND_RED : '#F0F0F0' }]} />
            </View>
          </View>

          {/* DYNAMIC CONTENT SWITCHING */}
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={styles.keyboardContainer}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
                {/* ---------------- STEP 1: FORM ---------------- */}
                {currentStep === 1 && (
                    <>
                        <Text style={styles.title}>Complete your account setup</Text>
                        <View style={styles.formContainer}>
                            {/* Phone */}
                            <View>
                                <Text style={styles.label}>Enter your phone number</Text>
                                <View style={styles.phoneRow}>
                                <View style={styles.countryCodeContainer}>
                                    <Text style={styles.countryCodeText}>+63</Text>
                                </View>
                                <TextInput
                                    style={[styles.phoneInput, errors.phone && styles.inputError]}
                                    value={phone}
                                    placeholder="Enter mobile number" 
                                    placeholderTextColor="#9CA3AF"
                                    onChangeText={handlePhoneChange}
                                    keyboardType="number-pad"
                                    maxLength={10} 
                                />
                                </View>
                            </View>

                            {/* First Name */}
                            <View>
                                <Text style={styles.label}>First Name</Text>
                                <TextInput
                                    style={[styles.input, errors.firstName && styles.inputError]}
                                    placeholder="Enter your full first name"
                                    placeholderTextColor="#9CA3AF"
                                    value={firstName}
                                    onChangeText={(t) => handleNameChange(t, setFirstName, 'firstName')}
                                />
                            </View>

                            {/* Last Name */}
                            <View>
                                <Text style={styles.label}>Last Name</Text>
                                <TextInput
                                    style={[styles.input, errors.lastName && styles.inputError]}
                                    placeholder="Enter your full last name"
                                    placeholderTextColor="#9CA3AF"
                                    value={lastName}
                                    onChangeText={(t) => handleNameChange(t, setLastName, 'lastName')}
                                />
                            </View>

                            {/* Password */}
                            <View>
                                <Text style={styles.label}>Password</Text>
                                <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Password"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={(t) => {
                                        setPassword(t);
                                        if(errors.password) setErrors({...errors, password: false});
                                    }}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={hp(2.5)} color="black" />
                                </TouchableOpacity>
                                </View>

                                {/* Criteria */}
                                <View style={styles.criteriaContainer}>
                                <View style={styles.criteriaRow}>
                                    <Feather name={passwordCriteria.length ? "check" : "x"} size={hp(1.8)} color={passwordCriteria.length ? SUCCESS_COLOR : BRAND_RED} />
                                    <Text style={[styles.criteriaText, passwordCriteria.length && styles.criteriaTextSuccess]}>At least 8 characters</Text>
                                </View>
                                <View style={styles.criteriaRow}>
                                    <Feather name={passwordCriteria.format ? "check" : "x"} size={hp(1.8)} color={passwordCriteria.format ? SUCCESS_COLOR : BRAND_RED} />
                                    <Text style={[styles.criteriaText, passwordCriteria.format && styles.criteriaTextSuccess]}>Must include letters and numbers</Text>
                                </View>
                                </View>
                            </View>
                        </View>
                    </>
                )}

                {/* ---------------- STEP 2: OTP ---------------- */}
                {currentStep === 2 && (
                    <>
                        <Text style={styles.title}>Input the 6-digit code</Text>
                        <Text style={styles.subtitle}>
                          We sent a 6 digit-code to +63 {phone}.
                        </Text>

                        <View style={styles.otpContainer}>
                          {otpCode.map((digit, index) => (
                            <TextInput
                              key={index}
                              ref={(ref) => (inputRefs.current[index] = ref)}
                              style={[
                                styles.otpBox,
                                { borderColor: digit ? BRAND_RED : '#E5E7EB' }
                              ]}
                              keyboardType="number-pad"
                              maxLength={1}
                              value={digit}
                              onChangeText={(text) => handleOtpChange(text, index)}
                              onKeyPress={(e) => handleOtpKeyPress(e, index)}
                              caretHidden={true}
                            />
                          ))}
                        </View>

                        {/* TIMER LOGIC: SHOW TEXT OR CLICKABLE BUTTON */}
                        <View style={styles.timerContainer}>
                            {timerCount > 0 ? (
                                <Text style={styles.timerText}>
                                    Resend code in {formatTime(timerCount)} seconds
                                </Text>
                            ) : (
                                <TouchableOpacity onPress={handleResendCode}>
                                    <Text style={styles.resendLinkText}>Resend Code</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </>
                )}

            </ScrollView>
          </KeyboardAvoidingView>

          {/* Footer Button */}
          <View style={styles.footerContainer}>
            {currentStep === 1 ? (
                <TouchableOpacity 
                    activeOpacity={0.8}
                    onPress={validateAndSubmit}
                    style={[styles.button, { backgroundColor: BRAND_RED }]}
                >
                    <Text style={styles.buttonText}>Verify Account</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity 
                    activeOpacity={0.8}
                    disabled={!isFullCode}
                    onPress={() => Alert.alert("Success", "Account Created!")}
                    style={[
                        styles.button, 
                        { backgroundColor: isFullCode ? BRAND_RED : DISABLED_RED }
                    ]}
                >
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
            )}
          </View>

        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  mainWrapper: {
    flex: 1,
    position: 'relative',
  },

  // Header & Progress
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

  // Main Scroll Area
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp(10), 
    paddingBottom: hp(15), 
  },
  
  // Text Styles
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

  // Form Styles
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

  // Password Criteria
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

  // --- OTP Specific Styles ---
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
  
  // Timer & Resend Styles (UPDATED)
  timerContainer: {
    marginBottom: hp(5),
  },
  timerText: {
    fontSize: hp(1.8),
    color: '#111',
  },
  resendLinkText: {
    fontSize: hp(1.9),
    color: '#D32F2F', // Brand Red
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  // Footer Button
  footerContainer: {
    position: 'absolute',
    bottom: hp(4),
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
});

export default AccountSetupScreen;