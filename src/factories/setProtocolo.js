import danfe from 'danfe-woj'
import { toDanfeDateTime } from '../utils/utils.js'

export function setProtocolo(dataNf) {

    var protocolo = new danfe.Protocolo();
    if (!dataNf.nfeProc?.protNFe?.[0].infProt?.[0].nProt?.[0]) {
        throw new Error('XML não possui protocolo!')
    } 
    protocolo.comCodigo(dataNf.nfeProc?.protNFe?.[0].infProt?.[0].nProt?.[0] ?? '');
    protocolo.comData(toDanfeDateTime(dataNf.nfeProc?.protNFe?.[0].infProt?.[0].dhRecbto?.[0] ?? ''))

    return protocolo
}
