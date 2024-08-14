import { useState, useEffect } from 'react';
import { FlatList, Text, View, TextInput, Button, TouchableHighlight } from "react-native";
import CreateNoteCard from './components/CreateNoteCard';
import NoteCard from './components/NoteCard';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const saveUser = async (user) => {
    try {
      const userString = JSON.stringify(user);
      await AsyncStorage.setItem('user', userString);
      // setUser(user);
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  }

  function login(event) {
    event.preventDefault();

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

      // Save in session
    })
    // .then(() => {
    //   getNotes();
    // })
    .catch(err => {
      console.log('Error logging in');
      console.log(err);
    });
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
    </View>
  );
}
function setUser(user: any) {
  throw new Error('Function not implemented.');
}

