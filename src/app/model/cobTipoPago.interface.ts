import { CobCuentum } from "./cobCuentum.interface"; 

export interface CobTipoPago {
    id: string;
    name: string;
    cuentaId: string | null; 
    cuenta: CobCuentum | null;
}