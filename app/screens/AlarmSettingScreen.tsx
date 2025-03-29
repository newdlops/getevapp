import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import LoginRequest from '../components/LoginRequest.tsx';

const AlarmSettingScreen: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <View>
      {user ? (
        <>
          <Text>{`${user.name} 님 환영합니다.`}</Text>
          <Text>{`이메일: ${user.email}`}</Text>
          <Button title="로그아웃" onPress={logout} />
        </>
      ) : (
        <LoginRequest onLoginPress={()=>alert('로그인')}></LoginRequest>
      )}
    </View>
  );
};

export default AlarmSettingScreen;
