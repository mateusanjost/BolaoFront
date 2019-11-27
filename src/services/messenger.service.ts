import { Injectable } from '@angular/core';
import { MessengerComponent } from '../app/components/shared/messenger/messenger.component';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {

  constructor() { }

  messengerBox(){
    let msgComponent = new MessengerComponent(this);
    msgComponent.showMessage();
  }
}
