import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { LoginScreen, HomeScreen, RegisterScreen, WelcomeScreen, VerificationScreen, ResetPasswordScreen, PasswordResettedScreen, CreateProfileScreen,
    EditProfileScreen, ViewProfileScreen, SettingsScreen, ChatScreen, Dashboard, Chats, ViewFriendScreen, ShareNotesScreen, UploadNotesScreen} from './screens';
import  { BottomNavigator } from './components';
import { MD3LightTheme as DefaultTheme, PaperProvider} from 'react-native-paper';
import theme from './components/theme';

const Stack = createNativeStackNavigator();

export default function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {     
        setIsAuthenticated(true);
      } else {   
        setIsAuthenticated(false);
      }   
    })
    return unsubscribe;
}, []);

  const [currentScreen, setCurrentScreen] = useState('WelcomeScreen');

  const shouldShowBottomNavigator = ['HomeScreen', 'ViewProfileScreen', 'EditProfileScreen', 'UploadNotesScreen'].includes(
    currentScreen
  );

  return (
    <PaperProvider theme={theme}>
    <NavigationContainer>
      <Stack.Navigator>
        
        <Stack.Screen options={{ headerShown: false }} name="Welcome" component={WelcomeScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Dashboard" component={Dashboard} />
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Register" component={RegisterScreen} />
        <Stack.Screen options={{ headerShown: false }} name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen options={{ headerShown: false }} name="PasswordResetted" component={PasswordResettedScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Verification" component={VerificationScreen} />
        <Stack.Screen options={{ headerShown: false }} name="CreateProfile" component={CreateProfileScreen} />
        <Stack.Screen options={{ headerShown: false }} name="BottomNavigator" component={BottomNavigator} />
        <Stack.Screen options={{ headerShown: false }} name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen options={{ headerShown: false }} name="ShareNotes" component={ShareNotesScreen} />
        <Stack.Screen options={{ headerShown: false }} name="UploadNotes" component={UploadNotesScreen} />
        <Stack.Screen
            name="Chats"
            component={Chats}
            options={({ route }) => ({
              title: route.params.name
            })}/>
        <Stack.Screen options={{ headerShown: false }} name="ViewFriendScreen" component={ViewFriendScreen} />

      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'light blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 50
  }
});
