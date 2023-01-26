import { CobReciboDetalle } from "./cobReciboDetalles.interface";

export interface CobReciboDto {
    id: string;
    clienteId: string;
    fecha: Date;
    operador: string;
    numero: number;
    detalles: CobReciboDetalle[] | null;
}