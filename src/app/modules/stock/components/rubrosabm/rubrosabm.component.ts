import { Component, OnInit } from '@angular/core';
import { MessageService, SortEvent } from 'primeng/api';
import { StockRubroDto } from 'src/app/model/stockRubroDto.interface';
import { StockService } from 'src/app/service/stock/stock.service';

@Component({
  selector: 'app-rubrosabm',
  templateUrl: './rubrosabm.component.html',
  styleUrls: ['./rubrosabm.component.css']
})
export class RubrosabmComponent implements OnInit {
  rubroDialog = false;
  updating = false;
  submitted = false;
  listado: StockRubroDto[] = [];
  insert: StockRubroDto = {
    id: '',
    name: ''
  }
  first = 0;
  rows = 10;

  constructor(private stockService: StockService,
    private messageService: MessageService,) { }

  ngOnInit(): void {
    this.stockService.rubrosObservable
      .subscribe(s => this.listado = s);
    this.stockService.rubros
      .subscribe(s => this.listado = s);
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

  onEdit(rubro: StockRubroDto) {
    this.insert = rubro;
    this.rubroDialog = true;
    this.updating = true;
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

  hideDialog() {
    this.rubroDialog = false;
    this.submitted = false;
    this.updating = false;
  }

  addRubro() {
    this.submitted = true;
    this.rubroDialog = false;
    this.stockService.rubroadd(this.insert)
      .subscribe({
        complete: () => {
          this.hideDialog()
          this.stockService.rubros
            .subscribe(s => this.listado = s);
        },
        error: (error) => { this.messageService.add({ severity: 'warn', summary: 'Error', detail: error }); }
      })
  }

  saveRubro() {
    this.submitted = true;
    this.updating = false;
    this.stockService.rubroupdate(this.insert)
      .subscribe({
        complete: () => {
          this.hideDialog()
          this.stockService.rubros
            .subscribe(s => this.listado = s);

        },
        error: (error) => { this.messageService.add({ severity: 'warn', summary: 'Error', detail: error }); }
      })
  }
}
