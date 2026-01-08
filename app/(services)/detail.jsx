import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Platform
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { hp, wp } from '../../helpers/common';

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
    address: 'Room 201, 2/F Main Bldg., City Hall Complex, J. Miranda Avenue, Concepcion Pequeña',
    email: 'cmo@naga.gov.ph',
    about: 'This service allows residents and organizations to request the use of city-owned spaces for events like seminars/trainings, conferences, gatherings, sports, rallies, and other activities.',
    who: ['Any resident of Naga City', 'Organizations or groups planning an activity']
  },
  'medical': {
    title: 'Medical Assistance',
    office: 'City Social Welfare and Development Office',
    address: 'G/F Social Development Center Bldg., City Hall Complex, J. Miranda Avenue, Concepcion Pequeña, Naga City',
    email: 'cswd@naga.gov.ph',
    about: 'The City Social Welfare and Development Office (CSWDO) provide emergency financial assistance or referrals for free service to individuals and families who are in extremely difficult situations and have inadequate resources.',
    who: ['Individuals and families with inadequate resources']
  },
  'transport': {
    title: 'Transportation Assistance',
    office: "City Mayor's Office",
    address: 'Room 201, 2/F Main Bldg., City Hall Complex, J. Miranda Avenue, Concepcion Pequeña, Naga City',
    email: 'cmo@naga.gov.ph',
    about: 'This service provides transportation support to residents, barangay officials, and city departments/offices requiring transportation within or outside the city.',
    who: ['Any resident of Naga City', 'Barangay officials', 'City government departments or offices']
  },
  'training': {
    title: 'Request for Training',
    office: "City Mayor's Office",
    address: 'Room 201, 2/F Main Bldg., City Hall Complex, J. Miranda Avenue, Concepcion Pequeña, Naga City',
    email: 'cmo@naga.gov.ph',
    about: 'The city offers a range of free and accessible training and information services designed to equip individuals, groups, and communities with valuable knowledge and practical skills. These cover diverse areas such as agriculture, food production, environmental awareness, and safety.',
    who: ['Any resident of Naga City', 'Organizations or groups planning an activity']
  },
  'grow': {
    title: 'GrOW Negosyo Program',
    office: 'Metro Public Employment Service',
    address: 'G/F DOLE Bldg., J. Miranda Ave., Concepcion Pequeña, Naga City',
    email: 'metropeso@naga.gov.ph',
    about: 'The Metro PESO, in service to the Nagueños through the Naga GrOW Negosyo Program, assists small & micro enterprises which are substantial and important component of the city’s local economy. The program has four (4) main services: Skills Training/Workshop, Product Development, Equipment Support, and Marketing Support.',
    who: ['Bona fide residents of Naga City (present any valid id)', 'Must have a new or existing business', 'Must be a manufacturer/producer', 'Must present a product sample']
  },
  'livelihood': {
    title: 'Livelihood Training & Loan Assistance',
    office: 'Metro Public Employment Service',
    address: 'GF DOLE Bldg., J. Miranda Ave., Concepcion Pequeña, Naga City',
    email: 'metropeso@naga.gov.ph',
    about: 'Metro PESO, through its Enterprise Development Center (EDC), implements a livelihood program that aims to improve the socio-economic well-being of the low-income population. It provides training and soft loans for income-generating projects.',
    who: ['be a bonafide resident of Naga City', 'be 18 years old and above', 'not be an employee of the City Government of Naga', 'not have any existing loan or overdue Metro PESO livelihood loan', 'have a new or existing business'],
    requirements: ['Metro PESO EDC Forms: L-1, L-1b, L-2, L-3', 'Two 1.5" x 1.5" photos (borrower & co-maker)', 'Valid government-issued IDs (with Naga address)', 'Community Tax Certificates (borrower & co-maker)', 'Business License / Mayor’s Permit (for loans P10,000.00 up)', 'Barangay Business Permit & Clearance (for loans below P10,000.00)'],
    process: ['Go to Metro PESO EDC and approach staff', 'Interview + fill out NSRP form', 'Fill out Form L-1 (Loan Application)', 'Submit form + requirements', 'Record check via LiBIS (loan history)', 'Credit investigation and Approval']
  },
  'medical_cert': {
    title: 'Medical Certificate Issuance',
    office: 'City Health Office',
    address: 'G/F Naga City Center for Health and Nutrition Bldg., Naga City Hall Complex',
    email: 'cho@naga.gov.ph',
    about: 'Health and medical certificates are commonly required by government agencies like the LTO, employers, and schools. These documents are issued by the City Health Office (CHO) and serve as proof of medical clearance.',
    requirements: ['Fecalysis results', 'Results of Blood Test/ (CBC)', 'Results of Chest X-ray(PA)', 'Results of Urinalysis', 'Results of Drug Test', 'From Cashier: Certification Fee receipt']
  },
  'solo_parent': {
    title: 'Solo Parent ID',
    office: 'Naga City Solo Parents Affairs Office (NCSPAO)',
    address: '2/F Ako Bicol Bldg., City Hall Complex Miranda Avenue, Concepcion Pequeña',
    email: 'cswdo@naga.gov.ph',
    about: 'This service provides qualified individuals with a Solo Parent Identification Card and a Certificate of Indigency, enabling access to support programs offered by the Naga City Solo Parents Affairs Office (NCSPAO).',
    who: ['A woman who gave birth as a result of rape', 'Parent left solo or alone due to death of spouse', 'Parent left solo while spouse is detained', 'Unmarried mother/father who prefers to keep the child', 'Any family member assuming head of family'],
    requirements: ['1pc 1x1 and 1pc 2x2 photos', 'Duly accomplished application form', 'Duly accomplished ID form', 'Filling up of Membership Renewal Form (For Renewal)', 'Validation of Member (For Renewal)']
  },
  'hiking': {
    title: 'Mt. Isarog Hiking Permit',
    office: 'City Environment and Natural Resources',
    address: 'Naga City Hall Complex, Naga City',
    email: 'cenro.nagacity@gmail.com',
    about: 'Individuals who wish to hike or visit Mt. Isarog Natural Park are required to secure a hiking permit from the City ENRO and pay the necessary environmental fees to the City Treasurer\'s Office.',
    requirements: ['Download, accomplish, and scan waiver release form', 'Scan valid IDs of all hikers', 'Fill up online form linked below', 'Wait for confirmation and approval of application'],
    fees: ['Climbing Permit: Filipino (P100/day), Foreign (P500/day)', 'Entrance Fee: Filipino (P10/person), Foreign (P50/person)', 'Guide Fee: P1,000.00 per guide per day (5 guests to 1 guide)']
  },
  'senior': {
    title: 'Senior Citizen ID',
    office: 'Office of the Senior Citizens Affairs Office',
    address: 'Senior Citizens Center, Naga City Hall Complex, Juan Q. Miranda Ave.',
    email: 'osca@naga.gov.ph',
    about: 'The Senior Citizens ID card entitles qualified bearers to avail of benefits and privileges mandated under RA 9994, including discounts on transport fares, groceries, and prescription medicines.',
    who: ['Residents of Naga City for at least one (1) year', 'Registered voter of the City of Naga (except bedridden senior citizens)'],
    services: ['Issuance of new IDs, discount booklets', 'Replacement of mutilated ID cards and booklets', 'Replacement of lost IDs and booklets']
  },
  'summer_job': {
    title: 'Summer Employment Program',
    office: 'Metro Public Employment Service',
    address: 'GF DOLE Bldg., J. Miranda Ave., Concepcion Pequeña, Naga City',
    email: 'metropeso@naga.gov.ph',
    about: 'The Summer Employment for Enrolment (SEFE) aims to help students in senior high school, out of school youth, college students, and dependents of displaced workers. This program was created under City Ordinance No. 2019-041.',
    who: ['Senior High School Students', 'College Students'],
    requirements: ['Accomplished application form', 'Photocopy of Birth Certificate OR valid document', 'Photocopy of Parents ITR or Certificate of Indigence', 'Photocopy of grades (85 or above)', 'For OSY: Certification as OSY issued by DSWD/CSWD']
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
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: hp(2.2),
    fontWeight: '700',
    color: COLORS.primary, // Brand Blue
    flex: 1,
    textAlign: 'center',
    marginHorizontal: wp(2),
  },
  scrollContent: {
    padding: wp(5),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: wp(5),
    marginBottom: hp(3),
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2.5),
  },
  logoPlaceholder: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(3),
    backgroundColor: COLORS.lightBlueBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(4),
  },
  officeName: {
    flex: 1,
    fontSize: hp(2),
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  contactRow: {
    flexDirection: 'row',
    marginBottom: hp(1.5),
    alignItems: 'flex-start',
  },
  contactText: {
    flex: 1,
    fontSize: hp(1.8),
    color: '#333',
    lineHeight: hp(2.5),
  },
  sectionTitle: {
    fontSize: hp(2.2),
    fontWeight: '700',
    color: COLORS.primary, // Brand Blue
    marginBottom: hp(1.5),
    marginTop: hp(0.5),
  },
  description: {
    fontSize: hp(1.9),
    color: '#444',
    lineHeight: hp(3),
    marginBottom: hp(2),
  },
  bulletList: {
    marginTop: hp(0.5),
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: hp(1),
    alignItems: 'flex-start',
  },
  bulletPoint: {
    fontSize: hp(2.2),
    marginRight: wp(2),
    color: '#333',
    lineHeight: hp(3),
    width: wp(6), 
  },
  bulletText: {
    flex: 1,
    fontSize: hp(1.9),
    color: '#444',
    lineHeight: hp(3),
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: wp(5),
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  applyButton: {
    backgroundColor: COLORS.secondary, // Brand Red
    paddingVertical: hp(2),
    borderRadius: 30,
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: hp(2),
    fontWeight: 'bold',
  },
});