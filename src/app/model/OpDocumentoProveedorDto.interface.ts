export interface OpDocumentoProveedorDto {
    id: string | null;
    proveedorId: string;
    fecha: string;
    razon: string;
    tipoDocId: string;
    estadoId: string | null;
    pos: number;
    numero: number;
    monto: number;
}