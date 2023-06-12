export interface BusOperacionInsert {
	id: string;
	clienteId: string;
	fecha: string;
	vence: string;
	razon: string;
	codAut: string | null;
	tipoDocId: string;
	estadoId: string;
	pos: number;
	operador: string;
	numero: number;
}