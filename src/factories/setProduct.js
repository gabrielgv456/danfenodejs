import danfe from 'danfe-woj'

export function setProduct(produtos, danfeInput) {

    produtos.map((itemNF, index) =>
        danfeInput.adicionarItem(new danfe.Item()
            .comCodigo(itemNF.prod?.[0].cProd?.[0] ?? '')
            .comDescricao(itemNF.prod?.[0].xProd?.[0] ?? '')
            .comNcmSh(itemNF.prod?.[0].NCM?.[0] ?? '')
            .comOCst((itemNF.imposto?.[0].ICMS?.[0].ICMS00?.[0].orig?.[0] ?? '') + (itemNF.imposto?.[0].ICMS?.[0].ICMS00?.[0].CST?.[0]))
            .comCfop(itemNF.prod?.[0].CFOP?.[0] ?? '')
            .comUnidade(itemNF.prod?.[0].uCom?.[0] ?? '')
            .comQuantidade(itemNF.prod?.[0].qCom?.[0] ?? '')
            .comValorUnitario(itemNF.prod?.[0].vUnCOm?.[0] ?? '')
            .comValorTotal(itemNF.prod?.[0].vProd?.[0] ?? '')
            .comBaseDeCalculoDoIcms(itemNF.imposto?.[0].ICMS?.[0].ICMS00?.[0].vBC?.[0] ?? '')
            .comValorDoIcms(itemNF.imposto?.[0].ICMS?.[0].ICMS00?.[0].vICMS?.[0] ?? '')
            .comValorDoIpi(itemNF.imposto?.[0].IPI?.[0].IPITrib?.[0].vIPI?.[0] ?? '')
            .comAliquotaDoIcms(itemNF.imposto?.[0].ICMS?.[0].ICMS00?.[0].pICMS?.[0] ?? '')
            .comAliquotaDoIpi(itemNF.imposto?.[0].IPI?.[0].IPITrib?.[0].pIPI?.[0] ?? '')
        )
    )
}