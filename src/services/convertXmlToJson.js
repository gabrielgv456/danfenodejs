import fs from 'fs'
import path from 'path'
import xml2js from 'xml2js'
import { returnDirName } from '../media/returnDirName.js';
const parser = new xml2js.Parser();

//const pathDoArquivoXml = path.join(returnDirName(), 'arquivo.xml');

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

