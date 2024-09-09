import { useState, useRef } from 'react';
import { Alert, FlatList, Modal, View, Pressable, StyleSheet  } from "react-native";
import { Button, Card, Text, IconButton, MD3Colors, Divider, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function NoteCard({ noteId, note, onRefresh }) {
  const [addTagsModalVisible, setAddTagsModalVisible] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  async function getUser() {
    const userString = await AsyncStorage.getItem('userToken');
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

  async function addTag() {
    const user = await getUser();

    fetch('http://localhost:3000/api/notes/' + noteId + '/tags', {
      method: 'post',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + user.token,
      },
      body: JSON.stringify({
        tags: [newTagInput],
      }),
    })
    .then(() => {
      onRefresh();
      setAddTagsModalVisible(false);
    })
    .catch(err => {
      console.log('Error fetching notes');
      console.log(err);
    });
  }

  return (
    <>
      <Card
        style={{
          width: 300,
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 5,
          margin: 5,
        }}
      >
        <Card.Content
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 5,
            margin: 5,
            width: '100%',
          }}
        >
          <View
            style={{
              alignSelf: 'flex-end',
            }}
          >
            <IconButton
              icon="delete"
              iconColor={MD3Colors.error50}
              onPress={deleteNote}
            ></IconButton>
          </View>
          <View
            style={{
              padding: 10,
              margin: 10,
            }}
          >
            <Text>{note.text}</Text>
          </View>
          <Divider />
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 10,
              margin: 10,
            }}
          >
            <FlatList
              data={note.tags}
              style={{
                flex: 1,
                flexDirection: 'row',
                maxWidth: '100%',
              }}
              contentContainerStyle={{
                flex: 1,
                alignItems: 'center',
              }}
              renderItem={({item, index, seperators}) => (
                <Button
                  mode="contained"
                  style={{
                    padding: 5,
                    margin: 5,
                    backgroundColor: 'rgba(33, 150, 243, 1.00)',
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                    }}
                  >{item}</Text>
                </Button>
              )}
            />
            <IconButton
              icon="plus"
              mode="contained"
              onPress={() => setAddTagsModalVisible(!addTagsModalVisible)}
            ></IconButton>
          </View>
        </Card.Content>
      </Card>
      <Modal
        animationType="slide"
        transparent={true}
        visible={addTagsModalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setAddTagsModalVisible(!addTagsModalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <IconButton
              icon="close-box"
              onPress={() => setAddTagsModalVisible(!addTagsModalVisible)}
            ></IconButton>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}
            >
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: 'black',
                }}
                value={newTagInput}
                onChangeText={(input) => setNewTagInput(input)}
              />
              <IconButton
                icon="plus"
                mode="contained"
                onPress={addTag}
              ></IconButton>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
