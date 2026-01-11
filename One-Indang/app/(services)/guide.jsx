import React, { useState } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Keyboard,
  Alert
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { hp, wp } from '../../helpers/common';
import styles from '../../styles/guideStyles';
import { GUIDE_DATA } from '../../constants/guideData';

export default function GuideScreen() {
  const { categoryId } = useLocalSearchParams();
  const data = GUIDE_DATA[categoryId];
  
  const [searchText, setSearchText] = useState('');
  const [expandedOffice, setExpandedOffice] = useState(null);

  const toggleOffice = (index) => {
    if (searchText.length > 0) return; 
    if (expandedOffice === index) {
      setExpandedOffice(null);
    } else {
      setExpandedOffice(index);
    }
  };

  const openPdf = (itemName) => {
    Alert.alert("Opening Document", `Downloading requirements for "${itemName}"...`, [{ text: "OK" }]);
  };

  const getFilteredOffices = () => {
    if (!data) return [];
    if (searchText.trim() === '') return data.offices;

    const lowerText = searchText.toLowerCase();
    return data.offices.reduce((acc, office) => {
      const officeNameMatches = office.name.toLowerCase().includes(lowerText);
      const matchingItems = office.items.filter(item => 
        item.toLowerCase().includes(lowerText)
      );

      if (officeNameMatches) {
        acc.push(office);
      } else if (matchingItems.length > 0) {
        acc.push({ ...office, items: matchingItems });
      }
      return acc;
    }, []);
  };

  const filteredOffices = getFilteredOffices();

  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
           <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
           <Text style={{marginLeft: 10, fontSize: 16}}>Category "{categoryId}" not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={hp(3.5)} color="#003087" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{data.title}</Text>
        <View style={{ width: wp(8) }} /> 
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={hp(2.5)} color="#999" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search Services..." 
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            autoCorrect={false}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchText(''); Keyboard.dismiss(); }}>
               <Ionicons name="close-circle" size={hp(2.5)} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Results List */}
        {filteredOffices.length > 0 ? (
          filteredOffices.map((office, index) => {
            const isExpanded = searchText.length > 0 ? true : expandedOffice === index;
            const uniqueKey = office.name; 

            return (
              <View key={uniqueKey} style={styles.officeContainer}>
                <TouchableOpacity 
                  style={[styles.officeHeader, isExpanded && styles.officeHeaderExpanded]} 
                  onPress={() => toggleOffice(index)}
                  activeOpacity={0.7}
                  disabled={searchText.length > 0} 
                >
                  <Text style={styles.officeTitle}>{office.name}</Text>
                  {searchText.length === 0 && (
                    <Ionicons 
                      name={isExpanded ? "remove" : "add"} 
                      size={hp(3)} 
                      color="#333" 
                    />
                  )}
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.itemsContainer}>
                    {office.items.map((item, i) => (
                      <TouchableOpacity 
                        key={i} 
                        style={styles.itemRow}
                        onPress={() => openPdf(item)}
                      >
                        <View style={styles.pdfIcon}>
                          <MaterialCommunityIcons name="file-document-outline" size={hp(3)} color="#D32F2F" />
                        </View>
                        <Text style={styles.itemText}>{item}</Text>
                        <Ionicons name="arrow-forward-outline" size={hp(2)} color="#999" style={{marginLeft: 'auto'}} />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={hp(6)} color="#eee" />
            <Text style={styles.emptyText}>No results found for "{searchText}"</Text>
          </View>
        )}

        <View style={{height: hp(5)}} />
      </ScrollView>
    </SafeAreaView>
  );
}