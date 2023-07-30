import danfe from 'danfe-woj'

export function setDanfeInput(dataNf, emitente, destinatario, transportador, protocolo, impostos, volumes) {

    const infNF = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe ).infNFe[0].ide[0]
    const totalNF = (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe ).infNFe[0].total[0].ICMSTot[0]

    var danfeInput = new danfe.Danfe();
    danfeInput.comChaveDeAcesso(dataNf.nfeProc?.protNFe?.[0].infProt?.[0].chNFe?.[0] ?? '');
    danfeInput.comEmitente(emitente);
    danfeInput.comDestinatario(destinatario);
    danfeInput.comTransportador(transportador);
    danfeInput.comProtocolo(protocolo);
    danfeInput.comImpostos(impostos);
    danfeInput.comVolumes(volumes);
    danfeInput.comTipo(infNF?.tpNF?.[0] ?? '');
    danfeInput.comNaturezaDaOperacao(infNF?.natOp?.[0] ?? '');
    danfeInput.comNumero(infNF?.nNF?.[0] ?? '');
    danfeInput.comSerie(infNF?.serie?.[0] ?? '');
    danfeInput.comDataDaEmissao(infNF?.dhEmi?.[0] ? new Date(infNF?.dhEmi?.[0]).toISOString().slice(0, -5) : '');
    danfeInput.comDataDaEntradaOuSaida(infNF?.dhSaiEnt?.[0] ? new Date(infNF?.dhSaiEnt?.[0]).toISOString().slice(0, -5) : '');
    danfeInput.comModalidadeDoFrete((dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe ).infNFe[0].transp?.[0].transporta?.[0]?.modFrete?.[0] ?? '');
    //danfeInput.comInscricaoEstadualDoSubstitutoTributario('102959579');
    danfeInput.comInformacoesComplementares((dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe ).infNFe[0].infAdic?.[0].infCpl?.[0] ?? (dataNf.nfeProc?.NFe?.[0] ?? dataNf.NFe ).infNFe[0].infAdic?.[0].infAdFisco?.[0] ?? '')
    danfeInput.comValorTotalDaNota(totalNF?.vNF?.[0] ?? '');
    danfeInput.comValorTotalDosProdutos(totalNF?.vProd?.[0] ?? '');
    danfeInput.comValorTotalDosServicos(totalNF?.vServ?.[0] ?? '');
    danfeInput.comValorDoFrete(totalNF?.vFrete?.[0] ?? '');
    danfeInput.comValorDoSeguro(totalNF?.vSeg?.[0] ?? '');
    danfeInput.comDesconto(totalNF?.vDesc?.[0] ?? '');
    danfeInput.comOutrasDespesas(totalNF?.vOutro?.[0] ?? '');

    return danfeInput

}