import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {
  @ViewChild('frame3', { static: true }) modalTicket: ModalDirective;

  isPrinting = true;

  constructor() { }

  ngOnInit() {
    this.modalTicket.show();
  }

}
