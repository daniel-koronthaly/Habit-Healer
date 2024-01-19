import React from 'react';
import {
  Button,
  StyleSheet,
  View,
} from 'react-native'

const Footer = ({ setCurrentScreen , currentScreen}) => (
  <View style={styles.container}>
    <Button
      title="Friends"
      onPress={() => setCurrentScreen('Friends')} 
    />
    <Button
      title="Habits"
      onPress={() => setCurrentScreen('Habits')} 
    />
    <Button
      title="Home"
      onPress={() => setCurrentScreen('Main')} 
    />
    <Button
      title="Calendar"
      onPress={() => setCurrentScreen('Calendar')} 
    />
    <Button
      title="Settings"
      onPress={() => setCurrentScreen('Settings')} 
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
  },
})

export default Footer;