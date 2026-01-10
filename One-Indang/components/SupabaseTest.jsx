import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { supabase } from '../services/supabase';

export default function SupabaseTest() {
  const [result, setResult] = useState('');

  const testConnection = async () => {
    try {
      setResult('Testing connection...');

      // Test basic connection
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setResult(`Connection error: ${error.message}`);
        return;
      }

      setResult('✅ Supabase connection successful!');

      // Test signup
      setResult('Testing signup...');
      const testEmail = `test${Date.now()}@example.com`;
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: testEmail,
        password: 'testpassword123',
        options: {
          data: { full_name: 'Test User', phone: '+631234567890' }
        }
      });

      if (signupError) {
        setResult(`Signup error: ${signupError.message}`);
      } else {
        setResult(`✅ Signup successful! User ID: ${signupData.user?.id}\nEmail confirmed: ${signupData.user?.email_confirmed_at ? 'Yes' : 'No'}`);
      }

    } catch (error) {
      setResult(`Exception: ${error.message}`);
    }
  };

  return (
    <View style={{ padding: 20, marginTop: 50 }}>
      <TouchableOpacity
        onPress={testConnection}
        style={{ backgroundColor: 'blue', padding: 15, borderRadius: 5, marginBottom: 20 }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Test Supabase Connection</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 12, fontFamily: 'monospace' }}>{result}</Text>
    </View>
  );
}