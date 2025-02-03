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

export const parsePrice = (price: string) => {
  if (price == '' || price == '$') return ''
  price = price.replace(/[\$\.]/g, '').replace(/[^\d,]/, '')
  const value = price.split(',')
  const parsedInt = value[0]
    .split('')
    .reverse()
    .join('')
    .match(/.{1,3}/g)
    .join('.')
    .split('')
    .reverse()
    .join('');
  if (price.endsWith(',')) return '$' + parsedInt + ','
  return '$' + (value.length > 1 ? parsedInt + ',' + value[1] : parsedInt)
}
