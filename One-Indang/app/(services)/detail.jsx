import React from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  StatusBar,
  TouchableOpacity,
  View,
  Text
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { hp, wp } from '../../helpers/common';
import styles from '../../styles/detailStyles';
import { SERVICES_DB } from '../../constants/detailData';
import { COLORS } from '../../constants/theme';

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams();
  const data = SERVICES_DB[id];

  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{padding: wp(5)}}>Service not found.</Text>
        <TouchableOpacity onPress={() => router.back()}><Text style={{color: COLORS.primary}}>Go Back</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={hp(3)} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{data.title}</Text>
        <View style={{ width: wp(10) }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Office Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.logoPlaceholder}>
               <MaterialCommunityIcons name="bank-outline" size={hp(3.5)} color={COLORS.primary} />
            </View>
            <Text style={styles.officeName}>{data.office}</Text>
          </View>

          <View style={styles.contactRow}>
            <Ionicons name="location-outline" size={hp(2.5)} color="#555" style={{marginRight: wp(2)}} />
            <Text style={styles.contactText}>{data.address}</Text>
          </View>

          <View style={styles.contactRow}>
            <Ionicons name="mail-outline" size={hp(2.5)} color="#555" style={{marginRight: wp(2)}} />
            <Text style={[styles.contactText, {color: COLORS.primary}]}>{data.email}</Text>
          </View>
        </View>

        {/* About Section */}
        <Text style={styles.sectionTitle}>About the Service</Text>
        <Text style={styles.description}>{data.about}</Text>

        {/* Who May Avail */}
        {data.who && (
          <>
            <Text style={styles.sectionTitle}>Who may Avail</Text>
            <View style={styles.bulletList}>
              {data.who.map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Requirements */}
        {data.requirements && (
          <>
            <Text style={[styles.sectionTitle, {marginTop: hp(2.5)}]}>Requirements</Text>
            <View style={styles.bulletList}>
              {data.requirements.map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Services */}
        {data.services && (
          <>
            <Text style={[styles.sectionTitle, {marginTop: hp(2.5)}]}>Available Services</Text>
            <View style={styles.bulletList}>
              {data.services.map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Fees */}
        {data.fees && (
          <>
            <Text style={[styles.sectionTitle, {marginTop: hp(2.5)}]}>Applicable Fees</Text>
            <View style={styles.bulletList}>
              {data.fees.map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Process */}
        {data.process && (
          <>
            <Text style={[styles.sectionTitle, {marginTop: hp(2.5)}]}>Application Process</Text>
            <View style={styles.bulletList}>
              {data.process.map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>{index + 1}.</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={{height: hp(12)}} />
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}