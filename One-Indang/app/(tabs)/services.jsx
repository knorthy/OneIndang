import React, { useState } from 'react';
import { 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
} from 'react-native';
import { router } from 'expo-router'; 
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { hp, wp } from '../../helpers/common';
import { styles, COLORS } from '../../styles/servicesStyles';

// --- DATA CONSTANTS ---
const E_SERVICES = [
  { id: 1, title: 'Business Permit', icon: 'briefcase-outline', color: COLORS.secondary },
  { id: 2, title: 'Real Property Tax', icon: 'home-city-outline', color: COLORS.primary },
  { id: 3, title: 'Local Civil Registry', icon: 'file-document-outline', color: COLORS.secondary },
];

const FEATURED_SERVICES = [
  { id: 'livelihood', title: 'Livelihood Training & Loan Assistance', icon: 'toolbox', library: 'MaterialCommunityIcons', color: COLORS.secondary },
  { id: 'medical_cert', title: 'Medical Certificate', icon: 'stethoscope', library: 'MaterialCommunityIcons', color: COLORS.primary },
  { id: 'solo_parent', title: 'Solo Parent ID', icon: 'card-account-details-outline', library: 'MaterialCommunityIcons', color: COLORS.secondary },
  { id: 'hiking', title: 'River Resort & Eco-Tourism', icon: 'landscape', library: 'MaterialIcons', color: COLORS.primary }, 
  { id: 'senior', title: 'Senior Citizen ID', icon: 'account-tie', library: 'MaterialCommunityIcons', color: COLORS.secondary },
  { id: 'summer_job', title: 'Summer Employment', icon: 'school', library: 'MaterialCommunityIcons', color: COLORS.primary },
];

const POPULAR_SERVICES = [
  { 
    id: 'facilities', 
    title: 'Use of Government Facilities', 
    subtitle: 'Book venues for your programs.', 
    icon: 'office-building', 
    color: COLORS.primary 
  },
  { 
    id: 'medical', 
    title: 'Medical Assistance', 
    subtitle: 'Get aid for medical expenses.', 
    icon: 'heart-pulse', 
    color: COLORS.secondary 
  },
  { 
    id: 'transport', 
    title: 'Transportation Assistance', 
    subtitle: 'Request a ride for urgent needs.', 
    icon: 'bus', 
    color: COLORS.primary 
  },
  { 
    id: 'training', 
    title: 'Request for Training', 
    subtitle: 'Request training from city experts.', 
    icon: 'school', 
    color: COLORS.secondary 
  },
  { 
    id: 'grow', 
    title: 'Negosyo Center / SME Support', 
    subtitle: 'Get support for business growth and development.', 
    icon: 'chart-line-variant', 
    color: COLORS.primary 
  },
];

const SERVICE_GUIDES = [
  { id: 'health', title: 'Health and Nutrition' },
  { id: 'social', title: 'Social Services' },
  { id: 'housing', title: 'Housing and Urban Poor' },
  { id: 'education', title: 'Education, Arts, Culture, and Sports' },
  { id: 'legal', title: 'Legal Assistance' },
  { id: 'livelihood', title: 'Livelihood, Employment, Agriculture' },
  { id: 'transparency', title: 'Transparency, Accountability, Growth' },
  { id: 'engineering', title: 'Engineering, General Services, Sound System' },
  { id: 'environment', title: 'Cleanliness and Environmental Protection' },
  { id: 'peace', title: 'Peace and Order, Public Safety, Transport' },
  { id: 'it', title: 'Information Technology and Investment' },
];

export default function ServicesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // --- FILTER LOGIC ---
  const filteredPopular = POPULAR_SERVICES.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEServices = E_SERVICES.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFeatured = FEATURED_SERVICES.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGuides = SERVICE_GUIDES.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to render icons dynamically
  const renderIcon = (lib, name, size, color) => {
    const iconSize = hp(3.5); 
    if (lib === 'MaterialIcons') return <Ionicons name={name} size={size || iconSize} color={color} />;
    if (lib === 'FontAwesome5') return <FontAwesome5 name={name} size={size || iconSize} color={color} />;
    return <MaterialCommunityIcons name={name} size={size || iconSize} color={color} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Note: We removed Stack.Screen here because _layout handles it now */}
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Services</Text>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications-outline" size={hp(3)} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={hp(2.5)} color="#999" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search..." 
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
               <Ionicons name="close-circle" size={hp(2.5)} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* 1. Popular Services (Hide if no matches) */}
        {filteredPopular.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Services</Text>
            {searchQuery === '' && (
              <Text style={styles.sectionSubtitle}>Avail municipal services in just a few taps.</Text>
            )}

            {filteredPopular.map((service) => (
              <TouchableOpacity 
                key={service.id} 
                style={styles.card}
                onPress={() => router.push({
                  pathname: '/(services)/detail',
                  params: { id: service.id }
                })}
              >
                <View style={[styles.cardIconBox, { backgroundColor: service.color === COLORS.primary ? COLORS.lightBlueBg : COLORS.lightRedBg }]}>
                  <MaterialCommunityIcons name={service.icon} size={hp(3)} color={service.color} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{service.title}</Text>
                  <Text style={styles.cardSubtitle}>{service.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 2. e-Services (Hide if no matches) */}
        {filteredEServices.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>e-Services</Text>
            {searchQuery === '' && (
              <Text style={styles.sectionSubtitle}>Login to the Online Services portal.</Text>
            )}
            <View style={styles.eServicesGrid}>
              {filteredEServices.map((item) => (
                <TouchableOpacity key={item.id} style={styles.eServiceItem}>
                  <View style={[styles.iconBox, { backgroundColor: item.color === COLORS.primary ? COLORS.lightBlueBg : COLORS.lightRedBg }]}>
                    <MaterialCommunityIcons name={item.icon} size={hp(3.5)} color={item.color} />
                  </View>
                  <Text style={styles.gridLabel}>{item.title}</Text>
                </TouchableOpacity>
              ))}
              {/* Spacer views to keep grid alignment if filtering leaves gaps (optional, but good for flex) */}
              {filteredEServices.length === 1 && <View style={{width: wp(28)}} />} 
              {filteredEServices.length === 1 && <View style={{width: wp(28)}} />} 
            </View>
          </View>
        )}

        {/* 3. Featured Services (Hide if no matches) */}
        {filteredFeatured.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Services</Text>
            {searchQuery === '' && (
              <Text style={styles.sectionSubtitle}>Quick guides and forms for essential services.</Text>
            )}
            
            <View style={styles.featuredGrid}>
              {filteredFeatured.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.featuredCard}
                  onPress={() => router.push({ pathname: '/(services)/detail', params: { id: item.id } })}
                >
                   <View style={styles.featuredIconContainer}>
                      {renderIcon(item.library, item.icon, hp(3.5), item.color)}
                   </View>
                   <Text style={styles.featuredTitle}>{item.title}</Text>
                </TouchableOpacity>
              ))}
              {/* Keep grid aligned if only 1 item matches */}
              {filteredFeatured.length % 2 !== 0 && <View style={styles.featuredCardHidden} />}
            </View>
          </View>
        )}

        {/* 4. Guide to All Services (Hide if no matches) */}
        {filteredGuides.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Guide to All Services</Text>
            {searchQuery === '' && (
              <Text style={styles.sectionSubtitle}>Requirements and procedures for availing City Services.</Text>
            )}
            
            <View style={styles.listContainer}>
              {filteredGuides.map((guide) => (
                <TouchableOpacity 
                  key={guide.id} 
                  style={styles.listItem}
                  onPress={() => router.push({
                    pathname: '/(services)/guide',
                    params: { categoryId: guide.id }
                  })}
                >
                  <Text style={styles.listItemText}>{guide.title}</Text>
                  <Ionicons name="chevron-forward" size={hp(2.5)} color={COLORS.textGray} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* No Results Found State */}
        {searchQuery.length > 0 && 
         filteredPopular.length === 0 && 
         filteredEServices.length === 0 && 
         filteredFeatured.length === 0 && 
         filteredGuides.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: hp(5) }}>
            <Ionicons name="search-outline" size={hp(8)} color="#ddd" />
            <Text style={{ color: '#999', marginTop: 10 }}>No services found matching "{searchQuery}"</Text>
          </View>
        )}

        <View style={{ height: hp(10) }} />
      </ScrollView>
    </SafeAreaView>
  );
}