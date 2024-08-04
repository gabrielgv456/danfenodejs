//@ts-check
import fs from 'fs'

export function getPDFFile(filePath, res) {
    // Verifica se o arquivo existe
    if (!fs.existsSync(filePath)) {
        res.status(404).send('Arquivo não encontrado: ' + filePath);
        return;
    }

    // Define o cabeçalho para indicar que é um arquivo PDF
    res.setHeader('Content-Type', 'application/pdf');

    // Cria um stream de leitura do arquivo PDF
    const readStream = fs.createReadStream(filePath);

    // Encaminha o stream para a resposta
    readStream.pipe(res);
}