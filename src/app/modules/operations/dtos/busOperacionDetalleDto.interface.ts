export interface BusOperacionDetalleDto {
	id: string | null;
	operacionId: string;
	cantidad: number;
	productoId: string;
	codigo: string;
	detalle: string;
	rubro: string;
	unitario: number | null;
	ivaValue: number | null;
	internos: number;
	facturado: number | null;
}