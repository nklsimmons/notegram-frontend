import { useState, useRef } from 'react';
import { View, TextInput, Button } from "react-native";


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
    <View
      style={{
        background: 'white',
        padding: 10,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <TextInput
          style={{
            width: '100%',
          }}
          ref={inputRef}
          onChangeText={(input) => setNewNote(input)}
          placeholder="Write something here" />
        <Button title="Submit" onPress={submitNote} />
      </View>
      <Button title="Refresh" onPress={onPressRefresh} />
    </View>
  );
}