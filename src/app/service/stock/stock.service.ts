import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StockProductDto } from 'src/app/model/stockProductDto.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(
    private http: HttpClient
  ) { }

  get products() {
    return this.http.get<StockProductDto[]>(`${environment.baseUrl}/stock/productsList`);
  }

}