import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { environment } from 'src/environments/environment';
import { ProductoSummaryDto } from './dtos/productoSummaryDto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private baseUrl = environment.baseUrl; // Establece la URL base del BFF 
  private _productosSeleccionados: ProductoSummaryDto[] = [];
  private _productosSeleccionadosSubject: BehaviorSubject<ProductoSummaryDto[]> = new BehaviorSubject<ProductoSummaryDto[]>([]);
  constructor(private http: HttpClient) { }

  getProductosSeleccionadosSubject(): BehaviorSubject<ProductoSummaryDto[]> {
    return this._productosSeleccionadosSubject;
  }
  
  setProductosSeleccionados(productos: ProductoSummaryDto[]) {
    this._productosSeleccionados = productos;
    this._productosSeleccionadosSubject.next(this._productosSeleccionados);
  }

  getAllProductos(): Observable<DataResponse<ProductoSummaryDto[]>> {
    const url = `${this.baseUrl}/productos/getAllProductos`;
    return this.http.get<DataResponse<ProductoSummaryDto[]>>(url);
  }
}