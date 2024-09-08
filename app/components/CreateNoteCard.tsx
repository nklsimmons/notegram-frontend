import { useState, useRef } from 'react';
import { View } from "react-native";
import { Button, Card, TextInput, Text, IconButton, MD3Colors, Divider } from 'react-native-paper';


export default function CreateNoteCard({ user, onPressRefresh }) {
  const [newNote, setNewNote] = useState(null);
  const inputRef = useRef(null);

  function submitNote() {
    if(!newNote) {
      return;
    }

    fetch('http://localhost:3000/api/notes', {
      method: 'post',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + user.token,
      },
      body: JSON.stringify({
        text: newNote,
      }),
    })
    .then(() => {
      setNewNote(null);
      inputRef.current.value = null;
    })
    .then(res => onPressRefresh())
    .catch(err => {
      console.log(err);
      // console.log('Error');
    });
  }

  return (
    <Card
      style={{
        alignSelf: 'center',
        // height: '50%',
        // borderColor: 'black',
        // borderWidth: 1,
        width: 300,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        // backgroundColor: 'white',
        padding: 5,
        margin: 5,
        // width: '100%',
      }}
    >
      <Card.Content
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <TextInput
          style={{
            maxWidth: '80%',
          }}
          ref={inputRef}
          onChangeText={(input) => setNewNote(input)}
          placeholder="Write something here" />
        <Button mode="contained" onPress={submitNote}>Submit</Button>
      </Card.Content>
    </Card>
  );
}