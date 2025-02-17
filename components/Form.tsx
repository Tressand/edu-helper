import React, { useState } from 'react'
import { Text, View, ScrollView, TouchableOpacity, TextInput, Image, Platform, SafeAreaView, useColorScheme} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'
import createBudgetDocument from '../utils/pdfHandler';
import { parsePhoneNumber, parsePrice, parseLicensePlate, priceToNumber, parsePercentage, percentageToNumber, parseNumber } from '../utils/parsers';
import getGlobalStyles, { getColors } from '../styles/global_styles';

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

const devMode = false
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

export default function Form() {
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

  return (
    <SafeAreaView style={[global_styles.page]}>
      <ScrollView 
        style={global_styles.scroll_container}
        showsVerticalScrollIndicator={false}
      >
        <View style={{flexDirection:'row', gap:20, justifyContent:'center', alignItems:'center'}}>
          { devMode ? (
            <>
              <TouchableOpacity
                style={[global_styles.input_box, global_styles.button,{width:'auto', alignSelf:'center'}]}
                onPress={() => {
                  const totalWork = priceCalculator({...mockData.costObjects.work, setTotal: workCostObject.setTotal})
                  const totalPaint = priceCalculator({...mockData.costObjects.paint, setTotal: paintCostObject.setTotal})
                  let finalFormData: FormDataObject = {...mockData.formData, workCost: totalWork, paintCost: totalPaint}
                  setFormData({...finalFormData, total:parsePrice(itemsTotal(finalFormData, mockData.items).toString())})
                  setItemList(mockData.items)
                  setPaintCostObject({...mockData.costObjects.work, setTotal: workCostObject.setTotal})
                  setWorkCostObject({...mockData.costObjects.paint, setTotal: paintCostObject.setTotal})
                }}
              >
                <Text style={[global_styles.title, {color: '#FAFAFA'}]}>Probar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[global_styles.input_box, global_styles.button,{width:'auto', alignSelf:'center'}]}
                onPress={() => alert(theme)}
              >
                <Text style={[global_styles.title, {color: '#FAFAFA'}]}>Tema</Text>
              </TouchableOpacity>
            </>
          ) : (<></>)
          }
          <TouchableOpacity
            style={[global_styles.input_box, global_styles.button,{width:'auto', alignSelf:'center'}]}
            onPress={() => {
              setFormData(initialFormData)
              setItemList({})
              setWorkCostObject({...emptyCostObject, setTotal:workCostObject.setTotal})
              setPaintCostObject({...emptyCostObject, setTotal:paintCostObject.setTotal})
            }}
          >
            <Text style={[global_styles.title, {color: '#FAFAFA'}]}>Limpiar</Text>
          </TouchableOpacity>
        </View>
        <View style={{width:'100%',flexDirection:'row', gap:10, alignItems:'center', justifyContent:'center'}}>
          { Platform.OS != 'web' ? 
            (
              <TouchableOpacity style={[global_styles.input_box, {width:'40%'}]} onPress={() => setShowDatePicker(true)} >
                <Text style = {[{textAlign: 'center', fontSize: 18}, global_styles.text]}> {formData.date.toLocaleDateString()} </Text>
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
                style = {{...global_styles.input_box, ...global_styles.date_input_box, width:'75%'}}
                onChange={(ev) => {
                  setFormData({...formData, date: new Date(ev.target.value)})
                }}
              />
            )
          }
          <View style={[global_styles.input_box, {height:40, width:'20%',flexDirection:'row', alignItems:'center', paddingVertical:0}]}>
            <TextInput
              value = {formData.page}
              keyboardType='number-pad'
              style = {[global_styles.text, {width:'50%', textAlign:'center', overflow:'hidden'}]}
              placeholder='()'
              placeholderTextColor={colors.text}
              onChangeText={(text) => setFormData({...formData, page: parseNumber(text)})}
            />
            <Text style={global_styles.text}>/</Text>
            <TextInput
              value = {formData.total_pages}
              keyboardType='number-pad'
              style = {[global_styles.text, {width:'50%', textAlign:'center', overflow:'hidden'}]}
              placeholder='()'
              placeholderTextColor={colors.text}
              onChangeText={(text) => setFormData({...formData, total_pages: parseNumber(text)})}
            />
          </View>
        </View>
        <TextInput
          value={formData.name}
          onChangeText={(text) => setFormData({...formData, name: text})}
          style = {global_styles.input_box}
          placeholder='Nombre y Apellido'
          placeholderTextColor={colors.text}
        />
        <TextInput
          value={formData.address}
          onChangeText={(text) => setFormData({...formData, address: text})}
          style = {global_styles.input_box}
          placeholder='Dirección'
          placeholderTextColor={colors.text}
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
          placeholderTextColor={colors.text}
        />
        <Text style={global_styles.title}>Información del Vehiculo</Text>
        <TextInput
          value={formData.brand}
          onChangeText={(text) => setFormData({...formData, brand: text})}
          style = {global_styles.input_box}
          placeholderTextColor={colors.text}
          placeholder='Marca'
        />
        <TextInput
          value={formData.model}
          onChangeText={(text) => setFormData({...formData, model: text})}
          style = {global_styles.input_box}
          placeholderTextColor={colors.text}
          placeholder='Modelo'
        />
        <TextInput
          value={parseLicensePlate(formData.id)}
          onChangeText={(text) => {setFormData({...formData, id: text.replace(/[ \-]/g,'').toUpperCase()})}}
          style = {global_styles.input_box}
          placeholderTextColor={colors.text}
          placeholder='Patente'
        />
        <TextInput
          value={formData.extra}
          onChangeText={(text) => setFormData({...formData, extra: text})}
          multiline={true}
          style = {[global_styles.input_box, global_styles.multiline]}
          placeholderTextColor={colors.text}
          placeholder='Observaciones'
        />
        <TextInput
          value={formData.locations}
          onChangeText={(text) => setFormData({...formData, locations: text})}
          multiline={true}
          style = {[global_styles.input_box, global_styles.multiline]}
          placeholderTextColor={colors.text}
          placeholder='Reparación por daños en...'
        />
        <Text style={global_styles.title}>Repuestos a Cambiar</Text>
        { ids.map((id) =>
            <View key={'elem' + id} style={{flex:1, flexDirection:'row', justifyContent:'center', alignItems:'center', marginVertical:5}}>
              <View style={[global_styles.input_box, global_styles.multiple_input_container, {flex: 1, marginVertical:0}]}>
                <TextInput
                  value={getValue(id) != undefined ? getValue(id).name : '' }
                  style = {[global_styles.double_input_left, {flex: 1}]}
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
          (<TouchableOpacity 
            style={[global_styles.button_add, global_styles.input_box, {padding:0}]}
            onPress={addItem}
          >
            <Image source={require('../assets/mas.png')} style = {global_styles.small_img} />
          </TouchableOpacity>) 
          : (<Text style={global_styles.warning}>Se alcanzó el máximo de entradas para este presupuesto.</Text>)
        }

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
            style={global_styles.secondary_double_container}
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
            style={global_styles.secondary_double_container}
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
            style = {[global_styles.text, {textAlign:'center', width:'75%'}]}
          />
        </View>
        <TouchableOpacity style={[global_styles.input_box, global_styles.button]} onPress={submit}>
          <Text style={[global_styles.title, {color: '#FAFAFA'}]}>CREAR PRESUPUESTO</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}