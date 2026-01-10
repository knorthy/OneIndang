import React, { useMemo, forwardRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, Image } from 'react-native';
import BottomSheet, { 
  BottomSheetView, 
  BottomSheetBackdrop, 
  BottomSheetTextInput 
} from '@gorhom/bottom-sheet';
import { wp } from '../helpers/common';

const SubscribeModal = forwardRef((props, ref) => {
  const snapPoints = useMemo(() => ['48%'], []);

  const handleSheetChange = useCallback((index) => {
    if (index <= 0) {
      Keyboard.dismiss();
    }
  }, []);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        onPress={() => Keyboard.dismiss()} 
      />
    ),
    []
  );

  const onSubscribePress = () => {
    Keyboard.dismiss(); 
    if (ref && 'current' in ref) {
      ref.current?.close();
    }
  };

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: '#E0E0E0' }}
      onChange={handleSheetChange}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="dismiss"
      android_keyboardInputMode="adjustResize"
    >
      <BottomSheetView style={styles.sheetContent}>
        
        {/* HEADER SECTION - LOGO PLACEHOLDER AND TEXT */}
        <View style={styles.headerWrapper}>
          <View style={styles.sheetHeader}>
            {/* CIRCULAR LOGO PLACEHOLDER */}
            <View style={styles.logoPlaceholder}>
              <Image 
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Ph_seal_cavite_indang.png/600px-Ph_seal_cavite_indang.png' }} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.sheetCityName}>CITY OF INDANG</Text>
          </View>
        </View>

        {/* CENTERED MAIN TITLE */}
        <Text style={styles.sheetMainTitle}>
          Subscribe now to stay ahead{"\n"}and never miss a beat!
        </Text>

        <BottomSheetTextInput 
          placeholder="Email address" 
          style={styles.sheetInput} 
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity 
          style={styles.sheetButton} 
          activeOpacity={0.8}
          onPress={onSubscribePress}
        >
          <Text style={styles.sheetButtonText}>Subscribe</Text>
        </TouchableOpacity>

        <Text style={styles.sheetFooterText}>
          Powered by <Text style={{ fontWeight: 'bold' }}>WordPress.com</Text>
        </Text>
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  sheetContent: { 
    paddingHorizontal: wp(8), 
    alignItems: 'center',
    paddingBottom: 5 
  },
  headerWrapper: {
    width: '100%', 
    alignItems: 'flex-start', // Aligns logo/city name to the left corner
    marginBottom: 15,
    marginTop: 5,
  },
  sheetHeader: { 
    flexDirection: 'row', 
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F2', // Light grey placeholder background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEE'
  },
  logoImage: { 
    width: '100%', 
    height: '100%',
  },
  sheetCityName: { 
    fontWeight: 'bold', 
    fontSize: 15, 
    color: '#000',
    letterSpacing: 0.5
  },
  sheetMainTitle: { 
    fontSize: wp(5.2), 
    fontWeight: '700', 
    textAlign: 'center', // Centered as requested
    color: '#000', 
    lineHeight: 24,
    marginBottom: 18,
  },
  sheetInput: { 
    width: '100%', 
    height: 52, 
    borderWidth: 1, 
    borderColor: '#DDD', 
    borderRadius: 6, 
    paddingHorizontal: 15, 
    fontSize: 16, 
    marginBottom: 12,
    backgroundColor: '#FFF',
    color: '#000'
  },
  sheetButton: { 
    width: '100%', 
    height: 52, 
    backgroundColor: '#000', 
    borderRadius: 6, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  sheetButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  sheetFooterText: { fontSize: 11, color: '#666', marginBottom: 5 }
});

export default SubscribeModal;