import { useColorScheme, View, Text, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import getGlobalStyles, { getColors } from '../styles/global_styles';
import Form from '../components/Form'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DownloadScreen from '../components/DownloadScreen';

export const version = 'v1.5'

const Stack = createNativeStackNavigator()

export default function App() {
  const global_styles = getGlobalStyles(useColorScheme())
  const colors = getColors(useColorScheme())

  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined}>
        <Stack.Screen name='Form' component={Form} options={{
          headerShown: false
        }}/>
        <Stack.Screen name='Download' component={DownloadScreen} options={{
          title: 'Descarga del Presupuesto',
          headerStyle: {
            backgroundColor:colors.magenta.secondary,
          },
          headerTintColor:colors.white
        }} />
      </Stack.Navigator>
      <StatusBar></StatusBar>
    </NavigationContainer>
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