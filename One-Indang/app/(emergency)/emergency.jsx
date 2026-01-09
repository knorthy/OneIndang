import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Platform,
  TextInput,
  Animated,
  PanResponder,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { hp, wp } from "../../helpers/common";

// Icons
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function EmergencyScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  const dialNumber = (number) => {
    let phoneNumber = number;
    if (Platform.OS === "android") {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber).catch((err) =>
      console.error("Failed to open dialer", err)
    );
  };

  const handleNotificationsPress = () => {
    navigation.navigate("Notifications");
  };

  const handleHospitalsPress = () => {
    navigation.navigate("Hospitals");
  };

  const handleFireProtectionPress = () => {
    navigation.navigate("FireProtection");
  };

  // Data for filtering
  const hotlines = [
    {
      label: "Smart",
      number: "0915-206-6929",
      rawNumber: "09152066929",
    },
    {
      label: "TNT",
      number: "0916-183-1458",
      rawNumber: "09161831458",
    },
    {
      label: "Tel",
      number: "433-9220",
      rawNumber: "4339220",
    },
  ];

  const quickActions = [
    {
      title: "Hospitals",
      icon: "hospital-building",
      onPress: handleHospitalsPress,
      library: MaterialCommunityIcons,
    },
    {
      title: "Fire Protection",
      icon: "local-fire-department",
      onPress: handleFireProtectionPress,
      library: MaterialIcons,
    },
  ];

  // Filter based on search query
  const filteredHotlines = hotlines.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.number.includes(searchQuery)
  );

  const filteredQuickActions = quickActions.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Emergency</Text>
        <TouchableOpacity
          style={styles.notificationBell}
          onPress={handleNotificationsPress}
        >
          <Ionicons name="notifications-outline" size={wp(7)} color="#000080" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInput}>
          <Ionicons name="search" size={wp(5)} color="#999999" />
          <TextInput
            style={styles.textInput}
            placeholder="Search hotlines or services..."
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={wp(5)} color="#999999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 911 Emergency Card */}
        <View style={styles.emergencyCard}>
          <View style={styles.emergencyHeader}>
            <Ionicons name="alert-circle-outline" size={wp(7)} color="#C41E3A" />
            <Text style={styles.emergencyText}>
              For Emergencies, Call 911 (Police)
            </Text>
          </View>

          {/* Functional Slide to Call 911 */}
          <SlideToCall911 />
        </View>

        {/* COMCEN Hotlines Card */}
        <View style={styles.hotlinesCard}>
          <Text style={styles.hotlinesTitle}>COMCEN Hotlines</Text>
          <Text style={styles.hotlinesSubtitle}>
            The Indang Central Communications Center Serving the people of Indang, Cavite for emergencies and urgent assistance.
          </Text>

          {filteredHotlines.length === 0 ? (
            <Text style={styles.noResultsText}>No hotlines found</Text>
          ) : (
            filteredHotlines.map((hotline, index) => (
              <TouchableOpacity
                key={index}
                style={styles.hotlineItem}
                onPress={() => dialNumber(hotline.rawNumber)}
                activeOpacity={0.7}
              >
                <View style={styles.hotlineInfo}>
                  <Text style={styles.hotlineLabel}>{hotline.label}:</Text>
                  <Text style={styles.hotlineNumber}>{hotline.number}</Text>
                </View>
                <View style={styles.hotlineIcons}>
                  <Ionicons name="call-outline" size={wp(6)} color="#C41E3A" />
                  <Ionicons
                    name="chatbubble-outline"
                    size={wp(6)}
                    color="#666666"
                    style={{ marginLeft: wp(4) }}
                  />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Quick Action Buttons */}
        <View style={styles.quickButtonsContainer}>
          {filteredQuickActions.length === 0 ? (
            <Text style={styles.noResultsText}>No services found</Text>
          ) : (
            filteredQuickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickButton}
                onPress={action.onPress}
                activeOpacity={0.8}
              >
                <action.library
                  name={action.icon}
                  size={action.icon === "hospital-building" ? wp(8) : wp(9)}
                  color="#C41E3A"
                />
                <Text style={styles.quickButtonText}>{action.title}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ================ Slide to Call 911 Component ================
const SlideToCall911 = () => {
  const pan = useRef(new Animated.Value(0)).current;
  const [hasCalled, setHasCalled] = useState(false);

  const maxDistance = wp(70);
  const triggerDistance = wp(50);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        pan.setOffset(pan.__getValue());
        pan.setValue(0);
      },

      onPanResponderMove: (_, gesture) => {
        let newX = gesture.dx;
        if (newX < 0) newX = 0;
        if (newX > maxDistance) newX = maxDistance;
        pan.setValue(newX);
      },

      onPanResponderRelease: (_, gesture) => {
        pan.flattenOffset();

        if (gesture.dx > triggerDistance && !hasCalled) {
          setHasCalled(true);

          Animated.spring(pan, {
            toValue: maxDistance,
            useNativeDriver: true,
            friction: 8,
            tension: 50,
          }).start(() => {
            dialNumber("911"); // Auto-dial 911

            setTimeout(() => {
              Animated.spring(pan, {
                toValue: 0,
                useNativeDriver: true,
              }).start(() => setHasCalled(false));
            }, 1200);
          });
        } else {
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.slideContainer}>
      <Text style={styles.slideBackgroundText}>SLIDE TO CALL 911 →</Text>

      <Animated.View
        style={[
          styles.slideKnob,
          {
            transform: [{ translateX: pan }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Ionicons name="call" size={wp(7)} color="#C41E3A" />
      </Animated.View>
    </View>
  );
};

// ================ Styles ================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(5),
    marginTop: hp(4),
    height: hp(8),
  },
  title: {
    fontSize: wp(9),
    fontWeight: "bold",
    color: "#000080",
  },
  notificationBell: {
    backgroundColor: "#FFFFFF",
    padding: wp(2.5),
    borderRadius: wp(10),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchContainer: {
    paddingHorizontal: wp(5),
    marginTop: hp(1),
    marginBottom: hp(2),
  },
  searchInput: {
    backgroundColor: "#F0F0F0",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: wp(8),
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(1.4),
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
  textInput: {
    flex: 1,
    marginLeft: wp(3),
    fontSize: wp(4.2),
    color: "#000",
  },
  scrollContent: {
    paddingBottom: hp(8),
  },
  emergencyCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: wp(5),
    marginTop: hp(4),
    borderRadius: wp(6),
    padding: wp(5),
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  emergencyHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  emergencyText: {
    color: "#000080",
    fontSize: wp(4.5),
    marginLeft: wp(3),
    flex: 1,
    fontWeight: "600",
  },
  slideContainer: {
    position: "relative",
    marginTop: hp(2.5),
    height: hp(9),
    backgroundColor: "#C41E3A",
    borderRadius: wp(12),
    overflow: "hidden",
    justifyContent: "center",
  },
  slideBackgroundText: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: wp(4.8),
    fontWeight: "700",
    letterSpacing: wp(0.5),
  },
  slideKnob: {
    position: "absolute",
    left: wp(3),
    width: wp(17),
    height: wp(17),
    borderRadius: wp(8.5),
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  hotlinesCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: wp(5),
    marginTop: hp(4),
    borderRadius: wp(6),
    padding: wp(5),
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  hotlinesTitle: {
    color: "#000080",
    fontSize: wp(5.8),
    fontWeight: "bold",
  },
  hotlinesSubtitle: {
    color: "#666666",
    fontSize: wp(4),
    marginTop: hp(1),
    lineHeight: wp(5.8),
  },
  hotlineItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    marginTop: hp(2),
    borderRadius: wp(4),
    paddingHorizontal: wp(4),
    paddingVertical: wp(4),
  },
  hotlineInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: wp(4),
  },
  hotlineLabel: {
    color: "#000080",
    fontSize: wp(4.8),
    fontWeight: "600",
    width: wp(22),
  },
  hotlineNumber: {
    color: "#C41E3A",
    fontSize: wp(4.8),
    fontWeight: "600",
    textDecorationLine: "underline",
    flexShrink: 1,
  },
  hotlineIcons: {
    flexDirection: "row",
    alignItems: "center",
    width: wp(20),
    justifyContent: "flex-end",
  },
  quickButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: wp(5),
    marginTop: hp(4),
  },
  quickButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp(5),
    paddingVertical: hp(4),
    paddingHorizontal: wp(8),
    alignItems: "center",
    width: wp(42),
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  quickButtonText: {
    color: "#000080",
    fontSize: wp(4.2),
    marginTop: hp(1.5),
    fontWeight: "600",
  },
  noResultsText: {
    textAlign: "center",
    color: "#999999",
    fontSize: wp(4),
    marginTop: hp(3),
    fontStyle: "italic",
  },
});