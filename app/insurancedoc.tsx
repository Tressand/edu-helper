import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function InsuranceDoc() {
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={[styles.doc_section, styles.small_section]}>
          <View></View>
          <View>
            <Text>TALLER EL QUIJOTE DE LA CHAPA</Text>
            <Text>Av. Alvarez Jonte 1531 - Paternal - C.A.B.A.</Text>
            <View>
              <Text>+54 11 5177-8297</Text>
            </View>
            <View>
              <Text>elquijotedelachapa@gmail.com</Text>
            </View>
          </View>
          <View></View>
          <Text>Header</Text>
        </View>
        <View style={[styles.doc_section, styles.small_section]}>
          <Text>Client Info</Text>
        </View>
        <View style={[styles.doc_section, styles.big_section]}>
          <Text>Description</Text>
        </View>
        <Text>PRESUPUESTO VALIDO POR 15 DÍAS LUEGO DE LA FECHA DE SU CONFECCIÓN</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio : 1/1.414,
    flex: 1,
    paddingTop: 25,
    paddingBottom: 25,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doc_section: {
    width : '100%',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 10,
  },
  small_section: {
    flex : 1,
    marginBottom: 10
  },
  big_section: {
    flex : 4,
  }
});
