import { FlatList, Text, View, TextInput, Button } from "react-native";

export default function CreateNoteCard({ onSubmit, onPressRefresh }) {
  return (
    <View>
      <View>
        <TextInput
          id="text"
          name="text"
          placeholder="Write something here" />
        <Button title="Submit" onPress={onSubmit} />
      </View>

      <Button title="Refresh" onPress={onPressRefresh} />
    </View>
  );
}