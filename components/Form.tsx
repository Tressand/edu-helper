// #region IMPORTS

import React, { useState } from 'react'
import { Text, View, ScrollView, TouchableOpacity, TextInput, Image, Platform, SafeAreaView, useColorScheme, KeyboardAvoidingView, Linking} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'
import createBudgetDocument from '../utils/pdfHandler';
import { parsePhoneNumber, numberToPrice, parseLicensePlate, priceToNumber, numberToPercentage, percentageToNumber, numberToFormat, parsePrefixedNumber, formatToNumber } from '../utils/parsers';
import getGlobalStyles, { getColors, ColorPalette } from '../styles/global_styles';
import { AppInfoStrip, version } from '../app/App';

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
  workCost:number,
  paintCost:number,
  mechanicCost:number,
  total:number,
  date:Date,
}

type ItemList = {[key:string]:ItemPair}
type ItemPair = {
  name: string,
  value: number
}

type CostObject = {
  units:number,
  perUnit:number,
  percentage:number,
  setTotal:(arg0:FormDataObject, arg1:number)=>FormDataObject,
}

export type PDFBudgetData = (FormDataObject & {
  items: [...ItemPair[]],
  days:number, sheets:number,
  day:string,
  month:string,
  year:string
})

type stateSetter<Type> = React.Dispatch<React.SetStateAction<Type>>
type setState<Type> =  [Type, stateSetter<Type>]

// #endregion

// #region CONSTS

const mockData : {
  formData:FormDataObject,
  items:{[id:number]:ItemPair},
  costObjects:{[id:string]:CostObject}
} = {
  formData: {
    name: 'Juan Pérez',
    address: 'Av. Siempre Viva 742',
    number: 1156781234,
    brand: 'Ford',
    model: 'Fiesta',
    id: 'AA123BB',
    extra: 'Algunas observaciones adicionales',
    locations: 'Paragolpes delantero, puerta trasera',
    workCost: 252000,
    paintCost: 392000,
    mechanicCost: 50000,
    total:844000,
    date: new Date()
  },
  items: {
    1: {name: 'Paragolpes delantero', value: 100000},
    2: {name: 'Puerta trasera', value: 50000},
    3: {name: 'Puerta trasera', value: 50000},
    4: {name: 'Puerta trasera', value: 50000},
    5: {name: 'Puerta trasera', value: 50000},
    6: {name: 'Puerta trasera', value: 50000},
    7: {name: 'Puerta trasera', value: 50000},
    8: {name: 'Puerta trasera', value: 50000},
    9: {name: 'Puerta trasera', value: 50000},
    10: {name: 'Puerta trasera', value: 50000},
    11: {name: 'Puerta trasera', value: 50000},
    12: {name: 'Puerta trasera', value: 50000},
    13: {name: 'Puerta trasera', value: 50000},
    14: {name: 'Puerta trasera', value: 50000},
    15: {name: 'Puerta trasera', value: 50000},
    16: {name: 'Puerta trasera', value: 50000},
    17: {name: 'Puerta trasera', value: 50000},
    18: {name: 'Puerta trasera', value: 50000},
    19: {name: 'Puerta trasera', value: 50000},
    20: {name: 'Puerta trasera', value: 50000},
  },
  costObjects: {
    work: {
      units:2,
      perUnit:140000,
      percentage:10,
      setTotal: (baseFormData, value: number) => {return {...baseFormData, workCost: value}}
    },
    paint: {
      units:7,
      perUnit:70000,
      percentage:20,
      setTotal: (baseFormData, value: number) => {return {...baseFormData, paintCost: value}}
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
  workCost: 0,
  paintCost: 0,
  mechanicCost: 0,
  total:0,
  date: new Date()
}

const emptyCostObject = {
  units: 0,
  perUnit: 0,
  percentage: 0,
}

// #endregion

export default function Form({ navigation }) {
  // #region STATE

  const [ids, setIds]: setState<[...number[]]> = useState([1,2,3,4])
  const [formData, setFormData]: setState<FormDataObject> = useState(initialFormData)
  const [showDatePicker, setShowDatePicker]: setState<Boolean> = useState(false)
  const [itemList, setItemList]: setState<ItemList> = useState({})
  const [workCostObject, setWorkCostObject]: setState<CostObject> = useState({
    ...emptyCostObject,
    setTotal: (baseFormData, value: number) => {return {...baseFormData, workCost: value}}
  })
  const [paintCostObject, setPaintCostObject]: setState<CostObject> = useState({
    ...emptyCostObject,
    setTotal: (baseFormData, value: number) => {return {...baseFormData, paintCost: value}}
  })
  const setCostObjectValue = (object: CostObject, setter: stateSetter<CostObject>, key:string, value:number) => {
    const newCostObject: CostObject = {...object, [key]: value}
    const totalPrice = (newCostObject.perUnit * newCostObject.units) * (1 - (newCostObject.percentage/100))
    const newFormData = object.setTotal(formData, totalPrice)
    setter(newCostObject)
    updateTotal(newFormData, itemList)
  }
  const theme = useColorScheme()
  const global_styles = getGlobalStyles(theme)
  const colors = getColors(theme)

  const updateTotal = (formData:FormDataObject, items:ItemList) => {
    setFormData({...formData, total:itemsTotal(formData, items)})
  }

  const addItem = () => {
    setIds([...ids, ids[ids.length - 1] + 1])
  }

  const removeItem = (id : number) => {
    let newItemList = {...itemList}
    if (ids.length == 1) {
      newItemList[id] = {name: '', value: 0}
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

  const setValue = (id : number, value: number) => {
    const newItemList : {[key: string]: ItemPair} = {
      ...itemList,
      [id]: {name: itemList[id]?.name || '', value: value}
    }
    setItemList(newItemList)
    setFormData({...formData, total:itemsTotal(formData, newItemList)})
  }

  const getItemPairFromID = (id : number) => {
    return itemList[id]
  }

  const itemsTotal = (baseFormData: FormDataObject, itemList:{[key: string]: ItemPair}) => {
    let total = 0
    for (let i = 0; i < ids.length; i++) {
      if(itemList[ids[i]]) total += itemList[ids[i]].value
    }
    total += baseFormData.workCost + baseFormData.paintCost + baseFormData.mechanicCost
    return total
  }

  const submit = () => {
    const data: PDFBudgetData = {
      ...formData,
      items: [],
      days: workCostObject.units ??= 0,
      sheets: paintCostObject.units ??= 0,
      day: '',
      month: '',
      year: ''
    }
    ids.forEach((id) => {
      if (itemList[id] && (itemList[id].name != '' || itemList[id].value != 0)) {
        data.items.push(itemList[id])
      }
    })
    if (data.items.length <= 9) createBudgetDocument({...data, page:1, totalPages:1})
    else navigation.navigate('Download', {budgetData: data})
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
      <KeyboardAvoidingView behavior='padding'
      style={[
        global_styles.input_box,
        props.multiline ? global_styles.multiline : {},
        {backgroundColor:palette.secondary, marginVertical:10}
      ]}>
        <TextInput
          value={props.formatter(formData[props.value])}
          onChangeText={props.updater}
          style = {[
            global_styles.input_box,
            props.multiline ? {...global_styles.multiline, padding:15} : {},
          ]}
          placeholder={props.placeholder}
          multiline={props.multiline}
          placeholderTextColor={colors.text}
          keyboardType={props.keyboardType}
        />
      </KeyboardAvoidingView>
    )
  }

  function ItemListDivisoryLine({index, length}) {
    const indexes = []
    const smallChunkSize = 9
    const bigChunkSize = 11

    let i = 0
    while(length >= 0) {
      const chunkSize = (length <= 2 * smallChunkSize) ? smallChunkSize : bigChunkSize

      if (chunkSize == smallChunkSize && length > chunkSize) {
        i += chunkSize
        length -= chunkSize
        indexes.push(i)
      }
      i += chunkSize
      length -= chunkSize
      indexes.push(i)
    }
                  
    return indexes.includes(index) ? <View style={{width:'100%', height:3, backgroundColor:colors.cyan.accent}} /> : <></>
  }

  function CostObjectComponent({ label, object, setter, value }){
    return (
      <View style={[global_styles.input_box, {height:'auto', marginVertical:10}]}>
        <View style={[global_styles.multiple_input_container, {backgroundColor:colors.magenta.secondary, borderBottomLeftRadius:0, borderBottomRightRadius:0}]}>
          <TextInput
            value = {label}
            editable = {false}
            style = {[global_styles.evenly_divided_input, {fontWeight: 'bold', borderTopLeftRadius:15, backgroundColor:colors.magenta.accent}]}
          />
          <TextInput
            value = {numberToPrice(object.perUnit)}
            style = {global_styles.evenly_divided_input}
            placeholderTextColor={colors.text}
            keyboardType='number-pad'
            placeholder='$/Día'
            onChangeText={(text) => {
              setCostObjectValue(object, setter, 'perUnit', priceToNumber(text))
            }}
          />
          <TextInput
            value = {numberToFormat(object.units)}
            keyboardType='number-pad'
            style = {[
              global_styles.evenly_divided_input, 
              {
                borderLeftColor: colors.magenta.primary, 
                borderRightColor: colors.magenta.primary
              }
            ]}
            placeholderTextColor={colors.text}
            placeholder='Días'
            onChangeText={(text) => {
              setCostObjectValue(object, setter, 'units', formatToNumber(text))
            }}
          />
          <TextInput
            value = {numberToPercentage(object.percentage)}
            keyboardType='number-pad'
            style = {global_styles.evenly_divided_input}
            placeholderTextColor={colors.text}
            placeholder='%'
            onChangeText={(text) => {
              setCostObjectValue(object, setter, 'percentage', percentageToNumber(text))
            }}
          />
        </View>
        <TextInput
          value={numberToPrice(formData[value])}
          editable={false}
          style={[global_styles.total_container, {
            backgroundColor:colors.magenta.secondary,
            borderTopColor:colors.magenta.primary
          }]}
        />
      </View>
    )
  }

  // #endregion

  // #region PAGE

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
            <ButtonComponent color='red' label="Limpiar" callback={() => {
              const test = formData.name == 'test'
              setItemList(test ? mockData.items : {})
              setWorkCostObject(test ? {...mockData.costObjects.work, setTotal:workCostObject.setTotal} : {...emptyCostObject, setTotal:workCostObject.setTotal})
              setPaintCostObject(test ? {...mockData.costObjects.paint, setTotal:paintCostObject.setTotal} : {...emptyCostObject, setTotal:paintCostObject.setTotal})
              setFormData(test ? {...mockData.formData, total:itemsTotal(mockData.formData, mockData.items)} : initialFormData)
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
          { ids.map((id, index, list) =>
              <View key={'elem' + id}>
                { 
                  ItemListDivisoryLine({index: index, length:list.length})
                }
                <View style={[global_styles.multiple_input_container, {marginVertical:10}]}>
                  <View style={[global_styles.multiple_input_container, {width:'auto', backgroundColor:colors.cyan.secondary}]}>
                    <TextInput
                      value={getItemPairFromID(id)?.name ?? ''}
                      style = {[global_styles.double_input_left, {borderRightColor: colors.cyan.primary}]}
                      placeholderTextColor={colors.text}
                      placeholder='Item'
                      onChangeText={(text) => setName(id, text)}
                    />
                    <TextInput
                      value={numberToPrice(getItemPairFromID(id)?.value)}
                      keyboardType='number-pad'
                      style = {global_styles.double_input_right}
                      placeholderTextColor={colors.text}
                      placeholder='Precio'
                      onChangeText={(text) => {setValue(id, priceToNumber(text))}}
                    />
                  </View>
                  <TouchableOpacity 
                    style={[global_styles.small_img, {alignSelf:'center', marginLeft: 10}]}
                    onPress={() => removeItem(id)}
                  >
                    <Image source={require('../assets/basura.png')} style = {global_styles.small_img} />
                  </TouchableOpacity>
                </View>
              </View>
            )
          }
          <ButtonComponent callback={addItem} color='cyan'>
            <Image source={require('../assets/mas.png')} style = {{...global_styles.small_img, marginHorizontal:25}} />
          </ButtonComponent>
        </View>
        {/* MAGENTA SECTION */}
        <View style={[global_styles.section, {backgroundColor: colors.magenta.primary}]}>
          <Text style={global_styles.title}>Mano de Obra</Text>
          {CostObjectComponent({label:'Chapa', object:workCostObject, setter:setWorkCostObject, value:'workCost'})}
          {CostObjectComponent({label:'Pintura', object:paintCostObject, setter:setPaintCostObject, value:'paintCost'})}
          <View style={[global_styles.multiple_input_container, {marginVertical:10}]}>
            <TextInput
              value = 'Mecánica'
              editable = {false}
              style = {[global_styles.evenly_divided_input,
                {
                  fontWeight: 'bold',
                  backgroundColor:colors.magenta.accent,
                  borderTopLeftRadius:15,
                  borderBottomLeftRadius:15
                }]}
              placeholderTextColor={colors.text}
              placeholder='Item'
            />
            <TextInput
              value={numberToPrice(formData.mechanicCost)}
              keyboardType='number-pad'
              style = {[global_styles.evenly_divided_input, {
                backgroundColor:colors.magenta.secondary,
                borderTopRightRadius:15,
                borderBottomRightRadius:15
              }]}
              placeholderTextColor={colors.text}
              placeholder='Precio'
              onChangeText={(text) => {
                const newFormData : FormDataObject = {...formData, mechanicCost: priceToNumber(text)}
                setFormData({...newFormData, total: itemsTotal(newFormData, itemList)})
              }}
            />
          </View>
          <View style={[global_styles.multiple_input_container, {marginVertical:10}]}>
            <TextInput
              value = 'Total'
              editable = {false}
              style = {[global_styles.evenly_divided_input,
                {
                  fontWeight: 'bold',
                  backgroundColor:colors.magenta.accent,
                  borderTopLeftRadius:15,
                  borderBottomLeftRadius:15
                }]}
              placeholderTextColor={colors.text}
              placeholder='Item'
            />
            <TextInput
              value={numberToPrice(formData.total)}
              editable={false}
              style = {[global_styles.evenly_divided_input, {
                width:'75%',
                fontWeight:'bold',
                fontSize:30,
                backgroundColor:colors.magenta.secondary,
                borderTopRightRadius:15,
                borderBottomRightRadius:15
              }]}
            />
          </View>
        </View>
        {/* SUBMIT BUTTON */}
        <TouchableOpacity style={[global_styles.button, {backgroundColor:colors.success, borderRadius:0, paddingVertical:25}]} onPress={submit}>
          <Text style={[global_styles.title]}>CREAR PRESUPUESTO</Text>
        </TouchableOpacity>
        <AppInfoStrip colors={colors}></AppInfoStrip>
      </ScrollView>
    </SafeAreaView>
  )
  // #endregion
}