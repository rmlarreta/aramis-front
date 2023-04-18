export interface CobCuentaMovimientoDto {
    id: string | null;
    cuenta: string | null;
    debito: boolean;
    computa: boolean;
    detalle: string;
    monto: number;
    fecha: Date | null;
    operador: string | null;
}