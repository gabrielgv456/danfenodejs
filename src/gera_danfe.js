import fs from 'fs'
import danfe from 'danfe-woj'
import path from 'path'
import { ConvertXmlToJson } from './services/convertXmlToJson.js';
import { setEmitente } from './factories/setEmitente.js';
import { returnDirName } from './media/returnDirName.js';
import { setDestinatario } from './factories/setDestinatario.js';
import { setTransportador } from './factories/setTransportador.js';
import { setProtocolo } from './factories/setProtocolo.js';
import { setImpostos } from './factories/setImpostos.js';
import { setVolumes } from './factories/setVolumes.js';
import { setProduct } from './factories/setProduct.js';
import { setDanfeInput } from './factories/setDanfeInput.js';
process.env.TZ = 'America/Sao_Paulo';

for (let i=1; i<=100; i++)  {

const pathDoArquivoPdf = path.join(returnDirName(), `danfe${i}.pdf`);
const pathDoArquivoXml = path.join(returnDirName(), `arquivo (${i}).xml`);


try {
    
    const dataNf = await ConvertXmlToJson(pathDoArquivoXml)
    const emitenteNF = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe ).infNFe[0].emit[0]
    var emitente = setEmitente(emitenteNF)

    const destinatarioNF = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe ).infNFe[0].dest[0]
    var destinatario = setDestinatario(destinatarioNF)

    const transportadorNF = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe ).infNFe[0].transp?.[0]
    var transportador = setTransportador(transportadorNF)

    var protocolo = setProtocolo(dataNf)

    const impostoNF = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe ).infNFe[0].total[0].ICMSTot[0]
    var impostos = setImpostos(impostoNF)

    const volumesNF = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe ).infNFe[0].transp?.[0].vol?.[0]
    var volumes = setVolumes(volumesNF)

    var danfeInput = setDanfeInput(dataNf, emitente, destinatario, transportador, protocolo, impostos, volumes)

    const produtos = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe ).infNFe[0].det
    setProduct(produtos, danfeInput)

    new danfe.Gerador(danfeInput).gerarPDF({
        ambiente: 'homologacao',
        ajusteYDoLogotipo: -4,
        ajusteYDaIdentificacaoDoEmitente: 4,
        creditos: 'Safyra.com.br - Gestão do seu negócio!'
    }, function (err, pdf) {
        if (err) {
            throw err;
        }

        pdf.pipe(fs.createWriteStream(pathDoArquivoPdf));
        console.log("emitido com sucesso! Disponivel em: " + pathDoArquivoPdf)
    });

} catch (error) {
    console.log(error.message)
}
}