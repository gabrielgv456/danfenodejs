import danfe from 'danfe-woj'

export function setImpostos(impostoNF) {
    console.log(impostoNF)
    var impostos = new danfe.Impostos();
    impostos.comBaseDeCalculoDoIcms(impostoNF?.vBC?.[0] ?? '');
    impostos.comValorDoIcms(impostoNF?.vICMS?.[0] ?? '');
    impostos.comBaseDeCalculoDoIcmsSt(impostoNF?.vBCST?.[0] ?? '');
    impostos.comValorDoIcmsSt(impostoNF?.vST?.[0] ?? '');
    impostos.comValorDoImpostoDeImportacao(impostoNF?.vII?.[0] ?? '');
    impostos.comValorDoPis(impostoNF?.vPIS?.[0] ?? '');
    impostos.comValorTotalDoIpi(impostoNF?.vIPI?.[0] ?? '');
    impostos.comValorDaCofins(impostoNF?.vCOFINS?.[0] ?? '');
    //impostos.comBaseDeCalculoDoIssqn(40);
    //impostos.comValorTotalDoIssqn(30);
    return impostos
}