import danfe from 'danfe-woj'
import path from 'path'
import { returnDirName } from '../media/returnDirName.js';


export function setEmitente(emitenteNF, logoBase64) {

    var emitente = new danfe.Emitente();
    emitente.comNome(emitenteNF?.xNome?.[0] ?? '');
    if (logoBase64) emitente.comLogotipo(logoBase64);
    emitente.comRegistroNacional(emitenteNF?.CNPJ?.[0] ?? '');
    emitente.comInscricaoEstadual(emitenteNF?.IE?.[0] ?? '');
    emitente.comTelefone(emitenteNF?.enderEmit[0]?.fone?.[0] ?? '');
    //emitente.comEmail('contato@acme.ind.br');
    emitente.comEndereco(new danfe.Endereco()
        .comLogradouro(emitenteNF?.enderEmit?.[0]?.xLgr?.[0] ?? '')
        .comNumero(emitenteNF?.enderEmit?.[0]?.nro?.[0] ?? '')
        .comComplemento(emitenteNF?.enderEmit?.[0]?.xCpl?.[0])
        .comCep(emitenteNF?.enderEmit?.[0]?.CEP?.[0] ?? '')
        .comBairro(emitenteNF?.enderEmit?.[0]?.xBairro?.[0] ?? '')
        .comMunicipio(emitenteNF?.enderEmit?.[0]?.xMun?.[0] ?? '')
        .comCidade(emitenteNF?.enderEmit?.[0]?.xMun[0])
        .comUf(emitenteNF?.enderEmit[0]?.UF?.[0] ?? ''))
    return emitente
}