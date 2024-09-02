export function currencyFormat(value, noSymbol) {
    if (!value) return ''
    return new Intl.NumberFormat('pt-BR', { style:  `${noSymbol ? 'decimal' : 'currency'}`, currency: 'BRL' }).format(value)
}


export function strCut(texto,length) {
    if (texto.length > length) {
        return texto.substring(0, length) + '...';
    } else {
        return texto;
    }
}

export function addSpaces(str) {
    return str.replace(/(.{4})/g, '$1 ').trim();
}

export function cpfCnpjFormat(text) {
    if (!text) { return '' }
    const localMax = text
    const cpfCnpj = removeNotNumerics(text)
    return (
      cpfCnpj.length === 11 ?
        cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4") :
        cpfCnpj.length === 14 ?
          cpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5") :
          cpfCnpj.length > 14 ?
            localMax
            :
            cpfCnpj)
  }
  
  export function removeNotNumerics(text) {
    if (!text) { return '' }
    return (text.replace(/[^0-9]/g, ''))
  }
  