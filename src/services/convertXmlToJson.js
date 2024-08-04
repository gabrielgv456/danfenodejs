//@ts-check

import fs from 'fs'
import xml2js from 'xml2js'
const parser = new xml2js.Parser();


export async function ConvertXmlToJson(pathDoArquivoXml) {

    return new Promise((resolve, reject) => {

        fs.readFile(pathDoArquivoXml, (err, data) => {
            if (err) {
                reject(err)
            }
            parser.parseString(data, (err, result) => {
                if (err) {
                    reject(err)
                }
                resolve(result)
            })
        })

    })

}

