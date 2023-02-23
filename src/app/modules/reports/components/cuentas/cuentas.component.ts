import { Component, OnInit } from '@angular/core';
import { CobCuentum } from 'src/app/model/cobCuentum.interface';
import { CuentasService } from 'src/app/service/cuentas/cuentas.service';

@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.css']
})
export class CuentasComponent implements OnInit {

  cuentas: CobCuentum[] = [];

  constructor(
    private cuentasService: CuentasService
  ) { }

  ngOnInit(): void {
    this.cuentasService.cuentas.subscribe(x => {
      this.cuentas = x;
    })
  }

}
