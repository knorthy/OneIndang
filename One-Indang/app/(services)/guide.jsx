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

// --- DATA FOR INDANG GUIDE (COMPLETE) ---
const GUIDE_DATA = {
  // 1. HEALTH
  'health': {
    title: 'Health & Nutrition',
    offices: [
      {
        name: 'Municipal Health Office (RHU)',
        items: [
          'Medical Consultation / Check-up',
          'Immunization Services (EPI)',
          'Maternal Care & Pre-natal',
          'Sanitary Permit for Businesses',
          'Medical Certificate Issuance',
          'TB-DOTS Program',
          'Family Planning Services'
        ]
      },
      { name: 'M.V. Santiago Medical Center', items: ['Emergency Room', 'Outpatient Services', 'Laboratory Services'] }
    ]
  },

  // 2. SOCIAL SERVICES
  'social': {
    title: 'Social Services',
    offices: [
      { 
        name: 'Municipal Social Welfare (MSWDO)', 
        items: [
          'AICS (Financial Assistance)',
          'Solo Parent ID Application',
          'PWD ID Application',
          'Senior Citizen ID Application',
          'Certificate of Indigency',
          'Pre-Marriage Counseling'
        ] 
      },
      { name: 'OSCA (Senior Citizens)', items: ['Social Pension', 'Senior Citizen Booklet', 'Birthday Cash Gift'] }
    ]
  },

  // 3. HOUSING (Missing Fixed)
  'housing': {
    title: 'Housing & Zoning',
    offices: [
      { 
        name: 'Municipal Planning (MPDO)', 
        items: [
          'Zoning Clearance',
          'Locational Clearance',
          'Development Permit',
          'Land Use Assistance'
        ] 
      },
      { name: 'National Housing Authority (Region IV)', items: ['Housing Loan Inquiry', 'Relocation Assistance'] }
    ]
  },

  // 4. EDUCATION (Missing Fixed)
  'education': {
    title: 'Education & Sports',
    offices: [
      { 
        name: 'Municipal Scholarship Office', 
        items: [
          'College Scholarship Application',
          'Financial Assistance for Students',
          'ALS (Alternative Learning System)'
        ] 
      },
      { name: 'Sports Development Office', items: ['Sports Equipment Request', 'Gymnasium Reservation'] }
    ]
  },

  // 5. LEGAL (Missing Fixed)
  'legal': {
    title: 'Legal Assistance',
    offices: [
      { name: 'Municipal Legal Officer', items: ['Legal Counseling', 'Notary Services (Indigent)', 'Drafting of Affidavits'] },
      { name: 'Public Attorney\'s Office (PAO)', items: ['Free Legal Representation', 'Mediation Services'] }
    ]
  },

  // 6. LIVELIHOOD (Merged Agri + Employment)
  'livelihood': {
    title: 'Livelihood & Agriculture',
    offices: [
      { 
        name: 'Municipal Agriculture Office', 
        items: [
          'Seed & Fertilizer Distribution',
          'Tractor / Farm Equipment Lending',
          'Technical Assistance on Farming',
          'Anti-Rabies Vaccination',
          'Crop Insurance'
        ] 
      },
      { name: 'Indang PESO', items: ['Job Fair Registration', 'SPES (Student Employment)', 'OFW Assistance', 'Livelihood Training'] }
    ]
  },

  // 7. TRANSPARENCY (Renamed from 'treasury')
  'transparency': {
    title: 'Transparency & Taxes',
    offices: [
      { name: 'Municipal Treasurer\'s Office', items: ['Real Property Tax Payment', 'Community Tax Certificate (Cedula)', 'Business Tax Payment'] },
      { name: 'Municipal Assessor\'s Office', items: ['Tax Declaration Issuance', 'Property Assessment', 'Transfer of Tax Dec'] },
      { name: 'Business Permit & Licensing (BPLO)', items: ['New Business Permit', 'Renewal of Business Permit', 'Retirement of Business'] }
    ]
  },

  // 8. ENGINEERING (Renamed from 'eng')
  'engineering': {
    title: 'Engineering & Works',
    offices: [
      { 
        name: 'Municipal Engineering Office', 
        items: [
          'Building Permit Application',
          'Occupancy Permit',
          'Electrical Permit',
          'Fencing Permit',
          'Excavation Permit'
        ] 
      },
      { name: 'General Services Office', items: ['Streetlight Repair Request', 'Facility Maintenance'] }
    ]
  },

  // 9. ENVIRONMENT (Missing Fixed)
  'environment': {
    title: 'Environment (MENRO)',
    offices: [
      { 
        name: 'Municipal Environment Office (MENRO)', 
        items: [
          'Tree Cutting Permit',
          'Solid Waste Management',
          'Environmental Compliance Certificate (ECC) Assist',
          'Garbage Collection Schedule'
        ] 
      },
      { name: 'Tourism Office', items: ['Resort Inspection', 'River Clean-up Drives'] }
    ]
  },

  // 10. PEACE AND ORDER
  'peace': {
    title: 'Peace & Order',
    offices: [
      { name: 'Indang Municipal Police', items: ['Police Clearance', 'Blotter Report', 'Peace & Order Assistance'] },
      { name: 'MDRRMO', items: ['Disaster Rescue', 'Emergency Response Training', 'Ambulance Request'] },
      { name: 'BFP Indang', items: ['Fire Safety Inspection', 'Fire Drill Request'] }
    ]
  },

  // 11. IT (Missing Fixed)
  'it': {
    title: 'IT & Investment',
    offices: [
      { name: 'Local Econ. & Investment (LEIPO)', items: ['Investment Incentives', 'Business Matching', 'DTI Registration Assist'] },
      { name: 'Admin - MIS Section', items: ['GovNet Connectivity', 'LGU Website Concerns'] }
    ]
  }
};

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