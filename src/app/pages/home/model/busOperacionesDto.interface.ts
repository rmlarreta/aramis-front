import { BusDetallesOperacionesDto } from "./busDetallesOperacionesDto.interface";
import { BusObservacionesDto } from "./busObservacionesDto.interface";
 
export interface BusOperacionesDto {
    id: string;
    numero: number | null;
    clienteId: string;
    cui: string | null;
    resp: string | null;
    domicilio: string | null;
    fecha: Date;
    vence: Date;
    razon: string;
    codAut: string | null;
    tipoDocId: string;
    tipoDocName: string | null;
    estadoId: string;
    estadoName: string | null;
    pos: number;
    operador: string;
    total: number;
    totalLetras: string | null;
    totalInternos: number | null;
    totalNeto: number | null;
    totalIva: number | null;
    totalIva10: number | null;
    totalIva21: number | null;
    totalExento: number | null;
    detalles: BusDetallesOperacionesDto[] | null;
    observaciones: BusObservacionesDto[];
    cuitEmpresa: string;
    razonEmpresa: string;
    domicilioEmpresa: string;
    fantasia: string;
    iibb: string;
    inicio: Date;
    respoEmpresa: string;
}
 