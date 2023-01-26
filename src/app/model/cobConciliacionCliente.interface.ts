import { BusOperacionesDto } from "./busOperacionesDto.interface";
import { CobReciboDetalle } from "./cobReciboDetalles.interface";
import { CobReciboDto } from "./cobReciboDto.interface";

export interface ConciliacionCliente {
    operacionesImpagas: BusOperacionesDto[];
    detallesCuentaCorriente: CobReciboDetalle[] | null;
    recibosSinImputar: CobReciboDto[];
    debitos: number | null;
    creditos: number | null;
    saldoConciliado: number | null;
}