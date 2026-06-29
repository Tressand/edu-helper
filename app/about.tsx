import { View, Text, Linking } from "react-native";

export default function AboutPage() {
  return (
    <View>
      <Text>Creador de Presupuestos Edu-Helper |  Hecho por </Text>
      <Text style={{color:'rgb(39, 104, 255)'}} onPress={() => {Linking.openURL('https://www.linkedin.com/in/g-mo/')}}>Gero</Text>
      <Text> {'<'}3</Text>
    </View>
  )
}