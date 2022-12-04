export interface BusOperacionesInsert {
    id: string | null;
    numero: number | null;
    clienteId: string | null;
    fecha: Date | null;
    vence: Date | null;
    razon: string | null;
    codAut: string | null;
    tipoDocId: string | null;
    estadoId: string | null;
    pos: number | null;
    operador: string;
}