import { Component, OnInit } from '@angular/core';
import { BusOperacionesDto } from 'src/app/model/busOperacionesDto.interface';
import { OperacionesService } from 'src/app/service/operaciones/operaciones.service';

@Component({
  selector: 'app-operacion',
  templateUrl: './operacion.component.html',
  styleUrls: ['./operacion.component.scss']
})

export class OperacionComponent implements OnInit {  
 
  operacion!: BusOperacionesDto;
  loading = false;
   
  constructor(
    private opservice: OperacionesService
  ) { }

  ngOnInit() { 
    this.nuevaOperacion();
  }

  nuevaOperacion(){
    this.loading=true;
    this.opservice.nuevaoperacion.subscribe(x=>this.operacion=x);
    this.loading=false;
  }
}

