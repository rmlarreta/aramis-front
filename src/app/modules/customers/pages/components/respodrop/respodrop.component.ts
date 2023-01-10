import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OpRespDto } from 'src/app/model/opClientesAttributes.interface';
import { ClientesService } from 'src/app/service/clientes/clientes.service';

@Component({
  selector: 'app-respodrop',
  templateUrl: './respodrop.component.html',
  styleUrls: ['./respodrop.component.css']
})
export class RespodropComponent implements OnInit {

  respos: OpRespDto[] = [];
  @Output() stringEvent = new EventEmitter<string | null>()
  selected!: string | null;
  loading = false;
  visible = false;
  constructor(
    private clienteservice: ClientesService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.clienteservice.respos
      .subscribe(x => {
        this.respos=x;
        this.loading = false;
      });
  }

  onChange(): void {
    this.stringEvent.emit(this.selected)
  }

}
