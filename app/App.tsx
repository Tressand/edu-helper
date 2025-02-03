import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Form from '../components/Form'
import global_styles from '../styles/global_styles';


export default function App() {
  return (
    <View style={[global_styles.page]}>
      <Form></Form>
      <StatusBar></StatusBar>
    </View>
  );
}
