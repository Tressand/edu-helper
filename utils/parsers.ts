export const parsePhoneNumber = (number: number) => {
  if (number == 0) return ''
  let str = number.toString()
  if (str.length > 2 && str.length < 8) str = str.slice(0,2) + ' ' + str.slice(2)
  if (str.length == 8) {
    // Example: 6975-7166
    return str.slice(0,4) + '-' + str.slice(4,8)
  }
  if (str.length == 9) {
    // Example: 697-57-166
    return str.slice(0,3) + '-' + str.slice(3,5) + '-' + str.slice(5,9)
  }
  if (str.length == 10) {
    // Example: 11 6975-7166
    return str.slice(0,2) + ' ' + str.slice(2,6) + '-' + str.slice(6,10)
  }
  if (str.length == 12) {
    // Example: +54 11 6975-7166
    return '+' + str.slice(0,2) + ' ' + str.slice(2,4) + ' ' + str.slice(4,8) + '-' + str.slice(8,12)
  }
  return str
}

export const parseLicensePlate = (id: string) => {
  if (id.length == 6) {
    // Example: ABC-123
    return id.slice(0,3) + '-' + id.slice(3,6)
  }
  if (id.length == 7) {
    // Example: AB-123-CD
    return id.slice(0,2) + '-' + id.slice(2,5) + '-' + id.slice(5,7)
  }
  return id
}

export const numberToFormat = (num: number) => {
  if(num == 0 || Number.isNaN(num)) return ''
  const value = num.toString()
  const mantise = value.split(',')[1] ? (',' + value.split(',')[1]) : ''
  const parsedInt = value
  .replace(/[^\d,]/, '')
  .split(',')
  [0]
  .split('')
  .reverse()
  .join('')
  .match(/.{1,3}/g)
  .join('.')
  .split('')
  .reverse()
  .join('')

  const parsedFloat = parsedInt + mantise
  return value.endsWith(',') ? parsedFloat + ',' : parsedFloat
}

export const formatToNumber = (value: string) => {
  const result = parseFloat(value.replace(/[.]/g,'').replace(',','.'))
  return Number.isNaN(result) ? 0 : result
}

const numberToPrefixed = (prefix:string, value:number) : string => {
  return value == 0 || value == undefined ? '' : prefix + numberToFormat(value)
}

export const parsePrefixedNumber = (prefix: string, value:string) : number => {
  return value == '' || value == prefix ? 0 : parseFloat(value.replace(prefix,'').replace(/[.]/g,'').replace(',','.'))
}

export const numberToPrice = (price: number) => {
  return numberToPrefixed('$', price)
}

export const priceToNumber = (price:string) => {
  return parsePrefixedNumber('$', price)
}

export const numberToPercentage = (value: number) => {
  return numberToPrefixed('%', value)
}

export const percentageToNumber = (value:string) => {
  return parsePrefixedNumber('%', value)
}

export const dateToFormat = (date: Date) => {
  return `${date.getDate() < 10 ? '0' + date.getDate(): date.getDate()}-${date.getMonth() < 10 ? '0' + date.getMonth(): date.getMonth()}-${date.getFullYear()}`
}

export const logFormData = (formData) => {
  alert(`
name: ${formData.name}\n
address: ${formData.address}\n
number: ${formData.number}\n
brand: ${formData.brand}\n
model: ${formData.model}\n
id: ${formData.id}\n
extra: ${formData.extra}\n
locations: ${formData.locations}\n
workCost: ${formData.workCost}\n
paintCost: ${formData.paintCost}\n
mechanicCost: ${formData.mechanicCost}\n
date: ${formData.date.toLocaleDateString()}\n
`)
}

export const logItemList = (ids,itemList) => {
  let str = ''
  ids.forEach(id => { if(itemList[id]) {str += `item: ${itemList[id].name}, value: ${itemList[id].value}\n`} else {str += `id=${id} present but has no value\n`}})
  alert(str)
}

export const logParsedItemList = (itemList) => {
  let str = ''
  itemList.items.forEach(item => { str += `item: ${item.name}, value: ${item.value}\n` })
  alert(str)
}