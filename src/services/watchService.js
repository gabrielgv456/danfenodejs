//@ts-check

import fs from 'fs'
import { processarArquivo } from './processFile.js';
import { returnDirName } from '../media/returnDirName.js';

const folderPath = returnDirName();

fs.watch(folderPath, async (eventType, filename) => {
    if (eventType === 'rename' && filename && filename.endsWith('.xml')) {
        await processarArquivo(filename);
    }
});

fs.readdir(folderPath, async (err, files) => {
    if (err) {
        console.error('Erro ao ler os arquivos existentes:', err);
        return;
    }

    for (const file of files) {
        if (file.endsWith('.xml')) {
            await processarArquivo(file);
        }
    }
});
