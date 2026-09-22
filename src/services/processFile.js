//@ts-check
import { generateDanfe } from './danfeGenerator.js'
import { generateDanfeNFC } from '../factories/danfeNFCeGenerator.js'

/**
 * @param {string} xml
 * @param {string} model
 * @param {string} [logoBase64]
 * @param {number} [positionYEmitDataNFe]
 * @param {number} [positionYLogoNFe]
 * @returns {Promise<Buffer>}
 */
export async function processarArquivo(xml, model, logoBase64, positionYEmitDataNFe, positionYLogoNFe) {
    if (model === 'NFE') {
        return generateDanfe(xml, logoBase64, positionYEmitDataNFe, positionYLogoNFe)
    }
    if (model === 'NFCE') {
        return generateDanfeNFC(xml)
    }
    throw new Error('Informe o modelo correto!')
}
