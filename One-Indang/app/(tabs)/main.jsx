import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StatusBar,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { hp, wp } from "../../helpers/common";

// Icons
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function HomeScreen() {
  const navigation = useNavigation();

  const services = [
    {
      title: "Services",
      icon: <Ionicons name="apps" size={38} color="#D32F2F" />,
      route: "Services",
    },
    {
      title: "Citizen Guide",
      icon: <MaterialIcons name="menu-book" size={38} color="#D32F2F" />,
      route: "CitizenGuide",
    },
    {
      title: "Students",
      icon: <MaterialCommunityIcons name="school" size={40} color="#D32F2F" />,
      route: "Students", // This will navigate to StudentsScreen
    },
    {
      title: "Emergency",
      icon: <Ionicons name="warning" size={38} color="#D32F2F" />,
      route: "Emergency",
    },
    {
      title: "Transport",
      icon: <MaterialIcons name="directions-bus" size={38} color="#D32F2F" />,
      route: "Transport",
    },
    {
      title: "Business",
      icon: <FontAwesome name="building" size={36} color="#D32F2F" />,
      route: "Business",
    },
  ];

  const handleServicePress = (route) => {
    navigation.navigate(route);
  };

  return (
    <SafeAreaView style={styles.container}>
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

          <TouchableOpacity style={styles.createAccountButton}>
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
    </SafeAreaView>
  );
}

// All styles moved here - clean and reusable
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFF",
  },
  mapHeader: {
    height: hp(35),
  },
  mapBackground: {
    flex: 1,
  },
  searchBarContainer: {
    flexDirection: "row",
    paddingHorizontal: wp(5),
    paddingTop: hp(6),
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    color: "#999",
    fontSize: 16,
  },
  notificationButton: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    elevation: 8,
  },
  mainTitle: {
    fontSize: 38,
    fontWeight: "900",
    color: "#003087",
    marginLeft: wp(5),
    marginTop: hp(4),
    letterSpacing: 0.5,
  },
  createAccountButton: {
    backgroundColor: "white",
    alignSelf: "flex-start",
    marginLeft: wp(5),
    marginTop: hp(2),
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  createAccountText: {
    color: "#D32F2F",
    fontWeight: "700",
    fontSize: 16,
  },
  arrowIcon: {
    marginLeft: 8,
  },
  scrollContent: {
    paddingBottom: hp(5),
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#003087",
    marginLeft: wp(5),
    marginTop: hp(4),
    marginBottom: hp(3),
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: wp(5),
  },
  serviceCard: {
    width: wp(42),
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: hp(4.5),
    alignItems: "center",
    marginBottom: hp(2.5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  serviceTitle: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "600",
    color: "#003087",
    textAlign: "center",
  },
  bottomBanner: {
    marginHorizontal: wp(5),
    marginTop: hp(5),
    backgroundColor: "#003087",
    borderRadius: 24,
    paddingVertical: hp(6),
    paddingHorizontal: wp(6),
    alignItems: "center",
  },
  bannerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  bannerSubtitle: {
    fontSize: 16,
    color: "#BBDEFB",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 24,
  },
  signInButton: {
    marginTop: hp(3),
    backgroundColor: "white",
    paddingHorizontal: wp(25),
    paddingVertical: 16,
    borderRadius: 30,
  },
  signInText: {
    color: "#D32F2F",
    fontWeight: "bold",
    fontSize: 18,
  },
});