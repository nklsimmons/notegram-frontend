import { useState } from 'react';
import { View, Text, TextInput, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const saveUser = async (user) => {
    try {
      const userString = JSON.stringify(user);
      await AsyncStorage.setItem('user', userString);
      window.location.reload();
    } catch (e) {
      console.log(e);
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
    .then((user) => {
      saveUser(user);
    })
    .catch(err => {
      setError('Error logging in');
      console.log('Error logging in');
      console.log(err);
    });
  }

  let errorMessage;
  if(error) {
    errorMessage = (
      <Text
        style={{
          color: 'red',
        }}
      >{ error }</Text>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextInput
        onChangeText={(username) => setUsername(username)}
        placeholder="Email" />
      <TextInput
        onChangeText={(password) => setPassword(password)}
        secureTextEntry={true}
        placeholder="Password"
      />
      <Button title="Login" /*onPress={onLogin}*/ onPress={login} />
      { errorMessage }
    </View>
  );
}

