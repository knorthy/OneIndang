import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
} from "react-native";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, wp } from "../../helpers/common";
import styles from '../../styles/mainStyles';
import { styles as serviceStyles } from '../../styles/servicesStyles';
import { auth } from '../../services/supabase';
import { E_SERVICES, FEATURED_SERVICES, POPULAR_SERVICES, SERVICE_GUIDES, MAIN_SERVICES } from '../../constants/mainData';

// Icons
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";


const COLORS = {
  primary: '#003087',
  secondary: '#D32F2F',
  background: '#ffffff',
  text: '#003087',
  textGray: '#666666',
  lightRedBg: '#FFEBEE',
  lightBlueBg: '#E3F2FD',
};

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const { isUserLoggedIn } = useLocalSearchParams();
  const [session, setSession] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); 

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await auth.getSession();
        if (response?.data?.session) {
          setSession(response.data.session);
          setIsLoggedIn(true);
        } else if (response?.session) {
          setSession(response.session);
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.log("Session check error:", e);
      }
    };
    checkUser();
    if (isUserLoggedIn === 'true') setIsLoggedIn(true);
  }, [isUserLoggedIn]);

  // --- FILTER LOGIC ---
  const filteredPopular = POPULAR_SERVICES.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredEServices = E_SERVICES.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredFeatured = FEATURED_SERVICES.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredGuides = SERVICE_GUIDES.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const renderIcon = (lib, name, size, color) => {
    const iconSize = hp(3.5); 
    if (lib === 'MaterialIcons') return <Ionicons name={name} size={size || iconSize} color={color} />;
    if (lib === 'FontAwesome5') return <FontAwesome5 name={name} size={size || iconSize} color={color} />;
    return <MaterialCommunityIcons name={name} size={size || iconSize} color={color} />;
  };

  const renderMainIcon = (service) => {
    const { icon, iconName, size, color } = service;
    if (icon === 'Ionicons') return <Ionicons name={iconName} size={size} color={color} />;
    if (icon === 'MaterialIcons') return <MaterialIcons name={iconName} size={size} color={color} />;
    if (icon === 'MaterialCommunityIcons') return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
    if (icon === 'FontAwesome') return <FontAwesome name={iconName} size={size} color={color} />;
    return null;
  };

  const handleServicePress = (route) => {
    router.push(route);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFF" />

      {/* --- FIXED HEADER (Search Bar) --- */}
      <View style={{
        paddingHorizontal: wp(5),
        paddingVertical: 15,
        backgroundColor: '#F8FAFF', 
        zIndex: 10,
      }}>
        <View style={styles.searchBarContainer}>
          <View style={styles.searchInput}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput 
                style={{ flex: 1, color: '#000', fontSize: 16 }}
                placeholder="Search services..." 
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#003087" />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- SCROLLABLE CONTENT --- */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scrollContent, { paddingTop: 10, paddingHorizontal: wp(5), paddingBottom: 100 }]}
      >
        
        {/* Title & Create Account Button */}
        {searchQuery === '' && (
            <View style={{ marginBottom: 25 }}>
                <Text style={[styles.mainTitle, { marginTop: 0 }]}>One Indang ahuy</Text>

                {!isLoggedIn && (
                    <TouchableOpacity 
                    style={[styles.createAccountButton, { marginTop: 15 }]} 
                    onPress={() => router.push('/signup')}
                    >
                    <Text style={styles.createAccountText}>Create your account</Text>
                    <Ionicons name="arrow-forward" size={20} color="#D32F2F" style={styles.arrowIcon} />
                    </TouchableOpacity>
                )}
            </View>
        )}

        {/* --- MAIN GRID (3 COLUMNS) --- */}
        {searchQuery === '' && (
            <>
                <Text style={styles.sectionTitle}>What would you like to do?</Text>
                
                <View style={[
                    styles.servicesGrid, 
                    { 
                        flexDirection: 'row', 
                        flexWrap: 'wrap', 
                        justifyContent: 'space-between' // Ensures spacing handles itself
                    }
                ]}>
                    {MAIN_SERVICES.map((service, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.serviceCard, 
                                { 
                                    // FIX: Using 30% width guarantees 3 items fit in one row (3x30=90%)
                                    width: '30%', 
                                    aspectRatio: 1, // Keep it square
                                    marginBottom: 15, 
                                    padding: 5,      
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }
                            ]}
                            activeOpacity={0.8}
                            onPress={() => handleServicePress(service.route)}
                        >
                            {renderMainIcon(service)}
                            <Text 
                                style={[
                                    styles.serviceTitle, 
                                    { 
                                        fontSize: hp(1.4), // Reduced font size slightly to fit 3 columns nicely
                                        marginTop: 6,
                                        textAlign: 'center'
                                    }
                                ]}
                                numberOfLines={2} 
                            >
                                {service.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </>
        )}

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: '#E0E0E0', marginVertical: 20 }} />

        {/* --- EMBEDDED SERVICES CONTENT (Filtered) --- */}
        
        {/* 1. Popular Services */}
        {filteredPopular.length > 0 && (
          <View style={serviceStyles.section}>
            <Text style={[serviceStyles.sectionTitle, { color: COLORS.text }]}>Popular Services</Text>
            {searchQuery === '' && <Text style={serviceStyles.sectionSubtitle}>Avail municipal services in just a few taps.</Text>}

            {filteredPopular.map((service) => (
              <TouchableOpacity 
                key={service.id} 
                style={serviceStyles.card}
                onPress={() => router.push({ pathname: '/(services)/detail', params: { id: service.id }})}
              >
                <View style={[serviceStyles.cardIconBox, { backgroundColor: service.color === COLORS.primary ? COLORS.lightBlueBg : COLORS.lightRedBg }]}>
                  <MaterialCommunityIcons name={service.icon} size={hp(3)} color={service.color} />
                </View>
                <View style={serviceStyles.cardContent}>
                  <Text style={[serviceStyles.cardTitle, { color: '#333' }]}>{service.title}</Text>
                  <Text style={serviceStyles.cardSubtitle}>{service.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 2. e-Services */}
        {filteredEServices.length > 0 && (
          <View style={serviceStyles.section}>
            <Text style={[serviceStyles.sectionTitle, { color: COLORS.text }]}>e-Services</Text>
            <View style={serviceStyles.eServicesGrid}>
              {filteredEServices.map((item) => (
                <TouchableOpacity key={item.id} style={serviceStyles.eServiceItem}>
                  <View style={[serviceStyles.iconBox, { backgroundColor: item.color === COLORS.primary ? COLORS.lightBlueBg : COLORS.lightRedBg }]}>
                    <MaterialCommunityIcons name={item.icon} size={hp(3.5)} color={item.color} />
                  </View>
                  <Text style={[serviceStyles.gridLabel, { color: COLORS.textGray }]}>{item.title}</Text>
                </TouchableOpacity>
              ))}
              {/* Spacers */}
              {filteredEServices.length === 1 && <View style={{width: '30%'}} />} 
              {filteredEServices.length === 1 && <View style={{width: '30%'}} />} 
            </View>
          </View>
        )}

        {/* 3. Featured Services */}
        {filteredFeatured.length > 0 && (
          <View style={serviceStyles.section}>
            <Text style={[serviceStyles.sectionTitle, { color: COLORS.text }]}>Featured Services</Text>
            <View style={serviceStyles.featuredGrid}>
              {filteredFeatured.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={serviceStyles.featuredCard}
                  onPress={() => router.push({ pathname: '/(services)/detail', params: { id: item.id } })}
                >
                   <View style={serviceStyles.featuredIconContainer}>
                      {renderIcon(item.library, item.icon, hp(3.5), item.color)}
                   </View>
                   <Text style={[serviceStyles.featuredTitle, { color: COLORS.textGray }]}>{item.title}</Text>
                </TouchableOpacity>
              ))}
              {filteredFeatured.length % 2 !== 0 && <View style={serviceStyles.featuredCardHidden} />}
            </View>
          </View>
        )}

        {/* 4. Guide to All Services */}
        {filteredGuides.length > 0 && (
          <View style={serviceStyles.section}>
            <Text style={[serviceStyles.sectionTitle, { color: COLORS.text }]}>Guide to All Services</Text>
            <View style={serviceStyles.listContainer}>
              {filteredGuides.map((guide) => (
                <TouchableOpacity 
                  key={guide.id} 
                  style={serviceStyles.listItem}
                  onPress={() => router.push({ pathname: '/(services)/guide', params: { categoryId: guide.id }})}
                >
                  <Text style={[serviceStyles.listItemText, { color: '#333' }]}>{guide.title}</Text>
                  <Ionicons name="chevron-forward" size={hp(2.5)} color={COLORS.secondary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: hp(10) }} />
      </ScrollView>
    </View>
  );
}