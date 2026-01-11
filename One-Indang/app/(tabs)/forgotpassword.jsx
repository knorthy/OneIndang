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
import styles from '../../styles/forgotPasswordStyles';
import { auth } from '../../services/supabase';
import { showToast } from '../../components/Toast';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const router = useRouter(); 
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async () => {
    // Validation
    if (!email.trim()) {
      showToast('Please enter your email address.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await auth.resetPassword(email);

      if (error) {
        console.log('Password reset error:', error.message);
        
        if (error.message.toLowerCase().includes('rate limit')) {
          showToast('Too many requests. Please try again later.');
        } else {
          showToast(error.message || 'Failed to send reset email. Please try again.');
        }
        return;
      }

      setEmailSent(true);
      showToast('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.log('Unexpected password reset error:', error);
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
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              {emailSent 
                ? "We've sent a password reset link to your email." 
                : "Enter your email address and we'll send you a link to reset your password."}
            </Text>
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
              {emailSent ? (
                // Success State
                <View style={styles.successContainer}>
                  <View style={styles.successIconContainer}>
                    <Ionicons name="mail-outline" size={hp(8)} color="#D32F2F" />
                  </View>
                  <Text style={styles.successTitle}>Check your email</Text>
                  <Text style={styles.successText}>
                    We sent a password reset link to{'\n'}
                    <Text style={styles.emailHighlight}>{email}</Text>
                  </Text>
                  <Text style={styles.successSubtext}>
                    Click the link in the email to reset your password. If you don't see it, check your spam folder.
                  </Text>
                </View>
              ) : (
                // Email Input Form
                <View style={styles.formContainer}>
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
                      <Ionicons name="mail-outline" size={hp(2.5)} color="#9CA3AF" />
                    </View>
                  </View>

                  {/* Info */}
                  <View style={styles.infoContainer}>
                    <Ionicons name="information-circle-outline" size={hp(2)} color="#6B7280" />
                    <Text style={styles.infoText}>
                      Enter the email address associated with your account.
                    </Text>
                  </View>
                </View>
              )}

              <View style={[
                  styles.footerContainer, 
                  { 
                    marginTop: 40,      
                    marginBottom: 20,   
                    position: 'relative', 
                    bottom: 'auto'
                  }
              ]}>
                {emailSent ? (
                  <>
                    <TouchableOpacity 
                      style={styles.continueButton} 
                      onPress={() => router.replace('/login')}
                    >
                      <Text style={styles.continueButtonText}>Back to Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.backToLoginButton}
                      onPress={() => {
                        setEmailSent(false);
                        setEmail('');
                      }}
                    >
                      <Text style={styles.backToLoginText}>Try a different email</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity 
                      style={[styles.continueButton, isLoading && { opacity: 0.6 }]} 
                      onPress={handleResetPassword}
                      disabled={isLoading}
                    >
                      <Text style={styles.continueButtonText}>
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.backToLoginButton}
                      onPress={() => router.replace('/login')}
                    >
                      <Text style={styles.backToLoginText}>Back to Login</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>

            </ScrollView>
          </KeyboardAvoidingView>

        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

