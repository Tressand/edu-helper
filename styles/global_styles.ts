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
    height:50,
    color:colors.text,
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 15,
  }

  return StyleSheet.create({
    page: {
      width: '100%',
      alignItems: 'center',
      paddingTop: Platform.OS === 'android' || Platform.OS === 'ios' ? StatusBar.currentHeight : 0,
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
      alignSelf:'center'
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
      overflow: 'hidden',
      textAlignVertical:'top',
      textAlign: 'left',
      alignSelf: 'stretch'
    },
    button: {
      ...input_box_style,
      justifyContent:'center',
      width:'auto',
      height:'auto',
      padding:10
    },
    button_label:{
      color: colors.text,
      textAlignVertical:'center',
      textAlign:'center',
      fontSize:20,
      fontWeight:'bold',
    },
    big_button: {
      color: colors.text,
      fontSize:30,
      alignSelf: 'center',
      marginVertical:12,
      width:'100%'
    },
    multiple_input_container: {
      ...input_box_style,
      display:'flex',
      flexDirection: 'row',
    },
    double_input_left: {
      color:colors.text,
      width: '65%',
      height:'100%',
      borderRightWidth: 3,
      paddingHorizontal: 15,
      borderTopLeftRadius:15,
      borderBottomLeftRadius:15,
    },
    double_input_right: {
      color:colors.text,
      width:'45%',
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
    double_container: {
      height:'auto',
      paddingVertical:0,
      flexDirection: 'column'
    },
    evenly_divided_input: {
      ...input_box_style,
      width:'25%',
      borderRadius:0,
      borderWidth: 3,
      fontSize:15,
      borderColor:'transparent'
    },
    total_container: { 
      ...input_box_style,
      borderTopLeftRadius:0,
      borderTopRightRadius:0,
      borderWidth:3,
      fontSize:25,
      borderColor:'transparent',
    },
    secondary_double_container: {
      fontSize: 18,
      paddingVertical:5,
      textAlign:'center'
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