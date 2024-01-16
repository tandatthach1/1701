import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  KeyboardAvoidingView, ImageBackground
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Login from './Login';

function Register({ navigation }) {
  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}
  >
    <View>
      <ImageBackground style={styles.background}>
        <Text style={styles.title}>ĐĂNG KÝ</Text>
        <View style={{ marginTop: 40 }}>
          <View style={styles.iconinput}>
            <Icon style={styles.icon} name="user" size={30} color="black" />
            <TextInput
              style={styles.input}
              placeholderTextColor={"#000033"}
              placeholder="Nhập tên đăng nhập hoặc email"
              onChangeText={(text) => setUsername(text)}
            />
          </View>

          <View style={styles.iconinput}>
            <Icon style={styles.icon} name="lock" size={30} color="black" />
            <TextInput
              style={styles.input}
              placeholderTextColor={"#000033"}
              placeholder="Nhập mật khẩu"
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <View style={styles.iconinput}>
            <Icon style={styles.icon} name="lock" size={30} color="black" />
            <TextInput
              style={styles.input}
              placeholderTextColor={"#000033"}
              placeholder="Nhập lại mật khẩu"
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
            />
          </View>
        </View>
        <View style={styles.rowContainer}>
  <TouchableOpacity onPress={() => navigation.navigate('Register')}>
  <Text style={{ textAlign: 'center', color: '#191970', fontSize: 20 }}>
    Bằng cách nhấn Đăng Ký Ngay, bạn đồng ý với{'\n'}Điều Khoản Dịch Vụ và Chính Sách Bảo Mật
  </Text>
  </TouchableOpacity>
</View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>
        
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
    marginBottom: 30, // Increased margin
  },
  title: {
    fontSize: 45, // Increased fontSize
    fontWeight: 'bold',
    marginBottom: 30, // Increased margin
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 60, // Increased height
    width: 450, // Increased width
    backgroundColor: 'white',
    paddingHorizontal: 20, // Increased paddingHorizontal
    fontSize: 20, // Increased fontSize
  },
  button: {
    backgroundColor: '#000033',
    padding: 20, // Increased padding
    marginTop: 30, // Increased margin
  },
  buttonText: {
    color: 'white',
    fontSize: 22, // Increased fontSize
    textAlign: 'center',
    width:200,

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

export default Register;
