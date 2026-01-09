import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar,
  ImageBackground,
  Modal,
  Dimensions
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

// Importing your helpers
import { hp, wp } from '../../helpers/common';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const HomeScreen = () => {

  // --- STATE ---

  const [activeCategory, setActiveCategory] = useState('House');

  const [searchText, setSearchText] = useState('');

  const [selectedProperty, setSelectedProperty] = useState(null);



  // --- BRAND COLORS ---

  const BRAND_BLUE = '#003087';

  const BRAND_RED = '#D32F2F';



  // --- DATA ---

  const categories = [

    { id: 1, name: 'House', icon: 'home' },
    { id: 2, name: 'Bed Space', icon: 'bed' },
    { id: 3, name: 'Apartment', icon: 'building' },
    { id: 4, name: 'Scholarship', icon: 'graduation-cap' },

  ];



  const allProperties = [

    // HOUSES 
    { id: 101, title: 'Sunrise Family Home', location: 'Poblacion 1, Indang', price: '15,000', rating: 4.7, type: 'House', image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: '3 Bedroom, 2 Bath, Garage', beds: 3, baths: 2, sqft: '1,848' },
    { id: 102, title: 'Casa Verde Bungalow', location: 'Bancod, Indang', price: '12,500', rating: 4.5, type: 'House', image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: '2 Bedroom, Garden', beds: 2, baths: 1, sqft: '1,200' },
    { id: 103, title: 'Villa Alfonso Rental', location: 'Kaytapos, Indang', price: '18,000', rating: 4.8, type: 'House', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Fully Furnished', beds: 4, baths: 3, sqft: '2,100' },
    { id: 104, title: 'Metrogate Indang', location: 'Alulod, Indang', price: '20,000', rating: 4.9, type: 'House', image: 'https://images.unsplash.com/photo-1600596542815-22b8c36002ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1475&q=80', details: 'Secure Subdivision', beds: 3, baths: 2, sqft: '1,500' },
    { id: 105, title: 'Cozy Bamboo Retreat', location: 'Buna Lejos, Indang', price: '8,000', rating: 4.3, type: 'House', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Native style', beds: 1, baths: 1, sqft: '600' },
    { id: 106, title: 'Poblacion Townhouse', location: 'Poblacion 3, Indang', price: '14,000', rating: 4.6, type: 'House', image: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-4.0.3&auto=format&fit=crop&w=1678&q=80', details: '2 Storey, 2 BR', beds: 2, baths: 2, sqft: '900' },
    { id: 107, title: 'Hidden Haven Villa', location: 'Calumpang, Indang', price: '25,000', rating: 5.0, type: 'House', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80', details: 'Pool access', beds: 4, baths: 4, sqft: '3,000' },
    { id: 108, title: 'Blue Roof Cottage', location: 'Mataas na Lupa, Indang', price: '10,000', rating: 4.4, type: 'House', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Quiet neighborhood', beds: 2, baths: 1, sqft: '800' },
    { id: 109, title: 'Modern Minimalist', location: 'Poblacion 4, Indang', price: '16,500', rating: 4.7, type: 'House', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80', details: 'Newly renovated', beds: 2, baths: 1, sqft: '1,100' },
    { id: 110, title: 'Farm View House', location: 'Tambo Kulit, Indang', price: '9,500', rating: 4.5, type: 'House', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Scenic view', beds: 2, baths: 1, sqft: '950' },



    // BED SPACES 

    { id: 201, title: 'Lola Fely\'s Dormitory', location: 'Near CvSU Main', price: '1,500', rating: 4.8, type: 'Bed Space', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80', details: 'Female only', beds: 1, baths: 1, sqft: 'N/A' },
    { id: 202, title: 'CvSU Student Lodge', location: 'Bancod, Indang', price: '1,800', rating: 4.2, type: 'Bed Space', image: 'https://images.unsplash.com/photo-1596276020587-8044fe049813?ixlib=rb-4.0.3&auto=format&fit=crop&w=1478&q=80', details: 'Walking distance', beds: 1, baths: 2, sqft: 'N/A' },
    { id: 203, title: 'SHO Dormitory', location: 'Rough Road, Indang', price: '2,000', rating: 4.9, type: 'Bed Space', image: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Airconditioned', beds: 1, baths: 1, sqft: 'N/A' },
    { id: 204, title: 'Green House Boarding', location: 'Poblacion 2, Indang', price: '1,200', rating: 4.0, type: 'Bed Space', image: 'https://images.unsplash.com/photo-1526725702345-bdda2b97ef73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1467&q=80', details: 'Fan room', beds: 1, baths: 2, sqft: 'N/A' },
    { id: 205, title: 'Indang Scholars Dorm', location: 'Kaytapos, Indang', price: '2,500', rating: 4.6, type: 'Bed Space', image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1518&q=80', details: 'Inclusive utils', beds: 1, baths: 1, sqft: 'N/A' },
    { id: 206, title: 'Nanay Esther\'s Place', location: 'Bancod, Indang', price: '1,600', rating: 4.7, type: 'Bed Space', image: 'https://images.unsplash.com/photo-1623625434462-e5e42318ae64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80', details: 'Meals avail', beds: 1, baths: 1, sqft: 'N/A' },
    { id: 207, title: 'St. Thomas Hall', location: 'San Gregorio, Indang', price: '3,000', rating: 4.5, type: 'Bed Space', image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Premium solo', beds: 1, baths: 1, sqft: 'N/A' },
    { id: 208, title: 'Happy Students Home', location: 'Poblacion 1, Indang', price: '1,500', rating: 4.3, type: 'Bed Space', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80', details: '4 pax/room', beds: 1, baths: 2, sqft: 'N/A' },
    { id: 209, title: 'Yellow Gate Boarding', location: 'Bancod, Indang', price: '1,300', rating: 4.1, type: 'Bed Space', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-4.0.3&auto=format&fit=crop&w=1473&q=80', details: 'Budget friendly', beds: 1, baths: 2, sqft: 'N/A' },
    { id: 210, title: 'Cristian Jay Dorm', location: 'Near 7-11 Indang', price: '2,200', rating: 4.4, type: 'Bed Space', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Male quarters', beds: 1, baths: 2, sqft: 'N/A' },



    // APARTMENTS 

    { id: 301, title: 'Woodland Apartments', location: 'Rough Road, Indang', price: '5,500', rating: 4.5, type: 'Apartment', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Studio Type', beds: 1, baths: 1, sqft: '500' },
    { id: 302, title: 'Poblacion Heights', location: 'Poblacion 4, Indang', price: '7,000', rating: 4.6, type: 'Apartment', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1380&q=80', details: '1 BR, Balcony', beds: 1, baths: 1, sqft: '700' },
    { id: 303, title: 'CvSU Gate 2 Apts', location: 'Bancod, Indang', price: '4,500', rating: 4.3, type: 'Apartment', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Unfurnished', beds: 1, baths: 1, sqft: '400' },
    { id: 304, title: 'Indang Ridge Flats', location: 'Alulod, Indang', price: '6,500', rating: 4.7, type: 'Apartment', image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Gated compound', beds: 1, baths: 1, sqft: '600' },
    { id: 305, title: 'San Gregorio Studio', location: 'San Gregorio, Indang', price: '3,800', rating: 4.0, type: 'Apartment', image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80', details: 'Solo unit', beds: 1, baths: 1, sqft: '350' },
    { id: 306, title: 'Mahogany Place', location: 'Mahogany Ave', price: '8,000', rating: 4.9, type: 'Apartment', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: '2 BR, WiFi', beds: 2, baths: 1, sqft: '800' },
    { id: 307, title: 'Bancod River View', location: 'Bancod, Indang', price: '5,000', rating: 4.4, type: 'Apartment', image: 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Scenic, quiet', beds: 1, baths: 1, sqft: '550' },
    { id: 308, title: 'Town Plaza Apts', location: 'Near Plaza, Indang', price: '6,000', rating: 4.5, type: 'Apartment', image: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Accessible', beds: 1, baths: 1, sqft: '600' },
    { id: 309, title: 'White House Units', location: 'Kaytapos, Indang', price: '4,000', rating: 4.2, type: 'Apartment', image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Water pump', beds: 1, baths: 1, sqft: '400' },
    { id: 310, title: 'East Wood Rental', location: 'Buna Cerca, Indang', price: '5,500', rating: 4.3, type: 'Apartment', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Studio w/ loft', beds: 1, baths: 1, sqft: '500' },



    // SCHOLARSHIPS 

    { id: 401, title: 'CvSU Academic', location: 'Cavite State U', price: 'Full', rating: 5.0, type: 'Scholarship', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Dean\'s List', beds: 0, baths: 0, sqft: 'N/A' },
    { id: 402, title: 'Provincial Schol', location: 'Provincial Gov', price: 'Grant', rating: 4.9, type: 'Scholarship', image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80', details: 'Local Gov', beds: 0, baths: 0, sqft: 'N/A' },
    { id: 403, title: 'DOST-SEI', location: 'Indang, Cavite', price: 'Stipend', rating: 5.0, type: 'Scholarship', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Sci & Tech', beds: 0, baths: 0, sqft: 'N/A' },
    { id: 404, title: 'CHED Tulong Dunong', location: 'Indang, Cavite', price: 'Assist', rating: 4.7, type: 'Scholarship', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Financial Aid', beds: 0, baths: 0, sqft: 'N/A' },
    { id: 405, title: 'LGU Indang Schol', location: 'Municipal Hall', price: 'Varies', rating: 4.6, type: 'Scholarship', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Residents', beds: 0, baths: 0, sqft: 'N/A' },
    { id: 406, title: 'CvSU Sports Schol', location: 'Cavite State U', price: 'Full', rating: 4.8, type: 'Scholarship', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Athletes', beds: 0, baths: 0, sqft: 'N/A' },
    { id: 407, title: 'Student Assistant', location: 'CvSU Main', price: 'Wage', rating: 4.5, type: 'Scholarship', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Work-study', beds: 0, baths: 0, sqft: 'N/A' },
    { id: 408, title: 'OWWA Scholarship', location: 'Cavite Region', price: 'Grant', rating: 4.7, type: 'Scholarship', image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=1349&q=80', details: 'OFW Dep', beds: 0, baths: 0, sqft: 'N/A' },
    { id: 409, title: 'Cebuana Schol', location: 'Indang Branches', price: 'Grant', rating: 4.4, type: 'Scholarship', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'ALS', beds: 0, baths: 0, sqft: 'N/A' },
    { id: 410, title: 'Rotary Club Grant', location: 'Rotary Indang', price: 'Books', rating: 4.3, type: 'Scholarship', image: 'https://images.unsplash.com/photo-1577896335477-2858506f48db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', details: 'Allowance', beds: 0, baths: 0, sqft: 'N/A' },

  ];



  const filteredData = allProperties.filter(item => 
    item.type === activeCategory && 
    (item.title.toLowerCase().includes(searchText.toLowerCase()) || 
     item.location.toLowerCase().includes(searchText.toLowerCase()))
  );

  const nearbyData = filteredData.slice().reverse(); 

  // COMPONENT: PROPERTY DETAILS PAGE

  const PropertyDetailsScreen = ({ item, onBack }) => {
    const tabs = ['About', 'Gallery', 'Review'];
    const [activeTab, setActiveTab] = useState('About');
    
    // IMAGE VIEWER STATES
    const [isViewerVisible, setIsViewerVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    //  MOCK DATA FOR TABS 
    const galleryImages = [

       item.image,
       'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
       'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1453&q=80',
       'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
       'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
       'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',

    ];

    const reviews = [
       { id: 1, name: 'Alice Smith', rating: 5, date: 'Jan 10, 2026', comment: 'Beautiful place! Very accessible to CvSU. Highly recommended.' },
       { id: 2, name: 'Mark D.', rating: 4, date: 'Dec 05, 2025', comment: 'Quiet and safe neighborhood. The landlord is very approachable.' },
       { id: 3, name: 'Sarah Joy', rating: 5, date: 'Nov 22, 2025', comment: 'Best boarding house I stayed in Indang so far. Fast WiFi!' },
    ];

    // Helper to open viewer
    const openImageViewer = (index) => {
        setSelectedImageIndex(index);
        setIsViewerVisible(true);
    };

    // LOGIC TO SWITCH CONTENT 
    const renderContent = () => {
        if (activeTab === 'About') {
            return (
                <View>
                    {/* Facilities Icons */}
                    {item.type !== 'Scholarship' && (
                    <View style={styles.facilitiesContainer}>
                        <View style={styles.facilityItem}>
                            <Ionicons name="bed-outline" size={hp(3)} color="#6B7280" />
                            <Text style={styles.facilityText}>{item.beds || 1} Beds</Text>
                        </View>
                        <View style={styles.facilityItem}>
                            <FontAwesome5 name="bath" size={hp(2.5)} color="#6B7280" />
                            <Text style={styles.facilityText}>{item.baths || 1} Bath</Text>
                        </View>
                        <View style={styles.facilityItem}>
                            <MaterialIcons name="aspect-ratio" size={hp(3)} color="#6B7280" />
                            <Text style={styles.facilityText}>{item.sqft || 'N/A'} sqft</Text>
                        </View>
                    </View>
                    )}

                    {/* Description */}
                    <Text style={styles.descriptionTitle}>Description</Text>
                    <Text style={styles.descriptionText}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        <Text style={{ color: BRAND_BLUE, fontWeight: '700' }}> Read more</Text>
                    </Text>

                    {/* Listing Agent */}
                    <Text style={styles.descriptionTitle}>Listing Agent</Text>
                    <View style={styles.agentContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: wp(3) }}>
                            <Image 
                            source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' }} 
                            style={styles.agentImage}
                            />
                            <View>
                            <Text style={{ fontWeight: '700', fontSize: hp(2), color: 'black' }}>John Doe</Text>
                            <Text style={{ color: '#6B7280', fontSize: hp(1.6) }}>Owner</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', gap: wp(4) }}>
                            <TouchableOpacity style={styles.agentBtn}>
                            <Ionicons name="chatbubble-ellipses-outline" size={hp(2.5)} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.agentBtn}>
                            <Ionicons name="call-outline" size={hp(2.5)} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            );
        } else if (activeTab === 'Gallery') {
            return (
                <View style={styles.galleryContainer}>
                    {galleryImages.map((img, index) => (
                        <TouchableOpacity 
                            key={index} 
                            onPress={() => openImageViewer(index)}
                            activeOpacity={0.8}
                        >
                            <Image source={{ uri: img }} style={styles.galleryImage} />
                        </TouchableOpacity>
                    ))}
                </View>
            );
        } else if (activeTab === 'Review') {
            return (
                <View style={styles.reviewsContainer}>
                    {reviews.map((rev) => (
                        <View key={rev.id} style={styles.reviewItem}>
                            <View style={styles.reviewHeader}>
                                <View style={{flexDirection: 'row', alignItems: 'center', gap: wp(3)}}>
                                   <View style={styles.reviewAvatar}>
                                      <Text style={{color: 'white', fontWeight: 'bold'}}>{rev.name.charAt(0)}</Text>
                                   </View>
                                   <View>
                                      <Text style={styles.reviewName}>{rev.name}</Text>
                                      <View style={{flexDirection: 'row', gap: 2}}>
                                        {[...Array(5)].map((_, i) => (
                                            <Ionicons key={i} name="star" size={hp(1.4)} color={i < rev.rating ? "#FFD700" : "#E5E7EB"} />
                                        ))}
                                      </View>
                                   </View>
                                </View>
                                <Text style={styles.reviewDate}>{rev.date}</Text>
                            </View>
                            <Text style={styles.reviewText}>{rev.comment}</Text>
                        </View>
                    ))}
                </View>
            );
        }
    };

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        
        {/*  IMAGE MODAL */}
        <Modal 
            visible={isViewerVisible} 
            transparent={true} 
            animationType="fade"
            onRequestClose={() => setIsViewerVisible(false)}
        >
            <View style={styles.modalContainer}>
                <TouchableOpacity 
                    style={styles.closeButton} 
                    onPress={() => setIsViewerVisible(false)}
                >
                    <Ionicons name="close" size={hp(4)} color="white" />
                </TouchableOpacity>

                <FlatList 
                    data={galleryImages}
                    horizontal
                    pagingEnabled
                    initialScrollIndex={selectedImageIndex}
                    getItemLayout={(data, index) => (
                        {length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index}
                    )}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.fullScreenImageContainer}>
                            <Image 
                                source={{ uri: item }} 
                                style={styles.fullScreenImage} 
                                resizeMode="contain" 
                            />
                        </View>
                    )}
                />
            </View>
        </Modal>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: hp(12) }}>
          
          {/* Main Image Header */}
          <ImageBackground source={{ uri: item.image }} style={styles.detailsImage} resizeMode="cover">
            <View style={styles.detailsHeaderIcons}>
              <TouchableOpacity style={styles.iconCircle} onPress={onBack}>
                <Ionicons name="arrow-back" size={hp(3)} color="black" />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: wp(3) }}>
                <TouchableOpacity style={styles.iconCircle}>
                  <Ionicons name="share-social-outline" size={hp(3)} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>

          {/* Body Content */}
          <View style={styles.detailsBody}>
              
              {/* Tag & Rating */}
              <View style={styles.flexRowBetween}>
                 <View style={[styles.blueTag, { backgroundColor: '#EFF6FF' }]}>
                    <Text style={{ color: BRAND_BLUE, fontWeight: '600', fontSize: hp(1.6) }}>
                      {item.type}
                    </Text>
                 </View>
                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Ionicons name="star" size={hp(2)} color="#FFD700" />
                    <Text style={{ fontWeight: 'bold', fontSize: hp(1.8) }}>{item.rating}</Text>
                    <Text style={{ color: '#6B7280', fontSize: hp(1.6) }}>(365 reviews)</Text>
                 </View>
              </View>

              {/* Title & Address */}
              <Text style={[styles.detailsTitle, { color: 'black' }]}>{item.title}</Text>
              <Text style={[styles.detailsLocation, { color: '#6B7280' }]}>{item.location}</Text>

              {/* Tabs */}
              <View style={styles.tabContainer}>
                 {tabs.map(tab => (
                    <TouchableOpacity 
                      key={tab} 
                      style={[styles.tabItem, activeTab === tab && { borderBottomColor: BRAND_BLUE, borderBottomWidth: 3 }]}
                      onPress={() => setActiveTab(tab)}
                    >
                      <Text style={[styles.tabText, activeTab === tab ? { color: BRAND_BLUE, fontWeight: '700' } : { color: '#9CA3AF' }]}>
                         {tab}
                      </Text>
                    </TouchableOpacity>
                 ))}
              </View>

              {/* Dynamic Content */}
              {renderContent()}

          </View>
        </ScrollView>

        {/* Bottom Footer - Chat Button */}
        <View style={styles.footerBar}>
           <View>
              <Text style={{ color: '#9CA3AF', fontSize: hp(1.6), fontWeight: '500' }}>Total Price</Text>
              <Text style={{ color: BRAND_BLUE, fontSize: hp(2.5), fontWeight: '700' }}>
                 {item.type === 'Scholarship' ? item.price : `₱${item.price}`}
                 {item.type !== 'Scholarship' && <Text style={{ fontSize: hp(1.6), fontWeight: '400' }}> /month</Text>}
              </Text>
           </View>
           <TouchableOpacity style={[styles.bookBtn, { backgroundColor: BRAND_BLUE }]}>
              <Text style={styles.bookBtnText}>Chat</Text>
           </TouchableOpacity>
        </View>
      </View>
    );
  };

  // MAIN RENDER (Conditional)  
  if (selectedProperty) {
    return (
      <SafeAreaView style={styles.container}>
         <View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, flex: 1 }}>
            <PropertyDetailsScreen item={selectedProperty} onBack={() => setSelectedProperty(null)} />
         </View>
      </SafeAreaView>
    );
  }


  const renderRecommendedCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.cardContainer} 
      activeOpacity={0.9} 
      onPress={() => setSelectedProperty(item)} 
    >
      <View style={styles.cardImageContainer}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={[styles.cardTypeTag, { backgroundColor: 'rgba(0, 48, 135, 0.9)' }]}>
          <Text style={styles.cardTypeText}>{item.type}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: BRAND_BLUE }]} numberOfLines={1}>{item.title}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={hp(1.8)} color="#9CA3AF" />
          <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>
        </View>
        <View style={styles.priceRow}>
           <Text style={[styles.priceText, { color: BRAND_RED }]}>
            {item.type === 'Scholarship' ? item.price : `₱${item.price}`}
            {item.type !== 'Scholarship' && <Text style={styles.priceSubText}> /mo</Text>}
           </Text>
           <View style={styles.ratingBadge}>
             <Ionicons name="star" size={hp(1.6)} color="#FFD700" />
             <Text style={styles.ratingText}>{item.rating}</Text>
           </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderNearbyCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.nearbyContainer} 
      activeOpacity={0.9}
      onPress={() => setSelectedProperty(item)} 
    >
      <Image source={{ uri: item.image }} style={styles.nearbyImage} />
      <View style={styles.nearbyContent}>
         <View style={styles.tagRatingRow}>
            <View style={styles.smallTypeTag}>
                <Text style={[styles.smallTypeText, { color: BRAND_BLUE }]}>{item.type}</Text>
            </View>
            <View style={styles.ratingBadge}>
               <Ionicons name="star" size={hp(1.6)} color="#FFD700" />
               <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
         </View>
         <Text style={[styles.nearbyTitle, { color: BRAND_BLUE }]}>{item.title}</Text>
         <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={hp(1.6)} color="#9CA3AF" />
            <Text style={styles.locationText}>{item.location}</Text>
         </View>
         <Text style={[styles.priceTextSmall, { color: BRAND_RED }]}>
            {item.type === 'Scholarship' ? item.price : `₱${item.price}`}
         </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => {
    const isActive = activeCategory === item.name;
    return (
      <TouchableOpacity 
        style={styles.categoryItem} 
        onPress={() => setActiveCategory(item.name)}
      >
        <View style={[styles.categoryIconContainer, isActive && { backgroundColor: BRAND_BLUE }]}>
          <FontAwesome5 name={item.icon} size={hp(2.5)} color={isActive ? 'white' : '#6B7280'} />
        </View>
        <Text style={[styles.categoryText, isActive && { color: BRAND_BLUE, fontWeight: '700' }]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Header */}
          <View style={styles.header}>
             <View>
                 <Text style={styles.locationLabel}>Location</Text>
                 <View style={styles.locationRowMain}>
                     <Ionicons name="location" size={hp(2.5)} color={BRAND_RED} />
                     <Text style={[styles.locationMainText, { color: BRAND_BLUE }]}>Indang, Cavite</Text>
                 </View>
             </View>
             <View style={styles.notificationBtn}>
                <Ionicons name="notifications-outline" size={hp(3)} color="black" />
                <View style={[styles.notificationDot, { backgroundColor: BRAND_RED }]} />
             </View>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Ionicons name="search" size={hp(2.5)} color="#9CA3AF" />
              <TextInput 
                placeholder="Search" 
                placeholderTextColor="#9CA3AF"
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
            <TouchableOpacity style={[styles.filterBtn, { backgroundColor: BRAND_RED }]}>
               <Ionicons name="options-outline" size={hp(3)} color="white" />
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <View style={styles.categoriesContainer}>
            {categories.map((cat) => (
                <View key={cat.id} style={{flex: 1}}>{renderCategory({item: cat})}</View>
            ))}
          </View>

          {/* Recommended */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: BRAND_BLUE }]}>Recommended {activeCategory}s</Text>
            <TouchableOpacity><Text style={[styles.seeAllText, { color: BRAND_RED }]}>See all</Text></TouchableOpacity>
          </View>
          <FlatList 
            horizontal
            data={filteredData}
            renderItem={renderRecommendedCard}
            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />

          {/* Nearby */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: BRAND_BLUE }]}>Nearby {activeCategory}s</Text>
            <TouchableOpacity><Text style={[styles.seeAllText, { color: BRAND_RED }]}>See all</Text></TouchableOpacity>
          </View>
          <View style={styles.nearbyList}>
            {nearbyData.map((prop) => (<View key={prop.id}>{renderNearbyCard({item: prop})}</View>))}
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFF' },
  scrollContent: { paddingBottom: hp(5) },

  // Header & Home Styles
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(5), marginTop: hp(2) },
  locationLabel: { fontSize: hp(1.6), color: '#9CA3AF', marginBottom: hp(0.5) },
  locationRowMain: { flexDirection: 'row', alignItems: 'center' },
  locationMainText: { fontSize: hp(2.2), fontWeight: '700', marginLeft: wp(1) },
  notificationBtn: { position: 'relative', padding: wp(2), backgroundColor: 'white', borderRadius: 50, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  notificationDot: { position: 'absolute', top: hp(1.5), right: wp(2.8), width: wp(2), height: wp(2), borderRadius: wp(1), borderWidth: 1, borderColor: 'white' },

  searchContainer: { flexDirection: 'row', paddingHorizontal: wp(5), marginTop: hp(3), gap: wp(3) },
  searchInputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 15, paddingHorizontal: wp(4), height: hp(6.5), elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  searchInput: { flex: 1, marginLeft: wp(2), fontSize: hp(1.8), color: '#1F2937' },
  filterBtn: { width: hp(6.5), height: hp(6.5), borderRadius: 15, justifyContent: 'center', alignItems: 'center' },

  categoriesContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: wp(5), marginTop: hp(3) },
  categoryItem: { alignItems: 'center' },
  categoryIconContainer: { width: wp(16), height: wp(16), backgroundColor: '#F3F4F6', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: hp(1) },
  categoryText: { fontSize: hp(1.6), color: '#6B7280', fontWeight: '500' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(5), marginTop: hp(3), marginBottom: hp(2) },
  sectionTitle: { fontSize: hp(2.2), fontWeight: '700' },
  seeAllText: { fontSize: hp(1.8), fontWeight: '600' },

  // List Cards Styles 
  horizontalList: { paddingLeft: wp(5), paddingRight: wp(2) },
  cardContainer: { width: wp(65), backgroundColor: 'white', borderRadius: 20, marginRight: wp(4), padding: wp(3), shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, marginBottom: hp(2) },
  cardImageContainer: { position: 'relative', width: '100%', height: hp(18), borderRadius: 15, overflow: 'hidden', marginBottom: hp(1.5) },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardTypeTag: { position: 'absolute', bottom: hp(1.5), left: wp(3), paddingHorizontal: wp(3), paddingVertical: hp(0.5), borderRadius: 8 },
  cardTypeText: { color: 'white', fontSize: hp(1.4), fontWeight: '600' },
  cardContent: { gap: hp(0.5) },
  cardTitle: { fontSize: hp(2), fontWeight: '700' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: hp(0.5) },
  locationText: { fontSize: hp(1.6), color: '#6B7280' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceText: { fontSize: hp(2), fontWeight: '700' },
  priceSubText: { fontSize: hp(1.6), fontWeight: '400', color: '#6B7280' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: hp(1.6), color: '#1F2937', fontWeight: '600' },

  nearbyList: { paddingHorizontal: wp(5) },
  nearbyContainer: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 15, padding: wp(3), marginBottom: hp(2), shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  nearbyImage: { width: wp(22), height: wp(22), borderRadius: 12 },
  nearbyContent: { flex: 1, marginLeft: wp(3), justifyContent: 'space-between', paddingVertical: hp(0.5) },
  tagRatingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  smallTypeTag: { backgroundColor: '#EFF6FF', paddingHorizontal: wp(2), paddingVertical: hp(0.3), borderRadius: 5 },
  smallTypeText: { fontSize: hp(1.3), fontWeight: '600' },
  nearbyTitle: { fontSize: hp(1.9), fontWeight: '700' },
  priceTextSmall: { fontSize: hp(1.9), fontWeight: '700', marginTop: hp(0.5) },

  // PROPERTY DETAILS STYLES
  detailsImage: { width: '100%', height: hp(40), justifyContent: 'space-between', paddingBottom: hp(2) },
  detailsHeaderIcons: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: wp(5), marginTop: hp(2) },
  iconCircle: { width: hp(5), height: hp(5), backgroundColor: 'white', borderRadius: 50, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  
  detailsBody: { flex: 1, backgroundColor: 'white', marginTop: -hp(2), borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: wp(5), paddingTop: hp(3) },
  flexRowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(2) },
  blueTag: { paddingHorizontal: wp(3), paddingVertical: hp(0.8), borderRadius: 8 },
  detailsTitle: { fontSize: hp(3), fontWeight: '800', marginBottom: hp(1) },
  detailsLocation: { fontSize: hp(1.8), marginBottom: hp(3) },
  
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', marginBottom: hp(3) },
  tabItem: { marginRight: wp(8), paddingBottom: hp(1) },
  tabText: { fontSize: hp(1.8) },

  // Content Styles
  facilitiesContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(4) },
  facilityItem: { flexDirection: 'row', alignItems: 'center', gap: wp(2), backgroundColor: '#F9FAFB', paddingHorizontal: wp(4), paddingVertical: hp(1.5), borderRadius: 12 },
  facilityText: { color: '#6B7280', fontSize: hp(1.6), fontWeight: '600' },

  descriptionTitle: { fontSize: hp(2.2), fontWeight: '700', color: '#1F2937', marginBottom: hp(1.5) },
  descriptionText: { fontSize: hp(1.7), color: '#6B7280', lineHeight: hp(2.8), marginBottom: hp(4) },

  agentContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(5) },
  agentImage: { width: hp(6), height: hp(6), borderRadius: 50 },
  agentBtn: { width: hp(6), height: hp(6), backgroundColor: '#003087', borderRadius: 50, justifyContent: 'center', alignItems: 'center' },

  // Gallery Styles
  galleryContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: wp(6), marginBottom: hp(4), justifyContent: 'center' },
  galleryImage: { width: wp(40), height: wp(40), borderRadius: 10, backgroundColor: '#F3F4F6', resizeMode: 'cover' },

  // IMAGE VIEWER MODAL STYLES
  modalContainer: { flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' },
  closeButton: { position: 'absolute', top: Platform.OS === 'ios' ? hp(6) : hp(3), right: wp(5), zIndex: 10, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 50 },
  fullScreenImageContainer: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT, justifyContent: 'center', alignItems: 'center' },
  fullScreenImage: { width: '100%', height: '80%' },

  // Review Styles
  reviewsContainer: { marginBottom: hp(4) },
  reviewItem: { marginBottom: hp(3), borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: hp(2) },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(1) },
  reviewAvatar: { width: hp(5), height: hp(5), borderRadius: 25, backgroundColor: '#D32F2F', justifyContent: 'center', alignItems: 'center' },
  reviewName: { fontWeight: '700', fontSize: hp(1.8), color: '#111' },
  reviewDate: { color: '#9CA3AF', fontSize: hp(1.5) },
  reviewText: { color: '#6B7280', fontSize: hp(1.6), lineHeight: hp(2.4) },

  footerBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#F3F4F6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: wp(5), paddingVertical: hp(2), paddingBottom: Platform.OS === 'ios' ? hp(4) : hp(2) },
  bookBtn: { paddingHorizontal: wp(8), paddingVertical: hp(1.8), borderRadius: 30 },
  bookBtnText: { color: 'white', fontWeight: '700', fontSize: hp(2) }

});

export default HomeScreen;