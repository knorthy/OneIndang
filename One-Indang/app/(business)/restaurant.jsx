import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, 
  StatusBar, Dimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { hp, wp } from '../../helpers/common'; 

const { width } = Dimensions.get('window');
const BRAND_RED = '#D32F2F'; 

export default function RestaurantDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { name = "Jollibee Indang", image, location = "Indang Town Plaza" } = params;

  const [activeTab, setActiveTab] = useState('About');

  const handleOrderNow = () => {
    // Navigate to the Menu/Ordering page
    router.push({
        pathname: '/(business)/order',
        params: { name, image } 
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" transparent translucent />
      
      {/* Header Image */}
      <View style={styles.imageContainer}>
        <Image 
            source={{ uri: image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4' }} 
            style={styles.headerImage} 
        />
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        
        <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconBtn}><Ionicons name="heart-outline" size={24} color="black" /></TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}><Ionicons name="share-social-outline" size={24} color="black" /></TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Title Section */}
        <View style={styles.titleSection}>
            <View style={styles.badge}><Text style={styles.badgeText}>Fast Food</Text></View>
            <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#FBC02D" />
                <Text style={styles.ratingText}>4.8 (Review)</Text>
            </View>
        </View>
        
        <Text style={styles.restaurantName}>{name}</Text>
        <Text style={styles.locationText}>{location}</Text>

        {/* Tabs */}
        <View style={styles.tabContainer}>
            {['About', 'Gallery', 'Review'].map((tab) => (
                <TouchableOpacity 
                    key={tab} 
                    onPress={() => setActiveTab(tab)}
                    style={[styles.tab, activeTab === tab && styles.activeTab]}
                >
                    <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                </TouchableOpacity>
            ))}
        </View>

        {/* Info Icons */}
        <View style={styles.infoRow}>
            <View style={styles.infoItem}>
                <Ionicons name="people-outline" size={20} color="#D32F2F" />
                <Text style={styles.infoText}>100+ Pax</Text>
            </View>
            <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={20} color="#D32F2F" />
                <Text style={styles.infoText}>24/7</Text>
            </View>
            <View style={styles.infoItem}>
                <MaterialCommunityIcons name="silverware-fork-knife" size={20} color="#D32F2F" />
                <Text style={styles.infoText}>Dine-in</Text>
            </View>
        </View>

        <View style={styles.divider} />

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
            Fast Food • Town Plaza. Serving the community of Indang with fresh ingredients and great flavors. Perfect for family gatherings or quick snacks. 
            <Text style={{color: '#D32F2F', fontWeight:'bold'}}> Read more</Text>
        </Text>

        {/* Contact Person */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Contact Person</Text>
        <View style={styles.contactRow}>
            <Image 
                source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
                style={styles.contactAvatar} 
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.contactName}>Manager On Duty</Text>
                <Text style={styles.contactRole}>Customer Relations</Text>
            </View>
            <TouchableOpacity style={styles.contactBtn}><Ionicons name="chatbubble-ellipses-outline" size={22} color="#D32F2F" /></TouchableOpacity>
            <TouchableOpacity style={styles.contactBtn}><Ionicons name="call-outline" size={22} color="#D32F2F" /></TouchableOpacity>
        </View>

      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
            <Text style={styles.avgLabel}>Avg. Cost</Text>
            <Text style={styles.priceText}>₱250 <Text style={styles.perPerson}>/person</Text></Text>
        </View>
        <TouchableOpacity style={styles.orderButton} onPress={handleOrderNow}>
            <Text style={styles.orderButtonText}>Order Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  imageContainer: { height: hp(35), width: '100%', position: 'relative' },
  headerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  backButton: { position: 'absolute', top: 40, left: 20, backgroundColor: 'white', padding: 8, borderRadius: 20, elevation: 5 },
  headerIcons: { position: 'absolute', top: 40, right: 20, flexDirection: 'row', gap: 10 },
  iconBtn: { backgroundColor: 'white', padding: 8, borderRadius: 20, elevation: 5 },
  
  scrollContent: { padding: 20, paddingBottom: 100 },
  titleSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  badge: { backgroundColor: '#FFF3E0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#FF9800', fontWeight: 'bold', fontSize: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { color: '#666', fontWeight: '600' },
  
  restaurantName: { fontSize: 26, fontWeight: 'bold', color: '#111', marginVertical: 5 },
  locationText: { color: '#666', fontSize: 14, marginBottom: 20 },
  
  tabContainer: { flexDirection: 'row', gap: 20, borderBottomWidth: 1, borderBottomColor: '#EEE', marginBottom: 20 },
  tab: { paddingBottom: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#D32F2F' },
  tabText: { fontSize: 16, color: '#888', fontWeight: '500' },
  activeTabText: { color: '#D32F2F', fontWeight: '700' },
  
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { color: '#333', fontWeight: '500' },
  
  divider: { height: 1, backgroundColor: '#EEE', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111', marginBottom: 8 },
  description: { color: '#666', lineHeight: 22 },
  
  contactRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  contactAvatar: { width: 50, height: 50, borderRadius: 25 },
  contactName: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  contactRole: { color: '#666', fontSize: 12 },
  contactBtn: { backgroundColor: '#FFEBEE', padding: 10, borderRadius: 12, marginLeft: 10 },
  
  bottomBar: { position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: 'white', elevation: 20, borderTopWidth: 1, borderTopColor: '#EEE' },
  avgLabel: { color: '#888', fontSize: 12 },
  priceText: { color: '#D32F2F', fontSize: 22, fontWeight: 'bold' },
  perPerson: { color: '#888', fontSize: 12, fontWeight: 'normal' },
  orderButton: { backgroundColor: '#FF7043', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12 },
  orderButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});