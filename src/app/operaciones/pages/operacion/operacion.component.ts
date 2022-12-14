import { Component, OnInit, ViewChild } from '@angular/core';
import { BusOperacionesDto } from 'src/app/model/busOperacionesDto.interface';
import { OperacionesService } from 'src/app/service/operaciones/operaciones.service';
import { ListadoComponent } from '../components/listadostock/listado.component';

@Component({
  selector: 'app-operacion',
  templateUrl: './operacion.component.html'
})

export class OperacionComponent implements OnInit {

  @ViewChild(ListadoComponent)
  child!: ListadoComponent
  operacion!: BusOperacionesDto;
  loading: boolean = false;
  actualizar: boolean = false;
  constructor(
    private opservice: OperacionesService,
  ) { }

  ngOnInit() {
    this.nuevaOperacion();
  }

  nuevaOperacion() {
    this.loading = true;
    this.opservice.nuevaoperacion.subscribe(x => {
      this.operacion = x,
        this.child.operacion = x.id,
        this.child.operador = x.operador
    })
    this.loading = false;
  }

  actualizaroperacion() {
    this.loading = true;
    this.opservice.operacion(this.operacion.id).subscribe(x => {
      this.operacion = x,
        this.child.operacion = x.id,
        this.child.operador = x.operador 
    })
    this.loading = false;
  }
}

