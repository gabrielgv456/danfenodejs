//@ts-check

import pdfMake from 'pdfmake'
import { ConvertXmlToJson } from "../services/convertXmlToJson.js";
import path from 'path'
import fs from 'fs'
import { returnDirName } from "../media/returnDirName.js";
import { currencyFormat, strCut } from '../utils/utils.js';
import QRCode from 'qrcode'

export const generateDanfeNFC = async (pathDoArquivoXml, filename, profile) => {

    const fonts = {
        Roboto: {
            normal: 'src/media/fonts/Roboto-Regular.ttf',
            bold: 'src/media/fonts/Roboto-Bold.ttf'
        }
    };

    const printer = new pdfMake(fonts)
    const dataNf = await ConvertXmlToJson(pathDoArquivoXml)
    const infNF = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe).infNFe[0].ide[0]
    if (Number(infNF.mod) !== 65) throw new Error('Somente é possivel emitir cupom de notas do modelo 65! Modelo informado: ' + infNF.mod)
    
    const emitenteNF = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe).infNFe[0].emit[0]
    const destinatarioNF = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe).infNFe[0].dest[0]
    const totalNF = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe).infNFe[0].total[0].ICMSTot[0]
    const products = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe).infNFe[0].det
    const payments = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe).infNFe[0].pag
    const protocoloNF = dataNf.nfeProc?.protNFe?.[0].infProt?.[0]
    const dataProtocolo = protocoloNF?.dhRecbto?.[0] ? new Date(protocoloNF?.dhRecbto?.[0]).toLocaleDateString() + ' ' + new Date(protocoloNF?.dhRecbto?.[0]).toLocaleTimeString() : ''
    const chaveNf = dataNf.nfeProc?.protNFe?.[0].infProt?.[0].chNFe?.[0] ?? ''
    const emissao = infNF?.dhEmi?.[0] ? new Date(infNF?.dhEmi?.[0]).toLocaleDateString() + ' ' + new Date(infNF?.dhEmi?.[0]).toLocaleTimeString() : ''
    const urlChave = 'https://portalsped.fazenda.mg.gov.br/portalnfce/' + chaveNf

    const ProductData = products.map((product, index) => {
        return [
            { text: String(index + 1).padStart(3, index) }, { text: product.prod?.[0].cProd?.[0] ?? '' }, { text: strCut(product.prod?.[0].xProd?.[0], 25) ?? '' }, { text: Number(product.prod?.[0].qCom?.[0]).toFixed(2) ?? '' }, { text: product.prod?.[0].uCom?.[0] ?? '' }, { text: currencyFormat(product.prod?.[0].vUnCom?.[0]) ?? '' }, { text: currencyFormat(product.prod?.[0].vProd?.[0]) ?? '' }
        ]
    })

    const PaymentData = payments.map((pay) => {
        return [
            { text: 'CARTAO' }, { text: currencyFormat(pay.detPag[0]?.vPag) ?? '', alignment: 'right' }
        ]
    })
    const QrCodeChave = await new Promise((resolve, reject) => {
        QRCode.toDataURL(urlChave, function (err, QrCodeChave) {
            if (err) {
                reject(err);
            } else {
                resolve(QrCodeChave)
            }
        });
    })

    const docParams = {
        pageSize: {
            width: 250,
            height: 'auto'
        },
        pageMargins: 15,
        PageOrientation: 'portrait',
        //pageMargins: [15,50,15,40],

        //header:[],
        //content:[{
        //   text:"teste",
        //   fontSize:15,
        // }],
        //footer:[]
        content: [
            {
                style: 'title',
                alignment: 'center',
                text: [emitenteNF?.xNome?.[0] ?? '']
            },
            {
                style: 'default',
                alignment: 'center',
                text: [
                    `CNPJ: ${emitenteNF?.CNPJ?.[0] ?? ''} ${' '} ${emitenteNF?.xNome?.[0] ?? ''}`,
                    ` ${emitenteNF?.enderEmit?.[0]?.xLgr?.[0] ?? ''}, ${emitenteNF?.enderEmit?.[0]?.nro?.[0] ?? ''}`,
                    ` ${emitenteNF?.enderEmit?.[0]?.xBairro?.[0] ?? ''}`,
                    ` ${emitenteNF?.enderEmit?.[0]?.xMun?.[0] ?? ''} - ${emitenteNF?.enderEmit[0]?.UF?.[0] ?? ''}`,
                    ` ${emitenteNF?.enderEmit?.[0]?.CEP?.[0] ?? ''} \n`,
                    ` Fone:${emitenteNF?.enderEmit[0]?.fone?.[0] ?? ''} I.E.: ${emitenteNF?.IE?.[0] ?? ''}`,
                ]
            },
            {
                style: 'bold',
                margin: [0, 1],
                alignment: 'center',
                text: ['Documento Auxiliar da Nota Fiscal de Consumidor Eletrônica']
            },
            {
                style: 'default',
                layout: 'noBorders',
                table: {
                    widths: ['auto', 'auto', 45, 'auto', 'auto', 'auto', 'auto'],

                    body: [
                        [{ text: '#' }, { text: 'Cód.' }, { text: 'Descrição' }, { text: 'Qtde' }, { text: 'Un' }, { text: 'Valor Unit.' }, { text: 'Valor total' }],
                        ...ProductData
                    ]
                }
            },
            {
                style: 'default',
                alignment: 'left',
                margin: [0, 1],
                columns: [
                    {
                        text: 'Qtde. total de itens',
                        alignment: 'left'
                    },
                    {
                        text: String(products.length).padStart(3, '0'),
                        alignment: 'right'
                    }
                ]
            },
            {
                style: 'highlight',
                alignment: 'left',
                margin: [0, 1],
                columns: [
                    {
                        text: 'Valor total',
                        alignment: 'left'
                    },
                    {
                        text: currencyFormat(totalNF?.vNF?.[0] ?? ''),
                        alignment: 'right'
                    }
                ]
            },

            {
                style: 'default',
                layout: 'noBorders',
                table: {
                    widths: ['*', '*'],
                    body: [
                        [{ text: 'FORMA DE PAGAMENTO' }, { text: 'VALOR PAGO', alignment: 'right' }],
                        ...PaymentData
                    ]
                }
            },
            {
                style: 'bold',
                margin: [0, 1],
                alignment: 'center',
                text: ['Consulte pela Chave de Acesso em']
            },
            {
                style: 'default',
                alignment: 'center',
                margin: [0, 1],
                text: [urlChave]
            },
            {
                style: 'default',
                alignment: 'center',
                margin: [0, 1],
                text: [destinatarioNF?.xNome?.[0].toUpperCase() ?? '']
            },
            {
                style: 'bold',
                alignment: 'center',
                margin: [0, 1],
                text: [`NFC-e nº ${String(infNF?.nNF?.[0] ?? '').padStart(9, '0')} Série ${String(infNF?.serie?.[0] ?? '').padStart(3, '0')} ${emissao}`]
            },
            {
                alignment: 'left',
                margin: [0, 1],
                widths: [10, 10],
                columns: [
                    {
                        text: 'Protocolo de Autorização:',
                        alignment: 'left',
                        style: 'bold'
                    },
                    {
                        text: protocoloNF.nProt?.[0] ?? '',
                        alignment: 'right',
                        style: 'default'
                    }
                ]
            },
            {
                alignment: 'left',
                margin: [0, 1],
                widths: [10, 10],
                columns: [
                    {
                        text: 'Data de Autorização:',
                        alignment: 'left',
                        style: 'bold'
                    },
                    {
                        text: dataProtocolo,
                        alignment: 'right',
                        style: 'default'
                    }
                ]
            },
            {
                image: 'qrCode',
                width: 150,
                alignment: 'center'
            },
            {
                style: 'default',
                margin: [0, 1],
                alignment: 'center',
                text: [`Tributos Totais Incidentes(Lei Federal 12.741/12): ${currencyFormat(totalNF?.vTotTrib ?? '')}`]
            },
            {
                style: 'footer',
                text: ['Emitido com Safyra® - Gestão do seu negócio (safyra.com.br)'],

            }
        ],

        styles: {
            title: {
                fontSize: 11, bold: true, margin: [0, 6]
            },
            bold: {
                bold: true, fontSize: 7
            },
            highlight: {
                bold: true, fontSize: 9
            },
            default: {
                fontSize: 7
            },
            footer: {
                fontSize: 5, margin: [0, 8], alignment: 'center'
            }
        },
        images: {
            qrCode: QrCodeChave
        }

    }

    const dirArquivoPdf = path.join(returnDirName(), 'success_conversion', profile);
    if (!fs.existsSync(dirArquivoPdf)) {
        fs.mkdirSync(dirArquivoPdf, { recursive: true });
    }

    const pathDoArquivoPdf = path.join(dirArquivoPdf, `${path.parse(filename).name}.pdf`);

    //@ts-ignore
    const pdfDoc = printer.createPdfKitDocument(docParams);

    const writeStream = fs.createWriteStream(pathDoArquivoPdf);

    pdfDoc.pipe(writeStream);
    pdfDoc.end();

    writeStream.on('finish', () => {
        console.log('PDF gerado e salvo com sucesso em: ', pathDoArquivoPdf);
    });

    writeStream.on('error', (err) => {
        throw new Error('Erro ao salvar o PDF:' + err);
    });

    return pathDoArquivoPdf
} 