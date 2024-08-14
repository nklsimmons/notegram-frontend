import { useState, useEffect } from 'react';
import { FlatList, Text, View, TextInput, Button, TouchableHighlight } from "react-native";
import CreateNoteCard from './components/CreateNoteCard';
import NoteCard from './components/NoteCard';
import LoginForm from  './components/LoginForm';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Index() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);

  // type User = {
  //   id: string;
  //   token: string;
  //   username: string;
  // }

  const saveUser = async (user) => {
    try {
      const userString = JSON.stringify(user);
      await AsyncStorage.setItem('user', userString);
      setUser(user);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getNotes();
  }, [user]);

  useEffect(() => {
    async function getUser() {
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString);
      setUser(user);
    }
    getUser();
  }, []);

  function getNotes() {
    if(user === null) {
      return;
    }

    fetch('http://localhost:3000/api/notes', {
      headers: {
        "Authorization": "Bearer " + user.token,
      },
    })
    .then(res => res.json())
    .then(body => {
      setNotes(body);
    })
    .catch(err => {
      console.log('Error fetching notes');
      console.log(err);
    });
  }

  function submitNote(event) {
    event.preventDefault();

    fetch('http://localhost:3000/api/notes', {
      method: 'post',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + user.token,
      },
      body: JSON.stringify({
        text: event.target.text.value,
      }),
    })
    .then(res => {
      event.target.text.value = '';
      getNotes();
    })
    .catch(err => {
      console.log(err);
      // console.log('Error');
    });
  }

  if (user)
    return (
      <View>
        <View
          // style={{
          //   flex: 1,
          //   justifyContent: "center",
          //   alignItems: "center",
          //   flexDirection: 'row',
          // }}
        >
          <Text>User: {user.username}</Text>
          <form>
            <Button title="Logout" onPress={() => {
              console.log('pressed');
              saveUser(null);
            }} />
          </form>
        </View>
        <CreateNoteCard onSubmit={submitNote} onPressRefresh={getNotes} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: 'row',
          }}
        >
          <FlatList
            data={notes}
            style={{
              flex: 1,
              flexDirection: 'row',
            }}
            // contentContainerStyle={{
            //   alignItems: "center",
            // }}
            ItemSeparatorComponent={
              ({highlighted}) => (
                <View>
                  <Text>----------------</Text>
                </View>
              )
            }
            renderItem={({item, index, seperators}) => (
              <NoteCard key={item._id} note={item} />
            )}
          />
        </View>
      </View>
    );
  else
    return (
      <LoginForm />
    );
}
