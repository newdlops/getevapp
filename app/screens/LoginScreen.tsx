import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLoginMutation } from '../api/auth/authApi.ts';
import {useDispatch} from 'react-redux';
import {setCredentials} from '../store/authSlice.ts';

// 로고 이미지 예시 (로컬 이미지라면 require로 불러오기)
// import logoImage from '../assets/logo.png';

const LoginScreen = ({ navigation }) => {
  // 로그인 입력값 상태
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();

  // 로그인 버튼 클릭 시 처리
  const handleLogin = async () => {
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials(result));
      // 로그인 후 메인 화면으로 이동
      navigation.navigate('Main');
    } catch (err) {
      console.log('로그인 에러:', err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* 로고 + 타이틀 */}
        <View style={styles.logoContainer}>
          <Image
            // 실제 로컬 이미지 사용 시: source={logoImage}
            source={{
              uri: 'https://via.placeholder.com/150/cccccc?text=App+Logo',
            }}
            style={styles.logo}
          />
          <Text style={styles.title}>My Awesome App</Text>
        </View>

        {/* 로그인 폼 */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="이메일"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>

          {/* 회원가입 / 비밀번호 찾기 링크 영역 */}
          <View style={styles.footerLinks}>
            <TouchableOpacity onPress={() => console.log('회원가입')}>
              <Text style={styles.linkText}>회원가입</Text>
            </TouchableOpacity>
            <Text style={styles.separator}> | </Text>
            <TouchableOpacity onPress={() => console.log('비밀번호 찾기')}>
              <Text style={styles.linkText}>비밀번호 찾기</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 16,
    paddingVertical: 24,
    justifyContent: 'center',
  },
  // 로고와 타이틀
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  // 폼
  formContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // 안드로이드 그림자
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 4,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // 하단 링크
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  linkText: {
    fontSize: 14,
    color: '#4CAF50',
  },
  separator: {
    fontSize: 14,
    color: '#999',
    marginHorizontal: 8,
  },
});
