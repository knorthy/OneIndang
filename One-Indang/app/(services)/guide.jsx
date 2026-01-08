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
  Alert,
  TextInput,
  Keyboard
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { hp, wp } from '../../helpers/common';

// --- THEME COLORS ---
const COLORS = {
  primary: '#003087',
  secondary: '#D32F2F',
  background: '#fff',
  text: '#333',
  gray: '#999',
  lightGray: '#f9f9f9',
  border: '#e0e0e0',
};

// --- DATA ---
const GUIDE_DATA = {
  'health': {
    title: 'Health and Nutrition',
    offices: [
      {
        name: 'City Health Office',
        items: [
          'Securing a Health / Medical Certificate',
          'Availing of Outpatient Consultation at City Health Office',
          'Availing of Immunization Services',
          'Availing of Maternal Care Services',
          'Availing of Free Medicines',
          'Availing of Anti-Tuberculosis Drugs',
          'Availing of Leprosy Drugs',
          'Availing of Dental Examination, Tooth Extraction'
        ]
      },
      {
        name: 'City Population and Nutrition Office',
        items: [
          'Availing of Counselling on Nutrition and Family Planning',
          'Requesting Information on Nutrition, Population and Family Planning',
          'Availing of Supplemental Feeding Preparations',
          'Availing Services of the Naga City Breastfeeding Center',
          'Securing Family Planning Supplies for Walk-in Clients',
          'Arranging Administration of DMPA Injections',
          'Attending Pre-Marriage Orientation and Counseling'
        ]
      },
      { name: 'Naga City Hospital', items: ['Admitting a Patient', 'Emergency Room Services', 'Outpatient Department Services'] },
      { name: 'Our Lady of Lourdes Infirmary', items: ['General Consultation', 'Minor Surgeries', 'Laboratory Services'] }
    ]
  },
  'social': {
    title: 'Social Services',
    offices: [
      { name: 'City Civil Registry Office', items: ['Registration of Birth', 'Registration of Marriage', 'Registration of Death', 'Requesting Certified True Copies'] },
      { name: 'City Mayor\'s Office - Office of the Senior Citizens Affairs', items: ['Application for Senior Citizen ID', 'Purchase of Medicine Booklet', 'Filing Complaints'] },
      { name: 'City Social Welfare and Development Office', items: ['Crisis Intervention Unit', 'Solo Parent ID Application', 'Child Development Centers'] },
      { name: 'City Veterinary Office', items: ['Animal Vaccination', 'Animal Impounding', 'Meat Inspection'] },
      { name: 'Lingkod Barangay Office', items: ['Barangay Clearance Assistance', 'Community Affairs'] },
      { name: 'Persons with Disability Affairs Office', items: ['PWD ID Application', 'Assistive Devices Request'] }
    ]
  },
  'housing': {
    title: 'Housing and Urban Poor',
    offices: [
      { name: 'Housing and Settlement Office', items: ['Application for Socialized Housing', 'Relocation Assistance', 'Dispute Resolution'] }
    ]
  },
  'education': {
    title: 'Education, Arts, Culture, and Sports',
    offices: [
      { name: 'Education, Scholarships & Sports Office', items: ['Scholarship Application', 'Sports Equipment Request', 'Facility Booking'] }
    ]
  },
  'legal': {
    title: 'Legal Assistance',
    offices: [
      { name: 'City Legal Office', items: ['Legal Counseling', 'Notary Services', 'Drafting of Legal Documents'] }
    ]
  },
  'livelihood': {
    title: 'Livelihood, Employment, Agriculture',
    offices: [
      { name: 'City Agriculturist Office', items: ['Seed Distribution', 'Technical Assistance on Farming', 'Tilapia Fingerlings Distribution'] },
      { name: 'City Human Resource Management Office', items: ['Job Application Reception', 'Issuance of Service Record', 'Leave Application'] },
      { name: 'Metro Public Employment Service Office', items: ['Job Fair Registration', 'Special Program for Employment of Students (SPES)', 'Livelihood Assistance'] },
      { name: 'Naga City District Abattoir', items: ['Slaughterhouse Services', 'Meat Inspection Certificate'] }
    ]
  },
  'transparency': {
    title: 'Transparency & Accountability',
    offices: [
      { name: 'City Accounting Office', items: ['Processing of Disbursement Vouchers', 'Issuance of Accountant\'s Advice'] },
      { name: 'City Assessor\'s Office', items: ['Issuance of Tax Declaration', 'Assessment of Real Property', 'Transfer of Ownership'] }
    ]
  },
  'engineering': {
    title: 'Engineering & General Services',
    offices: [
      { name: 'City Engineer\'s Office', items: ['Building Permit Application', 'Electrical Permit', 'Occupancy Permit'] },
      { name: 'General Services Office', items: ['Inventory Management', 'Procurement Services'] },
      { name: 'Building Maintenance Office', items: ['Repair Request', 'Facility Maintenance'] },
      { name: 'Water Services Division', items: ['Water Connection Application', 'Repair of Water Lines'] },
      { name: 'City Events Protocol Office', items: ['Event Coordination', 'Protocol Services'] }
    ]
  },
  'environment': {
    title: 'Cleanliness and Environmental Protection',
    offices: [
      { name: 'City Environment and Natural Resources Office', items: ['Mt. Isarog Hiking Permit', 'Tree Cutting Permit', 'Quarry Permit'] },
      { name: 'Parks and Recreational Facilities', items: ['Park Reservation', 'Sports Facility Usage'] },
      { name: 'Solid Waste Management Office', items: ['Garbage Collection Schedule', 'Request for Special Waste Collection'] }
    ]
  },
  'peace': {
    title: 'Peace and Order, Public Safety',
    offices: [
      { name: 'Bicol Central Station', items: ['Bus Terminal Assistance', 'Lost and Found'] },
      { name: 'City Disaster Risk Reduction Management Office', items: ['Emergency Response', 'Disaster Training Request'] },
      { name: 'Public Safety Office', items: ['Traffic Assistance', 'Reporting of Violations'] },
      { name: 'Sangguniang Panglungsod', items: ['Request for City Council Resolution', 'Public Hearing Schedules'] }
    ]
  },
  'it': {
    title: 'Information Technology and Investment',
    offices: [
      { name: 'Information Technology Office', items: ['GovNet Connectivity', 'Technical Support'] },
      { name: 'Naga City Investment Board', items: ['Investment Incentives Application', 'Business Matching'] }
    ]
  }
};

export default function GuideScreen() {
  const { categoryId } = useLocalSearchParams();
  const data = GUIDE_DATA[categoryId];
  
  // State for search text
  const [searchText, setSearchText] = useState('');
  
  // State for Accordion (Expanded Index)
  const [expandedOffice, setExpandedOffice] = useState(null);

  const toggleOffice = (index) => {
    // If we are searching, toggling shouldn't really close items because we want to see results
    if (searchText.length > 0) return; 
    
    if (expandedOffice === index) {
      setExpandedOffice(null);
    } else {
      setExpandedOffice(index);
    }
  };

  const openPdf = (itemName) => {
    Alert.alert("Opening Document", `Downloading sample.pdf for "${itemName}"...`, [{ text: "OK" }]);
  };

  // --- ROBUST FILTERING FUNCTION ---
  const getFilteredOffices = () => {
    if (!data) return [];
    
    // If search is empty, return original list
    if (searchText.trim() === '') {
      return data.offices;
    }

    const lowerText = searchText.toLowerCase();

    // Use reduce to build a NEW array containing only matching offices/items
    return data.offices.reduce((acc, office) => {
      // 1. Check if the OFFICE NAME matches
      const officeNameMatches = office.name.toLowerCase().includes(lowerText);

      // 2. Check if any ITEMS match
      const matchingItems = office.items.filter(item => 
        item.toLowerCase().includes(lowerText)
      );

      // LOGIC:
      // If Office Name matches, show the office and ALL its items (user wants the whole office)
      // If Office Name doesn't match, but Items DO match, show the office with ONLY the matching items
      
      if (officeNameMatches) {
        acc.push(office);
      } else if (matchingItems.length > 0) {
        acc.push({ ...office, items: matchingItems });
      }

      return acc;
    }, []);
  };

  // Calculate filtered list
  const filteredOffices = getFilteredOffices();

  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
           <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
           <Text style={{marginLeft: 10}}>Category not found</Text>
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
          <Ionicons name="chevron-back" size={hp(3.5)} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={2}>{data.title}</Text>
        <View style={{ width: wp(8) }} /> 
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={hp(2.5)} color={COLORS.gray} style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search Services..." 
            placeholderTextColor={COLORS.gray}
            value={searchText}
            onChangeText={setSearchText}
            autoCorrect={false}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchText(''); Keyboard.dismiss(); }}>
               <Ionicons name="close-circle" size={hp(2.5)} color={COLORS.gray} />
            </TouchableOpacity>
          )}
        </View>

        {/* Results List */}
        {filteredOffices.length > 0 ? (
          filteredOffices.map((office, index) => {
            // Force expand if searching, otherwise use manual state
            const isExpanded = searchText.length > 0 ? true : expandedOffice === index;
            // Use name as key because index changes when filtering
            const uniqueKey = office.name; 

            return (
              <View key={uniqueKey} style={styles.officeContainer}>
                {/* Accordion Header */}
                <TouchableOpacity 
                  style={[styles.officeHeader, isExpanded && styles.officeHeaderExpanded]} 
                  onPress={() => toggleOffice(index)}
                  activeOpacity={0.7}
                  // Optional: Disable collapsing while searching to prevent confusion
                  disabled={searchText.length > 0} 
                >
                  <Text style={styles.officeTitle}>{office.name}</Text>
                  
                  {/* Hide +/- icon while searching to indicate it's auto-expanded */}
                  {searchText.length === 0 && (
                    <Ionicons 
                      name={isExpanded ? "remove" : "add"} 
                      size={hp(3)} 
                      color={COLORS.text} 
                    />
                  )}
                </TouchableOpacity>

                {/* Accordion Content */}
                {isExpanded && (
                  <View style={styles.itemsContainer}>
                    {office.items.map((item, i) => (
                      <TouchableOpacity 
                        key={i} 
                        style={styles.itemRow}
                        onPress={() => openPdf(item)}
                      >
                        <View style={styles.pdfIcon}>
                          <MaterialCommunityIcons name="file-pdf-box" size={hp(3)} color={COLORS.secondary} />
                        </View>
                        <Text style={styles.itemText}>{item}</Text>
                        <Ionicons name="arrow-forward-outline" size={hp(2)} color={COLORS.gray} style={{marginLeft: 'auto'}} />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            );
          })
        ) : (
          /* Empty State */
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
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: hp(2.2),
    fontWeight: 'bold',
    color: COLORS.primary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: wp(2),
  },
  scrollContent: {
    padding: wp(5),
  },
  // Search Bar
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: wp(4),
    height: hp(6.5),
    marginBottom: hp(3),
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  searchIcon: {
    marginRight: wp(2),
  },
  searchInput: {
    flex: 1,
    fontSize: hp(2),
    color: COLORS.text,
  },
  // Accordion
  officeContainer: {
    marginBottom: hp(1.5),
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    overflow: 'hidden',
  },
  officeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: wp(5),
    backgroundColor: COLORS.lightGray,
  },
  officeHeaderExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  officeTitle: {
    fontSize: hp(1.9),
    fontWeight: '600',
    color: COLORS.text,
    width: '90%',
  },
  itemsContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: wp(5),
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pdfIcon: {
    marginRight: wp(3),
  },
  itemText: {
    fontSize: hp(1.8),
    color: COLORS.primary,
    flex: 1,
    lineHeight: hp(2.5),
    marginRight: wp(2),
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    marginTop: hp(5),
  },
  emptyText: {
    color: COLORS.gray,
    marginTop: 10,
    fontSize: hp(1.8),
  }
});