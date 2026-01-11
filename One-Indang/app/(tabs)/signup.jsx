import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router'; 
import { hp, wp } from '../../helpers/common'; 
import { styles, BRAND_RED, SUCCESS_COLOR, DISABLED_RED } from '../../styles/signupStyles';
import { showToast } from '../../components/Toast';
import { auth } from '../../services/supabase';

const AccountSetupScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter(); 
  
  // CAPTURE PARAMS (to pass to login if needed)
  const params = useLocalSearchParams();

  const [currentStep, setCurrentStep] = useState(1); 

  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // OTP STATE
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [timerCount, setTimer] = useState(60); 
  const inputRefs = useRef([]); 

  // ERROR STATE
  const [errors, setErrors] = useState({
    phone: false,
    email: false,
    fullName: false,
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

  const handleNameChange = (text) => {
    const alphabetValue = text.replace(/[^a-zA-Z\s]/g, '');
    setFullName(alphabetValue);
    if(errors.fullName) setErrors({...errors, fullName: false});
  };

  const validateAndSubmit = async () => {
    let valid = true;
    let newErrors = { phone: false, email: false, fullName: false, password: false };
    let firstErrorMessage = ''; 

    if (!phone || phone.length < 10) { 
        newErrors.phone = true; 
        valid = false; 
        if (!firstErrorMessage) firstErrorMessage = "Please enter a valid 10-digit phone number.";
    }
    
    if (!fullName.trim()) { 
        newErrors.fullName = true; 
        valid = false; 
        if (!firstErrorMessage) firstErrorMessage = "Please enter your full name.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) { 
        newErrors.email = true; 
        valid = false; 
        if (!firstErrorMessage) firstErrorMessage = "Please enter a valid email address.";
    }
    
    const isPassLengthValid = password.length >= 8;
    const isPassFormatValid = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password);

    if (!isPassLengthValid || !isPassFormatValid) { 
      newErrors.password = true; 
      valid = false; 
      if (!firstErrorMessage) firstErrorMessage = "Password must be at least 8 characters with letters & numbers.";
    }

    setErrors(newErrors);

    if (!valid) {
      showToast(firstErrorMessage || "Please fix the highlighted errors.");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await auth.signUp(email, password, {
        full_name: fullName,
        phone: `+63${phone}`
      });

      if (error) {
        console.log('Signup error:', error);
        if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('unique constraint')) {
            showToast('This email or phone number is already registered. Please login.');
        } else {
            showToast(error.message || 'Failed to create account');
        }
        return;
      }

      if (data.user) {
        if (!data.user.email_confirmed_at) {
          showToast('Please check your email for the verification code');
          setCurrentStep(2);
        } else {
          showToast('Account created successfully!');
          // Pass Params to Login
          router.replace({ pathname: '/login', params: params }); 
        }
      } else {
        showToast('Account creation failed - no user data');
      }
    } catch (error) {
      console.log('Signup exception:', error);
      showToast('An unexpected error occurred. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    const token = otpCode.join(''); 

    try {
      const { data, error } = await auth.verifyOtp({
        email: email,
        token: token,
        type: 'signup'
      });

      if (error) {
        showToast(error.message || "Invalid verification code");
        setIsLoading(false);
        return;
      }

      if (data.session) {
        showToast("Account Verified! Please log in.");
        await auth.signOut(); 
        // Pass Params to Login
        router.replace({ pathname: '/login', params: params }); 
      }
    } catch (error) {
      console.log("Verification error:", error);
      showToast("An error occurred during verification");
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  const handleInputFocus = (index) => {
    const firstEmptyIndex = otpCode.findIndex((digit) => digit === '');
    if (firstEmptyIndex !== -1 && index > firstEmptyIndex) {
        inputRefs.current[firstEmptyIndex]?.focus();
    }
  };

  const handleOtpChange = (text, index) => {
    if (/[^0-9]/.test(text)) return;

    setOtpCode((prev) => {
      const newCode = [...prev];
      newCode[index] = text;
      return newCode;
    });

    if (text && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
        if (!otpCode[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    }
  };

  const handleResendCode = async () => {
    try {
      const { error } = await auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      setTimer(60);
      showToast("Verification code resent successfully.");
    } catch (error) {
      showToast(error.message || "Failed to resend code");
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1); 
    } else {
      router.back(); 
    }
  };

  const isFullCode = otpCode.every((digit) => digit !== '');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.mainWrapper}>
            
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="chevron-back" size={hp(3.5)} color="black" />
            </TouchableOpacity>
            
            <View style={styles.progressContainer}>
                <View style={[styles.progressSegment, { backgroundColor: BRAND_RED }]} />
                <View style={[styles.progressSegment, { backgroundColor: currentStep === 2 ? BRAND_RED : '#F0F0F0' }]} />
            </View>
          </View>

          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={{ flex: 1 }} 
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <ScrollView 
              contentContainerStyle={[styles.scrollContent, { flexGrow: 1, paddingBottom: 150 }]} 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
                {/* STEP ONE*/}
                {currentStep === 1 && (
                    <>
                        <Text style={styles.title}>Complete your account setup</Text>
                        <View style={styles.formContainer}>
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

                            <View>
                                <Text style={styles.label}>Full Name</Text>
                                <TextInput
                                    style={[styles.input, errors.fullName && styles.inputError]}
                                    placeholder="Enter your full name"
                                    placeholderTextColor="#9CA3AF"
                                    value={fullName}
                                    onChangeText={handleNameChange}
                                />
                            </View>

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

                {/* STEP TWO */}
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
                              selectTextOnFocus={true} 
                              onFocus={() => handleInputFocus(index)}
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

                {/* FOOTER */}
                <View style={[styles.footerContainer, { marginTop: 40 }]}>
                    {currentStep === 1 ? (
                        <TouchableOpacity 
                            activeOpacity={0.8}
                            onPress={validateAndSubmit}
                            disabled={isLoading}
                            style={[styles.button, { backgroundColor: isLoading ? DISABLED_RED : BRAND_RED }]}
                        >
                            <Text style={styles.buttonText}>
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity 
                            activeOpacity={0.8}
                            disabled={!isFullCode || isLoading}
                            onPress={handleVerifyOtp} 
                            style={[
                                styles.button, 
                                { backgroundColor: isFullCode ? BRAND_RED : DISABLED_RED }
                            ]}
                        >
                            <Text style={styles.buttonText}>
                                {isLoading ? 'Verifying...' : 'Continue'} 
                            </Text>
                        </TouchableOpacity>
                    )}

                    {currentStep === 1 && (
                        <View style={styles.signinContainer}>
                            <Text style={styles.signinText}>Already have an account? </Text>
                            {/* FIX: Push to login with PARAMS */}
                            <TouchableOpacity onPress={() => router.push({ pathname: '/login', params: params })}>
                                <Text style={styles.signinLinkText}>Signin</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

            </ScrollView>
          </KeyboardAvoidingView>

        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default AccountSetupScreen;