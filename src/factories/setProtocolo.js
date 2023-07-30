import danfe from 'danfe-woj'

export function setProtocolo(dataNf) {

    var protocolo = new danfe.Protocolo();
    if (!dataNf.nfeProc?.protNFe?.[0].infProt?.[0].nProt?.[0]) {
        throw new Error('XML não possui protocolo!')
    } 
    protocolo.comCodigo(dataNf.nfeProc?.protNFe?.[0].infProt?.[0].nProt?.[0] ?? '');
    protocolo.comData(dataNf.nfeProc?.protNFe?.[0].infProt?.[0].dhRecbto?.[0] ? new Date(dataNf.nfeProc?.protNFe?.[0].infProt?.[0].dhRecbto?.[0] ?? '').toISOString().slice(0, -5) : '')

    return protocolo
}