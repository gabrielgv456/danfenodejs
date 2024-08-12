export function currencyFormat(value) {
    if (!value) return ''
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}


export function strCut(texto,length) {
    if (texto.length > length) {
        return texto.substring(0, length) + '...';
    } else {
        return texto;
    }
}