const NativeKakaoLogin = {
  isKakaoTalkLoginAvailable: () => false,
  loginWithKakaoTalk: () =>
    Promise.reject(new Error('NativeKakaoLogin is not available on iOS')),
  loginWithNewScope: () =>
    Promise.reject(new Error('NativeKakaoLogin is not available on iOS')),
  getHash: () => '',
  logout: () => Promise.reject(new Error('NativeKakaoLogin is not available on iOS')),
};

export default NativeKakaoLogin;

