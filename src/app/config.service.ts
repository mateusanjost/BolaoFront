import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';

import { User } from './user.interface';
import { Team } from './team.interface';
import { Round } from './round.interface';
import { Game } from './game.interface';
import { Prize } from './prize.interface';
import { Bet } from './bet.interface';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  apiUrl = 'http://api.socialawp.com';
  //apiUrl = 'https://localhost:44341';

  constructor(private http: HttpClient) { }
  
  getLogin(log: string, pass: string): Observable<any>{
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    const loginObj = { login: log, password: pass};

    return this.http.post(this.apiUrl + '/users/login', loginObj, { headers: header });

  }


  listUsers(){
    return this.http.get<User[]>(`${this.apiUrl}/users/`);
  }

  listTeams(){
    return this.http.get<Team[]>(`${this.apiUrl}/teams/`);
  }

  getPrize(){
    return this.http.get<Prize>(`${this.apiUrl}/prizes/`);
  }

  updateJackpot(newJackpot: Prize){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });
    
    // ATTENTION: for now, passing always param 2 because it's jackpot on current prizes table at db
    return this.http.put<Prize>(this.apiUrl + '/prizes/2', newJackpot, { headers: header });
  }

  updateApportionment(newApportionment: Prize){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });
    
    // ATTENTION: for now, passing always param 2 because it's jackpot on current prizes table at db
    return this.http.put<Prize>(this.apiUrl + '/prizes/3', newApportionment, { headers: header });
  }

  getRound(){
    return this.http.get<Round[]>(`${this.apiUrl}/rounds/`);
  }
  
  getLastRound(){
    return this.http.get<Round>(`${this.apiUrl}/common/getlastround`);
  }

  getSpecificRound(roundId: number){
    return this.http.get<Round>(`${this.apiUrl}/rounds/` + roundId);
  }

  createRound(newRound: Round){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    let jsonToPass = { "number" : newRound.number, "startDateTime" : newRound.startDateTime, "endDateTime" : newRound.endDateTime }
    
    return this.http.post<Round>(this.apiUrl + '/rounds/', jsonToPass, { headers: header });
  }

  getBets(roundId: number){
    return this.http.get<Bet[]>(`${this.apiUrl}/common/GetBetsByRound/?roundId=` + roundId);
  }

  postBet(bet: any){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    let jsonToPass = {
      "betDate": bet.date,
      "resultBetId": 1,
      "playerId": 1,
      "playerName": bet.playerName,
      "roundId": 6,
      "userAdminId": bet.userId,
      "results": bet.resultToPass
    }

    return this.http.post<Bet>(this.apiUrl + '/bets/', jsonToPass, { headers: header });
  }

  updateBet(bet: Bet){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    let jsonToPass = {
      "id": bet.id,
      "betDate": bet.betDate,
      "resultBetId": bet.resultBetId,
      "playerId": bet.playerId,
      "playerName": bet.playerName,
      "roundId": bet.roundId,
      "userAdminId": bet.userAdminId,
      "results": bet.results
    }

    return this.http.put<Bet>(`${this.apiUrl}/bets/` + bet.id, bet, { headers: header });
  }
  
  getGames(roundId: number){
    return this.http.get<Game[]>(`${this.apiUrl}/common/GetMatchesByRound/?roundId=` + roundId);
  }

  createGame(newGame: Game) {
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    let jsonToPass = { 
      "HomeTeamId" : newGame.homeTeamId, 
      "AwayTeamId" : newGame.awayTeamId, 
      "RoundId" : newGame.roundId, 
      "HomeTeamScore" : 0,
      "AwayTeamScore" : 0,
      "DateTime" : newGame.dateTime
    };
    
    return this.http.post<Game>(this.apiUrl + '/matches/', jsonToPass, { headers: header });
  }

  updateMatches(games: Array<Game>){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    return this.http.put<Game[]>(`${this.apiUrl}/matches/UpdateMatches/`, games, { headers: header });
  }


}
