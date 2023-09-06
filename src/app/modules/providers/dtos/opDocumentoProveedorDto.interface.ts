import { OpCustomerDto } from "../../clientes/dtos/opCustomerDto.interface";
import { BusEstadoDto } from "../../operations/dtos/busEstadoDto,interface";
import { TipoOperacionDto } from "../../operations/dtos/tipoOperacionDto.interface";

export interface OpDocumentoProveedorDto {
	id: string | null;
	fecha: string;
	razon: string;
	pos: number;
	numero: number;
	monto: number;
	estado: BusEstadoDto | null;
	proveedor: OpCustomerDto;
	tipoDoc: TipoOperacionDto;
}