import { useState, useEffect } from 'react';
import { FlatList, Text, View, Button, ScrollView } from "react-native";
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
    refreshNotes();
  }, [user]);

  useEffect(() => {
    async function getUser() {
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString);
      setUser(user);
    }
    getUser();
  }, []);

  function refreshNotes() {
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

  if (user)
    return (
      <>
        <View
          style={{
            marginBottom: 10,
          }}
        >
          <Text>User: {user.username}</Text>
          <View>
            <Button title="Logout" onPress={() => {
              saveUser(null);
            }} />
          </View>
        </View>
        <CreateNoteCard user={user} onPressRefresh={refreshNotes} />
        <ScrollView
          style={{
            margin: 20,
          }}
        >
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
                // width: 'auto',
              }}
              contentContainerStyle={{
                flex: 1,
                alignItems: 'center',
              }}
              // ItemSeparatorComponent={
              //   ({highlighted}) => (
              //     <View>
              //       <Text>----------------</Text>
              //     </View>
              //   )
              // }
              renderItem={({item, index, seperators}) => (
                <NoteCard noteId={item._id} note={item} onRefresh={refreshNotes} />
              )}
            />
          </View>
        </ScrollView>
      </>
    );
  else
    return (
      <LoginForm />
    );
}
