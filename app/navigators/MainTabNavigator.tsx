import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from '@react-native-vector-icons/ionicons';
import {Text} from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import AlarmSettingScreen from '../screens/AlarmSettingScreen';
import ForumScreen from '../screens/ForumScreen.tsx';
import MyAccountScreen from '../screens/MyAccountScreen.tsx';
import FavoriteGoodsScreen from '../screens/FavoriteGoodsScreen.tsx';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        // 탭 별 아이콘 설정
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'AlarmSetting') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Forum') {
            iconName = focused ? 'chatbubbles-sharp' : 'chatbubbles-outline';
          } else if (route.name === 'MyAccount') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'FavoriteGoods') {
            iconName = focused ? 'bag' : 'bag-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarIconStyle: {marginTop: 12},
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
        tabBarInactiveBackgroundColor: '#6C28FE',
        tabBarActiveBackgroundColor: '#6C28FE',
        tabBarStyle: {
          height: '10%',
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarLabel: ({focused, color, position}) => {
          let labelName;

          if (route.name === 'Home') {
            labelName = '메인화면';
          } else if (route.name === 'Profile') {
            labelName = '프로필';
          } else if (route.name === 'AlarmSetting') {
            labelName = '알림설정';
          } else if (route.name === 'Forum') {
            labelName = '포럼';
          } else if (route.name === 'MyAccount') {
            labelName = '내계정';
          } else if (route.name === 'FavoriteGoods') {
            labelName = '관심상품';
          }

          return <Text style={{color: color, marginTop: 4}}>{labelName}</Text>;
        },
        headerShown: true,
        headerStyle: {backgroundColor: '#6C28FE'},
        headerTitleStyle: {color: 'white'},
        headerTitle: () => {
          let labelName;

          if (route.name === 'Home') {
            labelName = '메인화면';
          } else if (route.name === 'Profile') {
            labelName = '프로필';
          } else if (route.name === 'AlarmSetting') {
            labelName = '알림설정';
          } else if (route.name === 'Forum') {
            labelName = '포럼';
          } else if (route.name === 'MyAccount') {
            labelName = '내계정';
          } else if (route.name === 'FavoriteGoods') {
            labelName = '관심상품';
          }
          return <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>{labelName}</Text>;
        }
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Forum" component={ForumScreen} />
      <Tab.Screen name="FavoriteGoods" component={FavoriteGoodsScreen} />
      <Tab.Screen name="AlarmSetting" component={AlarmSettingScreen} />
      <Tab.Screen name="MyAccount" component={MyAccountScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
