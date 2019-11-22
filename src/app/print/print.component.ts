import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { Router } from '@angular/router';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {
  @ViewChild('frame4', { static: true }) modalPrint: ModalDirective;

  isPrinting = true;

  constructor(private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
//      document.getElementById("spinner-loading").classList.add("hidden");
      this.openModal();
    }, 2000);
  }
  
  openModal(){
    this.modalPrint.show();
    let betId = document.title;
    console.log("id da aposta: " + betId);
    this.print();
  }

  print(){
    window.print();
  }

  closePrintModal(){
    //this.modalPrint.hide();
    //this.router.navigate(['/home']);
    //location.reload();
    window.close();
  }
}


