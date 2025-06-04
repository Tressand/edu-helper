import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, View, Text, Linking } from 'react-native';
import Form from '../components/Form'
import getGlobalStyles, { getColors } from '../styles/global_styles';

export const version = 'v1.5'

export default function App() {
  const global_styles = getGlobalStyles(useColorScheme())
  const colors = getColors(useColorScheme())

  return (
    <View style={[global_styles.page]}>
      <Form></Form>
      <StatusBar></StatusBar>
    </View>
  )
}

export function AppInfoStrip({colors}) {
  return (
    <View style={{width:'100%',flexDirection:'row', backgroundColor:colors.black}}>
      <Text style={{color:colors.white, paddingLeft:15}}>Creador de Presupuestos Edu-Helper {version}  |  Hecho por </Text>
      <Text style={{color:'rgb(39, 104, 255)'}} onPress={() => {Linking.openURL('https://www.linkedin.com/in/g-mo/')}}>Gero</Text>
      <Text style={{color:colors.white}}> {'<'}3</Text>
    </View>
  )
}