import { OpCustomerDto } from "../../clientes/dtos/opCustomerDto.interface";
import { OpDocumentoProveedorDto } from "./opDocumentoProveedorDto.interface";

  
export interface OpConciliacionProviders {
	proveedor: OpCustomerDto;
	documentos: OpDocumentoProveedorDto[];
	total: number;
}