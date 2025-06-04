import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import Form from '../components/Form'
import getGlobalStyles from '../styles/global_styles';

export const version = 'v1.4'

let current = "other"

const pages = {
  "form" : Form,
  "other": OtherPage
}

type setState<Type> =  [Type, React.Dispatch<React.SetStateAction<Type>>]

type PageData = {
  name:string,
  props:any
}

export default function App() {
  const global_styles = getGlobalStyles(useColorScheme())
  const [currentPage, setCurrentPage] : setState<PageData> = useState({name: 'form', props:{}})
  return (
    <View style={[global_styles.page]}>
      {console.log(currentPage)}
      {pages[currentPage.name]({...currentPage.props, router:setCurrentPage})}
      <StatusBar></StatusBar>
    </View>
  );
}

function OtherPage(props) {
  return(
    <View>
      <Text>PORONGO</Text>
      <TouchableOpacity style={{width:100, height:100, backgroundColor:'black'}} onPress={() => {props.router({name: 'form', props: {}})}}></TouchableOpacity>
    </View>
  )
}