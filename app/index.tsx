import { useState } from 'react';
import { Text, View, TextInput, Button } from "react-native";

export default function Index() {
  const [user, setUser] = useState(null);

  function onSubmit(event) {
    event.preventDefault();

    fetch('http://localhost:3000/api/auth/login', {
      method: 'post',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: event.target.email.value,
        password: event.target.password.value,
      }),
    })
    .then(res => res.json())
    .then(body => {
      setUser(body);
      // Save in session
    })
    .catch(err => {
      console.log('Error');
    });
  }

  if (user)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>Hello</p>
      </View>
    );
  else
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <form onSubmit={onSubmit}>
          <TextInput
            id="email"
            name="email"
            placeholder="Email" />
          <TextInput
            id="password"
            name="password"
            secureTextEntry={true}
            placeholder="Password"
          />
          <button type="submit">Submit</button>
        </form>
      </View>
    );
}
