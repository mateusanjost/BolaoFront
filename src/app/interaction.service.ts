import { Injectable }      from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Round } from './round.interface';

@Injectable({
    providedIn: 'root'
})
export class InteractionService {
    homeVisibleRound = new BehaviorSubject<Round>(null);

    setHomeVisibleRound(round: Round) {
        this.homeVisibleRound.next(round);
    }
}
