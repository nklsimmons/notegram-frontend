import { FlatList, Text, View, TextInput, Button } from "react-native";

export default function NoteCard({ note }) {
  return (
    <View
      style={{
        // borderColor: 'black',
        // borderWidth: 1,
        width: 300,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <Text key={note._id}>
        {note.text}
      </Text>
      <Text>X</Text>
    </View>
  );
}