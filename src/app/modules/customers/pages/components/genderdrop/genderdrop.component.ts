import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OpGenderDto } from 'src/app/model/opClientesAttributes.interface';
import { ClientesService } from 'src/app/service/clientes/clientes.service';

@Component({
  selector: 'app-genderdrop',
  templateUrl: './genderdrop.component.html',
  styleUrls: ['./genderdrop.component.css']
})
export class GenderdropComponent implements OnInit {

  genders: OpGenderDto[] = [];
  @Output() stringEvent = new EventEmitter<string | null>()
  selected!: string | null;
  loading = false;
  visible = false;
  constructor(
    private clienteservice: ClientesService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.clienteservice.genders
      .subscribe(x => {
        this.genders=x;
        this.loading = false;
      });
  }

  onChange(): void {
    this.stringEvent.emit(this.selected)
  }

}
