// src/navigators/RootNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthStack from './AuthStack';
import MainTabNavigator from './MainTabNavigator';

// 예시로, 로그인이 되어 있는지 여부를 전역 컨텍스트나 Redux, Recoil 등에서 가져옴
import {SafeAreaView} from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {

  return (
    <SafeAreaView style={{flex:1}}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* 로그인이 되어 있다면 메인 탭으로*/}
          <Stack.Screen name="MainTab" component={MainTabNavigator} />
          {/* 로그인이 안 되어 있다면 AuthStack으로*/}
          <Stack.Screen name="AuthStack" component={AuthStack} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default RootNavigator;
