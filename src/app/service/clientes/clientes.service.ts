import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConciliacionCliente } from 'src/app/model/cobConciliacionCliente.interface';
import { OpGenderDto, OpPaiDto, OpRespDto } from 'src/app/model/opClientesAttributes.interface';
import { OpClienteDto } from 'src/app/model/opClientesDto.interface';
import { OpClienteInsert } from 'src/app/model/opClientesInsert.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private baseUrl = environment.baseUrl; // Establece la URL base del BFF
  constructor(
    private http: HttpClient
  ) { }

  getbycui(cui: string) {
    return this.http.get<OpClienteDto>(`${this.baseUrl}/customers/GetByCui/${cui}`);
  }

  get clientes() {
    return this.http.get<OpClienteDto[]>(`${this.baseUrl}/customers/GetAll`);
  }

  get genders() {
    return this.http.get<OpGenderDto[]>(`${this.baseUrl}/customers/GetGenderList`);
  }

  get respos() {
    return this.http.get<OpRespDto[]>(`${this.baseUrl}/customers/GetRespList`);
  }

  get paises() {
    return this.http.get<OpPaiDto[]>(`${this.baseUrl}/customers/GetPaisList`);
  }

  customeradd(customer: OpClienteInsert) {
    return this.http.post<OpClienteDto>(`${this.baseUrl}/customers/Insert`, customer);
  }

  customerdelete(customerId: string) {
    return this.http.delete(`${this.baseUrl}/customers/Delete/` + customerId, { responseType: "arraybuffer" });
  }

  customersave(customer: OpClienteInsert) {
    return this.http.patch<OpClienteDto>(`${environment.baseUrl}/customers/Update`, customer);
  }

  conciliacion(customerId : string){
    return this.http.get<ConciliacionCliente>(`${environment.baseUrl}/pagos/ConciliacionCliente/`+customerId);
  }
}