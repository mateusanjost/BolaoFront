import { Injectable } from '@angular/core';
import { MessengerComponent } from '../app/components/shared/messenger/messenger.component';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {

  public openModal = false;

  constructor() { }

  messengerBox(){
    this.openModal = true;
    //let msgComponent = new MessengerComponent(this);
    //msgComponent.showMessage();
  }
}
