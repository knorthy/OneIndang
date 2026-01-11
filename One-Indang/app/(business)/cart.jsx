import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Platform, ToastAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { hp, wp } from '../../helpers/common';
import { useCart } from '../../context/CartContext'; 

// --- THEME COLORS ---
const COLORS = {
  primary: '#003087', // Deep Blue
  secondary: '#D32F2F', // Bright Red
  background: '#ffffff',
  text: '#003087',
  textGray: '#666666',
  lightRedBg: '#FFEBEE', 
  lightBlueBg: '#E3F2FD', 
};

// --- UPSELL DATA ---
const UPSELL_ITEMS = [
    { id: 'u1', name: 'Siomai (4pcs)', price: 45.00, img: require('../../assets/images/foods/siomai.png'), qty: 1 }, 
    { id: 'u2', name: 'Coke Regular', price: 35.00, img: require('../../assets/images/foods/coke.png'), qty: 1 },
    { id: 'u3', name: 'Buchi (2pcs)', price: 40.00, img: require('../../assets/images/foods/buchi.png'), qty: 1 },
];

export default function CartScreen() {
  const router = useRouter();
  
  const { cartItems, addToCart, removeFromCart, cartTotal } = useCart();
  const restaurantName = cartItems.length > 0 ? cartItems[0].restaurant : "Cart Empty";

  const DELIVERY_FEE = 59.00;
  const SERVICE_FEE = 5.00;
  const total = parseFloat(cartTotal) + DELIVERY_FEE + SERVICE_FEE;

  const handleAddUpsell = (item) => {
    addToCart(item, "Upsell Item");
    if (Platform.OS === 'android') {
        ToastAndroid.show(`${item.name} added!`, ToastAndroid.SHORT);
    }
  };

  const handleReviewPayment = () => {
    if (cartItems.length === 0) {
        Alert.alert("Empty Cart", "Please add items before checking out.");
        return;
    }
    router.push('/(business)/checkout');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View>
            <Text style={styles.headerTitle}>Cart</Text>
            <Text style={styles.headerSub}>{restaurantName}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Orders</Text>
            {cartItems.length === 0 ? (
                <Text style={styles.emptyText}>Your cart is empty.</Text>
            ) : (
                cartItems.map((item) => (
                    <View key={item.id} style={styles.cartItem}>
                        <View style={styles.itemImageContainer}>
                            <Image source={item.img} style={styles.itemImage} />
                        </View>
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.itemPrice}>₱ {item.price.toFixed(2)}</Text>
                        </View>
                        
                        <View style={styles.qtyContainer}>
                            <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.qtyBtn}>
                                <Ionicons name="remove" size={16} color={COLORS.textGray} />
                            </TouchableOpacity>
                            <Text style={styles.qtyText}>{item.qty}</Text>
                            <TouchableOpacity onPress={() => addToCart(item, item.restaurant)} style={styles.qtyBtn}>
                                <Ionicons name="add" size={16} color={COLORS.textGray} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            )}
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular with your order</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.upsellScroll}>
                {UPSELL_ITEMS.map((item) => (
                    <View key={item.id} style={styles.upsellCard}>
                        <Image source={item.img} style={styles.upsellImg} />
                        <Text style={styles.upsellName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.upsellPrice}>+ ₱{item.price.toFixed(2)}</Text>
                        <TouchableOpacity style={styles.upsellAdd} onPress={() => handleAddUpsell(item)}>
                            <Ionicons name="add" color="white" size={18} />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>

        <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>₱ {cartTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Text style={styles.summaryLabel}>Standard delivery</Text>
                    <Ionicons name="information-circle-outline" size={16} color={COLORS.textGray} style={{marginLeft:4}} />
                </View>
                <Text style={styles.summaryValue}>₱ {DELIVERY_FEE.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Text style={styles.summaryLabel}>Service fee</Text>
                    <Ionicons name="information-circle-outline" size={16} color={COLORS.textGray} style={{marginLeft:4}} />
                </View>
                <Text style={styles.summaryValue}>₱ {SERVICE_FEE.toFixed(2)}</Text>
            </View>
        </View>

        <TouchableOpacity style={styles.voucherBtn}>
            <MaterialCommunityIcons name="ticket-percent-outline" size={24} color={COLORS.textGray} />
            <Text style={styles.voucherText}>Apply a voucher</Text>
        </TouchableOpacity>

        <View style={styles.cutleryRow}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <MaterialCommunityIcons name="silverware-fork-knife" size={20} color={COLORS.textGray} />
                <Text style={styles.cutleryText}>Cutlery</Text>
            </View>
            <Ionicons name="toggle" size={40} color={COLORS.secondary} />
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerTotalRow}>
            <Text style={styles.footerTotalLabel}>Total <Text style={{fontWeight:'normal', fontSize: 12}}>(incl. fees)</Text></Text>
            <Text style={styles.footerTotalValue}>₱ {total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleReviewPayment}>
            <Text style={styles.checkoutText}>Review payment and address</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: wp(5), paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', flexDirection: 'row', alignItems: 'center' },
  closeBtn: { marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  headerSub: { fontSize: 12, color: COLORS.textGray },
  scrollContent: { paddingBottom: hp(20) },
  section: { padding: wp(5), borderBottomWidth: 8, borderBottomColor: '#F8F9FA' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: COLORS.text },
  cartItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  itemImageContainer: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#F5F5F5', justifyContent:'center', alignItems:'center', marginRight: 12 },
  itemImage: { width: '90%', height: '90%', resizeMode: 'contain' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: 'bold', color: COLORS.text },
  itemPrice: { fontSize: 13, color: COLORS.textGray, marginTop: 4 },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD', borderRadius: 8 },
  qtyBtn: { padding: 5, width: 30, alignItems: 'center' },
  qtyText: { fontSize: 14, fontWeight: 'bold', paddingHorizontal: 5, color: COLORS.text },
  upsellScroll: { flexDirection: 'row' },
  upsellCard: { width: 130, marginRight: 10, borderWidth: 1, borderColor: '#EEE', borderRadius: 10, padding: 10, alignItems: 'center' },
  upsellImg: { width: 70, height: 70, resizeMode: 'contain', marginBottom: 5 },
  upsellName: { fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginBottom: 2, color: COLORS.text },
  upsellPrice: { fontSize: 11, color: COLORS.textGray, marginBottom: 5 },
  upsellAdd: { position: 'absolute', right: 5, bottom: 5, backgroundColor: COLORS.secondary, borderRadius: 15, padding: 4, elevation: 2 },
  summaryContainer: { padding: wp(5) },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: COLORS.text },
  summaryValue: { fontSize: 14, color: COLORS.text },
  voucherBtn: { flexDirection: 'row', alignItems: 'center', marginHorizontal: wp(5), padding: 12, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, justifyContent: 'center', marginBottom: 20 },
  voucherText: { marginLeft: 8, fontWeight: 'bold', color: COLORS.text },
  cutleryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(5), marginBottom: 10 },
  cutleryText: { marginLeft: 10, fontSize: 14, fontWeight: 'bold', color: COLORS.text },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE', padding: wp(5), elevation: 20 },
  footerTotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  footerTotalLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  footerTotalValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  checkoutBtn: { backgroundColor: COLORS.primary, paddingVertical: 15, borderRadius: 8, alignItems: 'center' },
  checkoutText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  emptyText: { color: COLORS.textGray, textAlign: 'center', marginTop: 10 }
});