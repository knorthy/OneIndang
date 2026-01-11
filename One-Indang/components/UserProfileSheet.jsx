import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { hp, wp } from '../helpers/common';
import { COLORS } from '../constants/theme';

const UserProfileSheet = React.forwardRef(
  ({ onEditProfile, onLogout }, ref) => {
    
    const snapPoints = useMemo(() => ['25%'], []); 

    const handleEditPress = useCallback(() => {
      onEditProfile?.();
    }, [onEditProfile]);

    const handleLogoutPress = useCallback(() => {
      onLogout?.();
    }, [onLogout]);

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.indicator}
      >
        <BottomSheetView style={styles.container}>
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleEditPress}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="edit"
              size={hp(2.5)}
              color={COLORS.primary || '#000'} 
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogoutPress}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="logout"
              size={hp(2.5)}
              color="#FF6B6B"
              style={styles.icon}
            />
            <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
          
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

UserProfileSheet.displayName = 'UserProfileSheet';

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  indicator: {
    backgroundColor: '#ccc',
    width: wp(10),
    height: 4,
  },
  container: {
    paddingHorizontal: wp(5),
    paddingTop: hp(1),
    paddingBottom: hp(3),
    flex: 1, 
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    paddingHorizontal: wp(7),
    marginVertical: hp(1),
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  logoutButton: {
    backgroundColor: '#FFE5E5',
  },
  icon: {
    marginRight: wp(4),
  },
  buttonText: {
    fontSize: hp(2),
    fontWeight: '600',
    color: COLORS.black || '#000',
  },
  logoutText: {
    color: '#FF6B6B',
  },
});

export default UserProfileSheet;