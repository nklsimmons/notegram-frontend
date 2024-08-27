import { useState, useEffect } from 'react';
import { FlatList, Text, View, Button, ScrollView } from "react-native";
import CreateNoteCard from './CreateNoteCard';
import NoteCard from './NoteCard';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function HomePage({ navigation }) {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function getUser() {
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString);
      if(user === null) {
        navigation.navigate('LoginForm');
      } else {
        setUser(user);
      }
    }
    getUser();
  }, []);

  const saveUser = async (user) => {
    try {
      const userString = JSON.stringify(user);
      await AsyncStorage.setItem('user', userString);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    refreshNotes();
  }, [user]);

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

  function logoutUser() {
    saveUser(null);
    navigation.navigate('LoginForm');
  }

  if(!user)
    return <></>
  else
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
              logoutUser();
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
}
