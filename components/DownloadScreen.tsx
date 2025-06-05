import { TouchableOpacity, useColorScheme, View, Text } from "react-native";
import getGlobalStyles, { getColors } from "../styles/global_styles";
import { createBudgetDocument, createPagedBudgetDocument } from "../utils/pdfHandler";
import { useEffect, useState } from "react";
import { PDFBudgetData } from "./Form";
import { numberToFormat } from "../utils/parsers";

export type PagedPDFBudgetData = (PDFBudgetData & {page:number, totalPages:number})
type stateSetter<Type> = React.Dispatch<React.SetStateAction<Type>>
type setState<Type> =  [Type, stateSetter<Type>]

export default function DownloadScreen({ route }) {
  const [files, setFiles]: setState<PagedPDFBudgetData[]> = useState([])

  const { budgetData } = route?.params ?? {}
  const global_styles = getGlobalStyles(useColorScheme())
  const colors = getColors(useColorScheme())

  useEffect(() => {
    const bigChunkSize = 11
    const smallChunkSize = 9
    const items: object[] = budgetData.items

    const chunks = []
    while(items.length != 0) {
      const chunkSize = (items.length <= 2 * smallChunkSize) ? smallChunkSize : bigChunkSize

      if (chunkSize == smallChunkSize && items.length > chunkSize) {
        chunks.push(items.splice(0, chunkSize))
      }
      chunks.push(items.splice(0, chunkSize))
    }
    
    const totalPages = chunks.length
    
    let result: PagedPDFBudgetData[] = []

    chunks.map((itemList, index) => {
      result.push({...budgetData, items:itemList, page:index+1, totalPages:totalPages})
    })
    
    setFiles(result)
  }, [])

  return (
    <View style={[global_styles.page, {height: '100%',paddingVertical:10,paddingHorizontal:25,backgroundColor:colors.magenta.primary}]}>
      <TouchableOpacity style={[global_styles.input_box, {height:'auto', 
        backgroundColor:colors.magenta.accent, marginVertical:20, paddingVertical:20}]} onPress={() => {createPagedBudgetDocument(files)}}>
        <Text style={[global_styles.title, {fontSize:25, textAlign:'center', fontWeight:'bold'}]}>DESCARGAR DOCUMENTO COMPLETO</Text>
      </TouchableOpacity>
      { 
        files.map(file =>
          <TouchableOpacity key={'elem' + file.page.toString()} style={[global_styles.input_box, {height:'auto', 
          backgroundColor:colors.magenta.secondary, marginVertical:10}]} onPress={() => {createBudgetDocument(file)}}>
            <Text style={[global_styles.title, {fontSize:25, textAlign:'center'}]}>DESCARGAR PÁGINA {`(${numberToFormat(file.page)}/${numberToFormat(file.totalPages)})`}</Text>
          </TouchableOpacity>
        )
      }
    </View>
  )
}