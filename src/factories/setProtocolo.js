import danfe from 'danfe-woj'

export function setProtocolo(dataNf) {

    var protocolo = new danfe.Protocolo();
    protocolo.comCodigo(dataNf.nfeProc.protNFe?.[0].infProt?.[0].nProt?.[0] ?? '');
    protocolo.comData(new Date(dataNf.nfeProc.protNFe?.[0].infProt?.[0].dhRecbto?.[0] ?? '').toISOString().slice(0, -5))

    return protocolo
}