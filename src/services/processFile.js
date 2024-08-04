//@ts-check
import { returnDirName } from '../media/returnDirName.js';
import fs from 'fs'
import path from 'path'
import { generateDanfe } from './danfeGenerator.js';


export async function processarArquivo(folderPath, filename) {
    const filePath = path.join(folderPath, filename);

    if (!fs.existsSync(filePath)) return;

    console.log(`Arquivo ${filename} adicionado. Executar função...`);

    const successPath = await generateDanfe(filePath, filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Erro ao deletar o arquivo ${filename}:`, err);
        } else {
            console.log(`Arquivo ${filename} deletado.`);
        }
    });
    return successPath

}