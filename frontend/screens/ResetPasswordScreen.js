import {sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, TouchableOpacity, View, Alert, SafeAreaView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import { Platform } from "react-native";
import BackButton from "../components/BackButton";
import { TextInput, Button, Title, Text} from 'react-native-paper';
import { auth } from "../firebase";

const ResetPasswordScreen = () => {
  const [email, setEmail] = useState('');
  
  const navigation = useNavigation()

  //need this when conducting unit tests in nodejs without the emulator
  // let platform;
  // if (Platform != undefined) {
  //   platform = Platform;
  // } else {
  //   platform = {OS: 'ios'}
  // }

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert(
          'Password Reset',
          'A password reset email has been sent to your email address.'
        );
        navigation.navigate("PasswordResetted"); 
      })
      .catch(error => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
  
      <Title style={{textAlign: 'center', marginBottom: 40}}>Forgot Your Password?</Title>
        
      <View style={styles.inputContainer}>
          <TextInput 
            testID="email"
            label="Email"
            value={email}
            onChangeText={text => setEmail(text)}
    
          />
      </View>
      
      <View style={styles.buttonContainer}>  
          <Button onPress={handleResetPassword} mode="contained">
            Reset Password
          </Button>
      </View>
  
    </SafeAreaView>
  );
}

export default ResetPasswordScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputContainer: {
      width: '80%',
    },
    input: {
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 5,
    },
    buttonContainer: {
      width: '60%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 40,
    }


  })
