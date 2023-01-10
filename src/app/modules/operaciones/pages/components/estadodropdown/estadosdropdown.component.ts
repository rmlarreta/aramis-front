import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BusEstadoDto } from 'src/app/model/busEstadosDto.interface';
import { OperacionesService } from 'src/app/service/operaciones/operaciones.service';

@Component({
  selector: 'app-estadosdropdown',
  templateUrl: './estadosdropdown.component.html',
  styleUrls: ['./estadosdropdown.component.scss']
})
export class EstadosdropdownComponent implements OnInit {


  estados!: BusEstadoDto[] | [];
  @Output() stringEvent = new EventEmitter<string | null>()
  selected!: string | null;
  loading = false;
  visible = false;
  constructor(
    private operacionesService: OperacionesService
  ) {}
   

  ngOnInit(): void {
    this.loading = true;
    this.operacionesService.estados
      .subscribe(resp => {
        this.estados=resp;
        this.loading = false;
      });
  }

  onChange(): void {
    this.stringEvent.emit(this.selected)
  }
}
