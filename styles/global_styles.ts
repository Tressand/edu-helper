import { StatusBar, Platform, StyleSheet, ColorSchemeName } from "react-native"

type Theme = {
  background:string,
  accent_1:string,
  accent_2:string,
  shadow_1:string,
  text: string,
  warning:string
}

const lightTheme : Theme = {
  background: 'rgb(249, 247, 247)',
  accent_1: 'rgba(88, 128, 178, 0.7)',
  accent_2: 'rgba(17, 45, 78, 0.7)',
  shadow_1: 'rgb(219, 226, 239)',
  text : 'rgb(27, 38, 44)',
  warning: 'rgb(187, 0, 0)'
}

const darkTheme : Theme = {
  background: 'rgb(27, 38, 44)',
  accent_1: 'rgba(111, 173, 213, 0.2)',
  accent_2: 'rgba(15, 76, 117, 0.2)',
  shadow_1: 'rgb(51, 72, 83)',
  text : 'rgb(249, 247, 247)',
  warning: 'rgb(255, 81, 81)'
}

export const getColors : ((arg0:ColorSchemeName) => Theme) = (color:ColorSchemeName) => color === 'light' ? lightTheme : darkTheme

export default function getGlobalStyles (color:ColorSchemeName) {
  const colors = getColors(color)
  return StyleSheet.create({
    page: {
      flex:1,
      width: '100%',
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingTop: Platform.OS === 'android' || Platform.OS === 'ios' ? StatusBar.currentHeight/2 : 0,
      paddingHorizontal: 10
    },
    scroll_container: {
      height: 'auto',
      width: '100%',
      alignSelf:'center',
      maxWidth: 500,
    },
    field: {
      flex: 1,
      flexDirection: 'row'
    },
    title: {
      color: colors.text,
      fontSize: 25,
      alignSelf: 'center'
    },
    input_box: {
      color:colors.text,
      borderColor: colors.shadow_1,
      textAlign: 'center',
      backgroundColor: colors.accent_1,
      marginVertical: 10,
      paddingHorizontal: 18,
      paddingVertical: 10,
      fontSize: 18,
      borderRadius: 25,
      borderWidth: 1, 
    },
    date_input_box: {
      flex:3,
      height:40,
      paddingRight: 10,
      paddingLeft:10,
      textAlign: 'center',
      fontStyle: 'normal',
      fontWeight: 'medium'
    },
    multiple_input_container: {
      flexDirection: 'row',
      height: 50,
      paddingVertical:0
    },
    evenly_divided_input: {
      color:colors.text,
      flex: 1,
      width: '25%',
      textAlign: 'center',
    },
    double_container: {
      height:'auto',
      paddingVertical:0,
      flexDirection: 'column'
    },
    secondary_double_container: {
      fontSize: 18,
      paddingVertical:5,
      textAlign:'center'
    },
    double_input_left: {
      color:colors.text,
      flex: 1,
      paddingLeft:5,
      borderRightColor: colors.shadow_1,
      borderRightWidth: 1
    },
    double_input_right: {
      color:colors.text,
      width:70,
      paddingLeft:5,
      textAlign: 'center'
    },
    small_img: {
      height: 45,
      width: 45,
      borderRadius:25,
      backgroundColor: color == 'dark' ? colors.shadow_1: 'transparent',
    },
    multiline: {
      height: 200,
      paddingVertical: 10,
      overflow: 'hidden',
      textAlignVertical:'top',
      textAlign: 'left',
      alignSelf: 'stretch'
    },
    button: {
      backgroundColor: colors.accent_2,
      marginBottom: 10,
    },
    button_add: {
      height: 'auto',
      width: 100,
      alignSelf: 'center',
      alignItems: 'center'
    },
    text: {
      color:colors.text,
    },
    warning: {
      color: colors.warning,
      textAlign:'center',
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical:10
    }
  })
}