import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, Text, View } from 'react-native';

export default function LoginScreen() {
  const { login } = useAuth();
  const[username, setUsername] = useState<string>('');
  const[password, setPassword] = useState<string> ('');
  return (
    <View>
      <Text>Login Page</Text>
      <Button title="Login" onPress={() => login(username,password)} />
    </View>
  );
}
