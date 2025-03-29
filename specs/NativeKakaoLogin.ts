import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  isKakaoTalkLoginAvailable(): boolean;
  loginWithKakaoTalk(): Promise<any>;
  loginWithNewScope(): Promise<any>;
  getHash(): string;
  logout(): Promise<any>;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'NativeKakaoLogin',
);
