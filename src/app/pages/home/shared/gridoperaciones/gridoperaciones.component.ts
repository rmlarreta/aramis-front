import { Component, OnInit } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { UserAuth } from 'src/app/model/userAuth.interface';
import { AuthenticationService } from 'src/app/service/security/authentication.service';
import { BusOperacionesDto } from '../../../../model/busOperacionesDto.interface';
import { OperacionesService } from '../../../../service/operaciones/operaciones.service';

@Component({
  selector: 'app-gridoperaciones',
  templateUrl: './gridoperaciones.component.html',
  styleUrls: ['./gridoperaciones.component.scss']
})
export class GridoperacionesComponent implements OnInit {

  user?: UserAuth | null; 
  operaciones!: BusOperacionesDto[] | []; 
  loading = false;
  first = 0;
  rows = 10;

  constructor(
    private authenticationService: AuthenticationService,
    private operacionesService: OperacionesService 
  ) {
    this.authenticationService.user.subscribe(x => this.user = x); 
  }

  ngOnInit(): void {
   this.getoperaciones();
  }

  async getoperaciones() {
    this.loading = true;
    this.operacionesService.presupuestos
      .subscribe(ops => {
        this.operaciones = ops;
        this.loading = false;
      });
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
    return this.operaciones ? this.first === (this.operaciones.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.operaciones ? this.first === 0 : true;
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