import { useState, useRef } from 'react';
import { View } from "react-native";
import { Button, Modal, Portal, Card, TextInput, Text, IconButton, MD3Colors, Divider } from 'react-native-paper';


export default function CreateNoteCard({ user, onPressRefresh }) {
  const [newNote, setNewNote] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

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
      setNewNote('');
    })
    .then(res => onPressRefresh())
    .catch(err => {
      console.log(err);
    });
  }

  return (
    <>
      <IconButton
        style={{

        }}
        mode="contained"
        icon="plus"
        onPress={() => setModalVisible(true)}
      />
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={{
            alignSelf: 'center',
            backgroundColor: 'white',
            width: 300,
            height: 300,
          }}
        >
          <View
            style={{
              margin: 10,
              padding: 10,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <TextInput
              style={{
                maxWidth: '80%',
              }}
              value={newNote}
              onChangeText={(input) => setNewNote(input)}
              placeholder="Write something here" />
            <Button mode="contained" onPress={submitNote}>Submit</Button>
          </View>
        </Modal>
      </Portal>
    </>
  );
}