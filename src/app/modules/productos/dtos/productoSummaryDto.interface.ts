import { ProductoDto } from "./productoDto.interface"; 

export interface ProductoSummaryDto extends ProductoDto {
	rubroName: string | null;
	ivaValue: number | null;
	unitario: number | null;
}