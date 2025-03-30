import React, {useEffect, useState} from 'react';
import {
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {clearCredentials, selectCurrentUser} from '../store/authSlice.ts';
import {useLogoutMutation} from '../api/auth/authApi.ts';
import {useIsFocused} from '@react-navigation/native';
import LoginRequest from '../components/LoginRequest.tsx';

const MyAccountScreen = ({navigation}) => {
  // 예시로 사용자 아이디와 이메일을 상태로 관리
  const [userId, setUserId] = useState(currentUser?.userId??'');
  const [email, setEmail] = useState(currentUser?.email??'');
  const [logout, {isLoading, error}] = useLogoutMutation();
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(()=>{
    setUserId(currentUser.userId);
    setEmail(currentUser.email);
  },[currentUser]);


  // 저장 버튼 클릭 시 수행될 로직
  const handleSave = () => {
    // TODO: 서버에 수정된 아이디/이메일 전달, 혹은 로컬 상태 업데이트 등
    console.log('현재 유저', currentUser);
  };

  const handleLogout = async () => {
    try {
      console.log('현재 유저', currentUser);
      const logoutResult = await logout({
        access_token: currentUser.accessToken,
        refresh_token: currentUser.refreshToken,
        id: currentUser.id,
      });
      dispatch(clearCredentials());
      console.log('로그아웃 결과', logoutResult);
    } catch (error) {
      console.log('로그아웃중 에러발생', error);
    }
  };

  return (currentUser.isLogged ?
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.profileSection}>
            <Image
              source={{ uri: 'https://via.placeholder.com/120x120.png?text=👤' }}
              style={styles.profileImage}
            />
            <Text style={styles.usernameText}>{userId}</Text>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>아이디</Text>
            <TextInput
              style={styles.input}
              value={userId}
              onChangeText={setUserId}
              placeholder="아이디 입력"
            />

            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="이메일 입력"
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>저장하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>로그아웃</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
      : (
        <LoginRequest onLoginPress={()=>navigation.navigate('AuthStack')}></LoginRequest>
      )
  );
};

export default MyAccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EDE9FE',
    marginBottom: 16,
  },
  usernameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4C1D95',
  },
  inputSection: {
    width: '100%',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#6B21A8',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  saveButton: {
    backgroundColor: '#7C3AED',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#E5E5E5',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#3F3F46',
    fontSize: 16,
    fontWeight: '500',
  },
});
