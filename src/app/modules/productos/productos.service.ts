import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { environment } from 'src/environments/environment';
import { IvaDto } from './dtos/ivaDto.interface';
import { ProductoDto } from './dtos/productoDto.interface';
import { ProductoSummaryDto } from './dtos/productoSummaryDto.interface';
import { RubroDto } from './dtos/rubroDto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private baseUrl = environment.baseUrl; // Establece la URL base del BFF 
  private _productosSeleccionados: ProductoSummaryDto[] = [];
  private _productosSeleccionadosSubject: BehaviorSubject<ProductoSummaryDto[]> = new BehaviorSubject<ProductoSummaryDto[]>([]);
  private _productosUpdatedSubject: Subject<void> = new Subject<void>();
  public _productosUpdated$: Observable<void> = this._productosUpdatedSubject.asObservable();
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

  insertProducto(producto: ProductoDto): Observable<any> {
    const url = `${this.baseUrl}/productos/insertProducto`;
    return this.http.post(url, producto)
      .pipe(
        tap(() => {
          // Emitir el evento de actualización desde el servicio
          this._productosUpdatedSubject.next();
        })
      );
  }

  deleteProducto(id: string): Observable<any> {
    const url = `${this.baseUrl}/productos/deleteProducto/${id}`;
    return this.http.delete(url)
      .pipe(
        tap(() => {
          // Emitir el evento de actualización desde el servicio
          this._productosUpdatedSubject.next();
        })
      );
  }

  updateProducto(producto: ProductoDto): Observable<any> {
    const url = `${this.baseUrl}/productos/updateProducto`;
    return this.http.put(url, producto)
      .pipe(
        tap(() => {
          // Emitir el evento de actualización desde el servicio
          this._productosUpdatedSubject.next();
        })
      ); 
  }

  getRubros(): Observable<DataResponse<RubroDto[]>> {
    const url = `${this.baseUrl}/auxProductos/GetAllRubros`;
    return this.http.get<DataResponse<RubroDto[]>>(url);
  }
  getIvas(): Observable<DataResponse<IvaDto[]>> {
    const url = `${this.baseUrl}/auxProductos/GetAllIvas`;
    return this.http.get<DataResponse<IvaDto[]>>(url);
  }

}
