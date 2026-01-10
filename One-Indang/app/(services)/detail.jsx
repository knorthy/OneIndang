import React from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  StatusBar,
  TouchableOpacity,
  View,
  Text
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { hp, wp } from '../../helpers/common';
import styles from './styles/detail.styles';

// --- THEME COLORS ---
const COLORS = {
  primary: '#003087',
  secondary: '#D32F2F',
  lightBlueBg: '#E3F2FD',
};

// ... [The SERVICES_DB constant remains the exact same as provided previously] ...
// (I will omit the full DB content here to save space, but make sure to keep the full DB you had)
const SERVICES_DB = {
  // ... Paste the full DB content from the previous response here ...
  'facilities': {
    title: 'Use of Government Facilities',
    office: "City Mayor's Office",
    address: 'A. Mojica St., Poblacion III, Indang City',
    email: 'M1.INDANG@YAHOO.COM',
    about: 'This facility facilitates the booking of public spaces by individuals and groups for various purposes, including training sessions, assemblies, and recreational activities.',
    who: ['Any resident of the Municipality of Indang', 'Organizations or groups planning an activity']
  },
  'medical': {
    title: 'Medical Assistance',
    office: 'Indang Municipal Social Welfare and Development Office',
    address: 'A. Mojica St., Poblacion III, Indang City',
    email: 'M1.INDANG@YAHOO.COM',
    about: 'Indang Municipal Social Welfare and Development Office (MSWDO) delivers community-based social protection and welfare programs, including support for families, children, women, and the elderly',
    who: ['Individuals and families with inadequate resources']
  },
  'transport': {
    title: 'Transport & Vehicle Assistance',
    office: "Municipal Mayor's Office",
    address: '2/F Municipal Hall, Poblacion IV, Indang, Cavite',
    email: 'mayorsoffice@indang.gov.ph',
    about: 'This service provides vehicle assistance to Barangays, Schools, and registered organizations in Indang for official travel, medical emergencies (non-critical), or participation in provincial/national events.',
    who: ['Barangay Officials of Indang', 'Public Schools in Indang', 'Registered NGOs/CSOs']
  },
  'training': {
    title: 'Agri-Livelihood Training',
    office: "Municipal Agriculture Office (MAO)",
    address: 'Ground Floor, Municipal Hall Compound, Indang, Cavite',
    email: 'agriculture@indang.gov.ph',
    about: 'As the Agri-Tourism Hub of Cavite, Indang offers free technical training on coffee processing, dragon fruit cultivation, vinegar making, and organic farming to empower local farmers and enthusiasts.',
    who: ['Indang Farmers and Fisherfolks', 'Agri-business owners', 'Interested residents']
  },
  'grow': {
    title: 'Negosyo Center / SME Support',
    office: 'Indang PESO & LEIPO',
    address: 'Municipal Hall Compound, Poblacion IV, Indang, Cavite',
    email: 'peso@indang.gov.ph',
    about: 'The Local Economic and Investment Promotion Office (LEIPO) assists aspiring entrepreneurs in Indang. We provide business name registration (DTI), product development seminars, and market matching for local products like Kalamay and Tablea.',
    who: ['Bona fide residents of Indang', 'Aspiring Entrepreneurs', 'Owners of MSMEs']
  },
  'livelihood': {
    title: 'Capital Assistance Program',
    office: 'Municipal Social Welfare (MSWDO)',
    address: 'MSWDO Bldg., Municipal Hall Cmpd., Indang, Cavite',
    email: 'mswdo@indang.gov.ph',
    about: 'The Sustainable Livelihood Program (SLP) provides capital assistance (Sea-K or similar) to qualified indigent families to start small businesses such as sari-sari stores or food vending.',
    who: ['Indigent families (4Ps beneficiaries prioritized)', 'Residents of Indang for at least 6 months', 'Must pass the CI (Case Study)'],
    requirements: ['Certificate of Indigency (Barangay)', 'Valid ID', 'Project Proposal (Simple Format)', 'Social Case Study Report (from MSWDO)'],
    process: ['Visit MSWDO for assessment', 'Submit requirements', 'Wait for validation and home visit', 'Approval and releasing of assistance']
  },
  'medical_cert': {
    title: 'Medical Certificate Issuance',
    office: 'Municipal Health Office (RHU)',
    address: 'Indang Rural Health Unit, Poblacion, Indang, Cavite',
    email: 'rhu@indang.gov.ph',
    about: 'The Medical Certificate is issued by the Municipal Health Officer for employment, school enrollment, or driver’s license application, certifying the individual’s physical fitness.',
    requirements: ['Official Receipt (payment at Treasurer)', 'Laboratory Results (Urinalysis, Fecalysis, CBC)', 'Chest X-ray result', 'Drug Test result (for employment)']
  },
  'solo_parent': {
    title: 'Solo Parent ID Application',
    office: 'MSWDO Indang',
    address: 'MSWDO Bldg., Municipal Hall Cmpd., Indang, Cavite',
    email: 'mswdo@indang.gov.ph',
    about: 'Issuance of Solo Parent ID to qualified single parents in Indang to avail of benefits such as additional leave credits and discounts on basic commodities (per RA 11861).',
    who: ['Single parents due to death of spouse', 'Unmarried mothers/fathers', 'Legal guardians/foster parents'],
    requirements: ['Barangay Certificate of Residency', 'Birth Certificate of Child/Children', 'Affidavit of Solo Parent', '1x1 ID Picture', 'Certificate of No Marriage (CENOMAR) if applicable']
  },
  'hiking': {
    title: 'River Resort & Eco-Tourism', // Replaced Hiking since Indang is famous for Resorts
    office: 'Tourism Office',
    address: 'Indang Municipal Hall, Cavite',
    email: 'tourism@indang.gov.ph',
    about: 'Indang is known as the "Spring Resort Capital of Cavite". This service assists in booking, coordinating group tours, or registering new resorts. It also covers visits to the Bonifacio Shrine.',
    requirements: ['Booking Request Letter (for large groups)', 'Environmental Fee (for specific protected areas)', 'Business Permit (for resort owners)'],
    fees: ['Resort Entrance Fees: Varies by establishment', 'Environmental Fee: Php 20.00 (select areas)', 'Bonifacio Shrine: Donation based']
  },
  'senior': {
    title: 'Senior Citizen ID',
    office: 'OSCA Indang',
    address: 'OSCA Office, Municipal Hall Compound, Indang, Cavite',
    email: 'osca@indang.gov.ph',
    about: 'The OSCA ID provides Indang senior citizens (60+) with 20% discounts on medicines, food, and transportation, plus access to the Social Pension program for the indigent.',
    who: ['Residents of Indang aged 60 years old and above'],
    services: ['New ID Application', 'Purchase Booklet Issuance', 'Social Pension Application', 'Birthday Cash Gift Processing']
  },
  'summer_job': {
    title: 'SPES (Student Employment)',
    office: 'Indang PESO',
    address: 'Municipal Hall Compound, Poblacion IV, Indang, Cavite',
    email: 'peso@indang.gov.ph',
    about: 'The Special Program for Employment of Students (SPES) is a joint undertaking of DOLE and the LGU of Indang to provide temporary employment to poor but deserving students during summer or Christmas vacation.',
    who: ['Students / Out-of-School Youth (15-30 years old)', 'Parents\' combined income must not exceed poverty threshold', 'Must have passing grades'],
    requirements: ['SPES Application Form', 'Copy of Birth Certificate', 'Copy of Grades / Form 138', 'Certificate of Indigency of Parents']
  }
};

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams();
  const data = SERVICES_DB[id];

  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{padding: wp(5)}}>Service not found.</Text>
        <TouchableOpacity onPress={() => router.back()}><Text style={{color: COLORS.primary}}>Go Back</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={hp(3)} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{data.title}</Text>
        <View style={{ width: wp(10) }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Office Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.logoPlaceholder}>
               <MaterialCommunityIcons name="bank-outline" size={hp(3.5)} color={COLORS.primary} />
            </View>
            <Text style={styles.officeName}>{data.office}</Text>
          </View>

          <View style={styles.contactRow}>
            <Ionicons name="location-outline" size={hp(2.5)} color="#555" style={{marginRight: wp(2)}} />
            <Text style={styles.contactText}>{data.address}</Text>
          </View>

          <View style={styles.contactRow}>
            <Ionicons name="mail-outline" size={hp(2.5)} color="#555" style={{marginRight: wp(2)}} />
            <Text style={[styles.contactText, {color: COLORS.primary}]}>{data.email}</Text>
          </View>
        </View>

        {/* About Section */}
        <Text style={styles.sectionTitle}>About the Service</Text>
        <Text style={styles.description}>{data.about}</Text>

        {/* Who May Avail */}
        {data.who && (
          <>
            <Text style={styles.sectionTitle}>Who may Avail</Text>
            <View style={styles.bulletList}>
              {data.who.map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Requirements */}
        {data.requirements && (
          <>
            <Text style={[styles.sectionTitle, {marginTop: hp(2.5)}]}>Requirements</Text>
            <View style={styles.bulletList}>
              {data.requirements.map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Services */}
        {data.services && (
          <>
            <Text style={[styles.sectionTitle, {marginTop: hp(2.5)}]}>Available Services</Text>
            <View style={styles.bulletList}>
              {data.services.map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Fees */}
        {data.fees && (
          <>
            <Text style={[styles.sectionTitle, {marginTop: hp(2.5)}]}>Applicable Fees</Text>
            <View style={styles.bulletList}>
              {data.fees.map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Process */}
        {data.process && (
          <>
            <Text style={[styles.sectionTitle, {marginTop: hp(2.5)}]}>Application Process</Text>
            <View style={styles.bulletList}>
              {data.process.map((item, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bulletPoint}>{index + 1}.</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={{height: hp(12)}} />
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}