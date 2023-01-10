import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OpPaiDto } from 'src/app/model/opClientesAttributes.interface';
import { ClientesService } from 'src/app/service/clientes/clientes.service';

@Component({
  selector: 'app-paisdrop',
  templateUrl: './paisdrop.component.html',
  styleUrls: ['./paisdrop.component.css']
})
export class PaisdropComponent implements OnInit {

  paises: OpPaiDto[] = [];
  @Output() stringEvent = new EventEmitter<string | null>()
  selected!: string | null;
  loading = false;
  visible = false;
  constructor(
    private clienteservice: ClientesService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.clienteservice.paises
      .subscribe(x => {
        this.paises=x;
        this.loading = false;
      });
  }

  onChange(): void {
    this.stringEvent.emit(this.selected)
  }

}