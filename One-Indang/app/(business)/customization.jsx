import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { hp, wp } from '../../helpers/common';

const PANDA_PINK = '#D70F64';

export default function CustomizationScreen() {
  const router = useRouter();
  const { name, price, img, desc } = useLocalSearchParams();
  const [quantity, setQuantity] = useState(1);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imgHeader}>
          <Image source={{ uri: img }} style={styles.headerImg} />
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={28} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.details}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.priceText}>₱ {parseFloat(price).toFixed(2)}</Text>
          </View>
          <Text style={styles.descText}>{desc}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Variations</Text>
          <Text style={styles.sectionSub}>Select 1 (Required)</Text>
          {['Original', 'Spicy'].map((opt, i) => (
             <TouchableOpacity key={i} style={styles.optionRow}>
                <Text style={styles.optionLabel}>{opt}</Text>
                <View style={styles.radio} />
             </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <SafeAreaView style={styles.footer}>
        <View style={styles.qtyRow}>
          <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
            <Ionicons name="remove-circle-outline" size={32} color={PANDA_PINK}/>
          </TouchableOpacity>
          <Text style={styles.qtyVal}>{quantity}</Text>
          <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
            <Ionicons name="add-circle-outline" size={32} color={PANDA_PINK}/>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/cart')}>
          <Text style={styles.addBtnText}>Add to cart</Text>
          <Text style={styles.addBtnText}>₱ {(price * quantity).toFixed(2)}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  imgHeader: { height: hp(30), backgroundColor: '#F9F9F9' },
  headerImg: { width: '100%', height: '100%', resizeMode: 'contain' },
  closeBtn: { position: 'absolute', top: 50, left: 20, backgroundColor: '#FFF', padding: 8, borderRadius: 25 },
  details: { padding: 20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold' },
  priceText: { fontSize: 18, fontWeight: '600' },
  descText: { color: '#666', marginTop: 10 },
  divider: { height: 8, backgroundColor: '#F8F8F8', marginHorizontal: -20, marginVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  sectionSub: { color: '#777', fontSize: 12, marginBottom: 15 },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: PANDA_PINK },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#EEE', flexDirection: 'row', alignItems: 'center' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  qtyVal: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 15 },
  addBtn: { flex: 1, backgroundColor: PANDA_PINK, height: 50, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  addBtnText: { color: '#FFF', fontWeight: 'bold' }
});