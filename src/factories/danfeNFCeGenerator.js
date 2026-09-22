//@ts-check

import pdfMake from 'pdfmake'
import { ConvertXmlToJson } from "../services/convertXmlToJson.js";
import path from 'path'
import { returnDirName } from "../media/returnDirName.js";
import { addSpaces, cpfCnpjFormat, currencyFormat, strCut } from '../utils/utils.js';
import QRCode from 'qrcode'
import { PaymentType } from '../utils/enums.js';

/** @type {Record<string, string>} */
const NFCE_CONSULTA_URL_BY_UF = {
    AC: 'https://www.sefaznet.ac.gov.br/nfce/consulta',
    AL: 'https://nfce.sefaz.al.gov.br/consultaNFCe.htm',
    AM: 'https://sistemas.sefaz.am.gov.br/nfceweb/formConsulta.do',
    AP: 'https://www.sefaz.ap.gov.br/sate/seg/SEGf_AcessarFuncao.jsp?cdFuncao=FIS_1261',
    BA: 'https://nfe.sefaz.ba.gov.br/servicos/nfce/default.aspx',
    CE: 'https://nfce.sefaz.ce.gov.br/pages/ShowNFCe.html',
    DF: 'https://www.fazenda.df.gov.br/nfce/consulta',
    ES: 'https://app.sefaz.es.gov.br/ConsultaNFCe',
    GO: 'https://nfeweb.sefaz.go.gov.br/nfeweb/sites/nfce/danfeNFCe',
    MA: 'https://www.nfce.sefaz.ma.gov.br/portal/consultaNFe.do',
    MG: 'https://portalsped.fazenda.mg.gov.br/portalnfce',
    MS: 'https://www.dfe.ms.gov.br/nfce/consulta',
    MT: 'https://www.sefaz.mt.gov.br/nfce/consultanfce',
    PA: 'https://appnfc.sefa.pa.gov.br/portal/view/consultas/nfce/consultanfce.seam',
    PB: 'https://www.sefaz.pb.gov.br/nfce',
    PE: 'https://nfce.sefaz.pe.gov.br/nfce/consulta',
    PI: 'https://www.sefaz.pi.gov.br/nfce/consulta',
    PR: 'https://www.fazenda.pr.gov.br/nfce/consulta',
    RJ: 'https://www.nfce.fazenda.rj.gov.br/consulta',
    RN: 'https://nfce.set.rn.gov.br/portalDFE/NFCe/ConsultaNFCe.aspx',
    RO: 'https://www.nfce.sefin.ro.gov.br',
    RR: 'https://www.sefaz.rr.gov.br/nfce/servlet/wp_consulta_nfce',
    RS: 'https://www.sefaz.rs.gov.br/NFCE/NFCE-COM.aspx',
    SC: 'https://sat.sef.sc.gov.br/tax.net/Sat.DFe.NFCe.Web/Consultas/ConsultaPublicaNFe.aspx',
    SE: 'https://www.nfce.se.gov.br/nfce/consulta',
    SP: 'https://www.nfce.fazenda.sp.gov.br/consulta',
    TO: 'https://www.sefaz.to.gov.br/nfce/consulta',
}

/**
 * @param {string | undefined} uf
 * @param {string | undefined} urlChaveConsulta
 */
function resolveConsultaUrl(uf, urlChaveConsulta) {
    if (urlChaveConsulta) return urlChaveConsulta
    const key = (uf ?? '').toUpperCase()
    return NFCE_CONSULTA_URL_BY_UF[key] ?? ''
}

export const generateDanfeNFC = async (xml) => {

    const fonts = {
        Roboto: {
            normal: path.join(returnDirName(), 'fonts', 'Roboto-Regular.ttf'),
            bold: path.join(returnDirName(), 'fonts', 'Roboto-Bold.ttf')
        }
    };

    const printer = new pdfMake(fonts)
    const dataNf = await ConvertXmlToJson(xml)
    const nfeRoot = dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe
    const infNF = nfeRoot.infNFe[0].ide[0]
    if (Number(infNF.mod) !== 65) throw new Error('Somente é possivel emitir cupom de notas do modelo 65! Modelo informado: ' + infNF.mod)

    const emitenteNF = nfeRoot.infNFe[0].emit[0]
    const destinatarioNF = nfeRoot.infNFe[0].dest?.[0]
    const totalNF = nfeRoot.infNFe[0].total[0].ICMSTot[0]
    const products = nfeRoot.infNFe[0].det
    const payments = nfeRoot.infNFe[0].pag?.[0].detPag
    const protocoloNF = dataNf.nfeProc?.protNFe?.[0].infProt?.[0]
    const dataProtocolo = protocoloNF?.dhRecbto?.[0] ? new Date(protocoloNF?.dhRecbto?.[0]).toLocaleDateString() + ' ' + new Date(protocoloNF?.dhRecbto?.[0]).toLocaleTimeString() : ''
    const chaveNf = dataNf.nfeProc?.protNFe?.[0].infProt?.[0].chNFe?.[0] ?? ''
    const emissao = infNF?.dhEmi?.[0] ? new Date(infNF?.dhEmi?.[0]).toLocaleDateString() + ' ' + new Date(infNF?.dhEmi?.[0]).toLocaleTimeString() : ''
    const qrCodeUrl = nfeRoot.infNFeSupl?.[0]?.qrCode?.[0]
    const urlChaveConsulta = nfeRoot.infNFeSupl?.[0]?.urlChave?.[0]
    const consultaUrl = resolveConsultaUrl(emitenteNF?.enderEmit?.[0]?.UF?.[0], urlChaveConsulta)

    if (!qrCodeUrl) {
        throw new Error('QR Code da NFC-e não encontrado no XML (infNFeSupl.qrCode)')
    }

    const ProductData = products.map((product, index) => {
        return [
            { text: String(index + 1) }, { text: product.prod?.[0].cProd?.[0] ?? '' }, { text: strCut(product.prod?.[0].xProd?.[0], 25) ?? '' }, { text: Number(product.prod?.[0].qCom?.[0]).toFixed(2) ?? '' }, { text: product.prod?.[0].uCom?.[0] ?? '' }, { text: currencyFormat(product.prod?.[0].vUnCom?.[0], true) ?? '' }, { text: currencyFormat(product.prod?.[0].vProd?.[0], true) ?? '' }
        ]
    })

    const PaymentData = payments ? (payments.map((pay) => {
        return [
            { text: PaymentType[pay?.tPag?.[0]] ?? '' }, { text: currencyFormat(pay?.vPag?.[0]) ?? '', alignment: 'right' }
        ]
    })) : ([[{ text: '' }, { text: ''}]])

    const QrCodeChave = await new Promise((resolve, reject) => {
        QRCode.toDataURL(qrCodeUrl, function (err, QrCodeChave) {
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
        pageOrientation: 'portrait',
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
                    `CNPJ: ${cpfCnpjFormat(emitenteNF?.CNPJ?.[0] ?? emitenteNF?.CPF?.[0] ?? '')} ${' '} ${emitenteNF?.xNome?.[0] ?? ''}`,
                    ` ${emitenteNF?.enderEmit?.[0]?.xLgr?.[0] ?? ''}, ${emitenteNF?.enderEmit?.[0]?.nro?.[0] ?? ''}`,
                    ` ${emitenteNF?.enderEmit?.[0]?.xBairro?.[0] ?? ''}`,
                    ` ${emitenteNF?.enderEmit?.[0]?.xMun?.[0] ?? ''} - ${emitenteNF?.enderEmit?.[0]?.UF?.[0] ?? ''}`,
                    ` ${emitenteNF?.enderEmit?.[0]?.CEP?.[0] ?? ''} \n`,
                    ` Fone:${emitenteNF?.enderEmit?.[0]?.fone?.[0] ?? ''} I.E.: ${emitenteNF?.IE?.[0] ?? ''}`,
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
                text: [(consultaUrl ? consultaUrl + ' \n' : '') + addSpaces(chaveNf)]
            },
            {
                style: 'default',
                alignment: 'center',
                margin: [0, 1],
                text: [destinatarioNF?.xNome?.[0]?.toUpperCase() ?? 'CONSUMIDOR NÃO IDENTIFICADO']
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
                        text: protocoloNF?.nProt?.[0] ?? '',
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
                text: [`Tributos Totais Incidentes(Lei Federal 12.741/12): ${currencyFormat(totalNF?.vTotTrib?.[0] ?? '0')}`]
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
            //@ts-ignore
            const pdfDoc = printer.createPdfKitDocument(docParams);
            /** @type {Buffer[]} */
            const chunks = []
            pdfDoc.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
            pdfDoc.on('end', () => resolve(Buffer.concat(chunks)))
            pdfDoc.on('error', (err) => reject(new Error('Erro ao gerar o PDF: ' + err)))
            pdfDoc.end()
        } catch (err) {
            reject(err)
        }
    })
}
