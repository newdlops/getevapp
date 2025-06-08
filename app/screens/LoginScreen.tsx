import React, {useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useKakaoLoginMutation} from '../api/auth/authApi.ts';
import {useDispatch, useSelector} from 'react-redux';
import {selectCurrentUser, setCredentials} from '../store/authSlice.ts';
import NativeKakaoLogin from '../../specs/NativeKakaoLogin.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
// 로고 이미지 예시 (로컬 이미지라면 require로 불러오기)
// import logoImage from '../assets/logo.png';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
};

const LoginScreen = ({navigation}: {navigation: NativeStackNavigationProp<RootStackParamList>}) => {
  // 로그인 입력값 상태
  const [login, {isLoading, error}] = useKakaoLoginMutation();
  const currentUser = useSelector<{ auth: unknown }, ReturnType<typeof selectCurrentUser>>(selectCurrentUser);
  const dispatch = useDispatch();

  const loginRequest = async () => {
    // eslint-disable-next-line no-alert
    try {
      // 로그인 API 호출, unwrap()을 사용하여 성공/실패를 명시적으로 처리
      const kakaologinresult = await NativeKakaoLogin?.loginWithNewScope() as { accessToken: string; refreshToken: string };
      console.log('카카오로그인 결과', kakaologinresult);

      const loginArg: { access_token: string; refresh_token: string } = {
        access_token: kakaologinresult.accessToken,
        refresh_token: kakaologinresult.refreshToken,
      };
      const result = await login(loginArg).unwrap() as { access_token: string; refresh_token: string };
      // 로그인 성공: 스토어에 토큰 저장 후 대시보드 화면으로 이동
      dispatch(setCredentials({...result, isLogged: true}));
      await AsyncStorage.setItem('accessToken', String(result.access_token));
      await AsyncStorage.setItem('refreshToken', String(result.refresh_token));
      console.log('로그인 성공', result, currentUser);
      navigation.goBack();
    } catch (error) {
      console.log('로그인 실패', error);
      // 로그인 실패: 회원가입 화면으로 이동
      navigation.navigate('Signup');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>
          <Text style={styles.title}>핫딜모아</Text>

          <TouchableOpacity style={styles.kakaoButton} onPress={() => { void loginRequest(); }}>
            <Image
              source={{ uri: 'https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png' }}
              style={styles.kakaoIcon}
            />
            <Text style={styles.kakaoText}>카카오톡으로 로그인</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF', // 연한 보라 배경
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6B21A8', // 진한 보라색
    marginBottom: 60,
  },
  kakaoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE500',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  kakaoIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  kakaoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3C1E1E',
  },
});
