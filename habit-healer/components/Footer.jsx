import React from 'react';
import {
  Button,
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native'
import { colors } from '../colors/colors'
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

const Footer = ({ setCurrentScreen, currentScreen }) => {
  const CustomIconButton = ({ iconName, onPress, disabled, color }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        styles.circle,
        { backgroundColor: color },
      ]}
    >
      <Ionicons name={iconName} size={24} color="white" />
    </TouchableOpacity>
  )
  const getCurrentScreenColor = (screen) => {
    return currentScreen === screen ? colors.headerColor : "";
  }
  return (<View style={styles.container}>
    <CustomIconButton
      iconName="ios-home"
      onPress={() => setCurrentScreen('Main')}
      color={getCurrentScreenColor('Main')}
    />
    <CustomIconButton
      iconName="pie-chart-outline"
      onPress={() => setCurrentScreen('Habits')}
      color={getCurrentScreenColor('Habits')}
    />
    <CustomIconButton
      iconName="people-outline"
      onPress={() => setCurrentScreen('Friends')}
      color={getCurrentScreenColor('Friends')}
    />
    <CustomIconButton
      iconName="calendar"
      onPress={() => setCurrentScreen('Calendar')}
      color={getCurrentScreenColor('Calendar')}
    />
    <CustomIconButton
      iconName="settings"
      onPress={() => setCurrentScreen('Settings')}
      color={getCurrentScreenColor('Settings')}
    />
  </View>)
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
    paddingHorizontal: 10
  },
  button: {
    height: 70, 
    flex: 1, 
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    padding: 10,
},
squoval: {
    borderColor: '#332F2E',
    borderRadius: 20,
},
circle: {
    borderRadius: 35, 
},
buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
},
})

export default Footer;