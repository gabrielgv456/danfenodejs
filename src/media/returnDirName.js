//@ts-check

import { fileURLToPath } from 'url';
import { dirname } from 'path';

export function returnDirName (){
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    return __dirname
}

