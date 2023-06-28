const fs = require('fs')
const path = require('path')

const danfe = require('danfe-woj')

pathDoArquivoPdf = path.join(__dirname, 'danfe.pdf');

var emitente = new danfe.Emitente();
emitente.comNome('Acme Indústria de Testes Unitários S/A');
emitente.comLogotipo(path.join(__dirname, './logotipo.png'));
emitente.comRegistroNacional('14.625.996/0001-35');
emitente.comInscricaoEstadual('03.707.130-0');
emitente.comTelefone('(61) 3322-4455');
emitente.comEmail('contato@acme.ind.br');
emitente.comEndereco(new danfe.Endereco()
            .comLogradouro('Rua dos Testes')
            .comNumero('42')
            .comComplemento('Sala 1389 - Ed. Nodeunit')
            .comCep('72.100-300')
            .comBairro('Bairro da Integração')
            .comMunicipio('Testolândia')
            .comCidade('Belo Horizonte')
            .comUf('MG'));

var destinatario = new danfe.Destinatario();
destinatario.comNome('Cliente Feliz da Silva');
destinatario.comRegistroNacional('250.796.466-91');
destinatario.comTelefone('2123124389');
destinatario.comEndereco(new danfe.Endereco()
            .comLogradouro('Av. Brasil')
            .comNumero('132')
            .comComplemento('Fundos')
            .comCep('71.010-130')
            .comBairro('Padre Miguel')
            .comMunicipio('Rio de Janeiro')
            .comCidade('Rio de Janeiro')
            .comUf('RJ'));

var transportador = new danfe.Transportador();
transportador.comNome('Carroceria Cheia Transportes Ltda');
transportador.comRegistroNacional('28.124.151/0001-70');
transportador.comInscricaoEstadual('0731778300131');
transportador.comCodigoAntt('ASDASD');
transportador.comPlacaDoVeiculo('ZZZ-9090');
transportador.comUfDaPlacaDoVeiculo('AP');
transportador.comEndereco(new danfe.Endereco()
            .comLogradouro('Rua Imaginária')
            .comNumero('S/N')
            .comCep('70000000')
            .comBairro('Bairro Alto')
            .comMunicipio('Cocalzinho de Goiás')
            .comCidade('Cocalzinho de Goiás')
            .comUf('GO'));

var protocolo = new danfe.Protocolo();
protocolo.comCodigo('123451234512345');
//protocolo.comData(new Date('01/01/2022'));

var impostos = new danfe.Impostos();
impostos.comBaseDeCalculoDoIcms(100);
impostos.comValorDoIcms(17.5);
impostos.comBaseDeCalculoDoIcmsSt(90);
impostos.comValorDoIcmsSt(6.83);
impostos.comValorDoImpostoDeImportacao(80);
impostos.comValorDoPis(70);
impostos.comValorTotalDoIpi(60);
impostos.comValorDaCofins(50);
//impostos.comBaseDeCalculoDoIssqn(40);
//impostos.comValorTotalDoIssqn(30);

var volumes = new danfe.Volumes();
volumes.comQuantidade(1342);
volumes.comEspecie('À GRANEL');
volumes.comMarca('Apple');
volumes.comNumeracao('AB732-4');
volumes.comPesoBruto('1.578Kg');
volumes.comPesoLiquido('1.120Kg');

var danfeInput = new danfe.Danfe();
danfeInput.comChaveDeAcesso('52131000132781000178551000000153401000153408');
danfeInput.comEmitente(emitente);
danfeInput.comDestinatario(destinatario);
danfeInput.comTransportador(transportador);
danfeInput.comProtocolo(protocolo);
danfeInput.comImpostos(impostos);
danfeInput.comVolumes(volumes);
danfeInput.comTipo('1');
danfeInput.comNaturezaDaOperacao('VENDA');
danfeInput.comNumero(1420);
danfeInput.comSerie(100);
danfeInput.comDataDaEmissao(new Date().toISOString().slice(0, -5));
danfeInput.comDataDaEntradaOuSaida(new Date().toISOString().slice(0, -5));
danfeInput.comModalidadeDoFrete('porContaDoDestinatarioRemetente');
danfeInput.comInscricaoEstadualDoSubstitutoTributario('102959579');
danfeInput.comInformacoesComplementares('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi non quis exercitationem culpa nesciunt nihil aut nostrum explicabo reprehenderit optio amet ab temporibus asperiores quasi cupiditate. Voluptatum ducimus voluptates voluptas? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi non quis exercitationem culpa nesciunt nihil aut nostrum consectetur adipisicing elit. Eligendi non quis exercitationem culpa nesciunt nihil aut nostrum nihil aut nostrum');
danfeInput.comValorTotalDaNota(250.13);
danfeInput.comValorTotalDosProdutos(120.10);
danfeInput.comValorTotalDosServicos(130.03);
danfeInput.comValorDoFrete(23.34);
danfeInput.comValorDoSeguro(78.65);
danfeInput.comDesconto(1.07);
danfeInput.comOutrasDespesas(13.32);

for (var i = 0; i < 10; i++) {
    danfeInput.adicionarItem(new danfe.Item()
        .comCodigo('' + i)
        .comDescricao('Produto')
        .comNcmSh('15156000')
        .comOCst('020')
        .comCfop('6101')
        .comUnidade('LT')
        .comQuantidade(3.1415)
        .comValorUnitario(2.31)
        .comValorTotal(7.13)
        .comBaseDeCalculoDoIcms(5.01)
        .comValorDoIcms(0.67)
        .comValorDoIpi(0.03)
        .comAliquotaDoIcms(0.1753)
        .comAliquotaDoIpi(0.0034));
}

new danfe.Gerador(danfeInput).gerarPDF({
    ambiente: 'homologacao',
    ajusteYDoLogotipo: -4,
    ajusteYDaIdentificacaoDoEmitente: 4,
    creditos: 'Gammasoft Desenvolvimento de Software Ltda - http://opensource.gammasoft.com.br'
}, function(err, pdf) {
    if(err) {
        throw err;
    }

    pdf.pipe(fs.createWriteStream(pathDoArquivoPdf));
    console.log("emitido com sucesso! Disponivel em: "+pathDoArquivoPdf)
});

