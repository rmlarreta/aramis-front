import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OpGenderDto, OpPaiDto, OpRespDto } from 'src/app/model/opClientesAttributes.interface';
import { OpClienteDto } from 'src/app/model/opClientesDto.interface';
import { OpClienteInsert } from 'src/app/model/opClientesInsert.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(
    private http: HttpClient
  ) { }

  getbycui(cui: string) {
    return this.http.get<OpClienteDto>(`${environment.baseUrl}/customers/GetByCui/${cui}`);
  }

  get clientes() {
    return this.http.get<OpClienteDto[]>(`${environment.baseUrl}/customers/GetAll`);
  }

  get genders() {
    return this.http.get<OpGenderDto[]>(`${environment.baseUrl}/customers/GetGenderList`);
  }

  get respos() {
    return this.http.get<OpRespDto[]>(`${environment.baseUrl}/customers/GetRespList`);
  }

  get paises() {
    return this.http.get<OpPaiDto[]>(`${environment.baseUrl}/customers/GetPaisList`);
  }

  customeradd(customer: OpClienteInsert) {
    return this.http.post<OpClienteDto>(`${environment.baseUrl}/customers/Insert`, customer);
  }

  customerdelete(id: string) {
    return this.http.delete(`${environment.baseUrl}/customers/Delete/` + id, { responseType: "arraybuffer" });
  }

  customersave(customer: OpClienteInsert) {
    return this.http.patch<OpClienteDto>(`${environment.baseUrl}/customers/Update`, customer);
  }
}