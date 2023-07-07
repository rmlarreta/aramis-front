import { CobReciboInsert } from "../../cobranzas/dtos/cobReciboInsert.interface";
import { BusOperacionSumaryDto } from "../../operations/dtos/busOperacionSummaryDto.interface";
import { OpCustomerDto } from "./opCustomerDto.interface";

export interface CustomerConciliacion {
	customer: OpCustomerDto | null;
	operacionesImpagas: BusOperacionSumaryDto[] | null;
	recibosNoImputados: CobReciboInsert[] | null;
	debe: number;
	haber: number;
	balance: number;
}