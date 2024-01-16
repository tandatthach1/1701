import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartContext } from './CartContent';

const SingleProductScreen = () => {
  const route = useRoute();
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const { updateCartItemCount } = useContext(CartContext);

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const cartItemsData = await AsyncStorage.getItem('cartItems');
        const existingCartItems = cartItemsData ? JSON.parse(cartItemsData) : [];
        console.log('Existing Cart Items:', existingCartItems);
      } catch (error) {
        console.log('Error loading cart items:', error);
      }
    };

    loadCartItems();
  }, []);

  const handleBuyNow = async () => {
    try {
      const cartItemsData = await AsyncStorage.getItem('cartItems');
      const existingCartItems = cartItemsData ? JSON.parse(cartItemsData) : [];

      const existingItemIndex = existingCartItems.findIndex((item) => item.id === product.id);

      if (existingItemIndex !== -1) {
        // Sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng
        existingCartItems[existingItemIndex].quantity += parseInt(quantity);
      } else {
        // Sản phẩm chưa tồn tại trong giỏ hàng, thêm mới
        existingCartItems.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: parseInt(quantity),
        });
      }

      await AsyncStorage.setItem('cartItems', JSON.stringify(existingCartItems));

      const updatedCartItemCount = existingCartItems.reduce((total, item) => total + item.quantity, 0); // Tính tổng số lượng sản phẩm
      updateCartItemCount(updatedCartItemCount); // Cập nhật số lượng sản phẩm trong giỏ hàng trong context

      console.log('Mua hàng:', product.title, 'Số lượng:', quantity);
    } catch (error) {
      console.log('Error saving cart items:', error);
    }
  };

  const handleQuantityChange = (text) => {
    // Kiểm tra nếu người dùng chỉ nhập số
    if (/^\d+$/.test(text) || text === '') {
      setQuantity(text);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <View style={styles.imageContainer}>
            <Image source={{ uri: product.image }} style={styles.image} />
          </View>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>Giá: ${product.price.toFixed(2)} </Text>
          <Text style={styles.description}>Mô tả sản phẩm: {product.description}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>Đánh giá: </Text>
            {Array.from({ length: Math.floor(product.rating.rate) }).map((_, index) => (
              <Text key={index} style={styles.starIcon}>
                ⭐
              </Text>
            ))}
            <Text style={styles.ratingValue}>{product.rating.rate.toFixed(1)}</Text>
            <Text style={styles.ratingCount}>({product.rating.count} reviews)</Text>
          </View>
        </View>
        <View style={styles.buyContainer}>
          <View style={styles.quantityContainer}>
            <TextInput
              style={styles.quantity}
              placeholder="Qty"
              keyboardType="numeric"
              value={quantity.toString()}
              onChangeText={handleQuantityChange}
            />
          </View>
          {/* Buy Button */}
          <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
            <Text style={styles.buyButtonText}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
  }, imageContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
    width: '100%',
    height: 450,
    resizeMode: 'cover',
  },
  image: {
    width: '90%',
    height: '85%',
    resizeMode: 'cover',
    marginLeft: '5%',
    marginTop: '5%',
    marginBottom: '5%'

  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 22,
    color: 'red',
    marginBottom: 12,
  },
  description: {
    fontSize: 18,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 18,
    marginRight: 4,
  },
  starIcon: {
    fontSize: 16,
  },
  ratingValue: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 2,
    marginLeft: 2,
  },
  ratingCount: {
    marginLeft: 4,
  },
  buyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buyButton: {
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 8,  // Adjust the width of the button
    borderRadius: 8,
    marginLeft: 8,
  },
  buyButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  quantityContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    width: 80, // Adjust the width of the quantity input
  },
  quantity: {
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});

export default SingleProductScreen;
