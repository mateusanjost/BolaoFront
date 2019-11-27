import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { AppComponent } from 'src/app/app.component';
import { MessengerService } from 'src/services/messenger.service';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss']
})
export class MessengerComponent implements OnInit{
  @ViewChild('frame4', { static: true }) modalMessage: ModalDirective;

  constructor(private msgService: MessengerService) { }

  ngOnInit(){

  }

  showMessage(){
    this.modalMessage.show();
    //alert("Chegou modal page");
  }

}
