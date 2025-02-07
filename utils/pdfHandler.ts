import { PDFDocument } from "pdf-lib"
import * as FileSystem from 'expo-file-system'
import { parsePhoneNumber, parsePrice, parseLicensePlate, logParsedItemList} from "./parsers"
import { Platform } from "react-native"
import { Asset } from "expo-asset"
import * as Sharing from 'expo-sharing'

const budget_template = require('../assets/budget_template.pdf')

/* All possible fields in the PDF:
Día,Mes,Año,Nombre y Apellido,Dirección,Telefono,Marca,Modelo,
Observaciones,Total,Patente,Nro. Hoja,Detalle,Precio0,Item0,Item1,Precio1,
Precio2,Item2,Item3,Precio3,Precio4,Item4,Item5,Precio5,Precio6,Item6,Item7,
Precio7,Item8,Item9,Item10,Item11,Item12,Precio8,Precio9,Precio10,Precio11,Precio12
*/

async function fetchPdfAssetFromModule(module: any) {
  let bytes
  if (Platform.OS === 'web') {
    bytes = await fetch(module).then(res => res.arrayBuffer())
  } else {
    const pdfAsset = Asset.fromModule(module)
    await pdfAsset.downloadAsync()
    const pdfUri = pdfAsset.localUri || pdfAsset.uri
    const base64String = await FileSystem.readAsStringAsync(pdfUri, { encoding: FileSystem.EncodingType.Base64 })
    bytes = Uint8Array.from(atob(base64String), c => c.charCodeAt(0))
  }
  if (!bytes) {
    alert('Error loading PDF template')
    throw new Error('Error loading PDF template')
  }
  return bytes
}

export default async function createBudgetDocument(formData: any) {
  // Load Form
  const bytes = await fetchPdfAssetFromModule(budget_template)
  const pdf = await PDFDocument.load(bytes)
  const form = pdf.getForm()
  
  // Fill Form
  fillFormWithFormData(formData, form)

  // Save PDF to byte array
  const resultBytes = await pdf.save()

  downloadPDFFileFromBytes(resultBytes, 'presupuesto.pdf')
}

function fillFormWithFormData(formData: any, form:any){
  const date = formData.date.toLocaleDateString().split('/')
  form.getTextField('Día').setText(date[0])
  form.getTextField('Mes').setText(date[1])
  form.getTextField('Año').setText(date[2])
  form.getTextField('Nombre y Apellido').setText(formData.name)
  form.getTextField('Dirección').setText(formData.address)
  form.getTextField('Telefono').setText(parsePhoneNumber(formData.number))
  form.getTextField('Marca').setText(formData.brand)
  form.getTextField('Modelo').setText(formData.model)
  form.getTextField('Patente').setText(parseLicensePlate(formData.id))
  form.getTextField('Observaciones').setText(formData.extra)
  form.getTextField('Detalle').setText(formData.locations)
  form.getTextField('Nro. Hoja').setText(`${formData.page}/${formData.total_pages}`)

  let total = 0
  let i = 0
  if (formData.items.length != 0) {
    form.getTextField(`Item0`).setText('Cambio:')
    i++
    formData.items.forEach((item: any) => {
      if (i > 9) return
      form.getTextField(`Item${i}`).setText('    • ' + item.name)
      form.getTextField(`Precio${i}`).setText(item.value)
      i++
    })
  } else {
    form.getTextField(`Item0`).setText('No se realizarán cambios de respuestos:')
  }

  form.getTextField((i == 0 ? `Item2` : `Item10`)).setText('Mano de Obra (Chapa)')
  form.getTextField((i == 0 ? `Precio2` : `Precio10`)).setText(formData.workCost)
  form.getTextField((i == 0 ? `Item3` : `Item11`)).setText('Mano de Obra (Pintura)')
  form.getTextField((i == 0 ? `Precio3` : `Precio11`)).setText(formData.paintCost)
  form.getTextField((i == 0 ? `Item4` : `Item12`)).setText('Mecánica')
  form.getTextField((i == 0 ? `Precio4` : `Precio12`)).setText(formData.mechanicCost)

  form.getTextField('Total').setText(formData.total)

  form.flatten()
}

async function downloadPDFFileFromBytes(bytes: Uint8Array, filename: string) {
  if (Platform.OS === 'web') {
    // On web you can dowload as per usual
    const blob = new Blob([bytes], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename

    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
  } else {
    // On mobile you can save to file system

    // Convert bytes to base64 string
    let binaryString = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binaryString += String.fromCharCode(bytes[i]);
    }
    const base64String = btoa(binaryString);

    // Save the file
    const filePath = `${FileSystem.cacheDirectory}` + filename
    await FileSystem.writeAsStringAsync(filePath, base64String, { encoding: FileSystem.EncodingType.Base64 })
    
    //const fileInfo = await FileSystem.getInfoAsync(filePath);
    //alert(`File info: ${JSON.stringify(fileInfo)}`)

    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath);
    } else {
      alert(`Sharing is not available on this device`);
    }

    // Delete the file
    FileSystem.deleteAsync(filePath, { idempotent: true })
  }
}