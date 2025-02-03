import React, { useState } from 'react'
import { Text, View, ScrollView, TouchableOpacity, TextInput, Image, Platform} from 'react-native';
import FormField from './FormField'
import global_styles from '../styles/global_styles';
import createBudgetDocument from '../utils/pdfHandler';
import { parsePhoneNumber, parsePrice, parseLicensePlate } from '../utils/parsers';

const devMode = true;
const mockData = {
  name: 'Juan Pérez',
  address: 'Av. Siempre Viva 742',
  number: 1156781234,
  brand: 'Ford',
  model: 'Fiesta',
  id: 'AA123BB',
  extra: 'Algunas observaciones adicionales',
  locations: 'Paragolpes delantero, puerta trasera',
  workCost: '$150.000',
  paintCost: '$80.000',
  mechanicCost: '$50.000'
}
const mockItems = {
  1: {name: 'Paragolpes delantero', value: '$100.000'},
  2: {name: 'Puerta trasera', value: '$50.000'}
}

export default function Form() {
  const [ids, setIds] = useState(devMode ? [1,2] : [1,2,3,4])
  const [formData, setFormData] = useState(devMode ? mockData : {
    name: '',
    address: '',
    number: 0,
    brand: '',
    model: '',
    id: '',
    extra: '',
    locations: '',
    workCost: '',
    paintCost: '',
    mechanicCost: ''
  })
  const [itemList, setItemList] = useState(devMode ? mockItems : {})
  
  type InfoPair = {
    name: string,
    value: number
  }

  const addItem = () => {
    setIds([...ids, ids[ids.length - 1] + 1])
  }

  const removeItem = (id : number) => {
    if (ids.length == 1) {
      setName(id, '')
      setValue(id, '')
      return
    }

    setIds(ids.filter((elem) => elem !== id))
  }

  const setName = (id : number, name: string) => {
    setItemList({
      ...itemList,
      [id]: {name: name, value: itemList[id]?.value || 0}
    })
  }

  const setValue = (id : number, value: string) => {
    setItemList({
      ...itemList,
      [id]: {name: itemList[id]?.name || '', value: value}
    })
  }

  const getValue = (id : number) => {
    return itemList[id]
  }
  
  const submit = () => {
    const data = {...formData, items: []}
    ids.forEach((id) => {
      if (itemList[id].name != '' || itemList[id].value != '') {
        data.items.push(itemList[id])
      }
    })
    const pdfDocument = createBudgetDocument(data)
  }

  return (
    <View style={[global_styles.page]}>
      <ScrollView 
        style={global_styles.scroll_container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={global_styles.title}>Información del Cliente</Text>
        <TextInput
          value={formData.name}
          onChangeText={(text) => setFormData({...formData, name: text})}
          style = {global_styles.input_box}
          placeholder='Nombre y Apellido'
        />
        <TextInput
          value={formData.address}
          onChangeText={(text) => setFormData({...formData, address: text})}
          style = {global_styles.input_box}
          placeholder='Dirección'
        />
        <TextInput
          value={parsePhoneNumber(formData.number)}
          onChangeText={(text) => {
            if (text == '') text = '0'
            let number = parseInt(text.replace(/[ \-\+]/g,''))
            if(!isNaN(number)) setFormData({...formData, number: number})
          }}
          keyboardType='number-pad'
          style = {global_styles.input_box}
          placeholder='Teléfono'
        />
        <Text style={global_styles.title}>Información del Vehiculo</Text>
        <TextInput
          value={formData.brand}
          onChangeText={(text) => setFormData({...formData, brand: text})}
          style = {global_styles.input_box}
          placeholder='Marca'
        />
        <TextInput
          value={formData.model}
          onChangeText={(text) => setFormData({...formData, model: text})}
          style = {global_styles.input_box}
          placeholder='Modelo'
        />
        <TextInput
          value={parseLicensePlate(formData.id)}
          onChangeText={(text) => {setFormData({...formData, id: text.replace(/[ \-]/g,'').toUpperCase()})}}
          keyboardType='number-pad'
          style = {global_styles.input_box}
          placeholder='Patente'
        />
        <TextInput
          value={formData.extra}
          onChangeText={(text) => setFormData({...formData, extra: text})}
          multiline={true}
          style = {[global_styles.input_box, global_styles.multiline]}
          placeholder='Observaciones'
        />
        <TextInput
          value={formData.locations}
          onChangeText={(text) => setFormData({...formData, locations: text})}
          multiline={true}
          style = {[global_styles.input_box, global_styles.multiline]}
          placeholder='Reparación por daños en...'
        />
        <Text style={global_styles.title}>Repuestos a Cambiar</Text>
        { ids.map((id) =>
            <View key={'elem' + id} style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', marginVertical:5}}>
              <View style={[global_styles.input_box, global_styles.double_input_container, {flex: 1, marginVertical:0}]}>
                <TextInput
                  value={getValue(id) != undefined ? getValue(id).name : '' }
                  style = {[global_styles.double_input_left, {flex: 1}]}
                  placeholder='Item'
                  onChangeText={(text) => setName(id, text)}
                />
                <TextInput
                  value={getValue(id) != undefined ? getValue(id).value : ''}
                  keyboardType='number-pad'
                  style = {global_styles.double_input_right}
                  placeholder='Precio'
                  onChangeText={(text) => {setValue(id, parsePrice(text))}}
                />
              </View>
              <TouchableOpacity 
                style={[global_styles.small_img, {marginLeft: 10}]}
                onPress={() => removeItem(id)}
              >
                <Image source={require('../assets/basura.png')} style = {global_styles.small_img} />
              </TouchableOpacity>
            </View>
          )
        }
        <TouchableOpacity 
          style={[global_styles.button_add, global_styles.input_box, {padding:0}]}
          onPress={addItem}
        >
          <Image source={require('../assets/mas.png')} style = {global_styles.small_img} />
        </TouchableOpacity>

        <Text style={global_styles.title}>Mano de Obra</Text>
        <View style={[global_styles.input_box, global_styles.double_input_container]}>
          <TextInput
            value = 'Chapa'
            editable = {false}
            style = {global_styles.double_input_left}
            placeholder='Item'
          />
          <TextInput
            value={formData.workCost}
            keyboardType='number-pad'
            style = {global_styles.double_input_right}
            placeholder='Precio'
            onChangeText={(text) => {setFormData({...formData, workCost: parsePrice(text)})}}
          />
        </View>
        <View style={[global_styles.input_box, global_styles.double_input_container]}>
          <TextInput
            value = 'Pintura'
            editable = {false}
            style = {global_styles.double_input_left}
            placeholder='Item'
          />
          <TextInput
            value={formData.paintCost}
            keyboardType='number-pad'
            style = {global_styles.double_input_right}
            placeholder='Precio'
            onChangeText={(text) => {setFormData({...formData, paintCost: parsePrice(text)})}}
          />
        </View>
        <View style={[global_styles.input_box, global_styles.double_input_container]}>
          <TextInput
            value = 'Mecánica'
            editable = {false}
            style = {global_styles.double_input_left}
            placeholder='Item'
          />
          <TextInput
            value={formData.mechanicCost}
            keyboardType='number-pad'
            style = {global_styles.double_input_right}
            placeholder='Precio'
            onChangeText={(text) => {setFormData({...formData, mechanicCost: parsePrice(text)})}}
          />
        </View>
        
        <TouchableOpacity style={[global_styles.input_box, global_styles.button]} onPress={submit}>
          <Text style={[global_styles.title, {color: '#FAFAFA'}]}>CREAR PRESUPUESTO</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}