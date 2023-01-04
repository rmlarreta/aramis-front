import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, SortEvent } from 'primeng/api';
import { StockProductDto } from 'src/app/model/stockProductDto.interface';
import { StockService } from 'src/app/service/stock/stock.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [MessageService]
})
export class MainComponent implements OnInit {

  listado: StockProductDto[] = [];
  loading = false;
  first = 0;
  rows = 10;

  constructor(
    private stockservice: StockService

  ) { }
  ngOnInit(): void {
    this.stockservice.products
    .subscribe(s=>this.listado=s);
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.listado ? this.first === (this.listado.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.listado ? this.first === 0 : true;
  }

  customSort(event: SortEvent) {
    event.data!.sort((data1, data2) => {
      const value1 = data1[event.field!];
      let value2 = data2[event.field!];
      let result = null;

      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (event.order! * result);
    });
  }

}
