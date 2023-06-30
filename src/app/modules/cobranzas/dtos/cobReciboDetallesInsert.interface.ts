export interface CobReciboDetallesInsert {
	id: string | null;
	reciboId: string | null;
	monto: number;
	tipo: string;
	observacion: string | null;
	posId: string | null;
	codAut: string | null;
	cancelado: boolean | null;
}