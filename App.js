import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import BoardScreen from './screens/BoardScreen';
import MyPageScreen from './screens/MyPageScreen';
import FirstScreen from './screens/FirstScreen';
import LoginScreen from './screens/LoginScreen';
import BowFactoryScreen from './screens/BowFactoryScreen';
import FirstBowFactoryInfoScreen from './screens/FirstBowFactoryInfoScreen';
import SelectBowFactoryScreen from './screens/SelectBowFactoryScreen';
import ChangeUserInfoScreen from './screens/ChangeUserInfoScreen'; // 추가
import CheckUserInfoScreen from './screens/CheckUserInfoScreen'; // 추가
import DeleteAccountScreen from './screens/DeleteAccountScreen'; // 추가

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === '홈') {
            iconName = 'home';
          } else if (route.name === '게시판') {
            iconName = 'list';
          } else if (route.name === '마이페이지') {
            iconName = 'person';
          } else if (route.name === '활공장') {
            iconName = 'map';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="홈" component={HomeScreen} />
      <Tab.Screen name="활공장" component={BowFactoryScreen} />
      <Tab.Screen name="게시판" component={BoardScreen} />
      <Tab.Screen name="마이페이지" component={MyPageScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FirstScreen">
        <Stack.Screen name="FirstScreen" component={FirstScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login">
          {props => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
        </Stack.Screen>
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        {isLoggedIn && (
          <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
        )}
        <Stack.Screen name="ChangeUserInfo" component={ChangeUserInfoScreen} options={{ title: "개인정보 수정" }} />
        <Stack.Screen name="CheckUserInfo" component={CheckUserInfoScreen} />
        <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
