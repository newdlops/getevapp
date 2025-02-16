import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../hooks/useAuth';

const HomeScreen: React.FC = () => {
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
        <Text>로그인이 필요합니다.</Text>
      )}
    </View>
  );
};

export default HomeScreen;
