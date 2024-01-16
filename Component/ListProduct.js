import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartContext } from './CartContent';
import { useNavigation } from '@react-navigation/native';
import Header from './Header';

export default function ListProduct() {
  const navigation = useNavigation();

  const CartScreen = () => {
    navigation.navigate('CartScreen');
  };

  const Login = () => {
    navigation.navigate('Login');
  };

  const { cartItemCount, updateCartItemCount } = useContext(CartContext);

  const [searchText, setSearchText] = useState('');
  const [showClearButton, setShowClearButton] = useState(false);
  const [minSearchLength, setMinSearchLength] = useState(1);
  const [noResults, setNoResults] = useState(false);

  const handleProductPress = (product) => {
    navigation.navigate('SingleProduct', { product });
  };

  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  useEffect(() => {
    getAllProduct();
  }, []);

  const handleSearch = (searchText) => {
    const filteredProducts = originalProducts.filter(item =>
      item.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setProducts(filteredProducts);
    setNoResults(filteredProducts.length === 0);
  };

  const fetchAllProducts = () => {
    resetProducts();
  };

  const resetProducts = () => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(json => setProducts(json));
  };

  const clearSearch = () => {
    setSearchText('');
    // Fetch all products when search text is cleared
    fetchAllProducts();
  };

  const setSearchTextAndSearch = (text) => {
    setSearchText(text);
    if (text.length >= minSearchLength) {
      handleSearch(text);
    } else {
      // Fetch all products when search text is empty
      setProducts(originalProducts);
    }
  };

  const getAllProduct = () => {
    axios
      .get('https://fakestoreapi.com/products')
      .then(function (response) {
        const data = response.data;
        setProducts(data);
        setOriginalProducts(data);
      })
      .catch(function (error) {
        alert(error.message);
      });
  };
  const getCategoryProducts = async (categories) => {
    try {
      const requests = categories.map((category) =>
        axios.get(`https://fakestoreapi.com/products/category/${category}`)
      );
      const responses = await Promise.all(requests);
      const mergedProducts = responses.flatMap((response) => response.data);
      setProducts(mergedProducts);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <View style={styles.searchContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginLeft:30,marginRight:-50 }}>
          
          <TextInput
            placeholder="Bạn cần tìm gì?"
            value={searchText}
            onChangeText={text => {
              setSearchTextAndSearch(text);
              setShowClearButton(!!text);
            }}
            style={{
              width: '80%',
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              borderRadius: 20,
              paddingHorizontal: 15,
              marginRight: 10,
            }}
          />
        
        </View>
        <View style={styles.cart}>
          <TouchableOpacity style={styles.cartContainer} onPress={CartScreen}>
            <FontAwesome name="shopping-cart" size={25} color="black" />
          </TouchableOpacity>
            <View style={styles.cartContainer}>
              <Text style={styles.cartTitleText}>Giỏ hàng</Text>
            </View>
        </View>

        <View style={styles.cart}>
          <TouchableOpacity style={styles.cartContainer} onPress={Login}>
            <FontAwesome name="user" size={25} color="black" />
          </TouchableOpacity>
          <View style={styles.cartContainer}>
              <Text style={styles.cartTitleText}>Đăng nhập</Text>
            </View>
        </View>
      </View>
      <View>
            
      {/* Gọi trang header */}
           <Header></Header>
      </View>
      <View>
        <View style={styles.catetitle}>
          <Text style={{ fontSize: 20, color: 'red', fontWeight: '600' }}>Danh mục</Text>
          <Text style={{ fontSize: 13, color: 'blue', fontWeight: '600' }}>Xem thêm</Text>
        </View>

        <SafeAreaView style={styles.contain}>
          <View style={styles.categoryContainer}>
            <TouchableOpacity style={styles.categoryItem} onPress={getAllProduct}>
              <Image
                style={{ width: 30, height: 30, marginLeft: 10, marginTop: 3 }}
                source={require('../Image/danhmuc/all.png')}
              />
              <Text style={{ fontSize: 15, marginTop: 5, marginLeft: 10 }}>Tất cả</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => getCategoryProducts(["men's clothing"])}
            >
              <Image style={styles.catepic} source={require('../Image/danhmuc/ao.png')} />
              <Text style={styles.categoryTitle}>Áo Nam</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => getCategoryProducts(["women's clothing"])}
            >
              <Image style={styles.catepic} source={require('../Image/danhmuc/ao.png')} />
              <Text style={styles.categoryTitle}>Áo Nữ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => getCategoryProducts(["electronics", "jewelery"])}
            >
              <Image style={styles.catepic} source={require('../Image/danhmuc/phukien.png')} />
              <Text style={styles.categoryTitle}>Phụ kiện</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={styles.catetitle}>
          <Text style={{ fontSize: 20, color: 'red', fontWeight: '600' }}>Tất cả sản phẩm</Text>
          <Text style={{ fontSize: 13, color: 'blue', fontWeight: '600' }}>Xem thêm</Text>
        </View>

        <ScrollView>
          {noResults ? (
            <Text style={styles.noResultsText}>Không tìm thấy kết quả nào</Text>
          ) : (
            <View style={styles.container}>
              {products.map((product) => (
                <TouchableOpacity
                  style={styles.item}
                  key={product.id}
                  onPress={() => handleProductPress(product)}
                >
                  <View>
                    <Image style={styles.img} source={{ uri: product.image }} />
                  </View>
                  <View style={styles.des}>
                    <Text style={styles.des_text}>{product.title}</Text>
                    <Text style={styles.price}>Price: ${product.price.toFixed(2)}</Text>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingText}>Rating: </Text>
                      <FontAwesome name="star" style={styles.starIcon} />
                      <Text style={styles.ratingValue}>{product.rating.rate.toFixed(1)}</Text>
                      <Text style={styles.ratingCount}>({product.rating.count} reviews)</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
    width: 400,
    paddingRight: 10,
    marginTop: 10
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingrizontal: 10,
    width: '80%',
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  searchButton: {
    padding: 10,
  },
  cart: {
    alignItems: 'center',
    marginRight:5,
    marginTop:6
  },
  cartContainer: {
    alignItems: 'center',
    marginLeft:-10
    
  },
  cartTitleText: {
    marginLeft: 10,
    fontSize: 12,
  },  
  searchResultsContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    elevation: 3,
    borderRadius: 5,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    zIndex: 1,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#CC3333',
  },
  searchResultItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    position: 'relative', // Đảm bảo relative position để z-index có hiệu lực
  },
  item: {
    width: '30%',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  contain: {
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20,
  },
  catepic: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
  },
  catetitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 5,
  },
  item: {
    width: '48%',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  img: {
    width: '100%',
    height: 170,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  des: {
    padding: 8,
  },
  des_text: {
    color: 'black',
    textAlign: 'center',
    marginBottom: 4,
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    color: 'black',
    textAlign: 'center',
    marginBottom: 4,
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    color: 'black',
  },
  starIcon: {
    color: 'gold',
    fontSize: 16,
    marginRight: 2,
  },
  ratingValue: {
    color: 'black',
    marginRight: 2,
  },
  ratingCount: {
    color: 'black',
  },
});
