//@ts-check

import pdfMake from 'pdfmake'
import { ConvertXmlToJson } from "../services/convertXmlToJson.js";
import path from 'path'
import fs from 'fs'
import { returnDirName } from "../media/returnDirName.js";
import { addSpaces, cpfCnpjFormat, currencyFormat, strCut } from '../utils/utils.js';
import QRCode from 'qrcode'
import { PaymentType } from '../utils/enums.js';

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
    const destinatarioNF = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe).infNFe[0].dest?.[0]
    const totalNF = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe).infNFe[0].total[0].ICMSTot[0]
    const products = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe).infNFe[0].det
    const payments = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe).infNFe[0].pag?.[0].detPag
    const protocoloNF = dataNf.nfeProc?.protNFe?.[0].infProt?.[0]
    const dataProtocolo = protocoloNF?.dhRecbto?.[0] ? new Date(protocoloNF?.dhRecbto?.[0]).toLocaleDateString() + ' ' + new Date(protocoloNF?.dhRecbto?.[0]).toLocaleTimeString() : ''
    const chaveNf = dataNf.nfeProc?.protNFe?.[0].infProt?.[0].chNFe?.[0] ?? ''
    const emissao = infNF?.dhEmi?.[0] ? new Date(infNF?.dhEmi?.[0]).toLocaleDateString() + ' ' + new Date(infNF?.dhEmi?.[0]).toLocaleTimeString() : ''
    const urlChave = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe).infNFeSupl?.[0].qrCode?.[0]


    const ProductData = products.map((product, index) => {
        return [
            { text: String(index + 1) }, { text: product.prod?.[0].cProd?.[0] ?? '' }, { text: strCut(product.prod?.[0].xProd?.[0], 25) ?? '' }, { text: Number(product.prod?.[0].qCom?.[0]).toFixed(2) ?? '' }, { text: product.prod?.[0].uCom?.[0] ?? '' }, { text: currencyFormat(product.prod?.[0].vUnCom?.[0], true) ?? '' }, { text: currencyFormat(product.prod?.[0].vProd?.[0], true) ?? '' }
        ]
    })

    const PaymentData = payments ? (payments.map((pay) => {
        return [
            { text: PaymentType[pay?.tPag] ?? '' }, { text: currencyFormat(pay?.vPag) ?? '', alignment: 'right' }
        ]
    })) : ([[{ text: '' }, { text: ''}]])
    
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
            width: 210, // valor em polegadas * 72
            height: 'auto'
        },
        pageMargins: 5,
        PageOrientation: 'portrait',
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
                    `CNPJ: ${cpfCnpjFormat(emitenteNF?.CNPJ?.[0] ?? '')} ${' '} ${emitenteNF?.xNome?.[0] ?? ''}`,
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
                    widths: ['auto', 'auto', 37, 'auto', 'auto', 'auto', 'auto'],

                    body: [
                        [{ text: '#' }, { text: 'Cód.' }, { text: 'Descrição' }, { text: 'Qtd' }, { text: 'Un' }, { text: 'Valor Unit(R$)' }, { text: 'Valor total(R$)' }],
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
                text: ['https://portalsped.fazenda.mg.gov.br/portalnfce \n' + addSpaces(chaveNf)]
            },
            {
                style: 'default',
                alignment: 'center',
                margin: [0, 1],
                text: [destinatarioNF?.xNome?.[0].toUpperCase() ?? 'CONSUMIDOR NÃO IDENTIFICADO']
            },
            {
                style: 'bold',
                alignment: 'center',
                margin: [0, 1],
                text: [`NFC-e nº ${String(infNF?.nNF?.[0] ?? '').padStart(9, '0')} Série ${String(infNF?.serie?.[0] ?? '').padStart(3, '0')} ${emissao}`]
            },
            {
                margin: [0, 1],
                alignment: 'center',
                text: [
                    {
                        text: 'Protocolo de Autorização: ',
                        style: 'bold'
                    },
                    {
                        text: protocoloNF.nProt?.[0] ?? '',
                        style: 'default'
                    }
                ]
            },
            {
                margin: [0, 1],
                alignment: 'center',
                text: [
                    {
                        text: 'Data de Autorização: ',
                        style: 'bold'
                    },
                    {
                        text: dataProtocolo,
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
                text: [`Tributos Totais Incidentes(Lei Federal 12.741/12): ${currencyFormat(totalNF?.vTotTrib ?? '0')}`]
            },
            {
                style: 'footer',
                text: ['Emitido com Safyra® - Gestão do seu negócio (safyra.com.br)'],

            }
        ],

        styles: {
            title: {
                fontSize: 12, bold: true, margin: [0, 6]
            },
            bold: {
                bold: true, fontSize: 8
            },
            highlight: {
                bold: true, fontSize: 10
            },
            default: {
                fontSize: 8
            },
            footer: {
                fontSize: 6, margin: [0, 8], alignment: 'center'
            }
        },
        images: {
            qrCode: QrCodeChave
        }

    }

    return new Promise((resolve, reject) => {
        try {
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
                resolve(pathDoArquivoPdf);
            });

            writeStream.on('error', (err) => {
                reject(new Error('Erro ao salvar o PDF: ' + err));
            });
        } catch (err) {
            reject(err);
        }
    })
} 