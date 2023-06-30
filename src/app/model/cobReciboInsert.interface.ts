import { CobReciboDetallesInsert } from "../modules/cobranzas/dtos/cobReciboDetallesInsert.interface";
import { CobReciboDetalle } from "./cobReciboDetalles.interface";

export interface ReciboInsert {
    id: string | null;
    numero: number | null;
    clienteId: string;
    fecha: Date | null;
    operador: string | null;
    detalles: CobReciboDetallesInsert[];
}