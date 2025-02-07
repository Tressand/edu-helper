import { StatusBar, Platform, StyleSheet } from "react-native"

export const colors = {
  background: '#fff',
  accent_1: 'rgba(186, 186, 186, 0.7)',
  accent_2: 'rgba(34, 85, 119, 0.7)'
}

const global_styles = StyleSheet.create({
  page: {
    flex:1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.background, // Cambiar por color de tema
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
    fontSize: 25,
    alignSelf: 'center'
  },
  input_box: {
    borderColor: 'gray',
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
    flex: 1,
    paddingLeft:5,
    borderRightColor: 'gray',
    borderRightWidth: 1
  },
  double_input_right: {
    width:70,
    paddingLeft:5,
    textAlign: 'center'
  },
  small_img: {
    height: 45,
    width: 45
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
    backgroundColor: colors.accent_1,
    height: 'auto',
    width: 100,
    alignSelf: 'center',
    alignItems: 'center'
  }
})

export default global_styles