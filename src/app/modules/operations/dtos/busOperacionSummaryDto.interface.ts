import { SysEmpresaDto } from "../../users/dtos/commons/sysEmpresaDto.interface";
import { BusOperacionDetalleSumaryDto } from "./busOperacionDetalleSummaryDto.interface";
import { BusOperacionDto } from "./busOperacionDto.interface";
import { BusOperacionesObservacionDto } from "./busOperacionesObservacionDto.interface";

export interface BusOperacionSumaryDto extends BusOperacionDto {
    total: number;
    totalLetras: string | null;
    totalInternos: number | null;
    totalNeto: number | null;
    totalIva: number | null;
    totalIva10: number | null;
    totalIva21: number | null;
    totalExento: number | null;
    detalles: BusOperacionDetalleSumaryDto[];
    observaciones: BusOperacionesObservacionDto[];
    empresa?: SysEmpresaDto;
    saldosPendientes: number | null;
}