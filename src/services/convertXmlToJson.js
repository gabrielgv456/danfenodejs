//@ts-check

import xml2js from 'xml2js'

const parser = new xml2js.Parser()

/**
 * @param {string | Buffer} xmlContent
 */
export async function ConvertXmlToJson(xmlContent) {
    if (xmlContent == null || xmlContent === '') {
        throw new Error('XML vazio')
    }
    return parser.parseStringPromise(xmlContent)
}
