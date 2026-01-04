import React from 'react';
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

// --- DATA MOCKED FROM SCREENSHOTS ---
const CITIZEN_GUIDE_DATA = [
  {
    category: "ID Registration and Licenses",
    items: [
      {
        id: 'nbi',
        title: "NBI - National Bureau of Investigation",
        address: "Maria Cristina St, Naga City",
        hours: "Weekdays, 8:00 AM - 5:00 PM",
        website: "https://clearance.nbi.gov.ph/",
        phone: "(054) 473 3346"
      }
    ]
  },
  {
    category: "Benefits & Contributions",
    items: [
      {
        id: 'sss',
        title: "SSS - Social Security System",
        address: "SSS Bldg., Concepcion, Pequeña, Naga City",
        hours: "Weekdays, 7:00 AM - 5:00 PM",
        website: "https://www.sss.gov.ph/",
        phone: "(054) 472 3880"
      }
    ]
  },
  {
    category: "Financial Support",
    items: [
      {
        id: 'dswd',
        title: "DSWD - Department of Social Welfare and Development",
        address: "Yorktown St., Naga City",
        hours: "Weekdays, 8:00 AM - 5:00 PM",
        website: "https://www.dswd.gov.ph/",
        phone: "+63 915 077 4169"
      }
    ]
  },
  {
    category: "Specialized Assistance",
    items: [
      {
        id: 'pdao',
        title: "PDAO - Persons with Disability Affairs Office",
        address: "Room 107, Ground Floor, Naga City Hall Building",
        website: "https://www.facebook.com/pdaonagacity/",
        // Note: Phone/hours were not visible in this specific card screenshot, but field is prepared
      }
    ]
  },
  {
    category: "Other Local Government Offices",
    items: [
      {
        id: 'post_office',
        title: "Naga City Post Office",
        address: "Yorktown St, Naga City",
        hours: "Weekdays, 8:00 AM - 5:00 PM",
        website: "https://phlpost.gov.ph/"
      }
    ]
  }
];

export default function CitizenGuideScreen() {
  
  // Helper to open links
  const openLink = (url) => {
    if(url) Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

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
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
           <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
           <TextInput 
             placeholder="Search..." 
             placeholderTextColor="#999"
             style={styles.searchInput}
           />
        </View>

        {/* Content Loop */}
        {CITIZEN_GUIDE_DATA.map((section, index) => (
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
                  {item.website && (
                    <TouchableOpacity onPress={() => openLink(item.website)} style={styles.detailRow}>
                      <MaterialCommunityIcons name="web" size={18} color="#333" style={styles.detailIcon} />
                      <Text style={[styles.detailText, styles.linkText]}>{item.website}</Text>
                    </TouchableOpacity>
                  )}

                  {/* Phone */}
                  {item.phone && (
                    <TouchableOpacity style={styles.detailRow}>
                      <Ionicons name="call-outline" size={18} color="#333" style={styles.detailIcon} />
                      <Text style={[styles.detailText, styles.linkText]}>{item.phone}</Text>
                    </TouchableOpacity>
                  )}

                </View>
              </View>
            ))}
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // White background mostly
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
    color: '#1a1a1a',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
    // Card Shadow
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
    backgroundColor: '#f5f5f5', // Light grey box for icon
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
    gap: 12, // Spacing between rows
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: 10,
  },
  detailIcon: {
    marginRight: 12,
    marginTop: 2, // Align icon with text top
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
    lineHeight: 20,
  },
  linkText: {
    color: '#0070bc', // Blue link color
  },
});