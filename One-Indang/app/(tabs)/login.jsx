import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { hp, wp } from "../../helpers/common";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../../styles/loginStyles';
import { auth } from '../../services/supabase';
import { showToast } from '../../components/Toast';
import { useRouter, useLocalSearchParams } from 'expo-router'; 

export default function LoginScreen() {
  const router = useRouter(); 
  const insets = useSafeAreaInsets();
  
  // CAPTURE PARAMS (Redirect info)
  const params = useLocalSearchParams();
  const { redirect, name, image } = params;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      showToast('Please enter your email address.');
      return;
    }
    if (!password) {
      showToast('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await auth.signIn(email, password);

      if (error) {
        console.log('Login error:', error.message);
        
        if (error.message.toLowerCase().includes('invalid login credentials')) {
            showToast('Incorrect email or password. Please try again.');
        } else if (error.message.toLowerCase().includes('email not confirmed')) {
            showToast('Your email is not verified. Please check your inbox.');
        } else {
            showToast(error.message || 'Login failed. Please try again.');
        }
        return;
      }

      if (data?.user || data?.session) {
        showToast('Login successful!');
        
        // --- LOGIC: Redirect to Order Page OR Home ---
        if (redirect) {
            router.replace({ 
                pathname: redirect, 
                params: { name, image } 
            });
        } else {
            router.replace({ 
                pathname: '/main', 
                params: { isUserLoggedIn: 'true' } 
            });
        }
      }
    } catch (error) {
      console.log('Unexpected Login error:', error);
      showToast('Network error. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.mainWrapper}>
            
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={hp(3.5)} color="black" />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Enter your account credentials to login.</Text>
          </View>

          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : undefined} 
            style={{ flex: 1 }} 
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <ScrollView 
              contentContainerStyle={[
                styles.scrollContent, 
                { flexGrow: 1, paddingBottom: 50 } 
              ]} 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.formContainer}>
                
                {/* Email Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Enter your email</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="example@email.com"
                      placeholderTextColor="#9CA3AF"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#9CA3AF"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity 
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Ionicons 
                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                        size={hp(2.5)} 
                        color="black" 
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Options Row */}
                <View style={styles.optionsRow}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer} 
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                      {rememberMe && <Ionicons name="checkmark" size={hp(1.8)} color="#FFF" />}
                    </View>
                    <Text style={styles.rememberText}>Remember me</Text>
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[
                  styles.footerContainer, 
                  { 
                    marginTop: 40,      
                    marginBottom: 20,   
                    position: 'relative', 
                    bottom: 'auto'
                  }
              ]}>
                <TouchableOpacity 
                  style={[styles.continueButton, isLoading && { opacity: 0.6 }]} 
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <Text style={styles.continueButtonText}>
                    {isLoading ? 'Signing In...' : 'Continue'}
                  </Text>
                </TouchableOpacity>
              </View>

            </ScrollView>
          </KeyboardAvoidingView>

        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}