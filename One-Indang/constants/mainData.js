import { COLORS } from './theme';

// --- SERVICE DATA ---
export const E_SERVICES = [
  { id: 1, title: 'Business Permit', icon: 'briefcase-outline', color: COLORS.secondary },
  { id: 2, title: 'Real Property Tax', icon: 'home-city-outline', color: COLORS.primary },
  { id: 3, title: 'Local Civil Registry', icon: 'file-document-outline', color: COLORS.secondary },
];

export const FEATURED_SERVICES = [
  { id: 'livelihood', title: 'Livelihood Training & Loan Assistance', icon: 'toolbox', library: 'MaterialCommunityIcons', color: COLORS.secondary },
  { id: 'medical_cert', title: 'Medical Certificate', icon: 'stethoscope', library: 'MaterialCommunityIcons', color: COLORS.primary },
  { id: 'solo_parent', title: 'Solo Parent ID', icon: 'card-account-details-outline', library: 'MaterialCommunityIcons', color: COLORS.secondary },
  { id: 'hiking', title: 'River Resort & Eco-Tourism', icon: 'landscape', library: 'MaterialIcons', color: COLORS.primary },
  { id: 'senior', title: 'Senior Citizen ID', icon: 'account-tie', library: 'MaterialCommunityIcons', color: COLORS.secondary },
  { id: 'summer_job', title: 'Summer Employment', icon: 'school', library: 'MaterialCommunityIcons', color: COLORS.primary },
];

export const POPULAR_SERVICES = [
  { id: 'facilities', title: 'Use of Government Facilities', subtitle: 'Book venues for your programs.', icon: 'office-building', color: COLORS.primary },
  { id: 'medical', title: 'Medical Assistance', subtitle: 'Get aid for medical expenses.', icon: 'heart-pulse', color: COLORS.secondary },
  { id: 'transport', title: 'Transportation Assistance', subtitle: 'Request a ride for urgent needs.', icon: 'bus', color: COLORS.primary },
  { id: 'training', title: 'Request for Training', subtitle: 'Request training from city experts.', icon: 'school', color: COLORS.secondary },
  { id: 'grow', title: 'Negosyo Center / SME Support', subtitle: 'Get support for business growth and development.', icon: 'chart-line-variant', color: COLORS.primary },
];

export const SERVICE_GUIDES = [
  { id: 'health', title: 'Health and Nutrition' },
  { id: 'social', title: 'Social Services' },
  { id: 'housing', title: 'Housing and Urban Poor' },
  { id: 'education', title: 'Education, Arts, Culture, and Sports' },
  { id: 'legal', title: 'Legal Assistance' },
  { id: 'livelihood', title: 'Livelihood, Employment, Agriculture' },
  { id: 'transparency', title: 'Transparency, Accountability, Growth' },
  { id: 'engineering', title: 'Engineering, General Services, Sound System' },
  { id: 'environment', title: 'Cleanliness and Environmental Protection' },
  { id: 'peace', title: 'Peace and Order, Public Safety, Transport' },
  { id: 'it', title: 'Information Technology and Investment' },
];

// --- MAIN SERVICES ---
export const MAIN_SERVICES = [
  { title: "Services", icon: "Ionicons", iconName: "apps", size: 28, color: "#D32F2F", route: "/services" },
  { title: "Citizen Guide", icon: "MaterialIcons", iconName: "menu-book", size: 28, color: "#D32F2F", route: "/citizen" },
  { title: "Students", icon: "MaterialCommunityIcons", iconName: "school", size: 30, color: "#D32F2F", route: "/studmain" },
  { title: "Emergency", icon: "Ionicons", iconName: "warning", size: 28, color: "#D32F2F", route: "/emergency" },
  { title: "Transport", icon: "MaterialIcons", iconName: "directions-bus", size: 28, color: "#D32F2F", route: "/transpo" },
  { title: "Business", icon: "FontAwesome", iconName: "building", size: 26, color: "#D32F2F", route: "/business" },
];