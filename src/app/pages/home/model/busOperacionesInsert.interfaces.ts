export interface BusOperacionesInsert {
    id: string;
    numero: number | null;
    clienteId: string;
    fecha: Date;
    vence: Date;
    razon: string;
    codAut: string | null;
    tipoDocId: string;
    estadoId: string;
    pos: number;
    operador: string;
}