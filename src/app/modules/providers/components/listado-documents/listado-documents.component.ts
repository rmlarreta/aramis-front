import { Component, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ConfirmationService, MessageService, SortEvent } from 'primeng/api';
import { Subscription, map, tap } from 'rxjs';
import { DataResponse } from 'src/app/shared/dtos/dataResponse.interface';
import { OpConciliacionProviders } from '../../dtos/opConciliacionProviders.interface';
import { OpDocumentoProveedorDto } from '../../dtos/opDocumentoProveedorDto.interface';
import { ProvidersService } from '../../providers.service';
import { AddDocumentComponent } from '../add-document/add-document.component';
import { PayDocumentComponent } from '../pay-document/pay-document.component';

@Component({
  selector: 'app-listado-documents',
  templateUrl: './listado-documents.component.html',
  styleUrls: ['./listado-documents.component.css']
})
export class ListadoDocumentsComponent {
  listado: OpConciliacionProviders[] = [];
  listadoFiltered: OpConciliacionProviders[] = [];
  selectedOperations: OpDocumentoProveedorDto[] = [];
  first = 0;
  rows = 10;

  @ViewChild('addDocumentContainer', { read: ViewContainerRef }) addDocumentContainer!: ViewContainerRef;
  addDocument!: ComponentRef<AddDocumentComponent>;

  @ViewChild('payDocumentContainer', { read: ViewContainerRef }) payDocumentContainer!: ViewContainerRef;
  payDocument!: ComponentRef<PayDocumentComponent>;

  documentUpdateSubscription: Subscription = new Subscription;

  constructor(
    private providersService: ProvidersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.documentUpdateSubscription = this.providersService._documentosUpdated$
      .subscribe(() => {
        this.getAll()
      });
    this.getAll();
  }

  getAll(): void {
    this.providersService.getAllPendientes()
      .pipe(
        tap((response: DataResponse<OpConciliacionProviders[]>) => {
          if (response.errorResponse !== null)
            this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: response.errorResponse.message! });
        }),
        map((response: DataResponse<OpConciliacionProviders[]>) => response.data || [])
      )
      .subscribe({
        next: (documents: OpConciliacionProviders[]) => {
          this.listado = documents; 
          this.listadoFiltered = this.listado;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.body.errorResponse.message });
        }
      });
  }


  openDocumentoAdd() {
    this.addDocumentContainer.clear();
    this.addDocument = this.addDocumentContainer.createComponent(AddDocumentComponent);
    this.addDocument.instance.visible = true;
  }

  openDocumentoEdit(document: OpDocumentoProveedorDto) {
    this.addDocumentContainer.clear();
    this.addDocument = this.addDocumentContainer.createComponent(AddDocumentComponent);
    this.addDocument.instance.visible = true;
    this.addDocument.instance.editing = true;
    this.addDocument.instance.documento = document; // Pasar el Documento a editar al componente hijo
  }

  onPago(document: OpDocumentoProveedorDto) { 
    this.payDocumentContainer.clear();
    this.payDocument = this.payDocumentContainer.createComponent(PayDocumentComponent);
    this.payDocument.instance.visible = true; 
    this.payDocument.instance.pago.documento = document.id!; // Pasar el Documento a editar al componente hijo 
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.listado ? this.first === (this.listado.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.listado ? this.first === 0 : true;
  }

  customSort(event: SortEvent) {
    event.data!.sort((data1, data2) => {
      const value1 = data1[event.field!];
      let value2 = data2[event.field!];
      let result = null;

      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (event.order! * result);
    });
  }

  onSearch(text: string) {
    text = text.toLowerCase();
    this.listadoFiltered = this.listado.filter((supplier) => {
      return (
        supplier.proveedor.razon.toLowerCase().includes(text) ||
        supplier.total.toString().toLowerCase().includes(text)
      );
    });
  }
}
