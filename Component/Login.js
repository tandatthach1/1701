import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  KeyboardAvoidingView, ImageBackground, Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

function Login({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Kiểm tra điều kiện đăng nhập
    if (username === 'tandat' && password === '123') {
      // Đăng nhập thành công
      alert('Đăng nhập thành công');
      // Chuyển đến trang HomeScreen
      navigation.navigate('HomeScreen');
    } else {
      // Đăng nhập thất bại, bạn có thể thực hiện xử lý khác tùy thuộc vào yêu cầu
      alert('Đăng nhập thất bại, vui lòng kiểm tra lại tên đăng nhập và mật khẩu');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View>
        <ImageBackground style={styles.background}>
          <Text style={styles.title}>ĐĂNG NHẬP</Text>
          <View style={{ marginTop: 40 }}>
            <View style={styles.iconinput}>
              <Icon style={styles.icon} name="user" size={25} color="black" />
              <TextInput
                style={styles.input}
                placeholderTextColor={"#000033"}
                placeholder="Nhập tên đăng nhập hoặc email"
                onChangeText={(text) => setUsername(text)}
              />
            </View>

            <View style={styles.iconinput}>
              <Icon style={styles.icon} name="lock" size={25} color="black" />
              <TextInput
                style={styles.input}
                placeholderTextColor={"#000033"}
                placeholder="Nhập mật khẩu"
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
              />
            </View>
            <Text style={{ alignSelf: 'flex-end', fontSize: 16 }}>Quên mật khẩu?</Text>

          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </TouchableOpacity>
          <View style={styles.rowContainer}>
  <Text style={{ alignSelf: 'flex-end', fontSize: 16 }}>Bạn chưa có tài khoản? </Text>
  {/* Chuyển đến trang Register khi nhấn vào chữ Đăng ký */}
  <TouchableOpacity onPress={() => navigation.navigate('Register')}>
    <Text style={{ textAlign: 'center', color: '#191970', fontSize: 16 }}> Đăng kí</Text>
  </TouchableOpacity>
</View>
          <StatusBar style="auto" />
        </ImageBackground>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30, // Increased margin
  },
  iconinput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: 'black',
    borderBottomWidth: 0.7, // Increased borderBottomWidth
    marginBottom: 10, // Increased margin
  },
  title: {
    fontSize: 30, // Increased fontSize
    fontWeight: 'bold',
    marginBottom: -20, // Increased margin
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 50, // Increased height
    width: 300, // Increased width
    backgroundColor: 'white',
    paddingHorizontal: 10, // Increased paddingHorizontal
    fontSize: 16, // Increased fontSize
    marginTop:5
  },
  button: {
    backgroundColor: '#000033',
    paddingVertical: 20, // Vertical padding
    paddingHorizontal: 25, // Horizontal padding
    marginTop: 10, // Increased margin from the top
    height: 60, // Increased height
    marginBottom: -10, // Added margin at the bottom
  },
  buttonText: {
    color: 'white',
    fontSize: 15, // Increased fontSize
    textAlign: 'center',
    width:130,

  },
  background: {
    flex: 1,
    backgroundColor: 'white',
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    width: 710, // Increased width
  },
  icon:{
    paddingTop:15

  }
});


export default Login;
