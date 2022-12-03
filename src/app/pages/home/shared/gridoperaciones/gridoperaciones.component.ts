import { Component,  OnInit } from '@angular/core';
import { User } from 'src/app/security/model/user.interface';
import { AuthenticationService } from 'src/app/service/security/authentication.service';
import { BusOperacionesDto } from '../../model/busOperacionesDto.interface';
import { OperacionesService } from '../../../../service/operaciones/operaciones.service';
import { BusOperacionesInsert } from '../../model/busOperacionesInsert.interfaces';
@Component({
  selector: 'app-gridoperaciones',
  templateUrl: './gridoperaciones.component.html',
  styleUrls: ['./gridoperaciones.component.scss']
})
export class GridoperacionesComponent implements OnInit {
 
  user?: User | null;
  operaciones!: BusOperacionesDto[] | [];
  loading = false;

  constructor(
    private authenticationService: AuthenticationService,
    private operacionesService: OperacionesService
  ) {
    this.authenticationService.user.subscribe(x => this.user = x);
  }

  ngOnInit(): void {
    this.loading = true;
    this.operacionesService.presupuestos
      .subscribe(ops => {
        this.operaciones = ops;
        this.loading = false;
      });
  }

  nuevaoperacion() {
    let nop: BusOperacionesInsert = {
      clienteId:'0',
      fecha: new Date(),
      vence: new Date(),
      razon: '0',
      codAut: null,
      tipoDocId: '0',
      estadoId: '0',
      pos: 0,
      operador: '0',
      id: '',
      numero: null
    };
    console.log(nop);
    this.operacionesService.nuevaoperacion(nop)
      .subscribe((op) => {
        this.operaciones = op;
      })
  }
}