import React, {useEffect} from 'react';
import {Button, Text, View} from 'react-native';
import {useAuth} from '../hooks/useAuth';
import {useSelector} from 'react-redux';
import {selectCurrentUser} from '../store/authSlice.ts';

const ProfileScreen = ({navigation}) => {
  const {user, logout} = useAuth();

  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (!currentUser.isLogged) navigation.navigate('AuthStack');
  }, [currentUser]);

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

export default ProfileScreen;
