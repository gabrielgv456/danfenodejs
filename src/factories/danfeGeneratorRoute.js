//@ts-check

import { processarArquivo } from "../services/processFile.js";

/**
 * @param {{ body: {
 *   xml?: string,
 *   NFe?: string,
 *   profile?: string,
 *   model?: string,
 *   logoBase64?: string,
 *   positionYEmitDataNFe?: number,
 *   positionYLogoNFe?: number
 * } }} request
 * @param {{ status: (code: number) => { json: (body: unknown) => unknown } }} response
 */
export const danfeGeneratorRoute = async (request, response) => {
    try {
        const { xml, NFe, profile, model, logoBase64, positionYEmitDataNFe, positionYLogoNFe } = request.body
        if (!xml) throw new Error('Informe o XML')
        if (!NFe) throw new Error('Informe a chave da NFe')
        if (!profile) throw new Error('Informe o profile')
        if (!model) throw new Error('Informe o modelo')

        const pdfBuffer = await processarArquivo(xml, model, logoBase64, positionYEmitDataNFe, positionYLogoNFe)
        return response.status(200).json({
            success: true,
            danfe: pdfBuffer.toString('base64'),
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        console.log('Ocorreu um erro: ' + message)
        return response.status(500).json({ success: false, error: message })
    }
}
