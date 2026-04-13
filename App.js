import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase } from './lib/supabase';

import HomeScreen from './screens/HomeScreen';
import PostScreen from './screens/PostScreen';
import MeScreen from './screens/MeScreen';
import AuthScreen from './screens/AuthScreen';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#f0f0ed',
          borderTopWidth: 0.5,
          paddingBottom: 20,
          paddingTop: 10,
          height: 70,
        },
        tabBarActiveTintColor: '#222',
        tabBarInactiveTintColor: '#ccc',
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.iconGrid}>
              <View style={[styles.iconDot, { backgroundColor: color }]} />
              <View style={[styles.iconDot, { backgroundColor: color }]} />
              <View style={[styles.iconDot, { backgroundColor: color }]} />
              <View style={[styles.iconDot, { backgroundColor: color }]} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Post"
        component={PostScreen}
        options={{
          tabBarIcon: () => (
            <View style={styles.postBtn}>
              <Text style={styles.postBtnText}>+</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Me"
        component={MeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.personIcon}>
              <View style={[styles.personHead, { backgroundColor: color }]} />
              <View style={[styles.personBody, { backgroundColor: color }]} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#222" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {session ? <TabNavigator /> : <AuthScreen />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGrid: {
    width: 18,
    height: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  iconDot: {
    width: 7,
    height: 7,
    borderRadius: 1.5,
  },
  postBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  postBtnText: {
    color: '#fff',
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '300',
  },
  personIcon: {
    alignItems: 'center',
    gap: 2,
  },
  personHead: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  personBody: {
    width: 14,
    height: 8,
    borderRadius: 4,
  },
});