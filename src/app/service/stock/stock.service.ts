import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { StockIvaDto } from 'src/app/model/stockIvaDto.interface';
import { StockProductDto } from 'src/app/model/stockProductDto.interface';
import { StockProductInsert } from 'src/app/model/stockProductInsert.interface';
import { StockRubroDto } from 'src/app/model/stockRubroDto.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private rubrosObservables: BehaviorSubject<StockRubroDto[]> =
    new BehaviorSubject<StockRubroDto[]>([]);
  constructor(
    private http: HttpClient
  ) { }

  get products() {
    return this.http.get<StockProductDto[]>(`${environment.baseUrl}/stock/productsList`);
  }

  get rubrosObservable() {
    return this.rubrosObservables.asObservable();
  }

  get rubros() {
    return this.http.get<StockRubroDto[]>(`${environment.baseUrl}/stock/rubros`)
      .pipe(
        map((_r) => {
          this.rubrosObservables.next(_r);
          return _r;
        })
      );
  }

  get ivas() {
    return this.http.get<StockIvaDto[]>(`${environment.baseUrl}/stock/ivas`);
  }

  productadd(product: StockProductInsert) {
    return this.http.post<StockProductDto>(`${environment.baseUrl}/stock/productadd`, product);
  }

  productdelete(id: string) {
    return this.http.delete(`${environment.baseUrl}/stock/ProductDelete/` + id, { responseType: "arraybuffer" });
  }

  productsave(product: StockProductInsert) {
    return this.http.patch<StockProductDto>(`${environment.baseUrl}/stock/productupdate`, product);
  }

  productssave(product: StockProductInsert[]) {
    return this.http.patch(`${environment.baseUrl}/stock/productsUpdate`, product, { responseType: "arraybuffer" });
  }

  rubroadd(rubro: StockRubroDto) {
    return this.http.post(`${environment.baseUrl}/stock/RubroInsert`, rubro, { responseType: "arraybuffer" });
  }

  rubroupdate(rubro: StockRubroDto) {
    return this.http.patch(`${environment.baseUrl}/stock/RubroUpdate`, rubro, { responseType: "arraybuffer" });
  }


}