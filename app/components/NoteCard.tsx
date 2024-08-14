import { FlatList, Text, View, TextInput, Button, Pressable } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NoteCard({ noteId, note, onRefresh }) {
  async function getUser() {
    const userString = await AsyncStorage.getItem('user');
    return JSON.parse(userString);
  }

  async function deleteNote() {
    if(!confirm('Are you sure you want to delete this?')) {
      return;
    }

    const user = await getUser();

    fetch('http://localhost:3000/api/notes/' + noteId, {
      method: 'delete',
      headers: {
        "Authorization": "Bearer " + user.token,
      },
    })
    .then(() => onRefresh())
    .catch(err => {
      console.log('Error fetching notes');
      console.log(err);
    });
  }

  return (
    <View
      style={{
        // borderColor: 'black',
        // borderWidth: 1,
        // width: 300,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 10,
        margin: 10,
        width: '100%',
      }}
    >
      <Text>{note.text}</Text>
      <Pressable
        style={{
          backgroundColor: 'rgba(33, 150, 243, 1.00)',
          alignItems: 'center',
          width: 20,
          height: 20,
        }}
        onPress={deleteNote}
      >
        <Text
          style={{
            color: 'white',
          }}
        >x</Text>
      </Pressable>
    </View>
  );
}