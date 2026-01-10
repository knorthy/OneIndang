import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StatusBar,
} from "react-native";
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { hp, wp } from "../../helpers/common";
import styles from '../../styles/mainStyles';

// Icons
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const services = [
    {
      title: "Services",
      icon: <Ionicons name="apps" size={38} color="#D32F2F" />,
      route: "/services",
    },
    {
      title: "Citizen Guide",
      icon: <MaterialIcons name="menu-book" size={38} color="#D32F2F" />,
      route: "/citizen",
    },
    {
      title: "Students",
      icon: <MaterialCommunityIcons name="school" size={40} color="#D32F2F" />,
      route: "/studmain", 
    },
    {
      title: "Emergency",
      icon: <Ionicons name="warning" size={38} color="#D32F2F" />,
      route: "/emergency",
    },
    {
      title: "Transport",
      icon: <MaterialIcons name="directions-bus" size={38} color="#D32F2F" />,
      route: "/transpo",
    },
    {
      title: "Business",
      icon: <FontAwesome name="building" size={36} color="#D32F2F" />,
      route: "/business",
    },
  ];

  const handleServicePress = (route) => {
    router.push(route);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFF" />

      {/* Map Header */}
      <View style={styles.mapHeader}>
        <ImageBackground
          source={{ uri: "https://via.placeholder.com/400x300/E3F2FD/BBDEFB?text=Map" }}
          style={styles.mapBackground}
          resizeMode="cover"
        >
          {/* Search & Notification */}
          <View style={styles.searchBarContainer}>
            <View style={styles.searchInput}>
              <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
              <Text style={styles.searchPlaceholder}>Search...</Text>
            </View>

            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#003087" />
            </TouchableOpacity>
          </View>

          <Text style={styles.mainTitle}>One Indang ahuy</Text>

          <TouchableOpacity style={styles.createAccountButton} onPress={() => router.push('/signup')}>
            <Text style={styles.createAccountText}>Create your account</Text>
            <Ionicons name="arrow-forward" size={20} color="#D32F2F" style={styles.arrowIcon} />
          </TouchableOpacity>
        </ImageBackground>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>What would you like to do?</Text>

        {/* Services Grid */}
        <View style={styles.servicesGrid}>
          {services.map((service, index) => (
            <TouchableOpacity
              key={index}
              style={styles.serviceCard}
              activeOpacity={0.8}
              onPress={() => handleServicePress(service.route)}
            >
              {service.icon}
              <Text style={styles.serviceTitle}>{service.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom CTA */}
        <View style={styles.bottomBanner}>
          <Text style={styles.bannerTitle}>Help us improve our city</Text>
          <Text style={styles.bannerSubtitle}>
            Create an account to report local issues directly to the city.
          </Text>
          <TouchableOpacity style={styles.signInButton}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: hp(10) }} />
      </ScrollView>
    </View>
  );
}