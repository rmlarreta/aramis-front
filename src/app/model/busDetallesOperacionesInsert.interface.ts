export interface BusDetalleOperacionesInsert {
    id: string;
    operacionId: string;
    cantidad: number;
    productoId: string;
    codigo: string;
    detalle: string;
    rubro: string;
    unitario: number;
    ivaValue: number;
    internos: number;
    facturado: number;
    operador: string | null;
}