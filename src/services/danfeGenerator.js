//@ts-check

import fs from 'fs'
import danfe from 'danfe-woj'
import path from 'path'
import { ConvertXmlToJson } from './convertXmlToJson.js';
import { setEmitente } from '../factories/setEmitente.js';
import { returnDirName } from '../media/returnDirName.js';
import { setDestinatario } from '../factories/setDestinatario.js';
import { setTransportador } from '../factories/setTransportador.js';
import { setProtocolo } from '../factories/setProtocolo.js';
import { setImpostos } from '../factories/setImpostos.js';
import { setVolumes } from '../factories/setVolumes.js';
import { setProduct } from '../factories/setProduct.js';
import { setDanfeInput } from '../factories/setDanfeInput.js';
import fsPromises from 'fs/promises';
process.env.TZ = 'America/Sao_Paulo';

export async function generateDanfe(pathDoArquivoXml, filename, profile) {
    const dirArquivoPdf = path.join(returnDirName(), 'success_conversion', profile);
    if (!fs.existsSync(dirArquivoPdf)) {
        fs.mkdirSync(dirArquivoPdf, { recursive: true });
    }

    const pathDoArquivoPdf = path.join(dirArquivoPdf, `${path.parse(filename).name}.pdf`);

    const dataNf = await ConvertXmlToJson(pathDoArquivoXml)
    const emitenteNF = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe).infNFe[0].emit[0]
    var emitente = setEmitente(emitenteNF)

    const destinatarioNF = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe).infNFe[0].dest[0]
    var destinatario = setDestinatario(destinatarioNF)

    const transportadorNF = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe).infNFe[0].transp?.[0]
    var transportador = setTransportador(transportadorNF)

    var protocolo = setProtocolo(dataNf)

    const impostoNF = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe).infNFe[0].total[0].ICMSTot[0]
    var impostos = setImpostos(impostoNF)

    const volumesNF = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe).infNFe[0].transp?.[0].vol?.[0]
    var volumes = setVolumes(volumesNF)

    var danfeInput = setDanfeInput(dataNf, emitente, destinatario, transportador, protocolo, impostos, volumes)

    const produtos = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe).infNFe[0].det
    setProduct(produtos, danfeInput)


    await new Promise((resolve, reject) => {
        new danfe.Gerador(danfeInput).gerarPDF({
            ambiente: 'homologacao',
            ajusteYDoLogotipo: -4,
            ajusteYDaIdentificacaoDoEmitente: 4,
            creditos: 'Safyra.com.br - Gestão do seu negócio!'
        }, function (err, pdf) {
            if (err) {
                reject(err);
            } else {
                pdf.pipe(fs.createWriteStream(pathDoArquivoPdf))
                    .on('finish', resolve)
                    .on('error', reject);
            }
        });
    });

    console.log("Emitido com sucesso! Disponível em: " + pathDoArquivoPdf);
    return pathDoArquivoPdf;
}
