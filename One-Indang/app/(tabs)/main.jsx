import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StatusBar,
} from "react-native";
import { hp, wp } from '../../helpers/common';

// Import icons
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; // Added for graduation cap

export default function HomeScreen() {
  const services = [
    { title: "Services", icon: <Ionicons name="apps" size={38} color="#D32F2F" /> },
    { title: "Citizen Guide", icon: <MaterialIcons name="menu-book" size={38} color="#D32F2F" /> },
    { 
      title: "Students", 
      icon: <MaterialCommunityIcons name="school" size={40} color="#D32F2F" /> // Great student icon
      // Alternative icons you can use:
      // icon: <Ionicons name="school" size={38} color="#D32F2F" />
      // icon: <FontAwesome name="graduation-cap" size={38} color="#D32F2F" />
    },
    { title: "Emergency", icon: <Ionicons name="warning" size={38} color="#D32F2F" /> },
    { title: "Transport", icon: <MaterialIcons name="directions-bus" size={38} color="#D32F2F" /> },
    { title: "Business", icon: <FontAwesome name="building" size={36} color="#D32F2F" /> },
  ];

  // ... rest of your component remains exactly the same
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFF" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFF" />

      {/* Map Header */}
      <View style={{ height: hp(35) }}>
        <ImageBackground
          source={{ uri: "https://via.placeholder.com/400x300/E3F2FD/BBDEFB?text=Map" }}
          style={{ flex: 1 }}
          resizeMode="cover"
        >
          {/* Search & Notification Bar */}
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: wp(5),
              paddingTop: hp(6),
              alignItems: "center",
            }}
          >
            <View
              style={{
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
              }}
            >
              <Ionicons name="search" size={20} color="#999" style={{ marginRight: 8 }} />
              <Text style={{ color: "#999", fontSize: 16 }}>Search...</Text>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: "white",
                padding: 12,
                borderRadius: 30,
                shadowColor: "#000",
                shadowOpacity: 0.15,
                elevation: 8,
              }}
            >
              <Ionicons name="notifications-outline" size={24} color="#003087" />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text
            style={{
              fontSize: 38,
              fontWeight: "900",
              color: "#003087",
              marginLeft: wp(5),
              marginTop: hp(4),
              letterSpacing: 0.5,
            }}
          >
            One Indang ahuy
          </Text>

          {/* Create Account Button */}
          <TouchableOpacity
            style={{
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
            }}
          >
            <Text style={{ color: "#D32F2F", fontWeight: "700", fontSize: 16 }}>
              Create your account
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#D32F2F" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </ImageBackground>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Section Title */}
        <Text
          style={{
            fontSize: 28,
            fontWeight: "800",
            color: "#003087",
            marginLeft: wp(5),
            marginTop: hp(4),
            marginBottom: hp(3),
          }}
        >
          What would you like to do?
        </Text>

        {/* Services Grid */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            paddingHorizontal: wp(5),
          }}
        >
          {services.map((service, index) => (
            <TouchableOpacity
              key={index}
              style={{
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
              }}
              activeOpacity={0.8}
            >
              {service.icon}
              <Text
                style={{
                  marginTop: 12,
                  fontSize: 15,
                  fontWeight: "600",
                  color: "#003087",
                  textAlign: "center",
                }}
              >
                {service.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom CTA Banner */}
        <View
          style={{
            marginHorizontal: wp(5),
            marginTop: hp(5),
            backgroundColor: "#003087",
            borderRadius: 24,
            paddingVertical: hp(6),
            paddingHorizontal: wp(6),
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 26, fontWeight: "bold", color: "white", textAlign: "center" }}>
            Help us improve our city
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#BBDEFB",
              textAlign: "center",
              marginTop: 12,
              lineHeight: 24,
            }}
          >
            Create an account to report local issues directly to the city.
          </Text>

          <TouchableOpacity
            style={{
              marginTop: hp(3),
              backgroundColor: "white",
              paddingHorizontal: wp(25),
              paddingVertical: 16,
              borderRadius: 30,
            }}
          >
            <Text style={{ color: "#D32F2F", fontWeight: "bold", fontSize: 18 }}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: hp(10) }} />
      </ScrollView>
    </SafeAreaView>
  );
}