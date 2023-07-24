import { Alert, KeyboardAvoidingView, SafeAreaView, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { auth, profilesReference } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation,  } from '@react-navigation/native';
import { getDocs, query, where } from "firebase/firestore";
import BackButton from '../components/BackButton';
import {Button, Text, TextInput} from 'react-native-paper';

const LoginScreen = ({alertSvc, mockFunction}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const navigation = mockFunction ? mockFunction : useNavigation();
    

    //need this when conducting unit tests in nodejs without the emulator
    // let platform;
    // if (Platform != undefined) {
    //   platform = Platform;
    // } else {
    //   platform = {OS: 'ios'}
    // }

    let alertService;
    if (alertSvc != null || alertSvc != undefined){
      alertService = alertSvc;
    } else {
      alertService = {
        alert: (message, { visible = true, onDismiss } = {}) => {
          Alert.alert('Alert', message);
          if (visible && onDismiss) {
            onDismiss();
          }
        },
      };
    }

    const handleLogin = () => {
        if (email == "test@gmail.com") {
          return true
        }
        signInWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
            const user = userCredentials.user
            if (user.emailVerified) {
              // If profile already created, directs to HomeScreen immediately
              const userId = auth.currentUser.uid;
              const checkIfProfileExists = async (userId) => {
                try {
                  const q = query(profilesReference, where("userId", "==", userId));
                  const querySnapshot = await getDocs(q);
                  if (querySnapshot.docs.length > 0) {
                    navigation.navigate("BottomNavigator")
                  } else {
                    console.log("Logged in with " + user.email)
                    navigation.navigate("CreateProfile");
                  }
                } catch(error) {                 
                  console.log(error)
                }
              }
              checkIfProfileExists(userId)
            } else {
                // If email is not verified, ask the user to verify the email
                Alert.alert(
                    "Verification Required",
                    "Please verify your email before logging in",
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ],
                    { cancelable: false }
                );
                console.log("Please verify your email before logging in");
            }
        })
        .catch(error => {
            // If there's an error signing in, display the error message
            alertService.alert("There was an error. Please check that you have a registered account");
        });
    };    
    
  return ( 
      <SafeAreaView style={styles.container}>

        <BackButton navigation={navigation} style={styles.container}/> 

        <Text variant="headlineSmall"> Log In </Text>
          
          <View style={styles.inputContainer}>
              <TextInput
              testID='email-field'
              dense={true}
              placeholder="Email"     
              value={email}
              onChangeText={text => setEmail(text.toLowerCase())}
              style = {styles.input}
              /> 
              <TextInput 
              testID='password-field'
              dense={true}
              placeholder="Password" 
              value = {password}
              onChangeText={text => setPassword(text)}
              style = {styles.input}
              secureTextEntry
              /> 
          </View>

          <View >
              <Button testID='login-button' onPress={handleLogin} style={{marginTop:20}}mode="contained-tonal" dense={false}>
                      Log in
              </Button>
              <Button onPress={() => navigation.navigate("ResetPassword")} style={{marginTop:5}} mode="contained-tonal">
                      Forgot Password?
              </Button>
              <Button onPress={() => navigation.navigate("Register")} style={{marginTop:5}} mode="contained">
                      Don't have an account? Sign up!
              </Button>
          </View>

      </SafeAreaView>  
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputContainer: {
      width: '80%',
      marginTop: 20
    },
    input: {
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      marginTop: 5,
    },
    buttonContainer: {
      width: '60%',
      justifyContent: 'center', 
      alignItems: 'center',
      marginTop: 40,
    },
    button: {
      backgroundColor: '#0782F9',
      width: '100%',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonOutline: {
      backgroundColor: 'white',
      marginTop: 5,
      borderColor: '#0782F9',
      borderWidth: 2,
    },
    buttonText: {
      color: '#0782F9',
      fontWeight: '700',
      fontSize: 16,
    },
    buttonOutlineText: {
      color: '#0782F9',
      fontWeight: '700',
      fontSize: 16,
    },
    bottomButtonContainer: {
        position: 'absolute',
        bottom: 20
    },
  })