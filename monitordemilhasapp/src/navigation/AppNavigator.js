import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { NavigationContainer } from '@react-navigation/native';
import { View, Text } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HomeScreen from '../components/HomeScreen';
import SettingsScreen from '../components/SettingsScreen';
import AlertsScreen from '../components/AlertsScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = ({ lastUpdate }) => {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Atualização realtime"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="Configurações"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Configurações',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="setting" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Alertas"
        component={AlertsScreen}
        options={{
          tabBarLabel: 'Alertas',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="bells" size={size} color={color} />
          ),
        }}
      />

    </Tab.Navigator>
  );
};

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [lastUpdate, setLastUpdate] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Tabs"
        screenOptions={{
          headerStyle: {
            backgroundColor: 'lightblue',
          },
          headerRight: () => (
            <View style={{ marginRight: 10 }}>
              <Text style={{ fontSize: 12 }}> Eduardo Freitas</Text>
            </View>
          ),
        }}
      >
        <Stack.Screen
          name="Tabs"
          options={({ route }) => ({
            headerTitle: () => (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16 }}>Monitor de Milhas</Text>
              </View>
            ),
          })}
        >
          {() => <TabNavigator lastUpdate={lastUpdate} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
