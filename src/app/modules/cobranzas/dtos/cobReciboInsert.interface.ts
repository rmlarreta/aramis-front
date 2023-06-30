import { CobReciboDetallesInsert } from "./cobReciboDetallesInsert.interface";

export interface CobReciboInsert {
	id: string | null;
	numero: number | null;
	clienteId: string;
	fecha: string | null;
	operador: string | null;
	operacion: string | null;
	detalles: CobReciboDetallesInsert[] | null;
}