import React from 'react'
import {View, StyleSheet, Text, TextInput} from 'react-native';
import global_styles from '../styles/global_styles';

type FieldProps = {
  tag : string
  id : string
}

export default function FormField(props:FieldProps) {
  return (
    <View key={props.id} style = {global_styles.field}>
      <TextInput
        style = {global_styles.input_box}
        placeholder={props.tag}
      />
    </View>
  );
}