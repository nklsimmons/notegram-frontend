import { useState, useEffect } from 'react';
import { FlatList, Text, View, Button, ScrollView } from "react-native";
import LoginForm from  './components/LoginForm';
import HomePage from './components/HomePage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator  } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

export default function Index() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString);
      setUser(user);
    }
    getUser();
  }, []);

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName="HomePage"
        screenOptions={{
          // headerShown: false,
        }}
      >
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="LoginForm" component={LoginForm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
