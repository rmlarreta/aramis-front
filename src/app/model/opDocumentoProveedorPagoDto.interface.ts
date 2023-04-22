import { OpDocumentoProveedorDto } from "./OpDocumentoProveedorDto.interface"; 

export interface OpDocumentoProveedorPago {
    documento: OpDocumentoProveedorDto | null;
    cuenta: string | null;
    operador: string | null;
}