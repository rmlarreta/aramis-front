export interface StockProductDto {
    id: string;
    cantidad: number;
    plu: string;
    descripcion: string;
    rubro: string;
    rubroName: string | null;
    iva: string;
    ivaValue: number | null;
    neto: number;
    internos: number;
    tasa: number;
    servicio: boolean;
    unitario: number | null;
}