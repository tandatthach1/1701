import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default function Header() {
  const [currentImage, setCurrentImage] = useState(1);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Chuyển đổi giữa hình ảnh 1 và hình ảnh 2 sau 3 giây
      setCurrentImage(currentImage === 1 ? 2 : 1);
    }, 5000);

    // Lưu ý: Tránh thiếu sót và lỗi memory leak bằng cách làm sạch timeout khi component unmounts
    return () => clearTimeout(timeoutId);
  }, [currentImage]);

  return (
    <View style={styles.header}>
      <StatusBar style="auto" />

      <View style={styles.logoContainer}>
        {currentImage === 1 ? (
          <Image
            style={styles.logo}
            source={require('../Image/background1.png')}
          />
        ) : (
          <Image
            style={styles.logo}
            source={require('../Image/background2.png')}
          />
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  text: {
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    height: 220,
    width: '100%',
    resizeMode: 'contain',
  },
  search: {
    height: 100,
    width: 370,
    marginBottom: -40,
  },
});
