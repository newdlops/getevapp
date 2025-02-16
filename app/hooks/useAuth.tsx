import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
  Dispatch,
  SetStateAction,
} from 'react';

// 사용자 정보 타입 정의 (프로젝트에 맞게 수정 가능)
interface User {
  id: string;
  name: string;
  email?: string;
}

// Context에서 관리할 값들의 타입
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: Dispatch<SetStateAction<User | null>>;
}

// Context 생성 (초기값은 빈 함수/기본값)
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: async () => {},
  logout: () => {},
  setUser: () => {},
});

// Provider에서 받을 children 타입
interface AuthProviderProps {
  children: ReactNode;
}

// 실제 Provider 컴포넌트
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 로그인 함수 (API 연동 시 실제 로직 삽입)
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // 예시: 실제로는 fetch/Axios 등으로 서버에 로그인 요청
      // const response = await fetch('/api/login', {...})
      // const data = await response.json();

      // 여기서는 간단한 Mock 예시:
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 딜레이
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email,
      };

      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      // 에러 처리 로직...
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = () => {
    // 토큰 삭제, 서버에 로그아웃 알림 등 필요한 작업
    setUser(null);
  };

  // Context에 전달할 값 정의
  const authContextValue: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 인증 Context를 손쉽게 사용할 수 있는 훅
export function useAuth() {
  return useContext(AuthContext);
}
