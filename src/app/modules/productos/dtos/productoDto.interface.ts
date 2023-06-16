export interface ProductoDto {
	id: string | null;
	cantidad: number;
	plu: string;
	descripcion: string;
	rubro: string;
	iva: string;
	neto: number;
	internos: number;
	tasa: number;
	servicio: boolean;
}