import React, { useState, useRef, useMemo, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
  TextInput,
  Animated,
  PanResponder,
  Alert,
} from "react-native";
import { Stack } from "expo-router";
import { hp, wp } from "../../helpers/common";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import styles from './styles/emergency.styles';

// GORHOM BOTTOM SHEET IMPORTS
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

// COMPONENT IMPORTS
import HospitalsContent from "../../components/hospitals";
import FireProtectionContent from "../../components/fireprotection";

// Icons
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function EmergencyScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [contentType, setContentType] = useState("hospitals");
  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ["80%"], []);

  const dialNumber = (number) => {
    const cleanNumber = number.replace(/[^0-9+]/g, "");
    let phoneNumber =
      Platform.OS === "android" ? `tel:${cleanNumber}` : `telprompt:${cleanNumber}`;
    Linking.openURL(phoneNumber).catch((err) =>
      console.error("Failed to open dialer", err)
    );
  };

  const copyToClipboard = async (number, label) => {
    await Clipboard.setStringAsync(number);
    Alert.alert("Copied!", `${label} number has been copied.`);
  };

  const hotlines = [
    { label: "Indang Police", number: "0917-542-0193", rawNumber: "09175420193" },
    { label: "Indang COMCEN", number: "0917-843-1555", rawNumber: "09178431555" },
    { label: "Indang MDRRMO", number: "(046) 415-0624", rawNumber: "0464150624" },
  ];

  const filteredHotlines = hotlines.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.number.includes(searchQuery)
  );

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.appHeader}>
          <Text style={styles.headerTitle}>Emergency</Text>
          <TouchableOpacity style={styles.iconCircle}>
            <Ionicons name="notifications-outline" size={wp(6)} color="#003087" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={wp(5)} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search local services..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
          
          <View style={styles.mainCard}>
            <View style={styles.cardHeaderRow}>
              <MaterialCommunityIcons name="alarm-light" size={wp(6)} color="#D32F2F" />
              <Text style={styles.cardHeaderText}>For Emergencies, Call 911</Text>
            </View>
            <SlideToCall911 onCall={() => dialNumber("911")} />
          </View>

          <View style={styles.mainCard}>
            <Text style={styles.sectionTitle}>Local Hotlines</Text>
            <Text style={styles.comcenDescription}>
                The Central Communications Center (COMCEN) is available for emergency assistance.
            </Text>
            
            <View style={styles.hotlineListContainer}>
              {filteredHotlines.map((item, index) => (
                <View key={index} style={styles.hotlineRow}>
                  <View style={styles.hotlineInfo}>
                    <Text style={styles.hotlineText} numberOfLines={1}>
                      <Text style={styles.boldLabel}>{item.label}: </Text>
                      {item.number}
                    </Text>
                  </View>
                  <View style={styles.rowActions}>
                    <TouchableOpacity style={styles.actionIcon} onPress={() => dialNumber(item.rawNumber)}>
                      <Ionicons name="call" size={wp(4.5)} color="#D32F2F" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionIcon} onPress={() => copyToClipboard(item.number, item.label)}>
                      <Ionicons name="copy-outline" size={wp(4.5)} color="#003087" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.quickActionsRow}>
            <TouchableOpacity 
              style={styles.actionBox} 
              onPress={() => { setContentType("hospitals"); bottomSheetRef.current?.expand(); }}
            >
              <MaterialCommunityIcons name="hospital-building" size={wp(8)} color="#00C2A0" />
              <Text style={styles.actionBoxText}>Hospitals</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionBox} 
              onPress={() => { setContentType("fire"); bottomSheetRef.current?.expand(); }}
            >
              <MaterialIcons name="local-fire-department" size={wp(8)} color="#00C2A0" />
              <Text style={styles.actionBoxText}>Fire Protection</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          handleIndicatorStyle={{ backgroundColor: "#333", width: wp(12) }}
          backgroundStyle={{ borderRadius: wp(10) }}
        >
          <View style={{ flex: 1 }}>
            {contentType === "hospitals" ? (
              <HospitalsContent onCall={dialNumber} onClose={() => bottomSheetRef.current?.close()} />
            ) : (
              <FireProtectionContent onCall={dialNumber} onClose={() => bottomSheetRef.current?.close()} />
            )}
          </View>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const SlideToCall911 = ({ onCall }) => {
  const pan = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current; 
  const maxDistance = wp(68); 

  const textOpacity = pan.interpolate({
    inputRange: [0, maxDistance * 0.8], 
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx >= 0 && gesture.dx <= maxDistance) {
          pan.setValue(gesture.dx);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        // Must reach 95% to trigger, otherwise SNAP BACK TO START
        if (gesture.dx >= maxDistance * 0.95) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          
          Animated.parallel([
            Animated.timing(pan, { toValue: maxDistance, useNativeDriver: true, duration: 80 }),
            Animated.sequence([
              Animated.timing(scaleAnim, { toValue: 1.2, duration: 100, useNativeDriver: true }),
              Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
            ])
          ]).start(() => {
            onCall(); 
            setTimeout(() => {
              Animated.spring(pan, {
                toValue: 0,
                useNativeDriver: true,
                friction: 12,
              }).start();
            }, 1000);
          });
        } else {
          // If they let go anywhere else, force it back to 0 immediately
          Animated.spring(pan, { 
            toValue: 0, 
            useNativeDriver: true,
            bounciness: 0,
            speed: 30 
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.sliderTrack}>
      <Animated.View style={[styles.sliderContent, { opacity: textOpacity }]}>
        <Text style={styles.sliderText}>Slide to Call 911</Text>
        <Ionicons name="arrow-forward" size={wp(5)} color="#D32F2F" style={styles.arrowPos} />
      </Animated.View>

      <Animated.View 
        {...panResponder.panHandlers} 
        style={[
          styles.sliderKnob, 
          { transform: [{ translateX: pan }, { scale: scaleAnim }] }
        ]}
      >
        <Ionicons name="call" size={wp(6)} color="#FFF" />
      </Animated.View>
    </View>
  );
};