import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, 
  TextInput, StatusBar, Dimensions, SafeAreaView, Share, Platform, Animated, Alert
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';

import { hp, wp } from '../../helpers/common'; 
import styles from './styles/order.styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- THEME COLORS ---
const THEME_BLUE = '#003087';
const TEXT_GRAY = '#6B7280';
const BG_COLOR = '#FFFFFF';
const SECONDARY_BG = '#F3F4F6';

// --- DATA ---
const RESTAURANT_MENUS = {
  "Chowking": [
    // POPULAR
    { id: 'c1', category: 'Popular', name: 'Fried Pork Siomai (4pc)', price: 110.00, rating: '4.8', reviews: '2k', img: 'https://i.ibb.co/VmxPqGj/siomai-transparent.png' },
    { id: 'c2', category: 'Popular', name: 'Pork Chao Fan', price: 185.00, rating: '4.9', reviews: '5k', img: 'https://i.ibb.co/N6pP7Yx/chaofan-transparent.png' },
    
    // LAURIAT
    { id: 'c3', category: 'Lauriat', name: 'Chinese-Style Chicken Lauriat', price: 235.00, rating: '4.9', reviews: '3k', img: 'https://i.ibb.co/N6pP7Yx/chaofan-transparent.png' },
    { id: 'c4', category: 'Lauriat', name: 'Sweet & Sour Pork Lauriat', price: 235.00, rating: '4.8', reviews: '2k', img: 'https://i.ibb.co/N6pP7Yx/chaofan-transparent.png' },
    { id: 'c8', category: 'Lauriat', name: 'Breaded Pork Chop Lauriat', price: 245.00, rating: '4.7', reviews: '1.5k', img: 'https://i.ibb.co/N6pP7Yx/chaofan-transparent.png' },
    
    // CHAO FAN
    { id: 'c5', category: 'Chao Fan', name: 'Beef Chao Fan', price: 190.00, rating: '4.9', reviews: '4k', img: 'https://i.ibb.co/N6pP7Yx/chaofan-transparent.png' },
    { id: 'c9', category: 'Chao Fan', name: 'Yang Chow Chao Fan', price: 200.00, rating: '4.8', reviews: '3k', img: 'https://i.ibb.co/N6pP7Yx/chaofan-transparent.png' },
    { id: 'c10', category: 'Chao Fan', name: 'Spicy Chao Fan', price: 195.00, rating: '4.6', reviews: '2k', img: 'https://i.ibb.co/N6pP7Yx/chaofan-transparent.png' },

    // DIMSUM
    { id: 'c6', category: 'Dimsum', name: 'Siomai Platter', price: 250.00, rating: '4.8', reviews: '1k', img: 'https://i.ibb.co/VmxPqGj/siomai-transparent.png' },
    { id: 'c11', category: 'Dimsum', name: 'Steamed Siomai (4pc)', price: 110.00, rating: '4.7', reviews: '3k', img: 'https://i.ibb.co/VmxPqGj/siomai-transparent.png' },
    { id: 'c12', category: 'Dimsum', name: 'Lumpia Shanghai (3pc)', price: 95.00, rating: '4.8', reviews: '5k', img: 'https://i.ibb.co/VmxPqGj/siomai-transparent.png' },
    { id: 'c13', category: 'Dimsum', name: 'Buchi (3pc)', price: 85.00, rating: '4.9', reviews: '8k', img: 'https://i.ibb.co/VmxPqGj/siomai-transparent.png' },

    // NOODLES
    { id: 'c14', category: 'Noodles', name: 'Pancit Canton', price: 165.00, rating: '4.8', reviews: '4k', img: 'https://i.ibb.co/N6pP7Yx/chaofan-transparent.png' },
    { id: 'c15', category: 'Noodles', name: 'Beef Wonton Mami', price: 185.00, rating: '4.7', reviews: '2k', img: 'https://i.ibb.co/N6pP7Yx/chaofan-transparent.png' },
    { id: 'c16', category: 'Noodles', name: 'Lomi', price: 195.00, rating: '4.6', reviews: '1k', img: 'https://i.ibb.co/N6pP7Yx/chaofan-transparent.png' },

    // FAMILY MEALS
    { id: 'c17', category: 'Family Meals', name: 'Buchi Platter', price: 350.00, rating: '4.9', reviews: '1k', img: 'https://i.ibb.co/VmxPqGj/siomai-transparent.png' },
    { id: 'c18', category: 'Family Meals', name: 'Family Lauriat Set A', price: 1200.00, rating: '4.8', reviews: '500', img: 'https://i.ibb.co/N6pP7Yx/chaofan-transparent.png' },
    { id: 'c19', category: 'Family Meals', name: 'Family Chao Fan Platter', price: 850.00, rating: '4.7', reviews: '800', img: 'https://i.ibb.co/N6pP7Yx/chaofan-transparent.png' },

    // BEVERAGES
    { id: 'c20', category: 'Beverages', name: 'Iced Tea (Large)', price: 85.00, rating: '4.5', reviews: '5k', img: 'https://i.ibb.co/VmxPqGj/siomai-transparent.png' },
    { id: 'c21', category: 'Beverages', name: 'Pineapple Juice', price: 90.00, rating: '4.6', reviews: '2k', img: 'https://i.ibb.co/VmxPqGj/siomai-transparent.png' },
    { id: 'c22', category: 'Beverages', name: 'Coke Zero', price: 75.00, rating: '4.8', reviews: '3k', img: 'https://i.ibb.co/VmxPqGj/siomai-transparent.png' },

    // DESSERTS
    { id: 'c7', category: 'Desserts', name: 'Halo-Halo Supreme', price: 115.00, rating: '4.9', reviews: '10k', img: 'https://i.ibb.co/VmxPqGj/siomai-transparent.png' },
    { id: 'c23', category: 'Desserts', name: 'Milky White Halo-Halo', price: 105.00, rating: '4.8', reviews: '3k', img: 'https://i.ibb.co/VmxPqGj/siomai-transparent.png' },
  ]
};

const DEFAULT_MENU = RESTAURANT_MENUS["Chowking"];

export default function OrderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { name = "Chowking", image, logo } = params;

  const [cart, setCart] = useState([]); 
  const [activeTab, setActiveTab] = useState(0);
  const [deliveryMode, setDeliveryMode] = useState('delivery');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const horizontalScrollRef = useRef(null); 
  const tabScrollRef = useRef(null);

  // Load Menu Data
  const currentMenu = useMemo(() => {
    if (!name) return DEFAULT_MENU;
    const key = Object.keys(RESTAURANT_MENUS).find(k => name.includes(k));
    return key ? RESTAURANT_MENUS[key] : DEFAULT_MENU;
  }, [name]);

  // Extract Categories
  const categories = useMemo(() => {
    const uniqueCats = [...new Set(currentMenu.map(item => item.category))];
    const sortOrder = ['Popular', 'Lauriat', 'Chao Fan', 'Dimsum', 'Noodles', 'Family Meals', 'Beverages', 'Desserts'];
    return uniqueCats.sort((a, b) => {
      const indexA = sortOrder.indexOf(a);
      const indexB = sortOrder.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [currentMenu]);

  useEffect(() => {
    setActiveTab(0);
    horizontalScrollRef.current?.scrollTo({ x: 0, animated: false });
    tabScrollRef.current?.scrollTo({ x: 0, animated: false });
  }, [name]);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  }, [cart]);

  const handleBack = () => router.canGoBack() ? router.back() : router.replace('/');
  const handleShare = async () => {
    try { await Share.share({ message: `Check out ${name} on OneIndang!` }); } 
    catch (error) { console.log(error); }
  };

  const handleDeliveryChange = () => Alert.alert("Notice", "This feature is not yet available coming soon..");

  const onTabPress = (index) => {
    setActiveTab(index);
    horizontalScrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
    tabScrollRef.current?.scrollTo({ x: index * 80, animated: true });
  };

  const onMomentumScrollEnd = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (index !== activeTab) {
      setActiveTab(index);
      tabScrollRef.current?.scrollTo({ x: index * 80, animated: true });
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" transparent translucent />
        <Stack.Screen options={{ headerShown: false }} />

        {/* 1. FLOATING HEADER */}
        <Animated.View style={[styles.fixedHeader, { opacity: headerOpacity }]} pointerEvents="box-none">
          <SafeAreaView>
            <View style={styles.headerNav}>
              <TouchableOpacity style={styles.circleBtn} onPress={handleBack}>
                <Ionicons name="arrow-back" size={22} color="black" />
              </TouchableOpacity>
              <View style={styles.rightHeaderBtns}>
                <TouchableOpacity style={styles.circleBtn} onPress={() => setIsFavorite(!isFavorite)}>
                  <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={22} color={isFavorite ? THEME_BLUE : "black"} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.circleBtn} onPress={handleShare}>
                  <Ionicons name="share-outline" size={22} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Animated.View>

        {/* MAIN SCROLL VIEW */}
        <Animated.ScrollView 
          stickyHeaderIndices={[2]} 
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          {/* CHILD 0: HERO IMAGE */}
          <View style={styles.heroContainer}>
             <Image source={{ uri: image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4' }} style={styles.heroImage} />
             <View style={styles.logoBadge}>
               <Image source={{ uri: logo || 'https://upload.wikimedia.org/wikipedia/en/thumb/8/85/Chowking_logo.svg/1200px-Chowking_logo.svg.png' }} style={styles.logoImg} />
             </View>
          </View>

          {/* CHILD 1: INFO SECTION */}
          <View style={styles.infoSection}>
            <Text style={styles.restaurantName}>{name}</Text>
            <View style={styles.mainRatingRow}>
              <Ionicons name="star" size={16} color="#FBBF24" />
              <Text style={styles.ratingValue}> 4.8 (10k+ ratings)</Text>
            </View>
            
            <TouchableOpacity style={styles.deliveryBox} onPress={handleDeliveryChange}>
              <View style={styles.deliveryContent}>
                <View style={styles.iconWrapper}>
                  <MaterialCommunityIcons name={deliveryMode === 'delivery' ? "moped" : "walk"} size={24} color={THEME_BLUE} />
                </View>
                <View style={styles.deliveryTextContainer}>
                  <Text style={styles.deliveryTitle}>{deliveryMode === 'delivery' ? "Delivery" : "Pick-up"}</Text>
                  <Text style={styles.deliverySub}>₱ 59.00 • 25-50 min</Text>
                </View>
                <View style={styles.changeWrapper}>
                  <Text style={styles.changeText}>Change</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* CHILD 2: STICKY SEARCH & TABS */}
          <View style={styles.stickyArea}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color={TEXT_GRAY} />
              <TextInput 
                placeholder="Search menu" 
                style={styles.searchInput} 
                value={searchQuery} 
                onChangeText={setSearchQuery} 
                placeholderTextColor={TEXT_GRAY}
              />
              {searchQuery.length > 0 && (
                 <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={18} color={TEXT_GRAY} />
                 </TouchableOpacity>
              )}
            </View>
            
            <ScrollView 
              ref={tabScrollRef}
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.tabScroll}
            >
              {categories.map((tab, index) => (
                <TouchableOpacity key={tab} onPress={() => onTabPress(index)} style={[styles.tabBtn, activeTab === index && styles.activeTab]}>
                  <Text style={[styles.tabText, activeTab === index && styles.activeTabText]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* CHILD 3: MENU GRID */}
          <ScrollView
            ref={horizontalScrollRef}
            horizontal
            pagingEnabled
            onMomentumScrollEnd={onMomentumScrollEnd}
            showsHorizontalScrollIndicator={false}
          >
            {categories.map((category, catIndex) => {
               const filteredItems = currentMenu.filter(item => 
                 item.category === category && 
                 item.name.toLowerCase().includes(searchQuery.toLowerCase())
               );

               return (
                <View key={catIndex} style={[styles.menuPage, { minHeight: hp(80) }]}>
                  <Text style={styles.sectionHeader}>{category}</Text>
                  <View style={styles.menuGrid}>
                    {filteredItems.map((item) => (
                      <MenuItem key={item.id} {...item} onPress={() => {}} />
                    ))}
                    {filteredItems.length === 0 && (
                      <View style={{width: '100%', alignItems: 'center', marginTop: 30}}>
                        <Text style={{color: TEXT_GRAY}}>No {searchQuery} found in {category}</Text>
                      </View>
                    )}
                  </View>
                  <View style={{ height: 150 }} />
                </View>
              );
            })}
          </ScrollView>
        </Animated.ScrollView>

        {/* Floating Cart Button */}
        {cart.length > 0 && (
          <View style={styles.cartBarContainer}>
            <TouchableOpacity style={styles.cartBar} onPress={() => router.push('/cart')} activeOpacity={0.9}>
              <View style={styles.cartLeft}>
                <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{cart.length}</Text></View>
                <Text style={styles.viewOrderText}>View your order</Text>
              </View>
              <Text style={styles.cartPriceText}>₱ {cartTotal}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const MenuItem = ({ name, price, img, rating, reviews, onPress }) => (
  <TouchableOpacity style={styles.foodCard} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.imageContainer}>
      <Image source={{ uri: img }} style={styles.foodImg} />
      <View style={styles.addBtn}><Ionicons name="add" size={20} color="white" /></View>
    </View>
    <Text style={styles.foodName} numberOfLines={1}>{name}</Text>
    <Text style={styles.itemRatingText}>⭐ {rating} ({reviews})</Text>
    <Text style={styles.foodPrice}>₱ {price.toFixed(2)}</Text>
  </TouchableOpacity>
);