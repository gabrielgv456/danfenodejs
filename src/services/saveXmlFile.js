//@ts-check

import fs from 'fs'
import path from 'path'

export async function saveXMLToFile(xmlContent, directory, fileName) {
    // Certifique-se de que o diretório existe
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    // Caminho completo do arquivo
    const filePath = path.join(directory, fileName);

    // Escreve o conteúdo XML no arquivo
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, xmlContent, 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(`Arquivo XML salvo com sucesso em: ${filePath}`);
            }
        });
    });
}