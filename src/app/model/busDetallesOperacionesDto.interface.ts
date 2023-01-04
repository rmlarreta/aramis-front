export interface BusDetallesOperacionesDto {
    id: string;
    operacionId: string;
    productoId: string;
    cantidad: number;
    cantidadDisponible: number;
    codigo: string;
    detalle: string;
    rubro: string;
    unitario: number;
    ivaValue: number;
    internos: number;
    facturado: number;
    totalInternos: number | null;
    totalNeto10: number | null;
    totalNeto21: number | null;
    totalIva: number | null;
    total: number | null;
    totalIva10: number | null;
    totalIva21: number | null;
    totalExento: number | null;
    totalNeto: number | null;  
}