//@ts-check
import fs from 'fs'

export async function getPDFFile(filePath, res) {
    // Verifica se o arquivo existe
    if (!fs.existsSync(filePath)) {
        throw new Error('Arquivo não encontrado: ' + filePath);
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            throw new Error(err.message)
        }
        console.log('gerou base64'+filePath)
        return res.status(200).json({ success: true, danfe: data.toString('base64') })
    })
}