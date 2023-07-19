import danfe from 'danfe-woj'

export function setTransportador(transportadorNF) {

    var transportador = new danfe.Transportador();
    transportador.comNome(transportadorNF?.transporta?.[0].xNome?.[0] ?? '');
    transportador.comRegistroNacional(transportadorNF?.transporta?.[0].CNPJ?.[0] ?? '');
    transportador.comInscricaoEstadual(transportadorNF?.transporta?.[0].IE?.[0] ?? '');
    //transportador.comCodigoAntt();
    transportador.comPlacaDoVeiculo(transportadorNF?.veicTransp?.[0].placa?.[0] ?? '');
    transportador.comUfDaPlacaDoVeiculo(transportadorNF?.veicTransp?.[0].UF?.[0] ?? '');
    transportador.comEndereco(new danfe.Endereco()
        .comLogradouro(transportadorNF?.transporta?.[0].xEnder?.[0] ?? '')
        //.comNumero('S/N')
        //.comCep('70000000')
        //.comBairro('Bairro Alto')
        .comMunicipio(transportadorNF?.transporta?.[0].xMun?.[0] ?? '')
        .comCidade(transportadorNF?.transporta?.[0].xMun?.[0] ?? '')
        .comUf(transportadorNF?.transporta?.[0].UF?.[0] ?? ''))
    return transportador
}