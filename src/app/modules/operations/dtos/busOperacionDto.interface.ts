import { BusOperacionInsert } from "./busOperacionInsert.interface";
 
export interface BusOperacionDto extends BusOperacionInsert {
	cui: string | null;
	resp: string | null;
	domicilio: string | null;
	tipoDocName: string | null;
	estadoName: string | null;
}