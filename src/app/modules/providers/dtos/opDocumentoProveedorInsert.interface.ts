export interface OpDocumentoProveedorInsert {
	id: string | null;
	fecha: string;
	razon: string;
	pos: number;
	numero: number;
	monto: number;
	estadoId: string | null;
	proveedorId: string;
	tipoDocId: string;
}