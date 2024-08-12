//@ts-check
import { returnDirName } from '../media/returnDirName.js';
import fs from 'fs'
import path from 'path'
import { generateDanfe } from './danfeGenerator.js';
import { generateDanfeNFC } from '../factories/danfeNFCeGenerator.js';


export async function processarArquivo(folderPathXml, filenameXml, profile, model) {

    const filePathXml = path.join(folderPathXml, filenameXml);
    if (!fs.existsSync(filePathXml)) return;

    console.log(`Arquivo ${filenameXml} adicionado. Gerando danfe...`);

    try {
        const successPath = model === 'NFE' ?
            await generateDanfe(filePathXml, filenameXml, profile) :
            model === 'NFCE' ?
                await generateDanfeNFC(filePathXml, filenameXml, profile) : null

        if (!successPath) throw new Error('Informe o modelo correto!')
        return successPath
    } catch (error) {
        throw new Error(error)
    } finally {
        // deleta xml
        fs.unlink(filePathXml, (err) => {
            if (err) {
                console.error(`Erro ao deletar o arquivo ${filenameXml}:`, err);
            } else {
                console.log(`Arquivo ${filenameXml} deletado.`);
            }
        });
    }





}