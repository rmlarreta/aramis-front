import { Component, OnInit } from '@angular/core';
import { cardReportes } from 'src/app/model/cardReportes.interface';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  cards: cardReportes[];

  constructor() {
    this.cards = [
      {
        Titulo: 'Cuentas',
        Body: 'Módulo de Cuentas y Cajas. Saldos y movimientos',
        Link: '/reportes/cuentas'
      }
    ];
  }

  ngOnInit(): void {

  }
} 
