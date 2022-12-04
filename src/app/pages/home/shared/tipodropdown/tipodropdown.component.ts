import { Component, OnInit } from '@angular/core';
import { BusOperacionTipo } from '../../../../model/busOperacionTipo.interface';
import { OperacionesService } from '../../../../service/operaciones/operaciones.service';

@Component({
  selector: 'app-tipodropdown',
  templateUrl: './tipodropdown.component.html',
  styleUrls: ['./tipodropdown.component.scss']
})


export class TipodropdownComponent implements OnInit {

  tipos!: BusOperacionTipo[] | [];
  selected!: string | null;
  loading = false; 
  constructor(
    private operacionesService: OperacionesService
  ) {

  }

  ngOnInit(): void {
    this.loading = true;
    this.operacionesService.tipos  
      .subscribe(resp => { 
        this.tipos = resp;
        this.loading = false;
      });
  } 
}
