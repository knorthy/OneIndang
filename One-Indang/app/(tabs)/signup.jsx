import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
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
import { Link } from 'expo-router';
import { hp, wp } from '../../helpers/common'; 
import { styles, BRAND_RED, SUCCESS_COLOR, DISABLED_RED } from '../styles/signupStyles';

const AccountSetupScreen = () => {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1); 

 
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  // OTP STATE
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [timerCount, setTimer] = useState(60); 
  const inputRefs = useRef([]); 

  // ERROR STATE
  const [errors, setErrors] = useState({
    phone: false,
    email: false,
    firstName: false,
    lastName: false,
    password: false,
  });

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    format: false,
  });


  useEffect(() => {
    const isLengthValid = password.length >= 8;
    const isFormatValid = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password);
    
    setPasswordCriteria({
      length: isLengthValid,
      format: isFormatValid
    });
  }, [password]);


  useEffect(() => {
    let interval;
    if (currentStep === 2 && timerCount > 0) {
      interval = setInterval(() => {
        setTimer((lastTimerCount) => lastTimerCount - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep, timerCount]);



  const handlePhoneChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setPhone(numericValue);
    if(errors.phone) setErrors({...errors, phone: false});
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if(errors.email) setErrors({...errors, email: false});
  };

  const handleNameChange = (text, setter, errorField) => {
    const alphabetValue = text.replace(/[^a-zA-Z\s]/g, '');
    setter(alphabetValue);
    if(errors[errorField]) setErrors({...errors, [errorField]: false});
  };

  const validateAndSubmit = () => {
    let valid = true;
    let newErrors = { phone: false, email: false, firstName: false, lastName: false, password: false };

    if (!phone || phone.length < 10) { newErrors.phone = true; valid = false; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) { newErrors.email = true; valid = false; }
    if (!firstName.trim()) { newErrors.firstName = true; valid = false; }
    if (!lastName.trim()) { newErrors.lastName = true; valid = false; }
    if (!passwordCriteria.length || !passwordCriteria.format) { newErrors.password = true; valid = false; }

    setErrors(newErrors);

    if (valid) {
      setCurrentStep(2);
      setTimer(60);
    }
  };



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


  const handleResendCode = () => {
    setTimer(60);
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
                                <Text style={styles.label}>Full Name</Text>
                                <TextInput
                                    style={[styles.input, errors.firstName && styles.inputError]}
                                    placeholder="Enter your full name"
                                    placeholderTextColor="#9CA3AF"
                                    value={firstName}
                                    onChangeText={(t) => handleNameChange(t, setFirstName, 'firstName')}
                                />
                            </View>
                            {/* Email */}
                            <View>
                                <Text style={styles.label}>Enter your email</Text>
                                <TextInput
                                    style={[styles.input, errors.email && styles.inputError]}
                                    value={email}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#9CA3AF"
                                    onChangeText={handleEmailChange}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
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
                          We sent a 6 digit-code to {email}.
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
            <View style={styles.signinContainer}>
              <Text style={styles.signinText}>Already have an account? </Text>
              <Link href="/login">
                <Text style={styles.signinLinkText}>Signin</Text>
              </Link>
            </View>
          </View>

        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default AccountSetupScreen;