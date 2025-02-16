import React, { useState } from 'react'
import { View, Text, Button, TextInput } from 'react-native'
import { useAuth } from '../hooks/useAuth'

const LoginScreen: React.FC = () => {
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    login(email, password);
  }

  return (
    <View>
      <Text>"로그인"</Text>
      <TextInput
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={isLoading ? '로그인 중...' : '로그인'} onPress={handleLogin} />
  </View>
  )
}

export default LoginScreen
