import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import Form from '../components/Form'
import getGlobalStyles from '../styles/global_styles';


export default function App() {
  const global_styles = getGlobalStyles(useColorScheme())
  return (
    <View style={[global_styles.page]}>
      <Form></Form>
      <StatusBar></StatusBar>
    </View>
  );
}
