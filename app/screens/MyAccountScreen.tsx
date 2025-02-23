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

const MyAccountScreen = () => {
  // 예시로 사용자 아이디와 이메일을 상태로 관리
  const [userId, setUserId] = useState('mabin');
  const [email, setEmail] = useState('tymonjm@gmail.com');

  // 저장 버튼 클릭 시 수행될 로직
  const handleSave = () => {
    // TODO: 서버에 수정된 아이디/이메일 전달, 혹은 로컬 상태 업데이트 등
    console.log('저장 버튼 클릭:', { userId, email });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* iOS에서 키보드가 올라왔을 때 화면을 가리지 않게 하기 위해 KeyboardAvoidingView 사용 */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* 프로필 이미지 + 아이디 표시 영역 */}
        <View style={styles.profileSection}>
          {/* 프로필 이미지 (회색 원 형상) */}
          <View style={styles.profileImageWrapper}>
            <Image
              source={{
                uri: 'https://via.placeholder.com/150/cccccc?text=Profile',
              }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.profileNameLabel}>아이디</Text>
        </View>

        {/* 입력 영역 */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>아이디</Text>
          <TextInput
            style={styles.textInput}
            value={userId}
            onChangeText={setUserId}
          />

          <Text style={[styles.inputLabel, { marginTop: 24 }]}>이메일</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        {/* 하단 저장 버튼 */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>저장</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MyAccountScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    justifyContent: 'space-between', // 상단 프로필, 중간 입력, 하단 버튼으로 분리
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageWrapper: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileNameLabel: {
    fontSize: 16,
    color: '#333',
  },
  inputSection: {
    // 중간 입력 영역
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  textInput: {
    borderBottomWidth: 1,
    borderColor: '#333',
    fontSize: 16,
    paddingVertical: 4,
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: '#53a653',
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
    // 화면 하단 전체 너비에 맞추고 싶다면 width: '100%' 설정
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
