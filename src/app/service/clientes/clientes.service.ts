import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OpClienteDto } from 'src/app/model/opClientesDto.interface';
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
  
}