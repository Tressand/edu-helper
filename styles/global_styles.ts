import { CSSProperties } from "react"
import { StatusBar, Platform, StyleSheet, ColorSchemeName, ViewStyle, TextStyle, ImageStyle } from "react-native"

type Theme = {
  white:string,
  gray:string,
  black:string,
  shadows:string,
  green:ColorPalette,
  red:ColorPalette,
  cyan:ColorPalette,
  magenta:ColorPalette,
  text:string,
  success:string,
  failure:string,
}

export type ColorPalette = {
  primary:string,
  secondary:string,
  accent:string,
}

const lightTheme : Theme = {
  white:'#FFFFFF',
  gray:'#9f9f9f',
  black:'#2f2f2f',
  shadows:'#000000',
  green:{
    primary: '#74c250',
    secondary: '#5f9f41',
    accent: '#94ff62'
  },
  red:{
    primary: '#e44244',
    secondary: '#be3537',
    accent: '#ff4c4f'
  },
  cyan:{
    primary: '#47ace3',
    secondary: '#4594ce',
    accent: '#1b6bff'
  },
  magenta:{
    primary: '#7f62ff',
    secondary: '#6f58d9',
    accent: '#5438d7'
  },
  text:'#FFFFFF',
  success:'#2de32d',
  failure:'#f32828',
}

const darkTheme : Theme = {
  white:'#FFFFFF',
  gray:'#9f9f9f',
  black:'#2f2f2f',
  shadows:'#000000',
  green:{
    primary: '#74c250',
    secondary: '#5f9f41',
    accent: '#94ff62'
  },
  red:{
    primary: '#e44244',
    secondary: '#be3537',
    accent: '#ff4c4f'
  },
  cyan:{
    primary: '#47ace3',
    secondary: '#4594ce',
    accent: '#1b6bff'
  },
  magenta:{
    primary: '#7f62ff',
    secondary: '#6f58d9',
    accent: '#5438d7'
  },
  text:'#FFFFFF',
  success:'#2de32d',
  failure:'#f32828',
}

export const getColors : ((arg0:ColorSchemeName) => Theme) = (color:ColorSchemeName) => color === 'light' ? lightTheme : darkTheme

export default function getGlobalStyles (color:ColorSchemeName) {
  const colors = getColors(color)

  type Style = ViewStyle | TextStyle | ImageStyle | any
  const input_box_style: Style = {
    width:'100%',
    color:colors.text,
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 20,
    borderRadius: 15,
  }

  return StyleSheet.create({
    page: {
      flex:1,
      width: '100%',
      alignItems: 'center',
      paddingTop: Platform.OS === 'android' || Platform.OS === 'ios' ? StatusBar.currentHeight/2 : 0,
    },
    section: {
      width: '100%',
      alignItems: 'center',
      paddingHorizontal: 35,
      paddingVertical: 10
    },
    scroll_container: {
      height: 'auto',
      width: '100%',
      alignSelf:'center',
      maxWidth: 500,
    },
    title: {
      color: colors.text,
      fontSize:30,
      alignSelf: 'center',
      marginVertical:12
    },
    input_box: input_box_style,
    item_list_input_box: {
      ...input_box_style,

    },
    date_input_box: {
      ...input_box_style,
      flex:3,
      height:40,
      paddingRight: 10,
      paddingLeft:10,
      textAlign: 'center',
      fontStyle: 'normal',
      fontWeight: 'medium'
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
      ...input_box_style,
      width:'auto'
    },
    button_label:{
      color: colors.text,
      fontSize:20,
      fontWeight:'bold',
      alignSelf: 'center',
      marginVertical:5
    },
    big_button: {
      color: colors.text,
      fontSize:30,
      alignSelf: 'center',
      marginVertical:12,
      width:'100%'
    },
    multiple_input_container: {
      display:'flex',
      flexDirection: 'row',
      alignItems: 'center',
      height: 50,
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
      flexGrow:1,
      height:'100%',
      paddingHorizontal: 15,
      borderTopLeftRadius:15,
      borderBottomLeftRadius:15,
    },
    double_input_right: {
      color:colors.text,
      width:'30%',
      height:'100%',
      paddingHorizontal: 15,
      borderTopRightRadius:15,
      borderBottomRightRadius:15,
    },
    small_img: {
      height: 45,
      width: 45,
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
      color: colors.failure,
      textAlign:'center',
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical:10
    }
  })
}