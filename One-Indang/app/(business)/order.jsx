import React, { useState, useRef, useMemo } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, 
  StatusBar, Dimensions, SafeAreaView, Platform, Animated
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { hp, wp } from '../../helpers/common'; 
import { useCart } from '../../context/CartContext'; 

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- THEME COLORS ---
const COLORS = {
  primary: '#003087', // Deep Blue
  secondary: '#D32F2F', // Bright Red
  background: '#ffffff',
  text: '#003087',
  textGray: '#666666',
  lightRedBg: '#FFEBEE', 
  lightBlueBg: '#E3F2FD', 
};

// --- LOCAL IMAGES MAP ---
const RESTAURANT_MENUS = {
  "Jollibee Indang": [
    { id: 'j1', category: 'Best Sellers', name: 'Chickenjoy - 1pc w/ Rice', price: 99.00, img: require('../../assets/images/foods/chickenjoy.png') },
    { id: 'j2', category: 'Best Sellers', name: 'Jolly Spaghetti', price: 60.00, img: require('../../assets/images/foods/spaghetti.png') },
    { id: 'j3', category: 'Burgers', name: 'Yumburger', price: 45.00, img: require('../../assets/images/foods/yumburger.png') },
    { id: 'j4', category: 'Burgers', name: 'Cheesy Yumburger', price: 65.00, img: require('../../assets/images/foods/yumburger.png') },
    { id: 'j5', category: 'Sandwiches', name: 'Jolly Hotdog', price: 85.00, img: require('../../assets/images/foods/hotdog.png') },
    { id: 'j6', category: 'Dessert', name: 'Peach Mango Pie', price: 48.00, img: require('../../assets/images/foods/pie.png') },
    { id: 'j7', category: 'Buckets', name: 'Chickenjoy Bucket (6pcs)', price: 499.00, img: require('../../assets/images/foods/bucket.png') },
  ],
  "Siglo Farm Café": [
    { id: 's1', category: 'Coffee', name: 'Barako Brew', price: 120.00, img: require('../../assets/images/foods/coffee.png') },
    { id: 's2', category: 'Coffee', name: 'Iced Caramel Macchiato', price: 150.00, img: require('../../assets/images/foods/macchiato.png') },
    { id: 's3', category: 'Mains', name: 'Siglo Salad', price: 220.00, img: require('../../assets/images/foods/salad.png') },
    { id: 's4', category: 'Mains', name: 'Chicken Adobo w/ Red Rice', price: 280.00, img: require('../../assets/images/foods/adobo.png') },
    { id: 's5', category: 'Tea', name: 'Fresh Herbal Tea (Tarragon)', price: 90.00, img: require('../../assets/images/foods/tea.png') },
  ],
  "Celyns Inasal": [
    { id: 'c1', category: 'Inasal', name: 'Paa (Leg) w/ Unli Rice', price: 135.00, img: require('../../assets/images/foods/inasal.png') },
    { id: 'c2', category: 'Inasal', name: 'Pecho (Breast) w/ Unli Rice', price: 145.00, img: require('../../assets/images/foods/inasal.png') },
  ],
  "Indang Town Milk Tea": [
    { id: 'm1', category: 'Milk Tea', name: 'Pearl Milk Tea (Large)', price: 95.00, img: require('../../assets/images/foods/milktea.png') },
  ],
  "Kusina ni Lolo": [
    { id: 'k1', category: 'Soup', name: 'Special Bulalo (Good for 3)', price: 650.00, img: require('../../assets/images/foods/bulalo.png') },
  ]
};

const DEFAULT_MENU = RESTAURANT_MENUS["Jollibee Indang"];

export default function OrderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { name = "Jollibee Indang" } = params;

  const { cartItems, addToCart, removeFromCart, cartTotal, cartCount } = useCart();

  const [activeTab, setActiveTab] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const horizontalScrollRef = useRef(null); 

  const currentMenu = useMemo(() => {
    if (RESTAURANT_MENUS[name]) return RESTAURANT_MENUS[name];
    const key = Object.keys(RESTAURANT_MENUS).find(k => name.includes(k) || k.includes(name));
    return key ? RESTAURANT_MENUS[key] : DEFAULT_MENU;
  }, [name]);

  const categories = useMemo(() => {
    const uniqueCats = [...new Set(currentMenu.map(item => item.category))];
    return uniqueCats;
  }, [currentMenu]);

  const getHeroImage = () => {
    if (name.includes('Jollibee')) return require('../../assets/images/foods/jollibee.png');
    if (name.includes('Siglo')) return require('../../assets/images/foods/siglo.png');
    if (name.includes('Celyns')) return require('../../assets/images/foods/celyns.png');
    if (name.includes('Milk')) return require('../../assets/images/foods/milktea.png');
    return require('../../assets/images/foods/kusina.png');
  };

  const getCartItemQty = (id) => {
    const item = cartItems.find(i => i.id === id);
    return item ? item.qty : 0;
  };

  const handleAddToCart = (item) => addToCart(item, name);
  const handleViewCart = () => router.push('/(business)/cart');
  const handleBack = () => router.back(); 

  const onTabPress = (index) => {
    setActiveTab(index);
    horizontalScrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
  };

  const headerBgOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" transparent translucent />
        
        <View style={styles.fixedHeaderWrapper}>
            <Animated.View style={[styles.headerBackground, { opacity: headerBgOpacity }]} />
            <View style={styles.headerNav}>
                <TouchableOpacity style={styles.circleBtn} onPress={handleBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <View style={styles.rightHeaderBtns}>
                  <TouchableOpacity style={styles.circleBtn} onPress={() => setIsFavorite(!isFavorite)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? COLORS.secondary : COLORS.text} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.circleBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="share-outline" size={24} color={COLORS.text} />
                  </TouchableOpacity>
                </View>
            </View>
        </View>

        <Animated.ScrollView 
          stickyHeaderIndices={[2]} 
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hp(15) }}
        >
          <View style={styles.heroContainer}>
             <Image source={getHeroImage()} style={styles.heroImage} />
             <View style={styles.logoBadge}>
               <Image source={getHeroImage()} style={styles.logoImg} />
             </View>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.restaurantName}>{name}</Text>
            <View style={styles.mainRatingRow}>
              <Ionicons name="star" size={16} color="#FFB800" />
              <Text style={styles.ratingValue}> 4.8 (Verified)</Text>
            </View>
            
            <TouchableOpacity style={styles.deliveryBox}>
              <View style={styles.deliveryContent}>
                <View style={styles.iconWrapper}><MaterialCommunityIcons name="moped" size={24} color={COLORS.secondary} /></View>
                <View style={styles.deliveryTextContainer}>
                  <Text style={styles.deliveryTitle}>Delivery</Text>
                  <Text style={styles.deliverySub}>₱ 59.00 • 25-50 min</Text>
                </View>
                <Text style={styles.changeText}>Change</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.stickyArea}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
              {categories.map((tab, index) => (
                <TouchableOpacity key={tab} onPress={() => onTabPress(index)} style={[styles.tabBtn, activeTab === index && styles.activeTab]}>
                  <Text style={[styles.tabText, activeTab === index && styles.activeTabText]}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ScrollView ref={horizontalScrollRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false} scrollEnabled={false}>
            {categories.map((category, catIndex) => {
               const filteredItems = currentMenu.filter(item => item.category === category);
               return (
                <View key={catIndex} style={[styles.menuPage]}>
                  <Text style={styles.sectionHeader}>{category}</Text>
                  <View style={styles.menuGrid}>
                    {filteredItems.map((item) => (
                      <MenuItem 
                        key={item.id} 
                        {...item} 
                        qty={getCartItemQty(item.id)}
                        onAdd={() => handleAddToCart(item)}
                        onRemove={() => removeFromCart(item.id)}
                      />
                    ))}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </Animated.ScrollView>

        {cartCount > 0 && (
          <View style={styles.cartBarContainer}>
            <TouchableOpacity style={styles.cartBar} onPress={handleViewCart} activeOpacity={0.9}>
              <View style={styles.cartLeft}>
                <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{cartCount}</Text></View>
                <View style={{marginLeft: 12}}>
                    <Text style={styles.viewOrderText}>View your cart</Text>
                    <Text style={styles.restaurantSubText}>{cartItems[0]?.restaurant === name ? name : "Active Order"}</Text>
                </View>
              </View>
              <Text style={styles.cartPriceText}>₱ {cartTotal.toFixed(2)}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const MenuItem = ({ name, price, img, qty, onAdd, onRemove }) => (
  <View style={styles.foodCard}>
    <View style={styles.imageContainer}>
      <Image source={img} style={styles.foodImg} />
    </View>
    <View style={styles.foodContent}>
        <Text style={styles.foodName} numberOfLines={2}>{name}</Text>
        <Text style={styles.foodPrice}>₱ {price.toFixed(2)}</Text>
        
        {qty === 0 ? (
            <TouchableOpacity style={styles.addBtnCircle} onPress={onAdd}>
                <Ionicons name="add" size={24} color={COLORS.secondary} />
            </TouchableOpacity>
        ) : (
            <View style={styles.counterControl}>
                <TouchableOpacity onPress={onRemove} style={styles.counterBtn}>
                    <Ionicons name="remove" size={18} color="white" />
                </TouchableOpacity>
                <Text style={styles.counterVal}>{qty}</Text>
                <TouchableOpacity onPress={onAdd} style={styles.counterBtn}>
                    <Ionicons name="add" size={18} color="white" />
                </TouchableOpacity>
            </View>
        )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  fixedHeaderWrapper: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50, paddingHorizontal: wp(4), paddingBottom: 10 },
  headerBackground: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#FFF', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 4 },
  headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rightHeaderBtns: { flexDirection: 'row', gap: 12 },
  circleBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4 },
  heroContainer: { height: hp(22), backgroundColor: '#E5E7EB' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  logoBadge: { position: 'absolute', bottom: -30, alignSelf: 'center', width: 70, height: 70, backgroundColor: '#FFF', borderRadius: 35, elevation: 5, justifyContent: 'center', alignItems: 'center' },
  logoImg: { width: '80%', height: '80%', resizeMode: 'contain' },
  infoSection: { paddingHorizontal: wp(5), marginTop: 40, alignItems: 'center' },
  restaurantName: { fontSize: 22, fontWeight: 'bold', color: COLORS.text },
  mainRatingRow: { flexDirection: 'row', marginTop: 4, marginBottom: 15, alignItems: 'center' },
  ratingValue: { color: COLORS.textGray, fontSize: 13 },
  deliveryBox: { width: '100%', borderRadius: 12, padding: 12, backgroundColor: '#FFF', elevation: 2 },
  deliveryContent: { flexDirection: 'row', alignItems: 'center' },
  iconWrapper: { marginRight: 10 },
  deliveryTextContainer: { flex: 1 },
  deliveryTitle: { fontWeight: 'bold', fontSize: 14, color: COLORS.text },
  deliverySub: { color: COLORS.textGray, fontSize: 12 },
  changeText: { color: COLORS.secondary, fontWeight: 'bold', fontSize: 13 },
  stickyArea: { backgroundColor: COLORS.background, zIndex: 100, paddingTop: 10 },
  tabScroll: { paddingHorizontal: wp(5), paddingBottom: 10 },
  tabBtn: { marginRight: 20, paddingBottom: 8, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: COLORS.secondary },
  tabText: { fontWeight: '600', color: COLORS.textGray, fontSize: 14 },
  activeTabText: { color: COLORS.secondary },
  menuPage: { width: SCREEN_WIDTH, paddingHorizontal: wp(5), paddingTop: 20 },
  sectionHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: COLORS.text },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  foodCard: { width: wp(43), backgroundColor: '#FFF', borderRadius: 12, marginBottom: 20, elevation: 3, overflow: 'hidden' },
  imageContainer: { height: wp(30), width: '100%', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  foodImg: { width: '90%', height: '90%', resizeMode: 'contain' },
  foodContent: { padding: 10 },
  foodName: { fontWeight: '700', fontSize: 13, color: '#333', height: 35 },
  foodPrice: { fontWeight: '600', color: '#555', marginTop: 4, fontSize: 13 },
  addBtnCircle: { alignSelf: 'flex-end', marginTop: 5, backgroundColor: '#FFF', borderRadius: 20, width: 32, height: 32, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#DDD', elevation: 2 },
  counterControl: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginTop: 5, backgroundColor: COLORS.secondary, borderRadius: 20, paddingHorizontal: 4, paddingVertical: 2 },
  counterBtn: { padding: 4 },
  counterVal: { color: 'white', fontWeight: 'bold', marginHorizontal: 6, fontSize: 13 },
  cartBarContainer: { position: 'absolute', bottom: 20, left: 0, right: 0, paddingHorizontal: wp(4) },
  cartBar: { backgroundColor: COLORS.primary, height: 65, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, elevation: 8 },
  cartLeft: { flexDirection: 'row', alignItems: 'center' },
  cartBadge: { backgroundColor: '#FFF', width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary },
  cartBadgeText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 12 },
  viewOrderText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  restaurantSubText: { color: 'rgba(255,255,255,0.8)', fontSize: 11 },
  cartPriceText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});