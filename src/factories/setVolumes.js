 import danfe from 'danfe-woj'

export function setVolumes(volumesNF) {
 
 var volumes = new danfe.Volumes();
    volumes.comQuantidade(volumesNF?.qVol?.[0] ?? '' );
    volumes.comEspecie(volumesNF?.esp?.[0] ?? '');
    volumes.comMarca(volumesNF?.marca?.[0] ?? '');
    volumes.comNumeracao(volumesNF?.nVol?.[0] ?? '');
    volumes.comPesoBruto(volumesNF?.pesoB?.[0] ?? '' );
    volumes.comPesoLiquido(volumesNF?.pesoL?.[0] ?? '' );

    return volumes
}