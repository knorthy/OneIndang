import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Platform,
  TextInput,
  Linking
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

// --- INDANG CITIZEN GUIDE DATA ---
const CITIZEN_GUIDE_DATA = [
  {
    category: "Emergency & Safety",
    items: [
      {
        id: 'police',
        title: "Indang Municipal Police Station",
        address: "A. Mojica St, Poblacion III, Indang, Cavite",
        hours: "24/7 Operations",
        website: "https://www.facebook.com/IndangMPS/",
        phone: "(046) 415 0166"
      },
      {
        id: 'fire',
        title: "BFP - Indang Fire Station",
        address: "De Ocampo St., Poblacion II, Indang",
        hours: "24/7 Operations",
        website: "",
        phone: "(046) 415 0862" // Common local fire station number
      },
      {
        id: 'mdrrmo',
        title: "MDRRMO Indang (Rescue)",
        address: "Municipal Hall Compound",
        hours: "24/7 Operations",
        website: "",
        phone: "(046) 460 4709"
      }
    ]
  },
  {
    category: "National Agencies (Nearest Branches)",
    items: [
      {
        id: 'nbi',
        title: "NBI - Tagaytay Satellite Office",
        address: "Ayala Malls Serin, Tagaytay City (Nearest)",
        hours: "Weekdays, 8:00 AM - 5:00 PM",
        website: "https://clearance.nbi.gov.ph/",
        phone: "N/A"
      },
      {
        id: 'lto',
        title: "LTO - Tagaytay District Office",
        address: "Tagaytay City Market, Tagaytay (Nearest)",
        hours: "Weekdays, 8:00 AM - 5:00 PM",
        website: "https://lto.gov.ph/",
        phone: "(046) 483 4398"
      },
      {
        id: 'sss',
        title: "SSS - Tagaytay Branch",
        address: "Olivarez Plaza, Tagaytay City (Nearest)",
        hours: "Weekdays, 8:00 AM - 5:00 PM",
        website: "https://www.sss.gov.ph/",
        phone: "(046) 413 0643"
      }
    ]
  },
  {
    category: "Social Services & Health",
    items: [
      {
        id: 'mswdo',
        title: "MSWDO - Municipal Social Welfare",
        address: "Municipal Hall Compound, Indang",
        hours: "Weekdays, 8:00 AM - 5:00 PM",
        website: "https://indang.gov.ph",
        phone: "(046) 460 5585"
      },
      {
        id: 'rhu',
        title: "Rural Health Unit (RHU) Indang",
        address: "Poblacion IV, Indang, Cavite",
        hours: "Weekdays, 8:00 AM - 5:00 PM",
        website: "",
        phone: "N/A"
      },
      {
        id: 'osca',
        title: "OSCA - Senior Citizens Affairs",
        address: "Municipal Hall Compound, Indang",
        hours: "Weekdays, 8:00 AM - 5:00 PM",
        website: "",
        phone: "N/A"
      }
    ]
  },
  {
    category: "Education & Utilities",
    items: [
      {
        id: 'cvsu',
        title: "Cavite State University (CvSU Main)",
        address: "Bancod, Indang, Cavite",
        hours: "Mon-Sat, 7:00 AM - 6:00 PM",
        website: "https://cvsu.edu.ph/",
        phone: "(046) 415 0010"
      },
      {
        id: 'water',
        title: "Indang Water District (IWD)",
        address: "Poblacion, Indang, Cavite",
        hours: "Weekdays, 8:00 AM - 5:00 PM",
        website: "https://indangwd.com/",
        phone: "(046) 415 0048"
      },
      {
        id: 'post',
        title: "Indang Post Office",
        address: "Poblacion, Indang, Cavite",
        hours: "Weekdays, 8:00 AM - 5:00 PM",
        website: "https://phlpost.gov.ph/",
        phone: "N/A"
      }
    ]
  }
];

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  sectionContainer: {
    marginBottom: 25,
  },
  categoryTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#003087', // Indang Blue
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 15,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBox: {
    width: 60,
    height: 60,
    backgroundColor: '#E3F2FD', // Light Blue bg
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    lineHeight: 22,
  },
  cardBody: {
    gap: 12, 
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: 10,
  },
  detailIcon: {
    marginRight: 12,
    marginTop: 2, 
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
    lineHeight: 20,
  },
  linkText: {
    color: '#003087', // Link Blue
    fontWeight: '600',
  },
});