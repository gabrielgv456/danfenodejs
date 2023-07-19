import danfe from 'danfe-woj'

export function setDestinatario(destinatarioNF) {

    var destinatario = new danfe.Destinatario();
    destinatario.comNome(destinatarioNF?.xNome?.[0] ?? '');
    destinatario.comRegistroNacional(destinatarioNF?.CPF?.[0] ?? '');
    destinatario.comTelefone(destinatarioNF?.enderDest[0]?.fone?.[0] ?? '');
    destinatario.comInscricaoEstadual(destinatarioNF?.IE?.[0] ?? '')
    destinatario.comEndereco(new danfe.Endereco()
        .comLogradouro(destinatarioNF?.enderDest[0]?.xLgr?.[0] ?? '')
        .comNumero(destinatarioNF?.enderDest[0]?.nro?.[0] ?? '')
        .comComplemento(destinatarioNF?.enderDest[0]?.xCpl?.[0] ?? '')
        .comCep(destinatarioNF?.enderDest[0]?.CEP?.[0] ?? '')
        .comBairro(destinatarioNF?.enderDest[0]?.xBairro?.[0] ?? '')
        .comMunicipio(destinatarioNF?.enderDest[0]?.cMun?.[0] ?? '')
        .comCidade(destinatarioNF?.enderDest[0]?.xMun?.[0] ?? '')
        .comUf(destinatarioNF?.enderDest[0]?.UF?.[0] ?? ''))
    return destinatario
}