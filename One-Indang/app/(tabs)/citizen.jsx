import React, { useState } from 'react';
import { 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  TextInput,
  Linking
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import styles from '../../styles/citizenStyles';
import { CITIZEN_GUIDE_DATA } from '../../constants/citizenData';

export default function CitizenGuideScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Helper to open links
  const openLink = (url) => {
    if(url) Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  // --- SEARCH FILTER LOGIC ---
  const filteredData = CITIZEN_GUIDE_DATA.map(section => {
    // Filter items inside each category
    const matchingItems = section.items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Only return the section if it has matching items
    if (matchingItems.length > 0) {
      return { ...section, items: matchingItems };
    }
    return null;
  }).filter(section => section !== null); // Remove null sections

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Citizen Guide</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
           <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
           <TextInput 
             placeholder="Search agencies (e.g. Police, SSS)..." 
             placeholderTextColor="#999"
             style={styles.searchInput}
             value={searchQuery}
             onChangeText={setSearchQuery} // Updates state as you type
           />
           {searchQuery.length > 0 && (
             <TouchableOpacity onPress={() => setSearchQuery('')}>
               <Ionicons name="close-circle" size={20} color="#ccc" />
             </TouchableOpacity>
           )}
        </View>

        {/* Content Loop */}
        {filteredData.length > 0 ? (
          filteredData.map((section, index) => (
            <View key={index} style={styles.sectionContainer}>
              <Text style={styles.categoryTitle}>{section.category}</Text>
              
              {section.items.map((item, i) => (
                <View key={i} style={styles.card}>
                  {/* Card Header: Icon + Title */}
                  <View style={styles.cardHeader}>
                    <View style={styles.logoBox}>
                      <MaterialCommunityIcons name="office-building" size={32} color="#333" />
                    </View>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                  </View>

                  {/* Card Details */}
                  <View style={styles.cardBody}>
                    
                    {/* Address */}
                    {item.address && (
                      <View style={styles.detailRow}>
                        <Ionicons name="location-outline" size={18} color="#333" style={styles.detailIcon} />
                        <Text style={styles.detailText}>{item.address}</Text>
                      </View>
                    )}

                    {/* Hours */}
                    {item.hours && (
                      <View style={styles.detailRow}>
                        <Ionicons name="time-outline" size={18} color="#333" style={styles.detailIcon} />
                        <Text style={styles.detailText}>{item.hours}</Text>
                      </View>
                    )}

                    {/* Website */}
                    {item.website ? (
                      <TouchableOpacity onPress={() => openLink(item.website)} style={styles.detailRow}>
                        <MaterialCommunityIcons name="web" size={18} color="#0070bc" style={styles.detailIcon} />
                        <Text style={[styles.detailText, styles.linkText]}>Visit Website</Text>
                      </TouchableOpacity>
                    ) : null}

                    {/* Phone */}
                    {item.phone && item.phone !== "N/A" && (
                      <TouchableOpacity onPress={() => openLink(`tel:${item.phone}`)} style={styles.detailRow}>
                        <Ionicons name="call-outline" size={18} color="#0070bc" style={styles.detailIcon} />
                        <Text style={[styles.detailText, styles.linkText]}>{item.phone}</Text>
                      </TouchableOpacity>
                    )}

                  </View>
                </View>
              ))}
            </View>
          ))
        ) : (
          /* Empty State */
          <View style={{ alignItems: 'center', marginTop: 50 }}>
             <Ionicons name="search-outline" size={50} color="#ddd" />
             <Text style={{ color: '#999', marginTop: 10 }}>No agencies found matching "{searchQuery}"</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}