import { BusOperacionDetalleDto } from "./busOperacionDetalleDto.interface";

export interface BusOperacionDetalleSumaryDto extends BusOperacionDetalleDto {
	cantidadDisponible: number;
	totalInternos: number | null;
	totalNeto10: number | null;
	totalNeto21: number | null;
	totalExento: number | null;
	totalIva: number | null;
	total: number | null;
	totalIva10: number | null;
	totalIva21: number | null;
	totalNeto: number | null;
	operador: string | null;
}