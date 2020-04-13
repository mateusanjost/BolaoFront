import { Component, ViewChild } from '@angular/core';
import { MessengerService } from 'src/services/messenger.service';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss']
})
export class MessengerComponent{

  openModal = this.msgService.openModal;

  constructor(private msgService: MessengerService) {
   }

}
