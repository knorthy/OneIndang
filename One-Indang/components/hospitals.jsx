import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { wp, hp } from '../helpers/common';
import Ionicons from "react-native-vector-icons/Ionicons";

const HospitalsContent = ({ onCall, onClose }) => {
  const data = [
    {
      title: "MV Santiago Medical & Diagnostic Center",
      address: "Poblacion 3, Indang, Cavite (Near Town Plaza)",
      numbers: ["(046) 460-5630", "0998-341-4278"]
    },
    {
      title: "Indang Municipal Health Center (RHU)",
      address: "Ambrocio Mojica St., Poblacion 4, Indang, Cavite",
      numbers: ["(046) 460-4708", "(046) 415-0624"]
    },
    {
      title: "Indang Municipal Health Office",
      address: "New Municipal Building, Indang, Cavite",
      numbers: ["(046) 415-0624"]
    }
  ];

  const copyToClipboard = async (num) => {
    await Clipboard.setStringAsync(num);
    Alert.alert("Copied", "Number copied to clipboard");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Indang Medical</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={wp(7)} color="#333" />
        </TouchableOpacity>
      </View>
      <BottomSheetScrollView showsVerticalScrollIndicator={false}>
        {data.map((item, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={styles.stationName}>{item.title}</Text>
            <Text style={styles.address}>{item.address}</Text>
            {item.numbers.map((num, i) => (
              <View key={i} style={styles.numberRow}>
                <Text style={styles.numberText}>{num}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => onCall(num)}>
                    <Ionicons name="call" size={wp(5.5)} color="#00C2A0" style={{marginRight: 15}} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => copyToClipboard(num)}>
                    <Ionicons name="copy-outline" size={wp(5.5)} color="#333" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))}
        <View style={{ height: 40 }} />
      </BottomSheetScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: wp(6) },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(2) },
  title: { fontSize: wp(6), fontWeight: 'bold' },
  section: { marginBottom: hp(3) },
  stationName: { fontSize: wp(4.5), fontWeight: 'bold', color: '#333' },
  address: { fontSize: wp(3.5), color: '#666', marginVertical: hp(0.5) },
  numberRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8F9FA', padding: wp(4), borderRadius: wp(5), marginTop: hp(1) },
  numberText: { fontSize: wp(4), color: '#333' },
  actions: { flexDirection: 'row' }
});

export default HospitalsContent;