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
  { id: 'facilities', title: 'Use of Government Facilities', subtitle: 'Book venues for your programs.', icon: 'office-building', color: COLORS.primary },
  { id: 'medical', title: 'Medical Assistance', subtitle: 'Get aid for medical expenses.', icon: 'heart-pulse', color: COLORS.secondary },
  { id: 'transport', title: 'Transportation Assistance', subtitle: 'Request a ride for urgent needs.', icon: 'bus', color: COLORS.primary },
  { id: 'training', title: 'Request for Training', subtitle: 'Request training from city experts.', icon: 'school', color: COLORS.secondary },
  { id: 'grow', title: 'Negosyo Center / SME Support', subtitle: 'Get support for business growth and development.', icon: 'chart-line-variant', color: COLORS.primary },
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

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const { isUserLoggedIn } = useLocalSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); 

  // --- LOGIC: AUTH STATE HANDLER ---
  useEffect(() => {
    // 1. Check current session on mount
    const checkUser = async () => {
      try {
        const { session } = await auth.getSession();
        setIsLoggedIn(!!session);
      } catch (e) {
        console.log("Session check error:", e);
      }
    };
    checkUser();

    // 2. Setup real-time listener for login/logout events
    // This will catch the login from foodtripind.jsx
    const { data: authListener } = auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    if (isUserLoggedIn === 'true') setIsLoggedIn(true);

    return () => {
      // 3. Clean up the listener
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [isUserLoggedIn]);

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

  const mainServices = [
    { title: "Services", icon: <Ionicons name="apps" size={28} color="#D32F2F" />, route: "/services" },
    { title: "Citizen Guide", icon: <MaterialIcons name="menu-book" size={28} color="#D32F2F" />, route: "/citizen" },
    { title: "Students", icon: <MaterialCommunityIcons name="school" size={30} color="#D32F2F" />, route: "/studmain" },
    { title: "Emergency", icon: <Ionicons name="warning" size={28} color="#D32F2F" />, route: "/emergency" },
    { title: "Transport", icon: <MaterialIcons name="directions-bus" size={28} color="#D32F2F" />, route: "/transpo" },
    { title: "Business", icon: <FontAwesome name="building" size={26} color="#D32F2F" />, route: "/business" },
  ];

  const handleServicePress = (route) => {
    router.push(route);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFF" />

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

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scrollContent, { paddingTop: 10, paddingHorizontal: wp(5), paddingBottom: 100 }]}
      >
        
        {searchQuery === '' && (
            <View style={{ marginBottom: 25 }}>
                <Text style={[styles.mainTitle, { marginTop: 0 }]}>One Indang ahuy</Text>

                {/* --- LOGIC: HIDDEN IF LOGGED IN --- */}
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

        {searchQuery === '' && (
            <>
                <Text style={styles.sectionTitle}>What would you like to do?</Text>
                
                <View style={[
                    styles.servicesGrid, 
                    { 
                        flexDirection: 'row', 
                        flexWrap: 'wrap', 
                        justifyContent: 'space-between'
                    }
                ]}>
                    {mainServices.map((service, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.serviceCard, 
                                { 
                                    width: '30%', 
                                    aspectRatio: 1, 
                                    marginBottom: 15, 
                                    padding: 5,       
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }
                            ]}
                            activeOpacity={0.8}
                            onPress={() => handleServicePress(service.route)}
                        >
                            {service.icon}
                            <Text 
                                style={[
                                    styles.serviceTitle, 
                                    { 
                                        fontSize: hp(1.4), 
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

        <View style={{ height: 1, backgroundColor: '#E0E0E0', marginVertical: 20 }} />

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

        {/* --- LOGIC: HIDDEN IF LOGGED IN --- */}
        {!isLoggedIn && searchQuery === '' && (
          <View style={styles.bottomBanner}>
            <Text style={styles.bannerTitle}>Help us improve our city</Text>
            <Text style={styles.bannerSubtitle}>
              Create an account to report local issues directly to the city.
            </Text>
            <TouchableOpacity 
                style={styles.signInButton}
                onPress={() => router.push('/login')}
            >
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: hp(10) }} />
      </ScrollView>
    </View>
  );
}