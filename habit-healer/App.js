import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';

import { colors } from './colors/colors'

import Header from './components/Header'
import Footer from './components/Footer'

import Login from './components/Login'
import Settings from './components/Settings'
import Main from './components/Main'
import Friends from './components/Friends';
import HabitOverview from './components/HabitOverview';
import Calendar from './components/Calendar';
import HabitCreator from './components/HabitCreator';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Login');
  const theme = useColorScheme();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Login':
        return <Login setCurrentScreen={setCurrentScreen} />
      case 'Main':
        return <Main />
      case 'Friends':
        return <Friends />
      case 'Habits':
        return <HabitCreator />
      case 'Calendar':
        return <Calendar />
      case 'Settings':
        return <Settings setCurrentScreen={setCurrentScreen} />
      default:
        return <Text>You have swapped to a non-existent screen.</Text>
    }
  };
  return (
    <View style={[theme == 'light' ? styles.lightTheme : styles.darkTheme, styles.container]}>
      {currentScreen === 'Login' && (<Header style={styles.top} />)}
      <View style={styles.middle}>
        {renderScreen()}
      </View>
      {currentScreen !== 'Login' && (
        <Footer style={styles.bottom} setCurrentScreen={setCurrentScreen} currentScreen={currentScreen} />
      )}
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lightTheme: {
    backgroundColor: colors.appBackgroundColor,
    color: 'white',
  },
  darkTheme: {
    backgroundColor: colors.darkBackgroundColor,
    color: colors.appBackgroundColor,
  },
  top: {
    flex: 1,
  },
  middle: {
    flex: 7,
  },
  bottom: {
    flex: 1,
  },
});
