import { useState } from 'react';
import { View, Text } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, TextInput } from 'react-native-paper';

export default function LoginForm({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const saveUserToken = async (token) => {
    try {
      await AsyncStorage.setItem('userToken', JSON.stringify(token));
      window.location.reload();
    } catch (e) {
      console.log('error', e);
    }
  }

  function login() {
    if(username === '') {
      setError('Username must not be empty');
      return;
    }

    if(password === '') {
      setError('Password must not be empty');
      return;
    }

    setError('');

    fetch('http://localhost:3000/api/auth/login', {
      method: 'post',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
    .then(res => res.json())
    .then((res) => {
      if(res.error) setError(res.error);
      else saveUserToken(res);
    })
    .catch(err => {
      setError('Error logging in');
      console.log(err);
    });
  }

  let errorMessage;
  if(error) {
    errorMessage = (
      <Text
        style={{
          color: 'red',
          textAlign: 'center',
        }}
      >{ error }</Text>
    );
  }

  return (
    <View
      style={{
        padding: 20,
        margin: 20,
        width: '100%',
        maxWidth: 340,
        alignContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#fff',
      }}
    >
      <TextInput
        onChangeText={(username) => setUsername(username)}
        onKeyPress={(e) => {if(e.key == 'Enter') login()}}
        value={username}
        placeholder="Email" />
      <TextInput
        onChangeText={(password) => setPassword(password)}
        onKeyPress={(e) => {if(e.key == 'Enter') login()}}
        value={password}
        secureTextEntry={true}
        placeholder="Password"
      />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-around',
          padding: 10
        }}
      >
        <Button
          mode="contained"
          style={{
            alignContent: 'center',
            height: 40,
          }}
          onPress={login}
        >
          <Text>Login</Text>
        </Button>
        <Button
          style={{
            alignContent: 'center',
            height: 40,
          }}
          mode="contained"
          onPress={() => navigation.navigate('RegisterForm')}
        >
          <Text>Register</Text>
        </Button>
      </View>
      { errorMessage }
    </View>
  );
}
