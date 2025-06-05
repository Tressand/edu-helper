import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { getColors } from '../styles/global_styles';
import Form from '../components/Form'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DownloadScreen from '../components/DownloadScreen';

const Stack = createNativeStackNavigator()

export default function App() {
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