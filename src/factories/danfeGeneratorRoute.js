//@ts-check

import { returnDirName } from "../media/returnDirName.js";
import { getPDFFile } from "../services/getPDFFile.js";
import { processarArquivo } from "../services/processFile.js";
import { saveXMLToFile } from "../services/saveXmlFile.js"
import path from 'path'

export const danfeGeneratorRoute = async (request, response) => {
    try {
        const { xml, NFe, profile, model } = request.body
        if (!xml) throw new Error('Informe o XML')
        if (!NFe) throw new Error('Informe a chave da NFe')
        if (!profile) throw new Error('Informe o profile')
        const pathWaiting = path.join(returnDirName(), 'waiting_conversion', profile)
        await saveXMLToFile(xml, pathWaiting, NFe)
        const pathSuccess = await processarArquivo(pathWaiting, NFe, profile, model)
        if (!pathSuccess) throw new Error('Ocorreu uma falha ao processar o arquivo')
        getPDFFile(pathSuccess, response)
    } catch (error) {
        return response.status(500).json({ success: false, error: error.message })
    }

}