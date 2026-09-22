//@ts-check

import danfe from 'danfe-woj'
import path from 'path'
import { PassThrough } from 'stream'
import { ConvertXmlToJson } from './convertXmlToJson.js'
import { setEmitente } from '../factories/setEmitente.js'
import { returnDirName } from '../media/returnDirName.js'
import { setDestinatario } from '../factories/setDestinatario.js'
import { setTransportador } from '../factories/setTransportador.js'
import { setProtocolo } from '../factories/setProtocolo.js'
import { setImpostos } from '../factories/setImpostos.js'
import { setVolumes } from '../factories/setVolumes.js'
import { setProduct } from '../factories/setProduct.js'
import { setDanfeInput } from '../factories/setDanfeInput.js'

process.env.TZ = 'America/Sao_Paulo'

/**
 * @param {string} xml
 * @param {string} [logoBase64]
 * @param {number} [positionYEmitDataNFe]
 * @param {number} [positionYLogoNFe]
 * @returns {Promise<Buffer>}
 */
export async function generateDanfe(xml, logoBase64, positionYEmitDataNFe, positionYLogoNFe) {
    const dataNf = await ConvertXmlToJson(xml)
    const emitenteNF = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe).infNFe[0].emit[0]
    const emitente = setEmitente(emitenteNF, logoBase64)

    const destinatarioNF = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe).infNFe[0].dest[0]
    const destinatario = setDestinatario(destinatarioNF)

    const transportadorNF = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe).infNFe[0].transp?.[0]
    const transportador = setTransportador(transportadorNF)

    const protocolo = setProtocolo(dataNf)

    const impostoNF = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe).infNFe[0].total[0].ICMSTot[0]
    const impostos = setImpostos(impostoNF)

    const volumesNF = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe).infNFe[0].transp?.[0].vol?.[0]
    const volumes = setVolumes(volumesNF)

    const danfeInput = setDanfeInput(dataNf, emitente, destinatario, transportador, protocolo, impostos, volumes)

    const produtos = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe).infNFe[0].det
    setProduct(produtos, danfeInput)

    return new Promise((resolve, reject) => {
        new danfe.Gerador(danfeInput).gerarPDF({
            ambiente: (String((dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe).infNFe?.[0].ide?.[0].tpAmb[0] ?? '')) === '1' ? 'producao' : 'homologacao',
            ajusteYDoLogotipo: positionYLogoNFe ?? 0,
            ajusteYDaIdentificacaoDoEmitente: positionYEmitDataNFe ?? 0,
            creditos: 'Safyra.com.br - Gestão do seu negócio!',
            pathCredits: path.join(returnDirName(), 'creditLogo.png')
        }, function (err, pdf) {
            if (err) {
                reject(err)
                return
            }
            /** @type {Buffer[]} */
            const chunks = []
            const sink = new PassThrough()
            sink.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
            sink.on('end', () => resolve(Buffer.concat(chunks)))
            sink.on('error', reject)
            pdf.pipe(sink)
        })
    })
}
