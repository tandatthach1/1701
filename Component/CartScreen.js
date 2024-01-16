import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartContext } from './CartContent';


const CartScreen = () => {
  const { updateCartItemCount } = useContext(CartContext);

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [itemPrices, setItemPrices] = useState({});

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      const cartItemsData = await AsyncStorage.getItem('cartItems');
      if (cartItemsData) {
        const parsedCartItems = JSON.parse(cartItemsData);
        setCartItems(parsedCartItems);
        updateCartItemCount(getCartItemCount(parsedCartItems));

        // Initialize item prices based on the current cart items
        const initialItemPrices = {};
        parsedCartItems.forEach((item) => {
          initialItemPrices[item.id] = item.price * item.quantity;
        });
        setItemPrices(initialItemPrices);
      }
    } catch (error) {
      console.log('Error fetching cart items:', error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const updatedCartItems = cartItems.map((item) => {
        if (item.id === itemId && itemId != null) {
          item.quantity -= 1;
          if (item.quantity === 0) {
            return null;
          }
          updateItemPrice(itemId, item.quantity);
        }
        return item;
      }).filter(Boolean);

      setCartItems(updatedCartItems);
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

      updateCartItemCount(getCartItemCount(updatedCartItems));
    } catch (error) {
      console.log('Error removing item from cart:', error);
    }
  };

  const updateItemPrice = (itemId, newQuantity) => {
    setItemPrices((prevItemPrices) => {
      const updatedItemPrices = { ...prevItemPrices };
      const updatedItem = cartItems.find((item) => item.id === itemId);

      if (updatedItem) {
        updatedItemPrices[itemId] = updatedItem.price * newQuantity;
        setTotalPrice((prevTotalPrice) => prevTotalPrice + updatedItemPrices[itemId] - prevItemPrices[itemId]);
      }

      return updatedItemPrices;
    });
  };

  const calculateTotalPrice = () => {
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    setTotalPrice(totalPrice);
  };

  const getCartItemCount = (cartItems) => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  const handleCheckoutItem = async (item) => {
    try {
      setLoading(true);
      if (!itemPrices || typeof itemPrices !== 'object') {
        Alert.alert('Lỗi thanh toán', 'Không thể xác định giá của sản phẩm. Vui lòng thử lại sau.');
        return;
      }
  
      if (!item.id || !itemPrices[item.id]) {
        Alert.alert('Lỗi thanh toán', 'Không thể xác định giá của sản phẩm này. Vui lòng thử lại sau.');
        return;
      }
  
    const itemTotalPrice = itemPrices[item.id];

    if (typeof itemTotalPrice === 'number') {
      Alert.alert(
        `Thanh toán thành công cho ${item.title}`,
        `Số tiền đã thanh toán: $${itemTotalPrice.toFixed(2)}`,
        
        [
          {
            text: 'OK',
            onPress: async () => {
              // Xóa sản phẩm đã thanh toán khỏi giỏ hàng
              const updatedCartItems = cartItems.filter((cartItem) => cartItem.id !== item.id);
              setCartItems(updatedCartItems);

              // Lưu giỏ hàng mới vào AsyncStorage
              await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

              const updatedItemPrices = {};
              cartItems.forEach((item) => {
                updatedItemPrices[item.id] = item.price * item.quantity;
              });
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Lỗi thanh toán',
        'Không thể xác định tổng tiền cho sản phẩm này. Vui lòng thử lại sau.'
      );
    }
  } catch (error) {
    console.log('Lỗi trong quá trình thanh toán cho sản phẩm:', error);
    Alert.alert(
      'Lỗi thanh toán',
      'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.'
    );
  }
   finally {
    setLoading(false);
  }
};
    
  
  
  const handlePaymentSuccess = async () => {
    // Xóa tất cả sản phẩm khỏi giỏ hàng sau khi thanh toán thành công
    setCartItems([]);
    await AsyncStorage.removeItem('cartItems');
    updateCartItemCount(0);

    // Cập nhật giá trị tổng tiền (đặt lại 0)
    setTotalPrice(0);
  };

  const handleIncreaseQuantity = (itemId) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === itemId && itemId != null) {
        item.quantity += 1;
        updateItemPrice(itemId, item.quantity);
      }
      return item;
    });

    setCartItems(updatedCartItems);
    updateCartItemCount(getCartItemCount(updatedCartItems));
    AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    calculateTotalPrice();
  };
  
  
  const handleDecreaseQuantity = (itemId) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === itemId && itemId != null) {
        if (item.quantity === 1 || item.quantity < 2) {
          return item;
        }
        item.quantity -= 1;
        updateItemPrice(itemId, item.quantity);
      }
      return item;
    }).filter(Boolean);

    setCartItems(updatedCartItems);
    updateCartItemCount(getCartItemCount(updatedCartItems));
    AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    calculateTotalPrice();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đơn hàng</Text>
      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Image source={{ uri: item.image }} style={styles.cartItemImage} />
              <View style={styles.cartItemInfo}>
                <Text style={styles.cartItemTitle}>{item.title} </Text>
                <Text style={styles.cartItemPrice}>
  Giá: ${typeof item.price === 'number' ? item.price * (item.quantity || 0) : 'N/A'}
</Text>
                <View style={styles.quantityControls}>
                  <TouchableOpacity onPress={() => handleDecreaseQuantity(item.id)}>
                    <Text style={styles.quantityControlButton}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => handleIncreaseQuantity(item.id)}>
                    <Text style={styles.quantityControlButton}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                <Text style={styles.removeItemButton}>Xóa</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleCheckoutItem(item)}>
                <Text style={styles.checkoutItemButton}>Thanh toán</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text style={styles.emptyCartText}>Giỏ hàng của bạn trống!</Text>
      )}
      <Text style={styles.totalPrice}>Tổng giá đơn hàng của bạn: ${totalPrice.toFixed(2)}</Text>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  checkoutItemButton: {
    fontSize: 16,
    color: 'green',
    marginTop: 8,
    marginRight: 8, // Add margin to separate buttons
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityControlButton: {
    fontSize: 18,
    color: 'blue',
    paddingHorizontal: 8,
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cartItemImage: {
    width: '18%',
    height: '90%',
    resizeMode: 'contain',
    marginRight: 8,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cartItemPrice: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  removeItemButton: {
    fontSize: 16, // Decrease font size for a more balanced look
    color: 'red',
    marginTop: 8,
    marginRight: 8, // Add margin to separate buttons
  },
  emptyCartText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default CartScreen;
