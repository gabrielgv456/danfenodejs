import danfe from 'danfe-woj'
import { acessarPrimeiraProp } from '../utils/utils.js'

export function setProduct(produtos, danfeInput) {

    produtos.map((itemNF, index) => {
        const ICMS = acessarPrimeiraProp(itemNF.imposto?.[0].ICMS?.[0])

        danfeInput.adicionarItem(new danfe.Item()
            .comCodigo(itemNF.prod?.[0].cProd?.[0] ?? '')
            .comDescricao(itemNF.prod?.[0].xProd?.[0] ?? '')
            .comNcmSh(itemNF.prod?.[0].NCM?.[0] ?? '')
            .comOCst(ICMS?.[0].CST?.[0] ?? ICMS?.[0].CSOSN?.[0] ?? '')
            .comCfop(itemNF.prod?.[0].CFOP?.[0] ?? '')
            .comUnidade(itemNF.prod?.[0].uCom?.[0] ?? '')
            .comQuantidade(itemNF.prod?.[0].qCom?.[0] ?? '')
            .comValorUnitario(itemNF.prod?.[0].vUnCom?.[0] ?? '')
            .comValorTotal(itemNF.prod?.[0].vProd?.[0] ?? '')
            .comBaseDeCalculoDoIcms(ICMS?.[0].vBC?.[0] ?? '')
            .comValorDoIcms(ICMS?.[0].vICMS?.[0] ?? '')
            .comValorDoIpi(itemNF.imposto?.[0].IPI?.[0].IPITrib?.[0].vIPI?.[0] ?? '')
            .comAliquotaDoIcms(ICMS?.[0].pICMS?.[0] ?? '')
            .comAliquotaDoIpi(itemNF.imposto?.[0].IPI?.[0].IPITrib?.[0].pIPI?.[0] ?? '')
        )
    }
    )
}