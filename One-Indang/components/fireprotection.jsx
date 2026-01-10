import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Clipboard } from 'react-native';
import { wp, hp } from '../helpers/common';
import Ionicons from "react-native-vector-icons/Ionicons";

const FireProtectionContent = ({ onCall, onClose }) => {
  const data = [
    {
      title: "BFP Indang Fire Station",
      address: "De Ocampo St., Brgy. Poblacion 2, Indang, Cavite",
      numbers: ["(046) 415-0550", "0915-602-0193"]
    },
    {
      title: "Indang MDRRMO / Rescue",
      address: "Municipal Hall Compound, Indang, Cavite",
      numbers: ["(046) 460-5758", "0935-862-2469"]
    }
  ];

  const copyToClipboard = (num) => {
    Clipboard.setString(num);
    Alert.alert("Copied", "Number copied to clipboard");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fire Protection</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={wp(7)} color="#333" />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {data.map((item, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={styles.stationName}>{item.title}</Text>
            <Text style={styles.address}>{item.address}</Text>
            {item.numbers.map((num, i) => (
              <View key={i} style={styles.numberRow}>
                <Text style={styles.numberText}>{num}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => onCall(num)}>
                    <Ionicons name="call" size={wp(5.5)} color="#FF4D4D" style={{marginRight: 15}} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => copyToClipboard(num)}>
                    <Ionicons name="copy-outline" size={wp(5.5)} color="#333" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
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

export default FireProtectionContent;