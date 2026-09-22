export function assertSafePathSegment(value, fieldName = 'path') {
  if (value == null || value === '') {
    throw new Error(`Informe um valor válido para ${fieldName}`)
  }
  const segment = String(value)
  if (segment === '.' || segment === '..' || !/^[A-Za-z0-9._-]+$/.test(segment)) {
    throw new Error(`${fieldName} contém caracteres inválidos`)
  }
  return segment
}

export function currencyFormat(value, noSymbol) {
  if (value == null || value === '') return ''
  return new Intl.NumberFormat('pt-BR', { style: `${noSymbol ? 'decimal' : 'currency'}`, currency: 'BRL' }).format(value)
}


export function strCut(texto, length) {
  if (!texto) return ''
  if (texto.length > length) {
    return texto.substring(0, length) + '...';
  } else {
    return texto;
  }
}

export function addSpaces(str) {
  if (!str) return ''
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

/** Override danfe-woj CNPJ-only mask so CPF (11 digits) formats correctly. */
export function applyRegistroNacionalFormat(pessoa) {
  pessoa.getRegistroNacionalFormatado = function () {
    return cpfCnpjFormat(this.getRegistroNacional())
  }
  return pessoa
}

/**
 * Keep local wall-clock from NFe datetime strings for danfe-woj.
 * e.g. 2026-08-13T14:59:35-03:00 → 2026-08-13T14:59:35
 */
export function toDanfeDateTime(value) {
  if (value == null || value === '') return ''
  return String(value)
    .replace(/\.\d+/, '')
    .replace(/(Z|[+-]\d{2}:?\d{2})$/, '')
}

export function removeNotNumerics(text) {
  if (!text) { return '' }
  return (text.replace(/[^0-9]/g, ''))
}


export function acessarPrimeiraProp(obj) {
  const chaves = Object.keys(obj);
  if (chaves.length > 0) {
    const primeiraProp = chaves[0];
    return obj[primeiraProp];
  }
  return null;
}

export function base64ToBuffer(base64) {
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, ""); 
  return Buffer.from(base64Data, 'base64');
}
