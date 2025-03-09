import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  isKakaoTalkLoginAvailable(): boolean;
  loginWithKakaoTalk(): boolean;
  loginWithNewScope(): boolean;
  getHash(): string;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'NativeKakaoLogin',
);
