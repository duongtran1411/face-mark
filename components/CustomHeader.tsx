import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';

const headerBackgroundColor = '#297339'; 

export default function CustomHeader() {
  return (
    <View style={{ backgroundColor: headerBackgroundColor }}>
      <SafeAreaView>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/Demo 1.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
  },
  menuButton: {
    padding: 5,
  },
  menuIcon: {
    color: 'white',
    fontSize: 28,
  },
  logoContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoImage: {
    width: 150,
    height: 40,
  },
}); 