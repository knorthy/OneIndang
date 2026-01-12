import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../services/supabase'; 
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking'; 

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Waiting for link...');
  
  // This Ref prevents the code from running twice
  const isProcessing = useRef(false);

  useEffect(() => {
    const handleUrl = async (url) => {
      // 1. If we already processed a link, STOP.
      if (!url || isProcessing.current) return;
      isProcessing.current = true; 

      console.log("Processing URL:", url);
      setStatus("Verifying link...");

      try {
        // 2. Parse the URL manually to find the code
        const codeMatch = url.match(/[?&]code=([^&#]+)/);
        const accessMatch = url.match(/[?&#]access_token=([^&#]+)/);
        const refreshMatch = url.match(/[?&#]refresh_token=([^&#]+)/);

        if (codeMatch && codeMatch[1]) {
          const code = codeMatch[1];
          
          // Exchange code for session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
             // --- THE FIX IS HERE ---
             // If error, check if we are ALREADY logged in from the previous milliseconds
             const sessionCheck = await supabase.auth.getSession();
             if (sessionCheck.data.session) {
                 setStatus("Verified! Set new password.");
                 return; // Ignore the error, we are logged in!
             }
             throw error;
          }
          
          setStatus("Verified! Set new password.");
          Alert.alert("Success", "Link verified. Please create your new password.");
        } 
        else if (accessMatch && refreshMatch) {
          // Handle Implicit Flow
          const { error } = await supabase.auth.setSession({
            access_token: accessMatch[1],
            refresh_token: refreshMatch[1],
          });
          
          if (error) throw error;

          setStatus("Verified! Set new password.");
          Alert.alert("Success", "Link verified. Please create your new password.");
        } else {
           // Fallback: Just check if session is active anyway
           const { data } = await supabase.auth.getSession();
           if (data.session) {
             setStatus("Session active. Set password.");
           } else {
             setStatus("Ready. Waiting for link...");
             isProcessing.current = false; // Reset lock to allow retry if user clicks again
           }
        }
      } catch (e) {
        // Final fallback: Check session one last time before showing error
        const finalCheck = await supabase.auth.getSession();
        if (finalCheck.data.session) {
            setStatus("Verified! Set new password.");
        } else {
            setStatus("Error: " + (e.message || "Invalid Link"));
            Alert.alert("Link Error", e.message || "The link could not be verified.");
            isProcessing.current = false; 
        }
      }
    };

    // Check initial URL
    Linking.getInitialURL().then(url => {
        if (url) handleUrl(url);
    });

    // Listen for incoming URLs
    const subscription = Linking.addEventListener('url', ({ url }) => {
        handleUrl(url);
    });

    return () => {
        subscription.remove();
    };
  }, []);

  const handleUpdatePassword = async () => {
    if (!password || password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      // 3. Ensure we have a session before updating
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
         Alert.alert('Session Missing', 'The app lost the connection. Please click the email link again.');
         return;
      }

      const { error } = await supabase.auth.updateUser({ password: password });

      if (error) throw error;

      Alert.alert('Success', 'Your password has been updated!', [
        { text: 'Login Now', onPress: () => router.replace('/(tabs)/login') }
      ]);
    } catch (error) {
      Alert.alert('Update Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
            <Ionicons name="lock-closed-outline" size={80} color="#003087" />
        </View>
        
        <Text style={styles.title}>Set New Password</Text>
        
        {/* Status Indicator */}
        <Text style={[
            styles.statusText, 
            status.includes('Error') ? {color: 'red', backgroundColor: '#FFEBEE'} : 
            status.includes('Verified') || status.includes('active') ? {color: 'green', backgroundColor: '#E8F5E9'} : {}
        ]}>
            {status}
        </Text>

        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#999"
            />
        </View>

        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor="#999"
            />
        </View>

        <TouchableOpacity 
            style={[styles.button, !status.includes('Verified') && !status.includes('active') && { opacity: 0.5 }]} 
            onPress={handleUpdatePassword} 
            disabled={loading}
        >
            <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Update Password'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  content: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  iconContainer: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#003087', marginBottom: 10, textAlign: 'center' },
  statusText: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center', backgroundColor: '#F3F4F6', padding: 8, borderRadius: 8, overflow: 'hidden' },
  inputContainer: { marginBottom: 15 },
  input: { height: 50, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 15, fontSize: 16, backgroundColor: '#F9FAFB', color: '#333' },
  button: { backgroundColor: '#D32F2F', height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: "#D32F2F", shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 5, elevation: 4 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});