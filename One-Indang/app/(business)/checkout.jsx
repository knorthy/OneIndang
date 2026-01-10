import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform, KeyboardAvoidingView, Keyboard, Modal, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router'; 
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

import { hp, wp } from '../../helpers/common';
import { useCart } from '../../context/CartContext'; 

const BRAND_RED = '#D32F2F';

// Default Map Region (Indang, Cavite)
const INITIAL_REGION = {
  latitude: 14.1953,
  longitude: 120.8770,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function CheckoutScreen() {
  const router = useRouter();
  
  // 1. Context Data
  const { cartTotal, clearCart, placeOrder, cartItems } = useCart();
  const restaurantName = cartItems.length > 0 ? cartItems[0].restaurant : "Restaurant";

  // Calculations
  const DELIVERY_FEE = 59.00;
  const SERVICE_FEE = 5.00;
  const totalAmount = (parseFloat(cartTotal || 0) + DELIVERY_FEE + SERVICE_FEE).toFixed(2);

  // Form State
  const [address, setAddress] = useState("Poblacion 1, Indang, Cavite");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  // --- MAP STATE ---
  const [modalVisible, setModalVisible] = useState(false);
  const [mapRegion, setMapRegion] = useState(INITIAL_REGION);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // --- MAP FUNCTIONS ---
  
  const handleOpenMap = async () => {
    // Optional: Request permission to start map at user's current location
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      let location = await Location.getCurrentPositionAsync({});
      setMapRegion({
        ...INITIAL_REGION,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
    setModalVisible(true);
  };

  const onRegionChangeComplete = (region) => {
    setMapRegion(region);
  };

  const confirmLocation = async () => {
    setIsGeocoding(true);
    try {
      // Reverse Geocode: Convert Coords -> Address String
      let addressResponse = await Location.reverseGeocodeAsync({
        latitude: mapRegion.latitude,
        longitude: mapRegion.longitude
      });

      if (addressResponse.length > 0) {
        const addr = addressResponse[0];
        // Construct a readable address
        const street = addr.street || addr.name || '';
        const city = addr.city || addr.subregion || '';
        const region = addr.region || '';
        const formattedAddress = `${street}, ${city}, ${region}`.replace(/^, /, '');
        
        setAddress(formattedAddress || `${mapRegion.latitude.toFixed(5)}, ${mapRegion.longitude.toFixed(5)}`);
      }
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Could not fetch address details. Using coordinates.");
      setAddress(`${mapRegion.latitude.toFixed(5)}, ${mapRegion.longitude.toFixed(5)}`);
      setModalVisible(false);
    } finally {
      setIsGeocoding(false);
    }
  };

  // --- ORDER FUNCTIONS ---

  const handlePlaceOrder = () => {
    if (!address.trim()) {
      Alert.alert("Missing Address", "Please enter a delivery address.");
      return;
    }

    Alert.alert(
      "Order Placed Successfully!",
      `Your order from ${restaurantName} is being prepared.\n\nTotal: ₱${totalAmount}\nPayment: ${paymentMethod}`,
      [
        { 
          text: "OK", 
          onPress: () => {
             placeOrder({
                restaurantName,
                total: totalAmount,
                address,
                paymentMethod
             });

             if (router.canDismiss()) {
               router.dismiss(2); 
             }
             router.push('/(business)/orders');
          }
        }
      ]
    );
  };

  const handleSelectPayment = (method) => {
    if (method === 'GCash' || method === 'Card') {
        Alert.alert("Unavailable", "This payment method is currently unavailable. Please use Cash on Delivery.");
        return;
    }
    setPaymentMethod(method);
  };

  const PaymentOption = ({ method, icon, label }) => {
    const isUnavailable = method !== 'Cash';
    return (
        <TouchableOpacity 
          style={[
            styles.paymentOption, 
            paymentMethod === method && styles.activePaymentOption,
            isUnavailable && styles.unavailableOption
          ]} 
          onPress={() => handleSelectPayment(method)}
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons 
                name={icon} 
                size={24} 
                color={paymentMethod === method ? BRAND_RED : (isUnavailable ? "#999" : "#555")} 
            />
            <View>
                <Text style={[
                    styles.paymentText, 
                    paymentMethod === method && styles.activePaymentText,
                    isUnavailable && { color: '#999' }
                ]}>
                    {label}
                </Text>
                {isUnavailable && <Text style={styles.unavailableText}>Currently Unavailable</Text>}
            </View>
          </View>
          <View style={[styles.radioCircle, paymentMethod === method && styles.activeRadioCircle]}>
            {paymentMethod === method && <View style={styles.radioDot} />}
          </View>
        </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* --- MAP MODAL --- */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.mapContainer}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={INITIAL_REGION}
                region={mapRegion}
                onRegionChangeComplete={onRegionChangeComplete}
            />
            
            {/* Fixed Center Marker */}
            <View style={styles.markerFixed}>
                <Ionicons name="location" size={48} color={BRAND_RED} style={{ marginBottom: 24 }} />
            </View>

            {/* Map Header */}
            <View style={styles.mapHeader}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeMapBtn}>
                    <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.mapTitle}>Pin Location</Text>
            </View>

            {/* Map Footer */}
            <View style={styles.mapFooter}>
                <Text style={styles.mapInstruction}>Drag map to pin your exact location</Text>
                <TouchableOpacity style={styles.confirmLocationBtn} onPress={confirmLocation} disabled={isGeocoding}>
                    {isGeocoding ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.confirmLocationText}>Confirm Location</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined} 
        style={{ flex: 1 }}
      >
        <View style={styles.flexContainer}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Checkout</Text>
          </View>

          {/* Content */}
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            
            {/* Address */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                 <Text style={styles.sectionTitle}>Delivery Address</Text>
                 <TouchableOpacity onPress={handleOpenMap}>
                    <Text style={styles.mapLinkText}>Set on Map</Text>
                 </TouchableOpacity>
              </View>

              <View style={styles.addressBox}>
                <View style={styles.mapPreview}>
                  <Ionicons name="location" size={28} color="#D32F2F" />
                </View>
                <View style={styles.addressInputContainer}>
                  <Text style={styles.addressLabel}>Street / Area</Text>
                  <TextInput 
                    style={styles.addressInput}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Enter delivery address"
                    returnKeyType="done"
                    blurOnSubmit={true}
                    onSubmitEditing={Keyboard.dismiss} 
                    multiline={true} 
                  />
                </View>
              </View>

              <View style={styles.noteContainer}>
                <Ionicons name="create-outline" size={20} color="#666" style={{marginRight: 8}} />
                <TextInput 
                  style={styles.noteInput}
                  value={note}
                  onChangeText={setNote}
                  placeholder="Add a note (e.g. Red gate)"
                  returnKeyType="done"
                  blurOnSubmit={true}
                />
              </View>
            </View>

            {/* Payment */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              <PaymentOption method="Cash" icon="cash" label="Cash on Delivery" />
              <PaymentOption method="GCash" icon="wallet" label="GCash" />
              <PaymentOption method="Card" icon="credit-card" label="Credit/Debit Card" />
            </View>

            {/* Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Amount</Text>
                <Text style={styles.summaryTotal}>₱ {totalAmount}</Text>
              </View>
            </View>

          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerTextContainer}>
              <Text style={styles.footerTotalLabel}>Total to Pay</Text>
              <Text style={styles.footerTotalValue}>₱ {totalAmount}</Text>
            </View>
            <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder}>
              <Text style={styles.placeOrderText}>Place Order</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  flexContainer: { flex: 1, flexDirection: 'column' },

  header: { flexDirection: 'row', alignItems: 'center', padding: wp(5), backgroundColor: '#FFF', elevation: 2 },
  backBtn: { marginRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  
  scrollContent: { padding: wp(5) },
  
  section: { marginBottom: 25 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  mapLinkText: { color: BRAND_RED, fontWeight: 'bold', fontSize: 14 },

  addressBox: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12, padding: 15, elevation: 2, alignItems: 'center' },
  mapPreview: { width: 45, height: 45, borderRadius: 25, backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  addressInputContainer: { flex: 1 },
  addressLabel: { fontSize: 12, color: '#888', marginBottom: 2 },
  addressInput: { fontSize: 15, color: '#333', fontWeight: '500', padding: 0, maxHeight: 60 },
  
  noteContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 12, backgroundColor: '#FFF', padding: 12, borderRadius: 12, elevation: 1 },
  noteInput: { flex: 1, fontSize: 14, color: '#333', padding: 0 },

  paymentOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10, elevation: 1, borderWidth: 1, borderColor: 'transparent' },
  activePaymentOption: { borderColor: BRAND_RED, backgroundColor: '#FFF5F5' },
  unavailableOption: { opacity: 0.7, backgroundColor: '#F5F5F5' },

  paymentText: { fontSize: 15, color: '#333', marginLeft: 12, fontWeight: '500' },
  activePaymentText: { color: BRAND_RED, fontWeight: '700' },
  unavailableText: { fontSize: 10, color: '#999', marginLeft: 12, marginTop: 2 },
  
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#BBB', justifyContent: 'center', alignItems: 'center' },
  activeRadioCircle: { borderColor: BRAND_RED },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: BRAND_RED },

  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 12 },
  summaryLabel: { fontSize: 16, color: '#333' },
  summaryTotal: { fontSize: 18, fontWeight: 'bold', color: BRAND_RED },

  footer: { 
    backgroundColor: '#FFF', 
    padding: wp(5), 
    borderTopWidth: 1, 
    borderTopColor: '#EEE', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    elevation: 10,
  },
  footerTextContainer: { justifyContent: 'center' },
  footerTotalLabel: { fontSize: 12, color: '#666' },
  footerTotalValue: { fontSize: 20, fontWeight: 'bold', color: '#111' },
  
  placeOrderBtn: { backgroundColor: BRAND_RED, paddingVertical: 14, paddingHorizontal: 30, borderRadius: 10, elevation: 3 },
  placeOrderText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },

  // --- MAP STYLES ---
  mapContainer: { flex: 1, position: 'relative' },
  map: { flex: 1 },
  markerFixed: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 8,
    elevation: 4
  },
  closeMapBtn: { padding: 5 },
  mapTitle: { fontSize: 16, fontWeight: 'bold', marginLeft: 15, color: '#333' },
  mapFooter: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    elevation: 10,
    alignItems: 'center'
  },
  mapInstruction: { fontSize: 14, color: '#666', marginBottom: 15 },
  confirmLocationBtn: {
    backgroundColor: BRAND_RED,
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  confirmLocationText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});