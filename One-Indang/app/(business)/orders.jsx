import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
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

export default function OrdersScreen() {
  const router = useRouter();
  const { orders } = useCart(); 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="receipt" size={64} color="#DDD" />
            <Text style={styles.emptyText}>No active orders yet.</Text>
            <TouchableOpacity onPress={() => router.navigate('/(business)/foodtripind')} style={styles.browseBtn}>
                <Text style={styles.browseText}>Browse Food</Text>
            </TouchableOpacity>
          </View>
        ) : (
          orders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.restaurantName}>{order.restaurantName}</Text>
                    <Text style={styles.orderDate}>{order.date}</Text>
                </View>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.itemsContainer}>
                {order.items.map((item, index) => (
                    <Text key={index} style={styles.itemText} numberOfLines={1}>
                        {item.qty}x {item.name}
                    </Text>
                ))}
              </View>

              <View style={styles.divider} />

              <View style={styles.cardFooter}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₱ {order.total}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', alignItems: 'center', padding: wp(5), backgroundColor: '#FFF', elevation: 2 },
  backBtn: { marginRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  scrollContent: { padding: wp(5) },
  emptyContainer: { alignItems: 'center', marginTop: hp(15) },
  emptyText: { color: COLORS.textGray, fontSize: 16, marginTop: 10 },
  browseBtn: { marginTop: 15, backgroundColor: COLORS.secondary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  browseText: { color: '#FFF', fontWeight: 'bold' },
  orderCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  restaurantName: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  orderDate: { fontSize: 12, color: COLORS.textGray, marginTop: 2 },
  statusBadge: { backgroundColor: COLORS.lightBlueBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 10 },
  itemsContainer: { marginBottom: 5 },
  itemText: { fontSize: 14, color: '#555', marginBottom: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 14, color: COLORS.textGray },
  totalValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.secondary },
});