import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Image,
  Alert,
  Modal,
  StyleSheet,
  ImageBackground, // Import ImageBackground
} from "react-native";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, wp } from "../../helpers/common";
import styles from '../../styles/mainStyles';
import { styles as serviceStyles } from '../../styles/servicesStyles';
import { auth } from '../../services/supabase';
import { E_SERVICES, FEATURED_SERVICES, POPULAR_SERVICES, SERVICE_GUIDES, MAIN_SERVICES } from '../../constants/mainData';
import { COLORS } from '../../constants/theme';
import UserProfileSheet from '../../components/UserProfileSheet';
import * as ImagePicker from 'expo-image-picker';

// Icons
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const headerBg = require('../../assets/images/mainbg.png');

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { isUserLoggedIn } = useLocalSearchParams();
  const [session, setSession] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Profile Image State
  const [profileImage, setProfileImage] = useState(null);

  // Modals State
  const [isPickerVisible, setPickerVisible] = useState(false); // For Profile Pic
  const [isGuestModalVisible, setGuestModalVisible] = useState(false); // For Guest Login/Signup

  // Bottom Sheet ref
  const bottomSheetRef = useRef(null);

  // --- UPDATED: Handle Avatar Press ---
  const handleAvatarPress = useCallback(() => {
    if (isLoggedIn) {
      bottomSheetRef.current?.expand(); // Show menu if logged in
    } else {
      setGuestModalVisible(true); // Show choice modal if guest
    }
  }, [isLoggedIn]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      setSession(null);
      setIsLoggedIn(false);
      setProfileImage(null);
      bottomSheetRef.current?.close();
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  // Open Custom Image Picker
  const handleEditProfile = () => {
    bottomSheetRef.current?.close();
    setPickerVisible(true);
  };

  const openGallery = async () => {
    setPickerVisible(false);
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    setPickerVisible(false);
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your camera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Navigation Helpers for Guest Modal
  const handleGuestLogin = () => {
    setGuestModalVisible(false);
    router.push('/login');
  };

  const handleGuestSignup = () => {
    setGuestModalVisible(false);
    router.push('/signup');
  };

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
        } else {
          setSession(null);
          setIsLoggedIn(false);
        }
      } catch (e) {
        console.log("Session check error:", e);
      }
    };
    checkUser();
    if (isUserLoggedIn === 'true') setIsLoggedIn(true);

    const { data: authListener } = auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setSession(session);
        setIsLoggedIn(true);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setIsLoggedIn(false);
        setProfileImage(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
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
    <View style={styles.container}>
      {/* Changed StatusBar to light-content for better visibility on the new background */}
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* --- MODAL 1: IMAGE PICKER (For Logged In Users) --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isPickerVisible}
        onRequestClose={() => setPickerVisible(false)}
      >
        <TouchableOpacity
          style={localStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPickerVisible(false)}
        >
          <View style={localStyles.modalContent}>
            <View style={localStyles.modalHeader}>
              <Text style={localStyles.modalTitle}>Update Profile Photo</Text>
              <Text style={localStyles.modalSubtitle}>Select an option to proceed</Text>
            </View>

            <View style={localStyles.optionsContainer}>
              <TouchableOpacity style={localStyles.optionCard} onPress={openCamera}>
                <View style={[localStyles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                  <Ionicons name="camera" size={28} color="#003087" />
                </View>
                <Text style={localStyles.optionText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={localStyles.optionCard} onPress={openGallery}>
                <View style={[localStyles.iconCircle, { backgroundColor: '#FFEBEE' }]}>
                  <Ionicons name="images" size={28} color="#D32F2F" />
                </View>
                <Text style={localStyles.optionText}>Gallery</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={localStyles.cancelButton}
              onPress={() => setPickerVisible(false)}
            >
              <Text style={localStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* --- MODAL 2: GUEST WELCOME (For Guests) --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isGuestModalVisible}
        onRequestClose={() => setGuestModalVisible(false)}
      >
        <TouchableOpacity
          style={localStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setGuestModalVisible(false)}
        >
          <View style={localStyles.modalContent}>
            <View style={localStyles.modalHeader}>
              <Text style={localStyles.modalTitle}>Welcome to One Indang</Text>
              <Text style={localStyles.modalSubtitle}>Log in to manage your profile or create an account to get started.</Text>
            </View>

            <View style={localStyles.optionsContainer}>
              <TouchableOpacity style={localStyles.optionCard} onPress={handleGuestLogin}>
                <View style={[localStyles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                  <Ionicons name="log-in" size={28} color="#003087" />
                </View>
                <Text style={localStyles.optionText}>Log In</Text>
              </TouchableOpacity>

              <TouchableOpacity style={localStyles.optionCard} onPress={handleGuestSignup}>
                <View style={[localStyles.iconCircle, { backgroundColor: '#FFEBEE' }]}>
                  <Ionicons name="person-add" size={28} color="#D32F2F" />
                </View>
                <Text style={localStyles.optionText}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={localStyles.cancelButton}
              onPress={() => setGuestModalVisible(false)}
            >
              <Text style={localStyles.cancelText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* --- SCROLLABLE CONTENT --- */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        bounces={false}
      >
        {/* --- NEW HEADER WITH BACKGROUND IMAGE --- */}
        <ImageBackground
          source={headerBg}
          style={[styles.headerBackground, { paddingTop: insets.top }]}
          resizeMode="cover"
        >
          {/* Header Search Bar */}
          <View style={styles.headerContainer}>
            <View style={styles.searchBarContainer}>
              <TouchableOpacity style={styles.avatarButton} onPress={handleAvatarPress}>
                {profileImage && isLoggedIn ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={{ width: 32, height: 32, borderRadius: 16 }}
                  />
                ) : (
                  <Ionicons name="person-circle-outline" size={32} color="#003087" />
                )}
              </TouchableOpacity>

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
            </View>
          </View>

          {/* Title & Create Account Button */}
          {searchQuery === '' && (
            <View style={{ paddingHorizontal: wp(5), marginBottom: hp(3) }}>
              <Text style={styles.mainTitle}>One Indang ahuy</Text>

              {!isLoggedIn && (
                <TouchableOpacity
                  style={styles.createAccountButton}
                  onPress={() => router.push('/signup')}
                >
                  <Text style={styles.createAccountText}>Create your account</Text>
                  <Ionicons name="arrow-forward" size={20} color="#D32F2F" style={styles.arrowIcon} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </ImageBackground>

        {/* Content Container for the rest of the page */}
        <View style={[styles.scrollContent, { paddingHorizontal: wp(5) }]}>

          {/* --- MAIN GRID --- */}
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
                {MAIN_SERVICES.map((service, index) => (
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
                    {renderMainIcon(service)}
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

          {/* Divider */}
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
                  onPress={() => router.push({ pathname: '/(services)/detail', params: { id: service.id } })}
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
                {filteredEServices.length === 1 && <View style={{ width: '30%' }} />}
                {filteredEServices.length === 1 && <View style={{ width: '30%' }} />}
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
                    onPress={() => router.push({ pathname: '/(services)/guide', params: { categoryId: guide.id } })}
                  >
                    <Text style={[serviceStyles.listItemText, { color: '#333' }]}>{guide.title}</Text>
                    <Ionicons name="chevron-forward" size={hp(2.5)} color={COLORS.secondary} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={{ height: hp(10) }} />
        </View>
      </ScrollView>

      {/* User Profile Bottom Sheet */}
      {isLoggedIn && (
        <UserProfileSheet
          ref={bottomSheetRef}
          onEditProfile={handleEditProfile}
          onLogout={handleLogout}
        />
      )}
    </View>
  );
}

// --- MODAL STYLES ---
const localStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  optionCard: {
    width: '47%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  cancelButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  }
});