import { PDFDocument, PDFForm } from "pdf-lib/cjs"
import { File, Paths } from 'expo-file-system'
import { parsePhoneNumber, parseLicensePlate, dateToFormat, numberToFormat, numberToPrice} from "./parsers"
import { Platform } from "react-native"
import { Asset } from "expo-asset"
import * as Sharing from 'expo-sharing'
import { PDFBudgetData } from "../components/Form"

const budget_template = require('../assets/budget_template.pdf')
const ITEMS_PER_TEMPLATE = 12;

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
    bytes = await new File(pdfUri).bytes();
  }
  if (!bytes) {
    alert('Error loading PDF template')
    throw new Error('Error loading PDF template')
  }
  return bytes
}

export async function createBudgetDocument(formData: PDFBudgetData) {
  // Load Form
  const result = await PDFDocument.create()
  const bytes = await fetchPdfAssetFromModule(budget_template)
  
  let count = formData.items.length
  let total_pages = 1
  while (count > 0) {
    if (count > ITEMS_PER_TEMPLATE - 3) {
      break
    }
    count -= ITEMS_PER_TEMPLATE - 1;
    total_pages += 1
  }

  for (let i = 0; i < total_pages; i++) {
    let pageData = formData;
    const start_index = (ITEMS_PER_TEMPLATE-1)*i;
    const end_index = start_index + (ITEMS_PER_TEMPLATE-1)
    pageData.items = pageData.items.slice(start_index,end_index)
    
    const doc = await PDFDocument.load(bytes)
    const form = doc.getForm()
    
    fillFormWithFormData(pageData, i, total_pages, form)
    
    const page = await result.copyPages(doc, [0])
    result.insertPage(i, page[0])
  }

  // Save PDF to byte array
  const resultBytes = await result.save()

  downloadPDFFileFromBytes(resultBytes, 
    `${formData.id != '' ? `[${parseLicensePlate(formData.id)}]` : 'presupuesto'}_`+
    `${dateToFormat(formData.date)}.pdf`
  )
}

function fillFormWithFormData(formData: PDFBudgetData, page_number:number, total_pages:number, form:PDFForm){
  form.getTextField('Día').setText(formData.date.getDate().toString())
  form.getTextField('Mes').setText((formData.date.getMonth() + 1).toString())
  form.getTextField('Año').setText(formData.date.getFullYear().toString())
  form.getTextField('Nombre y Apellido').setText(formData.name)
  form.getTextField('Dirección').setText(formData.address)
  form.getTextField('Telefono').setText(parsePhoneNumber(formData.number))
  form.getTextField('Marca').setText(formData.brand)
  form.getTextField('Modelo').setText(formData.model)
  form.getTextField('Patente').setText(parseLicensePlate(formData.id))
  form.getTextField('Observaciones').setText(formData.extra)
  form.getTextField('Detalle').setText(formData.locations)
  form.getTextField('Nro. Hoja').setText(`${page_number}/${total_pages}`)

  let i = 0
  if (formData.items.length != 0) {
    form.getTextField(`Item0`).setText('Cambio:')
    i++
    formData.items.forEach((item: any) => {
      form.getTextField(`Item${i}`).setText('    • ' + item.name)
      form.getTextField(`Precio${i}`).setText(numberToPrice(item.value))
      i++
    })
  } else {
    form.getTextField(`Item0`).setText('No se realizarán cambios de respuestos:')
  }

  if (page_number == total_pages) {
    form.getTextField((i == 0 ? `Item2` : `Item10`)).setText('Mano de Obra (Chapa) [' + numberToFormat(formData.days) + ' días]')
    form.getTextField((i == 0 ? `Precio2` : `Precio10`)).setText(numberToPrice(formData.workCost))
    form.getTextField((i == 0 ? `Item3` : `Item11`)).setText('Mano de Obra (Pintura) [' + numberToFormat(formData.sheets) + ' paños]')
    form.getTextField((i == 0 ? `Precio3` : `Precio11`)).setText(numberToPrice(formData.paintCost))
    form.getTextField((i == 0 ? `Item4` : `Item12`)).setText('Mecánica')
    form.getTextField((i == 0 ? `Precio4` : `Precio12`)).setText(numberToPrice(formData.mechanicCost))
  } else {
    form.getTextField((i == 0 ? `Item4` : `Item12`)).setText('Continúa en la siguiente página...')
  }

  form.getTextField('Total').setText(numberToPrice(formData.total))

  form.flatten()
}

async function downloadPDFFileFromBytes(bytes: Uint8Array, filename: string) {
  if (!filename.endsWith(".pdf")) {
    console.error('filename doesn\'t end with .pdf, correcting')
    filename = filename + ".pdf"
  }
  if (Platform.OS === 'web') {
    // On web you can dowload as per usual
    alert('web download does not work on 2.0')
  } else {
    // On mobile you can save to file system

    // Save the file
    const file = new File(Paths.cache, filename)
    await file.write(bytes)
    
    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri);
    } else {
      alert(`Sharing is not available on this device`);
    }

    // Delete the file
    await file.delete()
  }
}