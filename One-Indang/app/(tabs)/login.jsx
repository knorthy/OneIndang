import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Using Expo icons
import { hp, wp } from "../../helpers/common";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.mainWrapper}>
            
          {/* Header / Back Button */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={hp(3.5)} color="black" />
            </TouchableOpacity>
            
          </View>

          {/* Title Section */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Enter  you account credentials to login.</Text>
          </View>

          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={styles.keyboardContainer}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Form Section */}
              <View style={styles.formContainer}>
                
                {/* Email Input (Replaced Phone Number) */}
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

                {/* Remember Me & Forgot Password Row */}
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
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Bottom Button */}
          <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.continueButton}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>

        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

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