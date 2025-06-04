// #region IMPORTS

import React, { useState } from 'react'
import { Text, View, ScrollView, TouchableOpacity, TextInput, Image, Platform, SafeAreaView, useColorScheme} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'
import createBudgetDocument from '../utils/pdfHandler';
import { parsePhoneNumber, parsePrice, parseLicensePlate, priceToNumber, parsePercentage, percentageToNumber, parseNumber } from '../utils/parsers';
import getGlobalStyles, { getColors, ColorPalette } from '../styles/global_styles';
import { version } from '../app/App';

// #endregion

// #region TYPES

type FormDataObject = {
  name:string,
  address:string,
  number:number,
  brand:string,
  model:string,
  id:string,
  extra:string,
  locations:string,
  workCost:string,
  paintCost:string,
  mechanicCost:string,
  total:string,
  date:Date,
  page:string,
  total_pages:string
}

type ItemList = {[key:string]:ItemPair}
type ItemPair = {
  name: string,
  value: string
}

type CostObject = {
  units:string,
  perUnit:string,
  percentage:string,
  setTotal:(arg0:FormDataObject, arg1:string)=>FormDataObject,
}

type setState<Type> =  React.Dispatch<React.SetStateAction<Type>>

// #endregion

// #region CONSTS

const mockData = {
  formData: {
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
    mechanicCost: '$50.000',
    total:'',
    date: new Date(),
    page:'1',
    total_pages:'1'
  },
  items: {
    1: {name: 'Paragolpes delantero', value: '$100.000'},
    2: {name: 'Puerta trasera', value: '$50.000'}
  },
  costObjects: {
    work: {
      units:'2',
      perUnit:'$140.000',
      percentage:'%10',
    },
    paint: {
      units:'7',
      perUnit:'$70.000',
      percentage:'%20',
    }
  }
}

const initialFormData : FormDataObject = {
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
  mechanicCost: '',
  total:'',
  date: new Date(),
  page:'1',
  total_pages:'1'
}

const emptyCostObject = {
  units: '',
  perUnit: '',
  percentage: '',
}

// #endregion

export default function Form(props) {
  // #region STATE

  const [ids, setIds]: [[...number[]], setState<[...number[]]>] = useState([1,2,3,4])
  const [formData, setFormData]: [FormDataObject, setState<FormDataObject>] = useState(initialFormData)
  const [showDatePicker, setShowDatePicker]: [boolean, setState<boolean>] = useState(false)
  const [itemList, setItemList]: [ItemList, setState<ItemList>] = useState({})
  const [workCostObject, setWorkCostObject]: [CostObject, setState<CostObject>] = useState({
    ...emptyCostObject,
    setTotal: (baseFormData, value: string) => {return {...baseFormData, workCost: value}}
  })
  const [paintCostObject, setPaintCostObject]: [CostObject, setState<CostObject>] = useState({
    ...emptyCostObject,
    setTotal: (baseFormData, value: string) => {return {...baseFormData, paintCost: value}}
  })
  const setCostObjectValue = (object: CostObject, setter: setState<CostObject>, key:string, value:string) => {
    const newCostObject: CostObject = {...object, [key]: value}
    const totalPrice = priceCalculator(newCostObject)
    const newFormData = object.setTotal(formData, totalPrice)
    setter(newCostObject)
    updateTotal(newFormData, itemList)
  }
  const theme = useColorScheme()
  const global_styles = getGlobalStyles(theme)
  const colors = getColors(theme)

  const updateTotal = (formData:FormDataObject, items:ItemList) => {
    setFormData({...formData, total:parsePrice(itemsTotal(formData, items).toString())})
  }

  const addItem = () => {
    setIds([...ids, ids[ids.length - 1] + 1])
  }

  const removeItem = (id : number) => {
    let newItemList = {...itemList}
    if (ids.length == 1) {
      newItemList[id] = {name: '', value: ''}
      setItemList(newItemList)
      updateTotal(formData, newItemList)
      return
    }

    delete newItemList[id]
    setItemList(newItemList)
    setIds(ids.filter((elem) => elem !== id))
    updateTotal(formData, newItemList)
  }

  const setName = (id : number, name: string) => {
    setItemList({
      ...itemList,
      [id]: {name: name, value: itemList[id]?.value || ''}
    })
  }

  const setValue = (id : number, value: string) => {
    const newItemList : {[key: string]: ItemPair} = {
      ...itemList,
      [id]: {name: itemList[id]?.name || '', value: value}
    }
    setItemList(newItemList)
    setFormData({...formData, total:parsePrice(itemsTotal(formData, newItemList).toString())})
  }

  const getValue = (id : number) => {
    return itemList[id]
  }

  const itemsTotal = (baseFormData: FormDataObject, itemList:{[key: string]: ItemPair}) => {
    let total = 0
    for (let i = 0; i < ids.length; i++) {
      if(itemList[ids[i]]) total += priceToNumber(itemList[ids[i]].value)
    }
    if (baseFormData.workCost != '') total += priceToNumber(baseFormData.workCost)
    if (baseFormData.paintCost != '') total += priceToNumber(baseFormData.paintCost)
    if (baseFormData.mechanicCost != '') total += priceToNumber(baseFormData.mechanicCost)
    return total
  }
  
  const priceCalculator = (object: CostObject) => {
    if(object.perUnit == '' && object.units == '') return '$0'
    const perUnitValue = object.perUnit == ''
      ? 0
      : priceToNumber(object.perUnit)
    const unitsValue = object.units == ''
      ? 0
      : parseFloat(object.units.replace('.', '').replace(',','.'))
    const percentageValue = object.percentage == '' 
      ? 0
      : percentageToNumber(object.percentage)
    const finalValue = (perUnitValue * unitsValue) * (1 - percentageValue/100)
    
    return parsePrice(finalValue.toString())
  }

  const submit = () => {
    const data: (FormDataObject & {items: [...ItemPair[]], days:number, sheets:number}) = {
      ...formData,
      items: [],
      days: parseInt(workCostObject.units) || 0,
      sheets: parseInt(paintCostObject.units) || 0,
    }
    ids.forEach((id) => {
      if (itemList[id] && (itemList[id].name != '' || itemList[id].value != '')) {
        data.items.push(itemList[id])
      }
    })
    createBudgetDocument(data)
  }

  // #endregion

  // #region COMPONENTS

  function DateInputComponent(props) {
    return (
    <>
      { Platform.OS != 'web' ? 
        (
          <TouchableOpacity style={[global_styles.input_box, {width:'40%', backgroundColor:colors.white}]} onPress={() => setShowDatePicker(true)} >
            <Text style = {[{textAlign: 'center', fontSize: 18, color:colors.black}]}> {formData.date.toLocaleDateString()} </Text>
            { showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={formData.date}
                themeVariant={theme}
                mode={'date'}
                is24Hour={true}
                onChange={(_ev, date) => {
                  setFormData({...formData, date: date || formData.date})
                  setShowDatePicker(false)
                }}
              />
            )}
          </TouchableOpacity>
        ) : (
          <input type="date"
            value={formData.date.toLocaleDateString().split('/').reverse().join('-0')}
            style = {{...global_styles.date_input_box, backgroundColor:colors.white, border:'none', color:colors.black}}
            onChange={(ev) => {
              setFormData({...formData, date: new Date(ev.target.value)})
            }}
          />
        )
      }
    </>
  )}

  function ButtonComponent(props) {
    const palette: ColorPalette = colors[props.color ??= 'green']
    return (
      <TouchableOpacity
        style={[global_styles.button, {backgroundColor:palette.accent}]}
        onPress={() => { props.callback() }}
      >
        { props.label ? <Text style={global_styles.button_label}>{props.label}</Text> : <></>}
        { props.children }
      </TouchableOpacity>
    )
  }

  function SimpleInputComponent(props) {
    props.formatter ??= (input) => input
    props.updater ??= (text) => {
      let newState = {...formData}
      newState[props.value] = text
      setFormData(newState)
    }
    props.keyboardType ??= 'default'
    props.multiline ??= false
    const palette: ColorPalette = colors[props.color ??= 'green']

    return (
      <>
        <TextInput
          value={props.formatter(formData[props.value])}
          onChangeText={props.updater}
          style = {[global_styles.input_box,
            props.multiline ? global_styles.multiline : {},
          {backgroundColor:palette.secondary}]}
          placeholder={props.placeholder}
          multiline={props.multiline}
          placeholderTextColor={colors.text}
          keyboardType={props.keyboardType}
        />
      </>
    )
  }

  // #endregion

  return (
    <SafeAreaView style={[global_styles.page]}>
      <ScrollView 
        style={global_styles.scroll_container}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={[global_styles.section, {backgroundColor: colors.gray}]}>
          <View style={{width:'100%',flexDirection:'row', gap:10, alignItems:'center', justifyContent:'center'}}>
            <DateInputComponent></DateInputComponent>
            <View style={[global_styles.input_box, {backgroundColor: colors.white, height:40, width:'20%',flexDirection:'row', alignItems:'center', paddingVertical:0}]}>
              <TextInput
                value = {formData.page}
                keyboardType='number-pad'
                style = {[{color:colors.black, width:'50%', textAlign:'center', fontWeight:'bold', overflow:'hidden'}]}
                placeholder='()'
                placeholderTextColor={colors.black}
                onChangeText={(text) => setFormData({...formData, page: parseNumber(text)})}
              />
              <Text style={{color:colors.black, fontWeight:'bold'}}>/</Text>
              <TextInput
                value = {formData.total_pages}
                keyboardType='number-pad'
                style = {[{color:colors.black, width:'50%', textAlign:'center', fontWeight:'bold', overflow:'hidden'}]}
                placeholder='()'
                placeholderTextColor={colors.black}
                onChangeText={(text) => setFormData({...formData, total_pages: parseNumber(text)})}
              />
            </View>
            <ButtonComponent color='red' label="Limpiar" callback={() => {
              const test = formData.name == 'test'
              setItemList(test ? mockData.items : {})
              setWorkCostObject(test ? {...mockData.costObjects.work, setTotal:workCostObject.setTotal} : {...emptyCostObject, setTotal:workCostObject.setTotal})
              setPaintCostObject(test ? {...mockData.costObjects.paint, setTotal:paintCostObject.setTotal} : {...emptyCostObject, setTotal:paintCostObject.setTotal})
              setFormData(test ? {...mockData.formData, total:parsePrice(itemsTotal(mockData.formData, mockData.items).toString())} : initialFormData)
            }}/>
          </View>
        </View>
        {/* GREEN SECTION */}
        <View style={[global_styles.section, {backgroundColor: colors.green.primary}]}>
          <Text style={global_styles.title}>Información del Cliente</Text>
          {SimpleInputComponent({value: "name", placeholder: "Nombre y Apellido", color: 'green'})}
          {SimpleInputComponent({value: "address", placeholder: "Dirección", color: 'green'})}
          {SimpleInputComponent({value: "number", placeholder: "Teléfono",
            formatter: parsePhoneNumber,
            updater: (text) => {
              if (text == '') text = '0'
              let number = parseInt(text.replace(/[ \-\+]/g,''))
              if(!isNaN(number)) setFormData({...formData, number: number})
            },
            keyboardType: 'number-pad',
            color: 'green'
          })}
        </View>
        {/* RED SECTION */}
        <View style={[global_styles.section, {backgroundColor: colors.red.primary}]}>
          <Text style={global_styles.title}>Información del Vehiculo</Text>
          {SimpleInputComponent({value: "brand", placeholder: "Marca", color: 'red'})}
          {SimpleInputComponent({value: "model", placeholder: "Modelo", color: 'red'})}
          {SimpleInputComponent({value: "id", placeholder: "Patente",
            formatter: parseLicensePlate,
            updater: (text) => {setFormData({...formData, id: text.replace(/[ \-]/g,'').toUpperCase()})},
            color: 'red'
          })}
          {SimpleInputComponent({value: "extra", placeholder: "Observaciones", multiline: true, color: 'red'})}
          {SimpleInputComponent({value: "locations", placeholder: "Reparación por daños en...", multiline: true, color: 'red'})}
        </View>
        {/* CYAN SECTION */}
        <View style={[global_styles.section, {backgroundColor: colors.cyan.primary}]}>
          <Text style={global_styles.title}>Repuestos a Cambiar</Text>
          { ids.map((id) =>
              <View key={'elem' + id} style={[global_styles.multiple_input_container, {width:'100%', marginVertical:10}]}>
                <View style={[global_styles.multiple_input_container, {borderRadius:15, flexGrow:1, backgroundColor:colors.cyan.secondary}]}>
                  <TextInput
                    value={getValue(id) != undefined ? getValue(id).name : ''}
                    style = {global_styles.double_input_left}
                    placeholderTextColor={colors.text}
                    placeholder='Item'
                    onChangeText={(text) => setName(id, text)}
                  />
                  <TextInput
                    value={getValue(id) != undefined ? getValue(id).value : ''}
                    keyboardType='number-pad'
                    style = {global_styles.double_input_right}
                    placeholderTextColor={colors.text}
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
          { ids.length < 9 ?
            (<ButtonComponent callback={addItem} color='cyan'>
              <Image source={require('../assets/mas.png')} style = {{...global_styles.small_img, marginHorizontal:25}} />
            </ButtonComponent>)
            : (<Text style={global_styles.warning}>Se alcanzó el máximo de entradas para este presupuesto.</Text>)
          }
        </View>
        {/* MAGENTA SECTION */}
        <View style={[global_styles.section, {backgroundColor: colors.magenta.primary}]}>
          <Text style={global_styles.title}>Mano de Obra</Text>
          <View style={[global_styles.input_box, global_styles.double_container]}>
            <View style={[global_styles.multiple_input_container]}>
              <TextInput
                value = 'Chapa'
                editable = {false}
                style = {[global_styles.evenly_divided_input, {fontSize: 20}]}
              />
              <TextInput
                value = {workCostObject.perUnit}
                style = {global_styles.evenly_divided_input}
                placeholderTextColor={colors.text}
                keyboardType='number-pad'
                placeholder='$/Día'
                onChangeText={(text) => {
                  setCostObjectValue(workCostObject, setWorkCostObject, 'perUnit', parsePrice(text))
                }}
              />
              <TextInput
                value = {workCostObject.units}
                keyboardType='number-pad'
                style = {[
                  global_styles.evenly_divided_input, 
                  {
                    borderLeftColor: 'gray', 
                    borderRightColor: 'gray'
                  }
                ]}
                placeholderTextColor={colors.text}
                placeholder='Días'
                onChangeText={(text) => {
                  setCostObjectValue(workCostObject, setWorkCostObject, 'units', text)
                }}
              />
              <TextInput
                value = {workCostObject.percentage}
                keyboardType='number-pad'
                style = {global_styles.evenly_divided_input}
                placeholderTextColor={colors.text}
                placeholder='%'
                onChangeText={(text) => {
                  setCostObjectValue(workCostObject, setWorkCostObject, 'percentage', parsePercentage(text))
                }}
              />
            </View>
            <TextInput
              value={formData.workCost}
              editable={false}
              style={[global_styles.secondary_double_container, global_styles.text]}
            />
          </View>
          <View style={[global_styles.input_box, global_styles.double_container]}>
            <View style={[global_styles.multiple_input_container]}>
              <TextInput
                value = 'Pintura'
                editable = {false}
                style = {[global_styles.evenly_divided_input, {fontSize: 20}]}
              />
              <TextInput
                value = {paintCostObject.perUnit}
                style = {global_styles.evenly_divided_input}
                placeholderTextColor={colors.text}
                keyboardType='number-pad'
                placeholder='$/Paño'
                onChangeText={(text) => {
                  setCostObjectValue(paintCostObject, setPaintCostObject, 'perUnit', parsePrice(text))
                }}
              />
              <TextInput
                value = {paintCostObject.units}
                keyboardType='number-pad'
                style = {[
                  global_styles.evenly_divided_input, 
                  {
                    borderLeftColor: 'gray', 
                    borderRightColor: 'gray'
                  }
                ]}
                placeholderTextColor={colors.text}
                placeholder='Paños'
                onChangeText={(text) => {
                  setCostObjectValue(paintCostObject, setPaintCostObject, 'units', text)
                }}
              />
              <TextInput
                value = {paintCostObject.percentage}
                keyboardType='number-pad'
                style = {global_styles.evenly_divided_input}
                placeholderTextColor={colors.text}
                placeholder='%'
                onChangeText={(text) => {
                  setCostObjectValue(paintCostObject, setPaintCostObject, 'percentage', parsePercentage(text))
                }}
              />
            </View>
            <TextInput
              value={formData.paintCost}
              editable={false}
              style={[global_styles.secondary_double_container, global_styles.text]}
            />
          </View>
          <View style={[global_styles.input_box, global_styles.multiple_input_container]}>
            <TextInput
              value = 'Mecánica'
              editable = {false}
              style = {[global_styles.text, {fontSize: 20, width:'25%', textAlign:'center'}]}
              placeholderTextColor={colors.text}
              placeholder='Item'
            />
            <TextInput
              value={formData.mechanicCost}
              keyboardType='number-pad'
              style = {[global_styles.text, {textAlign:'center', width:'75%'}]}
              placeholderTextColor={colors.text}
              placeholder='Precio'
              onChangeText={(text) => {
                const newFormData = {...formData, mechanicCost: parsePrice(text)}
                setFormData({...newFormData, total: parsePrice(itemsTotal(newFormData, itemList).toString())})
              }}
            />
          </View>
          <View style={[global_styles.input_box, global_styles.multiple_input_container]}>
            <TextInput
              value = 'Total'
              editable = {false}
              style = {[global_styles.text, {fontSize: 20, width:'25%', textAlign:'center'}]}
              placeholderTextColor={colors.text}
              placeholder='Item'
            />
            <TextInput
              value={formData.total}
              editable={false}
              style = {[global_styles.text, {textAlign:'center', width:'75%', fontWeight:'bold', fontSize:20}]}
            />
          </View>
        </View>
        {/* SUBMIT BUTTON */}
        <TouchableOpacity style={[global_styles.input_box, {backgroundColor:colors.success, margin: 0, borderRadius:0, paddingVertical:20}]} onPress={submit}>
          <Text style={[global_styles.title, {color: '#FAFAFA'}]}>CREAR PRESUPUESTO</Text>
        </TouchableOpacity>
        <Text style={global_styles.text}>{version} | Hecho por Gero {'<'}3</Text>
      </ScrollView>
    </SafeAreaView>
  )
}