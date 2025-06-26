import React from 'react';
import { View, StyleSheet, SafeAreaView, Image } from 'react-native';

const headerBackgroundColor = '#297339';

export default function CustomHeader() {
  return (
    <View style={{ backgroundColor: headerBackgroundColor }}>
      <SafeAreaView>
        <View style={styles.headerContainer}>
          <View style={styles.spacer} />

          <View style={styles.logoWrapper}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/images/Demo 1.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.spacer} /> 
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
    position: 'relative',
  },
  spacer: {
    width: 40,
  },
  logoWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
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
