import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TouchableOpacity } from 'react-native';
import NativeKakaoLogin from '../../specs/NativeKakaoLogin';
import { useKakaoSignupMutation} from '../api/auth/authApi.ts';
import {setCredentials} from '../store/authSlice.ts';
import {useDispatch, useSelector} from 'react-redux';

const CustomCheckBox = ({ value, onValueChange }) => {
  return (
    <TouchableOpacity onPress={() => onValueChange(!value)}>
      <View style={[styles.checkbox, value && styles.checkboxChecked]}>
        {value && <Text style={styles.checkMark}>✓</Text>}
      </View>
    </TouchableOpacity>
  );
};

const SignUpScreen = ({navigation }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [signup, {isLoading, error}] = useKakaoSignupMutation();
  const dispatch = useDispatch();

  const signUp = async () => {
    // eslint-disable-next-line no-alert
    // TODO: 회원가입을 누르면 kakaoId와 유저 Email을 받을수 있는데 이걸로 유저 계정을 생성해야 한다.
    try {

      const kakaoinfo = await NativeKakaoLogin?.loginWithNewScope();
      console.log('카카오 가입용 로그인 정보', kakaoinfo);
      // 로그인 API 호출, unwrap()을 사용하여 성공/실패를 명시적으로 처리
      const result = await signup({
        access_token: kakaoinfo.accessToken,
        refresh_token: kakaoinfo.refreshToken,
      }).unwrap();
      // 로그인 성공: 스토어에 토큰 저장 후 대시보드 화면으로 이동
      dispatch(setCredentials(result));
      navigation.goBack();
      alert('회원등록 성공');
    } catch (error) {
      console.log(error);
      alert('회원등록 실패');
      // 로그인 실패: 회원가입 화면으로 이동
    }

  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>약관 동의 및 회원가입</Text>

      <ScrollView style={styles.termsContainer}>
        <Text style={styles.termsText}>
          {/* 긴 약관 내용 예시 */}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet eros nec urna cursus dignissim.
          Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris convallis nunc a justo porta,
          sed sollicitudin eros tempus. Donec euismod, nisi quis tempus dignissim, nisl massa tempus tortor, nec fermentum est ligula ut ex.
          Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
          {"\n\n"}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet eros nec urna cursus dignissim.
          Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris convallis nunc a justo porta,
          sed sollicitudin eros tempus. Donec euismod, nisi quis tempus dignissim, nisl massa tempus tortor, nec fermentum est ligula ut ex.
          Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
          {"\n\n"}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet eros nec urna cursus dignissim.
          Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris convallis nunc a justo porta,
          sed sollicitudin eros tempus. Donec euismod, nisi quis tempus dignissim, nisl massa tempus tortor, nec fermentum est ligula ut ex.
          Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
          {/* 필요에 따라 더 많은 내용 추가 */}
        </Text>
      </ScrollView>

      <View style={styles.checkboxRow}>
        <CustomCheckBox value={isChecked} onValueChange={setIsChecked} />
        <Text style={styles.checkboxLabel}>약관에 동의합니다.</Text>
      </View>

      <Button
        title="회원가입"
        onPress={() => {
          // 회원가입 처리 로직 추가
          // alert('회원가입 버튼 클릭됨!');
          signUp();
        }}
        disabled={!isChecked}
        color="#007BFF"
      />
      <View style={{height:10}}></View>
      <Button
        title="취소"
        onPress={() => {
          // 회원가입 처리 로직 추가
          // alert('회원가입 버튼 클릭됨!');
          navigation.goBack();
        }}
        color="#007BFF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  termsContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 15,
    marginBottom: 20
  },
  termsText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333'
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxChecked: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF'
  },
  checkMark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16
  }
});

export default SignUpScreen;
