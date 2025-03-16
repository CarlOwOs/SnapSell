import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import UploadScreen from './src/screens/UploadScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');

  return (
    <View style={styles.container}>
      {currentScreen === 'home' ? (
        <HomeScreen 
          onUploadPress={() => setCurrentScreen('upload')} 
          onNotificationsPress={() => setCurrentScreen('notifications')}
        />
      ) : currentScreen === 'upload' ? (
        <UploadScreen onBackPress={() => setCurrentScreen('home')} />
      ) : (
        <NotificationsScreen onBackPress={() => setCurrentScreen('home')} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
