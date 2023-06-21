import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HomeScreen from '../components/HomeScreen';
import SettingsScreen from '../components/SettingsScreen';
import AlertsScreen from '../components/AlertsScreen';
import ConfiguracaoAlerta from '../components/ConfiguracaoAlerta';
import DebugScreen from '../components/DebugScreen'; // Import the DebugScreen component

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
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

const AppNavigator = () => {
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
          options={{
            headerShown: false,
          }}
        >
          {() => (
            <Stack.Navigator>
              <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }} />
              <Stack.Screen
                name="ConfiguracaoAlerta"
                component={ConfiguracaoAlerta}
                options={({ route }) => ({
                  title: 'Configurar Alerta',
                  headerBackTitle: 'Voltar',
                  headerRight: () => (
                    <TouchableOpacity
                      onPress={() => {
                        if (route.params?.onSalvar) {
                          route.params.onSalvar();
                        }
                      }}
                    >
                      <Text style={{ marginRight: 10, fontSize: 16 }}>Salvar</Text>
                    </TouchableOpacity>
                  ),
                })}
              />
              <Stack.Screen
                name="Debug" // Add the Debug screen here
                component={DebugScreen}
                options={{
                  title: 'Debug', // Set the title for the Debug screen
                }}
              />
            </Stack.Navigator>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
