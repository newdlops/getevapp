/**
 * @format
 */

// index.js (루트)
import { AppRegistry, LogBox } from 'react-native';
import { name as appName } from './app.json';

// (1) app 내부 index.js에서 default export로 내보낸 AppEntryPoint 가져오기
import AppEntryPoint from './app/index';

// (옵션) RN 특정 경고 무시하기, 환경 변수 로딩, Sentry 초기화 등
LogBox.ignoreLogs(['Warning: ...']);
// LogBox.ignoreAllLogs(); // 전부 무시하고 싶다면

AppRegistry.registerComponent(appName, () => AppEntryPoint);
