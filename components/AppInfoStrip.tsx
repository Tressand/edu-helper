import { View, Text, Linking } from "react-native"

export const version = 'v1.5'

export default function AppInfoStrip({ colors } : any) {
  return (
    <View style={{width:'100%',flexDirection:'row', justifyContent:'center', alignItems:'center', backgroundColor:colors.black}}>
      <Text style={{color:colors.white}}>Creador de Presupuestos Edu-Helper {version}  |  Hecho por </Text>
      <Text style={{color:'rgb(39, 104, 255)'}} onPress={() => {Linking.openURL('https://www.linkedin.com/in/g-mo/')}}>Gero</Text>
      <Text style={{color:colors.white}}> {'<'}3</Text>
    </View>
  )
}